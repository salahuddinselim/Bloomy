import type { WizardAction, WizardState } from "./wizard";

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

    case "SET_EMOTION":
      return { ...state, emotion: action.emotion };

    case "SET_RECIPIENT_TYPE":
      return { ...state, recipientType: action.recipientType };

    case "SET_RECIPIENT_NAME":
      return { ...state, recipientName: action.recipientName };

    case "SET_SENDER_NAME":
      return { ...state, senderName: action.senderName };

    case "SET_VIBE":
      return { ...state, vibe: action.vibe };

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    case "SET_MESSAGE_TITLE":
      return { ...state, messageTitle: action.messageTitle };

    case "SET_PRESENTATION":
      return { ...state, presentationTheme: action.presentationTheme };

    case "LOAD_STATE":
      return action.state;

    default:
      return state;
  }
}
