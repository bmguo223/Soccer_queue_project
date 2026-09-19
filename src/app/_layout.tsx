import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { User } from "firebase/auth";

import { ensureSignedIn } from "../firebase";
import { theme } from "../theme";
import { AppThemeProvider } from "../theme-context";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    ensureSignedIn(setUser);
  }, []);

  return (
    <AppThemeProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="queue-status" options={{ title: "In queue" }} />
        <Stack.Screen
          name="confirm-match"
          options={{ title: "Match found" }}
        />
      </Stack>
    </AppThemeProvider>
  );
}