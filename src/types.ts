export type MatchFormat = "1v1" | "5v5" | "7v7";

export const FORMAT_SIZE: Record<MatchFormat, number> = {
  "1v1": 1,
  "5v5": 5,
  "7v7": 7,
};

export interface Slot {
  id: string;
  venueName: string;
  format: MatchFormat;
  startTime: string; // ISO string
  location: { lat: number; lng: number };
}

export type QueueStatus = "waiting" | "matched" | "confirmed" | "cancelled";

export interface QueueEntry {
  id: string;
  userId: string;
  displayName: string;
  slotId: string;
  format: MatchFormat;
  status: QueueStatus;
  createdAt: number; // epoch ms, used for FIFO ordering
}

export type MatchStatus =
  | "pending_confirmation"
  | "confirmed"
  | "expired"
  | "cancelled";

export interface Match {
  id: string;
  slotId: string;
  format: MatchFormat;
  sideA: string[]; // userIds
  sideB: string[]; // userIds
  status: MatchStatus;
  confirmedBy: string[]; // userIds who tapped "confirm"
  createdAt: number;
  expiresAt: number; // epoch ms — auto-expire if not all confirm in time
}

export interface Booking {
  id: string;
  matchId: string;
  slotId: string;
  createdAt: number;
}
