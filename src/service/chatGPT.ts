import fetch from 'cross-fetch';

import type { MessageHistory } from '@/types';

type Message = {
  role: string;
  content: string;
};

type RequestBody = {
  model: string;
  messages: Message[];
  temperature: number;
};

const defaultApiUrl = 'https://api.openai.com';
export class OpenAI {
  private apiUrl: string;

  private apiKey: string;

  constructor({ apiKey, apiUrl }: { apiKey: string; apiUrl?: string | null }) {
    if (apiUrl && apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }
    this.apiUrl = `${apiUrl || defaultApiUrl}/v1/chat/completions`;
    this.apiKey = apiKey;
  }

  async sendMessage({
    model,
    message,
    temperature = 0.5,
  }: {
    model?: string;
    message: string;
    temperature?: number;
  }): Promise<string> {
    const requestBody: RequestBody = {
      model: model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature,
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const responseBody = await response.json();
    console.log(requestBody);
    const replyMessage = responseBody.choices[0].message.content;
    return replyMessage;
  }

  async sendContextMessages({
    model,
    messages,
    temperature = 0.5,
  }: {
    model?: string;
    messages: MessageHistory[];
    temperature?: number;
  }) {
    const requestBody: RequestBody = {
      model: model || 'gpt-3.5-turbo',
      messages,
      temperature,
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const responseBody = await response.json();
    console.log(requestBody);
    const replyMessage = responseBody.choices[0].message.content;
    return replyMessage;
  }
}
