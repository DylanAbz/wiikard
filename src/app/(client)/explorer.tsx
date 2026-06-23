import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { mockDb } from '../../data/mockDb';
import { isGeofencingEnabledGlobal } from './profile';

const categories = ['Tous', 'Sport', 'Santé', 'Loisirs', 'Maison', 'Services'];

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function ExplorerScreen() {
    const insets = useSafeAreaInsets();
    const [activeCat, setActiveCat] = useState('Tous');
    const [selectedPartner, setSelectedPartner] = useState<any>(null);
    const [offerModalVisible, setOfferModalVisible] = useState(false);
    const [gpsActive, setGpsActive] = useState(false);

    const initialLoc = { latitude: 45.1885, longitude: 5.7245 };
    const [myLocation, setMyLocation] = useState(initialLoc);

    // Garde la trace des partenaires déjà notifiés pour ne pas spammer
    const triggeredPartnersRef = useRef<Set<string>>(new Set());
    const locationSubRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        (async () => {
            // Canal Android obligatoire depuis Android 8
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('wiikard-geofence', {
                    name: 'Offres à proximité',
                    importance: Notifications.AndroidImportance.HIGH,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF4F30',
                });
            }

            // Demander la permission notifications
            const { status: notifStatus } = await Notifications.requestPermissionsAsync();
            if (notifStatus !== 'granted') {
                Alert.alert('Permission requise', 'Autorisez les notifications dans les paramètres pour recevoir les alertes de proximité.');
            }

            // Demander la permission GPS
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            setGpsActive(true);

            // Position initiale réelle
            try {
                const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                setMyLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude });
            } catch (_) {}

            // Écoute continue des déplacements
            locationSubRef.current = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.Balanced, distanceInterval: 15 },
                (loc) => setMyLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
            );
        })();

        return () => { locationSubRef.current?.remove(); };
    }, []);

    // Vérification du geofencing à chaque changement de position
    useEffect(() => {
        if (!isGeofencingEnabledGlobal) return;

        for (const partner of mockDb.partners) {
            const dist = getDistanceInMeters(myLocation.latitude, myLocation.longitude, partner.lat, partner.lng);

            if (dist < 100 && !triggeredPartnersRef.current.has(partner.id)) {
                // Nouvel accès à la zone → notification
                triggeredPartnersRef.current.add(partner.id);
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: '📍 Wiikard',
                        body: `Vous passez à proximité de ${partner.name} !\n${partner.discount}`,
                        ...(Platform.OS === 'android' && { channelId: 'wiikard-geofence' }),
                    },
                    trigger: null,
                });
            } else if (dist > 300) {
                // L'utilisateur est reparti → on réinitialise pour pouvoir re-notifier
                triggeredPartnersRef.current.delete(partner.id);
            }
        }
    }, [myLocation]);

    // Simulation pour la démo : téléportation vers un partenaire aléatoire
    const simulateMovement = () => {
        if (!isGeofencingEnabledGlobal) {
            Alert.alert('Geofencing Désactivé', "Activez-le d'abord dans l'onglet Profil !");
            return;
        }
        const partner = mockDb.partners[Math.floor(Math.random() * mockDb.partners.length)];
        triggeredPartnersRef.current.clear();
        setMyLocation({ latitude: partner.lat, longitude: partner.lng });
    };

    const filteredPartners = activeCat === 'Tous' ? mockDb.partners : mockDb.partners.filter(p => p.category === activeCat);

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.chip, activeCat === cat && styles.chipActive]}
                            onPress={() => { setActiveCat(cat); setSelectedPartner(null); }}
                        >
                            <Text style={[styles.chipText, activeCat === cat && styles.chipTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <MapView
                style={styles.map}
                initialRegion={{ ...initialLoc, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
                onPress={() => setSelectedPartner(null)}
            >
                <Marker coordinate={myLocation} title="Ma position">
                    <View style={styles.myLocationMarker}>
                        <View style={styles.myLocationDot} />
                    </View>
                </Marker>

                {filteredPartners.map((partner) => (
                    <Marker
                        key={partner.id}
                        coordinate={{ latitude: partner.lat, longitude: partner.lng }}
                        onPress={(e: any) => { e.stopPropagation(); setSelectedPartner(partner); }}
                    >
                        <View style={[styles.customPin, selectedPartner?.id === partner.id && styles.customPinActive]} />
                    </Marker>
                ))}
            </MapView>

            {/* Bouton simulation démo + indicateur GPS */}
            <View style={[styles.devBtnRow, { top: insets.top + 70 }]}>
                <View style={[styles.gpsBadge, gpsActive ? styles.gpsBadgeActive : styles.gpsBadgeOff]}>
                    <Text style={styles.gpsBadgeText}>{gpsActive ? '● GPS' : '○ GPS'}</Text>
                </View>
                <TouchableOpacity style={styles.devBtn} onPress={simulateMovement}>
                    <Text style={styles.devBtnText}>🏃 Simuler Géoloc.</Text>
                </TouchableOpacity>
            </View>

            {selectedPartner && (
                <View style={[styles.bottomCard, { paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 20 }]}>
                    <Image source={{ uri: selectedPartner.image }} style={styles.cardImage} />
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardCat}>{selectedPartner.category}</Text>
                        <Text style={styles.cardName}>{selectedPartner.name}</Text>
                        <Text style={styles.cardDiscount} numberOfLines={1}>⭐ {selectedPartner.discount}</Text>
                        <TouchableOpacity style={styles.cardBtn} onPress={() => setOfferModalVisible(true)}>
                            <Text style={styles.cardBtnText}>Voir l'offre</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Modal animationType="slide" transparent={true} visible={offerModalVisible} onRequestClose={() => setOfferModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 24 }]}>
                        <View style={styles.modalDragIndicator} />
                        <Image source={{ uri: selectedPartner?.offerImage || selectedPartner?.image }} style={styles.modalHeroImage} />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalCategory}>{selectedPartner?.category}</Text>
                            <Text style={styles.modalTitle}>{selectedPartner?.name}</Text>
                            <View style={{ backgroundColor: '#fff0ed', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                                <Text style={styles.modalDiscount}>🎁 {selectedPartner?.discount}</Text>
                            </View>
                            <Text style={styles.modalSectionTitle}>Détails de l'offre</Text>
                            <Text style={styles.modalText}>{selectedPartner?.description}</Text>
                            <Text style={styles.modalSectionTitle}>Adresse</Text>
                            <Text style={styles.modalText}>📍 {selectedPartner?.address}</Text>
                            <View style={styles.modalActionRow}>
                                <TouchableOpacity style={styles.closeBtn} onPress={() => setOfferModalVisible(false)}>
                                    <Text style={styles.closeBtnText}>Fermer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.navigateBtn} onPress={() => {
                                    setOfferModalVisible(false);
                                    Alert.alert('Navigation', `Itinéraire vers ${selectedPartner?.name}...`);
                                }}>
                                    <Text style={styles.navigateBtnText}>S'y rendre</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F8F6' },
    header: { paddingBottom: 12, backgroundColor: '#F9F8F6', zIndex: 10, borderBottomWidth: 1, borderBottomColor: '#F0EEE9' },
    chipsContainer: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#ECEAE5' },
    chipActive: { backgroundColor: '#FF4F30' },
    chipText: { fontSize: 13, fontWeight: '500', color: '#6B645C' },
    chipTextActive: { color: 'white' },
    map: { flex: 1 },

    myLocationMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.3)', justifyContent: 'center', alignItems: 'center' },
    myLocationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6', borderWidth: 2, borderColor: 'white' },

    customPin: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'white', borderWidth: 6, borderColor: '#FF4F30', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
    customPinActive: { borderColor: '#0D0D0D' },

    devBtnRow: { position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 20 },
    gpsBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
    gpsBadgeActive: { backgroundColor: '#22c55e' },
    gpsBadgeOff: { backgroundColor: '#A0998F' },
    gpsBadgeText: { color: 'white', fontSize: 11, fontWeight: '700' },
    devBtn: { backgroundColor: '#0D0D0D', padding: 10, borderRadius: 8, elevation: 5 },
    devBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    bottomCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, flexDirection: 'row', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10 },
    cardImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#ECEAE5' },
    cardInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    cardCat: { fontSize: 11, color: '#A0998F', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
    cardName: { fontSize: 18, fontWeight: '700', color: '#0D0D0D', marginBottom: 4 },
    cardDiscount: { fontSize: 14, color: '#FF4F30', fontWeight: '600', marginBottom: 12 },
    cardBtn: { backgroundColor: '#FF4F30', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
    cardBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
    modalDragIndicator: { width: 40, height: 5, backgroundColor: '#E5E5E5', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalHeroImage: { width: '100%', height: 180, borderRadius: 16, backgroundColor: '#ECEAE5', marginBottom: 20, resizeMode: 'cover' },
    modalCategory: { fontSize: 12, color: '#A0998F', fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
    modalTitle: { fontSize: 28, fontWeight: '800', color: '#0D0D0D', marginBottom: 8 },
    modalDiscount: { fontSize: 16, color: '#FF4F30', fontWeight: '700' },
    modalSectionTitle: { fontSize: 16, fontWeight: '700', color: '#0D0D0D', marginBottom: 8, marginTop: 10 },
    modalText: { fontSize: 14, color: '#6B645C', lineHeight: 22, marginBottom: 10 },

    modalActionRow: { flexDirection: 'row', gap: 12, marginTop: 30 },
    closeBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#F9F8F6', alignItems: 'center' },
    closeBtnText: { color: '#0D0D0D', fontWeight: '700', fontSize: 16 },
    navigateBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#FF4F30', alignItems: 'center' },
    navigateBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
