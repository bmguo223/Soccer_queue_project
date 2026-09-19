import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { router } from "expo-router";

import { db, auth } from "../../firebase";
import { theme } from "../../theme";
import { useAppTheme } from "../../theme-context";
import { Slot } from "../../types";

// Hardcoded for now. Replace with a Firestore "slots" collection once
// you're ready to let venues/admins publish real availability.
const MOCK_SLOTS: Slot[] = [
  {
    id: "slot-1",
    venueName: "Riverside Turf",
    format: "5v5",
    startTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    location: { lat: 42.3601, lng: -71.0589 },
  },
  {
    id: "slot-2",
    venueName: "Riverside Turf",
    format: "7v7",
    startTime: new Date(Date.now() + 7200 * 1000).toISOString(),
    location: { lat: 42.3601, lng: -71.0589 },
  },
  {
    id: "slot-3",
    venueName: "Downtown Cage",
    format: "1v1",
    startTime: new Date(Date.now() + 1800 * 1000).toISOString(),
    location: { lat: 42.3505, lng: -71.0655 },
  },
];

export default function JoinQueueScreen() {
  const { accent, accentSecondary } = useAppTheme();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  async function joinQueue(slot: Slot) {
    const user = auth.currentUser;
    if (!user) return;

    setJoiningId(slot.id);
    try {
      const docRef = await addDoc(collection(db, "queueEntries"), {
        userId: user.uid,
        displayName: user.displayName ?? "Player",
        slotId: slot.id,
        format: slot.format,
        status: "waiting",
        createdAt: serverTimestamp(),
      });

      router.push({
        pathname: "/queue-status",
        params: { queueEntryId: docRef.id, slotId: slot.id },
      });
    } catch (err) {
      console.error("Failed to join queue:", err);
    } finally {
      setJoiningId(null);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Open slots</Text>
      <Text style={styles.subheading}>Pick a game. Show up. Play.</Text>
      <FlatList
        data={MOCK_SLOTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlotCard
            slot={item}
            accent={accent}
            accentSecondary={accentSecondary}
            onPress={() => joinQueue(item)}
            joining={joiningId === item.id}
          />
        )}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      />
    </View>
  );
}

function SlotCard({
  slot,
  accent,
  accentSecondary,
  onPress,
  joining,
}: {
  slot: Slot;
  accent: string;
  accentSecondary: string;
  onPress: () => void;
  joining: boolean;
}) {
  const time = new Date(slot.startTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderColor: accent },
        pressed && { opacity: 0.85 },
      ]}
      onPress={onPress}
      disabled={joining}
    >
      {/* Kit stripe — the secondary club color as a thin top band,
          so both colors of the chosen theme show up, not just one. */}
      <View style={[styles.kitStripe, { backgroundColor: accentSecondary }]} />

      <View style={[styles.formatTag, { backgroundColor: accent }]}>
        <Text style={styles.formatTagText}>{slot.format}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.venue}>{slot.venueName}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <View style={[styles.ctaBar, { backgroundColor: accent }]}>
        <Text style={styles.ctaText}>
          {joining ? "Joining…" : "Join queue"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.bg },
  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: theme.text,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    color: theme.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  kitStripe: { height: 4, width: "100%" },
  formatTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    // Slight skew gives the tag a spray-stencil, cut-corner feel
    // instead of a soft rounded pill.
    transform: [{ skewX: "-8deg" }],
    marginTop: 14,
    marginLeft: 14,
  },
  formatTagText: {
    fontWeight: "900",
    color: theme.bg,
    fontSize: 14,
    transform: [{ skewX: "8deg" }],
  },
  cardBody: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 16 },
  venue: { fontSize: 19, fontWeight: "800", color: theme.text },
  time: { fontSize: 14, color: theme.muted, marginTop: 2 },
  ctaBar: { paddingVertical: 12, alignItems: "center" },
  ctaText: { fontWeight: "900", color: theme.bg, fontSize: 15 },
});
