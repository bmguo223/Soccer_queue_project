import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { updateProfile } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "../../firebase";
import { theme, CLUB_THEMES } from "../../theme";
import { useAppTheme } from "../../theme-context";

export default function CustomizeScreen() {
  const { accent, accentSecondary, clubName, setClubTheme } = useAppTheme();
  const [displayName, setDisplayName] = useState(
    auth.currentUser?.displayName ?? ""
  );
  const [saved, setSaved] = useState(false);
  // Collapsed by default — keeps the screen short so nothing needs to
  // scroll to be reached; tapping the header reveals the full club list.
  const [clubsExpanded, setClubsExpanded] = useState(false);

  async function saveName() {
    const user = auth.currentUser;
    if (!user || !displayName.trim()) return;
    await updateProfile(user, { displayName: displayName.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.heading}>Customize</Text>
      <Text style={styles.subheading}>Make it yours.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="What should other players see?"
          placeholderTextColor={theme.muted}
          style={[styles.input, { borderColor: accent }]}
        />
        <Pressable
          style={[styles.saveButton, { backgroundColor: accent }]}
          onPress={saveName}
        >
          <Text style={styles.saveButtonText}>
            {saved ? "Saved" : "Save name"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Pressable
          style={styles.accordionHeader}
          onPress={() => setClubsExpanded((v) => !v)}
        >
          <View style={styles.accordionHeaderLeft}>
            <Text style={styles.sectionTitle}>Club colors</Text>
            {clubName && (
              <View style={styles.currentPill}>
                <View
                  style={[styles.currentDot, { backgroundColor: accent }]}
                />
                <Text style={styles.currentPillText}>{clubName}</Text>
              </View>
            )}
          </View>
          <Ionicons
            name={clubsExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.muted}
          />
        </Pressable>

        {clubsExpanded && (
          <>
            <Text style={styles.hint}>
              Pick a club's colors for your queue cards, buttons, and tabs.
            </Text>
            <View style={{ gap: 10 }}>
              {CLUB_THEMES.map((club) => {
                const isSelected = clubName === club.name;
                return (
                  <Pressable
                    key={club.name}
                    onPress={() => setClubTheme(club)}
                    style={[
                      styles.clubRow,
                      { borderColor: isSelected ? club.primary : theme.line },
                    ]}
                  >
                    <View style={styles.kitSwatches}>
                      <View
                        style={[
                          styles.kitChip,
                          { backgroundColor: club.primary },
                        ]}
                      />
                      <View
                        style={[
                          styles.kitChip,
                          styles.kitChipSecond,
                          { backgroundColor: club.secondary },
                        ]}
                      />
                    </View>
                    <Text style={styles.clubName}>{club.name}</Text>
                    {isSelected && (
                      <Text
                        style={[styles.selectedTag, { color: club.primary }]}
                      >
                        Selected
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </View>

      {/*
        Extension point: format preference (default 1v1/5v5/7v7),
        preferred region, notification settings, etc. go here next —
        same section pattern as above.
      */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scrollContent: { padding: 20, paddingBottom: 48 },
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
    marginBottom: 28,
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.text,
  },
  hint: { fontSize: 13, color: theme.muted, marginTop: 10, marginBottom: 14 },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.text,
    fontSize: 15,
    marginBottom: 12,
  },
  saveButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  saveButtonText: { color: theme.bg, fontWeight: "900", fontSize: 14 },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.line,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  accordionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  currentPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  currentDot: { width: 8, height: 8, borderRadius: 4 },
  currentPillText: { color: theme.muted, fontSize: 12, fontWeight: "700" },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    marginTop: 10,
  },
  kitSwatches: { flexDirection: "row" },
  kitChip: {
    width: 22,
    height: 22,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.line,
  },
  kitChipSecond: { marginLeft: -6 },
  clubName: { color: theme.text, fontWeight: "700", fontSize: 15, flex: 1 },
  selectedTag: { fontWeight: "800", fontSize: 12 },
});
