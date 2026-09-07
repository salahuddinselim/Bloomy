export interface WizardState {
  step: number;
  emotion: string | null;
  recipientType: string | null;
  recipientName: string;
  senderName: string;
  vibe: string | null;
  message: string;
  messageTitle: string;
  presentationTheme: string | null;
}

export const WIZARD_STEPS = [
  { id: 1, label: "Emotion", shortLabel: "Emotion" },
  { id: 2, label: "Recipient", shortLabel: "Recipient" },
  { id: 3, label: "Vibe", shortLabel: "Vibe" },
  { id: 4, label: "Bouquet", shortLabel: "Bouquet" },
  { id: 5, label: "Message", shortLabel: "Message" },
  { id: 6, label: "Reveal", shortLabel: "Reveal" },
] as const;

export const INITIAL_WIZARD_STATE: WizardState = {
  step: 1,
  emotion: null,
  recipientType: null,
  recipientName: "",
  senderName: "",
  vibe: null,
  message: "",
  messageTitle: "",
  presentationTheme: null,
};

export type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_EMOTION"; emotion: string }
  | { type: "SET_RECIPIENT_TYPE"; recipientType: string }
  | { type: "SET_RECIPIENT_NAME"; recipientName: string }
  | { type: "SET_SENDER_NAME"; senderName: string }
  | { type: "SET_VIBE"; vibe: string }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "SET_MESSAGE_TITLE"; messageTitle: string }
  | { type: "SET_PRESENTATION"; presentationTheme: string }
  | { type: "LOAD_STATE"; state: WizardState };
