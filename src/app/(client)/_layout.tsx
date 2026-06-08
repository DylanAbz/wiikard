import { Tabs } from 'expo-router';

export default function ClientLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#FF4F30',
            tabBarInactiveTintColor: '#A0A0A0',
            tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 10, paddingBottom: 5, height: 60 },
            headerShown: false,
        }}>
            <Tabs.Screen name="explorer" options={{ title: 'Explorer' }} />
            <Tabs.Screen name="index" options={{ title: 'Ma Carte' }} />
            {/* On désactive les onglets vides pour ne pas faire crasher l'app au clic */}
            <Tabs.Screen name="economies" options={{ title: 'Économies', href: null }} />
            <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
        </Tabs>
    );
}