import { Stack } from 'expo-router';

export default function ClubsLayout() {
  return (
    <Stack>
      <Stack.Screen name="my" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
