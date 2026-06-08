import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* On dit à Expo que ces 3 routes existent */}
            <Stack.Screen name="index" />
            <Stack.Screen name="(client)" />
            <Stack.Screen name="(partner)" />
        </Stack>
    );
}