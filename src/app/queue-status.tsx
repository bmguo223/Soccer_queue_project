import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";

import { db, auth } from "../firebase";
import { theme } from "../theme";
import { useAppTheme } from "../theme-context";

/**
 * Listens for a Match document that includes this user for the given slot.
 * The actual matching happens server-side in a scheduled Cloud Function
 * (see functions/matchmaking.ts) — this screen just reacts to the result
 * appearing in Firestore.
 */
export default function QueueStatusScreen() {
  const { accent } = useAppTheme();
  const { slotId } = useLocalSearchParams<{
    queueEntryId: string;
    slotId: string;
  }>();
  const [waitingSince] = useState(Date.now());
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  // Nothing was re-rendering this screen once a second on its own, so
  // the timer text was frozen at whatever it computed on first render.
  // This interval just forces a re-render every second to update it.
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsWaiting(Math.floor((Date.now() - waitingSince) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [waitingSince]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !slotId) return;

    const q = query(
      collection(db, "matches"),
      where("slotId", "==", slotId),
      where("status", "==", "pending_confirmation")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      for (const docSnap of snapshot.docs) {
        const match = docSnap.data();
        const inMatch =
          match.sideA.includes(user.uid) || match.sideB.includes(user.uid);
        if (inMatch) {
          router.replace({
            pathname: "/confirm-match",
            params: { matchId: docSnap.id },
          });
          return;
        }
      }
    });

    return unsubscribe;
  }, [slotId]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={accent} />
      <Text style={styles.title}>Looking for a match…</Text>
      <Text style={styles.subtitle}>
        We'll notify you the moment enough players join this slot.
      </Text>
      <Text style={[styles.timer, { color: accent }]}>
        {secondsWaiting}s in queue
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: theme.bg,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.text,
    marginTop: 8,
  },
  subtitle: {
    textAlign: "center",
    color: theme.muted,
    maxWidth: 280,
  },
  timer: { fontWeight: "800", marginTop: 12 },
});
