import React, { createContext, useContext, useState } from "react";
import { theme, ClubTheme } from "./theme";

interface AppThemeContextValue {
  accent: string; // primary color — buttons, tags, active states
  accentSecondary: string; // secondary color — borders, detail accents
  clubName: string | null;
  setClubTheme: (club: ClubTheme) => void;
}

// Default is the plain volt/asphalt look before any club is picked.
const AppThemeContext = createContext<AppThemeContextValue>({
  accent: theme.volt,
  accentSecondary: theme.hot,
  clubName: null,
  setClubTheme: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState(theme.volt);
  const [accentSecondary, setAccentSecondary] = useState(theme.hot);
  const [clubName, setClubName] = useState<string | null>(null);

  function setClubTheme(club: ClubTheme) {
    setAccent(club.primary);
    setAccentSecondary(club.secondary);
    setClubName(club.name);
  }

  return (
    <AppThemeContext.Provider
      value={{ accent, accentSecondary, clubName, setClubTheme }}
    >
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}
