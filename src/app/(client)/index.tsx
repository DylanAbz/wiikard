import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { mockDb } from '../../data/mockDb';

export default function ClientCardScreen() {
    const insets = useSafeAreaInsets();
    const [currentUser, setCurrentUser] = useState(mockDb.users[0]); // Sophie par défaut
    const [showSwitch, setShowSwitch] = useState(false);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>

                {/* En-tête : Bonjour + Bouton Profil */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingSub}>Compte Client 👋</Text>
                        <Text style={styles.greetingName}>{currentUser.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.avatar} onPress={() => setShowSwitch(!showSwitch)}>
                        <Text style={styles.avatarText}>{currentUser.name[0]}</Text>
                    </TouchableOpacity>
                </View>

                {/* Sélecteur de profil à la volée pour le POC */}
                {showSwitch && (
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchTitle}>Choisir le profil à tester :</Text>
                        <View style={styles.switchButtons}>
                            {mockDb.users.map((u) => (
                                <TouchableOpacity
                                    key={u.id}
                                    style={[styles.switchBtn, currentUser.id === u.id && styles.switchBtnActive]}
                                    onPress={() => {
                                        setCurrentUser(u);
                                        setShowSwitch(false);
                                    }}
                                >
                                    <Text style={[styles.switchBtnText, currentUser.id === u.id && styles.switchBtnTextActive]}>
                                        {u.name} ({u.valid ? 'Valide' : 'Invalide'})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* La Carte Virtuelle Wiikard */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardSubtitle}>CARTE MEMBRE</Text>
                            <Text style={styles.cardTitle}>Wiikard</Text>
                        </View>

                        {/* Badge Dynamique selon le statut (Rouge si actif, Gris si expiré) */}
                        <View style={[styles.activeBadge, { backgroundColor: currentUser.valid ? '#FF4F30' : '#4A4A4A' }]}>
                            <View style={[styles.activeDot, { backgroundColor: currentUser.valid ? 'white' : '#A0998F' }]} />
                            <Text style={styles.activeText}>{currentUser.valid ? 'Actif' : 'Expiré'}</Text>
                        </View>
                    </View>

                    {/* Le QR Code contient l'identifiant (ID) unique de l'utilisateur choisi */}
                    <View style={styles.qrWrapper}>
                        <View style={styles.qrContainer}>
                            <QRCode value={currentUser.id} size={160} backgroundColor="white" color="#0D0D0D" />
                        </View>
                    </View>

                    <Text style={styles.memberId}>{currentUser.id.split('-').join(' - ')}</Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F8F6' },
    content: { padding: 24 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    greetingSub: { fontSize: 13, color: '#A0998F', fontWeight: '500', marginBottom: 4 },
    greetingName: { fontSize: 28, fontWeight: '700', color: '#0D0D0D', letterSpacing: -0.5 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FF4F30', justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 18, fontWeight: 'bold', color: 'white' },

    switchContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ECEAE5' },
    switchTitle: { fontSize: 14, fontWeight: '600', color: '#0D0D0D', marginBottom: 12 },
    switchButtons: { gap: 8 },
    switchBtn: { padding: 10, borderRadius: 8, backgroundColor: '#F9F8F6', alignItems: 'center' },
    switchBtnActive: { backgroundColor: '#0D0D0D' },
    switchBtnText: { fontSize: 13, fontWeight: '500', color: '#6B645C' },
    switchBtnTextActive: { color: 'white' },

    card: { backgroundColor: '#0D0D0D', borderRadius: 24, padding: 28, elevation: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 },
    cardSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '500', letterSpacing: 1.5, marginBottom: 4 },
    cardTitle: { fontSize: 24, fontWeight: '700', color: 'white' },

    activeBadge: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
    activeDot: { width: 6, height: 6, borderRadius: 3 },
    activeText: { fontSize: 11, fontWeight: '700', color: 'white', textTransform: 'uppercase' },

    qrWrapper: { alignItems: 'center', marginBottom: 20 },
    qrContainer: { backgroundColor: 'white', padding: 16, borderRadius: 16 },
    memberId: { textAlign: 'center', color: '#A0998F', fontSize: 14, letterSpacing: 3, fontWeight: '500' }
});