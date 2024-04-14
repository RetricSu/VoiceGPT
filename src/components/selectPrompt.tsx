import React, { useEffect, useState } from 'react';

import { promptOptions } from '@/prompt';

export const StoredKeySelectedPrompt = 'selectedSpeakPrompt';

export function loadSelectedPromptFromStore() {
  const promptKey = localStorage.getItem(StoredKeySelectedPrompt);
  if (promptKey == null) return null;
  if (!promptOptions[promptKey]) return null;

  return promptOptions[promptKey]!;
}

export interface SelectPromptProp {
  onSelectPromptKey?: (key: string) => any;
}

export const SelectPrompt: React.FC<SelectPromptProp> = ({
  onSelectPromptKey,
}) => {
  const [promptKey, setPromptKey] = useState<string>('oral-en-practicer'); // see prompt/index.ts

  useEffect(() => {
    const key = localStorage.getItem(StoredKeySelectedPrompt);
    if (key) setPromptKey(key);
  }, []);

  const handlePromptKeyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPromptKey = event.target.value;
    setPromptKey(selectedPromptKey);
    localStorage.setItem(StoredKeySelectedPrompt, selectedPromptKey);
    if (onSelectPromptKey) onSelectPromptKey(selectedPromptKey);
  };

  return (
    <select
      className="rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-900"
      value={promptKey}
      onChange={handlePromptKeyChange}
    >
      {Object.values(promptOptions).map((p) => (
        <option key={p.key} value={p.key}>
          {p.label}
        </option>
      ))}
    </select>
  );
};
