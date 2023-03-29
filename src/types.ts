export enum ChatRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}
export interface MessageHistory {
  role: ChatRole;
  content: string;
}
