import type { MessageHistory } from '@/types';
import { ChatRole } from '@/types';

import type { PromptOptions } from './type';

export const recognitionTips =
  'the input text is converting from speech recognition, sometimes you might need to guess what the user trying to say if the input text feels wrong due to the speech recognition precision.';

export const promptOptions: PromptOptions = {
  'oral-en-practicer': {
    key: 'oral-en-practicer',
    label: 'Oral English Practicer',
    prompt: {
      text: 'I want you to pretend to be a human chatter.',
      description: 'use this prompt to correct your English sentence.',
    },
  },
  'en-mapper': {
    key: 'en-mapper',
    label: 'English Sentence Mapper',
    prompt: {
      text: 'I want you to act as a English sentence mapper. Whenever I say things to you in any language, you return a polish native-speaker-like English sentence mapping the things I say to me. You also only output the English sentence. No any other words, please.',
      description: 'use this prompt to correct your English sentence.',
    },
  },
};

export function getFirstSystemMessage(promptKey: string) {
  const content = promptOptions[promptKey]?.prompt.text;
  if (content == null) return null;
  const msg: MessageHistory = {
    role: ChatRole.system,
    content,
  };
  return msg;
}
