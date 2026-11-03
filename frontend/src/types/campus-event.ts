export type Category = "Seminer" | "Atölye" | "Söyleşi" | "Yarışma";
export interface CampusEvent {
  id: string; title: string; category: Category; capacity: number;
  date: string; time: string; location: string; description: string; image?: string;
}
export type EventFormData = Omit<CampusEvent, "id" | "image" | "capacity"> & { capacity: string };
export type EventFormErrors = Partial<Record<keyof EventFormData, string>>;
