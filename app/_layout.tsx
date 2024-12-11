import { Stack } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                paddingTop: 30,
                fontWeight: 700,
              }}
            >
              WEATHER APP
            </Text>
          ),
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
