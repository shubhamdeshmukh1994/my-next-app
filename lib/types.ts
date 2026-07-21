export type EventMode = "online" | "offline" | "hybrid";

export interface IEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
