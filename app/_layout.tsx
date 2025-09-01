import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{ 
          headerShown: false  // Nasconde l'header
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ricette/[id]"
        options={{ 
          headerShown: false,
          title: 'Dettaglio Ricetta'  
        }}
      />
    </Stack>
  );
}
