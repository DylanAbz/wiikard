import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Variable globale simple pour passer l'info à la map sans utiliser Redux ou Context pour ce POC
export let isGeofencingEnabledGlobal = true;

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const [geofence, setGeofence] = useState(isGeofencingEnabledGlobal);

    const toggleGeofence = (val: boolean) => {
        setGeofence(val);
        isGeofencingEnabledGlobal = val;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.pageTitle}>Mon Profil</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Préférences de confidentialité</Text>

                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 15 }}>
                            <Text style={styles.settingName}>Notifications Geofencing</Text>
                            <Text style={styles.settingDesc}>Être alerté(e) automatiquement lorsque je passe à moins de 100m d'un partenaire Wiikard.</Text>
                        </View>
                        <Switch
                            value={geofence}
                            onValueChange={toggleGeofence}
                            trackColor={{ false: '#ECEAE5', true: '#FF4F30' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Personnelles</Text>
                    <Text style={styles.readOnlyText}>Nom : DUPONT</Text>
                    <Text style={styles.readOnlyText}>Prénom : Sophie</Text>
                    <Text style={styles.readOnlyText}>Email : sophie.d@exemple.com</Text>
                    <Text style={styles.readOnlyInfo}>(Non modifiable depuis l'application)</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F8F6' },
    content: { padding: 24 },
    pageTitle: { fontSize: 28, fontWeight: '700', color: '#0D0D0D', marginBottom: 30 },
    section: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0D0D0D', marginBottom: 15 },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    settingName: { fontSize: 15, fontWeight: '600', color: '#0D0D0D', marginBottom: 4 },
    settingDesc: { fontSize: 12, color: '#A0998F', lineHeight: 18 },
    readOnlyText: { fontSize: 15, color: '#0D0D0D', marginBottom: 10, fontWeight: '500' },
    readOnlyInfo: { fontSize: 12, color: '#FF4F30', marginTop: 10, fontStyle: 'italic' }
});