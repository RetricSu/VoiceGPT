export interface PromptOpt {
  value: string; // key of the prompt
  label: string;
}

export interface PromptOptions {
  [key: string]: Prompt;
}

export interface Prompt {
  key: string;
  label: string;
  prompt: {
    text: string;
    description?: string;
    title?: string;
  };
}
