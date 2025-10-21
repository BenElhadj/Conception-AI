import { persisted } from './persisted.js';

// Historique conversationnel: [{ role: "user"|"assistant", content: string }]
export const conversation = persisted('chat_history', []);

// Pile d'annulation: [{ code: string, chat: Array }]
export const historyStack = persisted('history_stack', []);

// Dernier code généré (affiché dans "Generated Code" + "Preview")
export const generatedCode = persisted('generated_code', '');

// Layout (horizontal|vertical)
export const layout = persisted('layout_pref', 'horizontal');

// Pile redo persistante
export const futureStack = persisted('future_stack', []);
