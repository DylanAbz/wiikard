import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { mockDb } from '../../data/mockDb';

const TOKEN_WINDOW_MS = 10 * 60 * 1000;

function isTokenValid(token: string): boolean {
    const now = Date.now();
    const current = Math.floor(now / TOKEN_WINDOW_MS);
    const t = parseInt(token, 10);
    // Accepte la fenêtre actuelle et la précédente (tolérance de ±10 min à cheval entre 2 fenêtres)
    return t === current || t === current - 1;
}

export default function ScannerScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanResult, setScanResult] = useState<'valid' | 'invalid' | null>(null);
    const [scannedUser, setScannedUser] = useState<any>(null);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginBottom: 20, color: '#0D0D0D' }}>L'autorisation de la caméra est requise.</Text>
                <TouchableOpacity style={styles.btn} onPress={requestPermission}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Autoriser la caméra</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanResult) return;

        // Format attendu : "WK-XXXXX|TOKEN" (nouveau) ou "WK-XXXXX" (ancien, toujours accepté)
        const pipeIdx = data.lastIndexOf('|');
        const userId = pipeIdx > 0 ? data.slice(0, pipeIdx) : data;
        const token = pipeIdx > 0 ? data.slice(pipeIdx + 1) : null;

        // Vérification du token temporel si présent
        if (token !== null && !isTokenValid(token)) {
            setScannedUser({ name: 'QR Code', id: userId, status: 'QR Code Expiré — Demandez au client de rafraîchir son app' });
            setScanResult('invalid');
            return;
        }

        const user = mockDb.users.find(u => u.id === userId);
        if (user) {
            setScannedUser(user);
            setScanResult(user.valid ? 'valid' : 'invalid');
        } else {
            setScannedUser({ name: 'Inconnu', id: userId, status: 'Carte Inconnue' });
            setScanResult('invalid');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scanner Partenaire</Text>
                <View style={{ width: 60 }} />
            </View>

            {scanResult === null ? (
                <View style={styles.cameraContainer}>
                    <CameraView style={StyleSheet.absoluteFillObject} facing="back" onBarcodeScanned={handleBarcodeScanned}>
                        <View style={styles.overlay}>
                            <Text style={styles.scanInstruction}>Pointez le QR Code du client</Text>
                            <View style={styles.viewfinder}>
                                <View style={[styles.corner, styles.tl]} />
                                <View style={[styles.corner, styles.tr]} />
                                <View style={[styles.corner, styles.bl]} />
                                <View style={[styles.corner, styles.br]} />
                            </View>
                            <View style={styles.simulateBtns}>
                                <TouchableOpacity
                                    style={[styles.simulateBtn, { borderColor: '#22c55e' }]}
                                    onPress={() => handleBarcodeScanned({ data: `WK-84930|${Math.floor(Date.now() / TOKEN_WINDOW_MS)}` })}
                                >
                                    <Text style={styles.simulateBtnText}>✅ Valide</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.simulateBtn, { borderColor: '#EF4444' }]}
                                    onPress={() => handleBarcodeScanned({ data: `WK-99999|${Math.floor(Date.now() / TOKEN_WINDOW_MS)}` })}
                                >
                                    <Text style={styles.simulateBtnText}>❌ Invalide</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.simulateBtn, { borderColor: '#F59E0B' }]}
                                    onPress={() => handleBarcodeScanned({ data: `WK-84930|${Math.floor(Date.now() / TOKEN_WINDOW_MS) - 5}` })}
                                >
                                    <Text style={styles.simulateBtnText}>⏱ Expiré</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </CameraView>
                </View>
            ) : scanResult === 'valid' ? (
                <View style={styles.resultContainer}>
                    <View style={styles.successCard}>
                        <View style={styles.checkIcon}>
                            <Text style={{ fontSize: 40 }}>✅</Text>
                        </View>
                        <Text style={styles.successTitle}>CARTE VALIDE</Text>
                        <View style={styles.userInfo}>
                            <View style={styles.successAvatar}>
                                <Text style={styles.successAvatarText}>{scannedUser?.name[0]}</Text>
                            </View>
                            <Text style={styles.successName}>{scannedUser?.name}</Text>
                            <Text style={styles.successId}>N° {scannedUser?.id}</Text>
                        </View>
                        <TouchableOpacity style={styles.newScanBtn} onPress={() => setScanResult(null)}>
                            <Text style={styles.newScanBtnText}>Nouveau scan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.resultContainer}>
                    <View style={[styles.successCard, { borderColor: '#EF4444', borderWidth: 2 }]}>
                        <View style={[styles.checkIcon, { backgroundColor: '#fee2e2' }]}>
                            <Text style={{ fontSize: 40 }}>❌</Text>
                        </View>
                        <Text style={[styles.successTitle, { color: '#EF4444' }]}>CARTE INVALIDE</Text>
                        <View style={styles.userInfo}>
                            <View style={[styles.successAvatar, { backgroundColor: '#A0998F' }]}>
                                <Text style={styles.successAvatarText}>{scannedUser?.name[0]}</Text>
                            </View>
                            <Text style={styles.successName}>{scannedUser?.name}</Text>
                            <Text style={[styles.successId, { color: '#EF4444', fontWeight: 'bold' }]}>
                                {scannedUser?.status || 'Profil Inconnu'}
                            </Text>
                            <Text style={styles.successId}>N° {scannedUser?.id}</Text>
                        </View>
                        <TouchableOpacity style={[styles.newScanBtn, { backgroundColor: '#0D0D0D' }]} onPress={() => setScanResult(null)}>
                            <Text style={styles.newScanBtnText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F8F6' },
    btn: { backgroundColor: '#FF4F30', padding: 15, borderRadius: 10, alignSelf: 'center' },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    backBtn: { padding: 8 },
    backBtnText: { color: '#A0998F', fontWeight: '600' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#0D0D0D' },

    cameraContainer: { flex: 1, borderRadius: 24, overflow: 'hidden', margin: 16, backgroundColor: '#141414' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    scanInstruction: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 40 },

    viewfinder: { width: 250, height: 250, position: 'relative' },
    corner: { position: 'absolute', width: 40, height: 40, borderColor: 'white' },
    tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
    tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
    br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },

    resultContainer: { flex: 1, justifyContent: 'center', padding: 20 },
    successCard: { backgroundColor: 'white', borderRadius: 24, padding: 32, alignItems: 'center', elevation: 5 },
    checkIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    successTitle: { fontSize: 24, fontWeight: '800', color: '#22c55e', letterSpacing: 1, marginBottom: 32 },

    userInfo: { alignItems: 'center', marginBottom: 40 },
    successAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF4F30', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    successAvatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
    successName: { fontSize: 22, fontWeight: '700', color: '#0D0D0D', marginBottom: 4 },
    successId: { fontSize: 14, color: '#A0998F', fontWeight: '500' },

    newScanBtn: { backgroundColor: '#FF4F30', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center' },
    newScanBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

    simulateBtns: { marginTop: 40, flexDirection: 'row', gap: 10 },
    simulateBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
    simulateBtnText: { color: 'white', fontSize: 13, fontWeight: '600' },
});
