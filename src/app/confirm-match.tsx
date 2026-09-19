import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";

import { db, auth } from "../firebase";
import { Match } from "../types";
import { theme } from "../theme";
import { useAppTheme } from "../theme-context";

export default function ConfirmMatchScreen() {
  const { accent, accentSecondary } = useAppTheme();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!matchId) return;
    const unsubscribe = onSnapshot(doc(db, "matches", matchId), (snap) => {
      if (!snap.exists()) return;
      const data = { id: snap.id, ...snap.data() } as Match;
      setMatch(data);

      if (data.status === "confirmed") {
        // TODO: navigate to a BookingDetail screen once you build one.
      }
      if (data.status === "expired" || data.status === "cancelled") {
        router.dismissAll();
      }
    });
    return unsubscribe;
  }, [matchId]);

  async function confirm() {
    const user = auth.currentUser;
    if (!user || !matchId) return;
    setConfirming(true);
    try {
      await updateDoc(doc(db, "matches", matchId), {
        confirmedBy: arrayUnion(user.uid),
      });
      // TODO: schedule a local/push notification here once
      // expo-notifications is wired up.
    } finally {
      setConfirming(false);
    }
  }

  if (!match) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Loading match…</Text>
      </View>
    );
  }

  const totalPlayers = match.sideA.length + match.sideB.length;
  const user = auth.currentUser;
  const alreadyConfirmed = user
    ? match.confirmedBy.includes(user.uid)
    : false;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.formatBadge,
          { backgroundColor: accent, borderColor: accentSecondary },
        ]}
      >
        <Text style={styles.formatBadgeText}>{match.format}</Text>
      </View>
      <Text style={styles.title}>Match found</Text>
      <Text style={styles.subtitle}>
        {match.confirmedBy.length} of {totalPlayers} players confirmed
      </Text>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: accent },
          alreadyConfirmed && styles.buttonDisabled,
        ]}
        onPress={confirm}
        disabled={alreadyConfirmed || confirming}
      >
        <Text style={styles.buttonText}>
          {alreadyConfirmed
            ? "Waiting on others…"
            : confirming
            ? "Confirming…"
            : "Confirm and book"}
        </Text>
      </Pressable>
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
    gap: 14,
  },
  formatBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 2,
    transform: [{ skewX: "-8deg" }],
    marginBottom: 4,
  },
  formatBadgeText: {
    fontWeight: "900",
    color: theme.bg,
    fontSize: 14,
    transform: [{ skewX: "8deg" }],
  },
  title: { fontSize: 22, fontWeight: "900", color: theme.text },
  subtitle: { color: theme.muted },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 4,
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: theme.line },
  buttonText: { color: theme.bg, fontWeight: "900", fontSize: 16 },
});
