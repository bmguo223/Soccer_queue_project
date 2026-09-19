// Street-soccer palette: asphalt black, cage-fence charcoal, and two
// spray-paint accents (volt lime + hot orange-red). High contrast,
// no soft pastels — meant to feel like a night cage match, not a SaaS app.
export const theme = {
  bg: "#0B0C0D",
  surface: "#17191B",
  surfaceAlt: "#1F2224",
  line: "#2B2E30",
  text: "#F3F4F0",
  muted: "#9A9D9F",
  volt: "#D4FF3D",
  hot: "#FF4B36",
};

// Club-inspired color themes for the Customize tab. Each has a primary
// color (used for buttons, tags, and highlights) and a secondary color
// (used for borders/details), based on each club's kit colors — no
// crests or logos, just colors, since badges are trademarked but color
// pairings aren't.
export interface ClubTheme {
  name: string;
  primary: string;
  secondary: string;
}

export const CLUB_THEMES: ClubTheme[] = [
  { name: "Real Madrid", primary: "#FFFFFF", secondary: "#FEBE10" },
  { name: "Barcelona", primary: "#A50044", secondary: "#004D98" },
  { name: "Manchester United", primary: "#DA291C", secondary: "#FBE122" },
  { name: "Arsenal", primary: "#EF0107", secondary: "#9C824A" },
  { name: "Liverpool", primary: "#C8102E", secondary: "#00B2A9" },
  { name: "Chelsea", primary: "#034694", secondary: "#DBA111" },
  { name: "PSG", primary: "#004170", secondary: "#DA291C" },
  { name: "Inter Milan", primary: "#010E80", secondary: "#3A3A3C" },
  { name: "AC Milan", primary: "#FB090B", secondary: "#3A3A3C" },
  { name: "Bayern Munich", primary: "#DC052D", secondary: "#0066B2" },
  { name: "Borussia Dortmund", primary: "#FDE100", secondary: "#3A3A3C" },
];
