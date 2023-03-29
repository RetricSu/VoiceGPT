import React, { useEffect, useState } from 'react';

export enum SpeakLang {
  zh = 'zh',
  en = 'en',
  es = 'es',
  fr = 'fr',
  de = 'de',
  it = 'it',
  ja = 'ja',
  ko = 'ko',
  pt = 'pt',
  ru = 'ru',
}

export const StoredKeySelectedLang = 'selectedSpeakLang';

export interface SelectLangProps {
  onSelectLang?: (lang: SpeakLang) => void;
}

export function mapStoredLangToSpeakLang(lang: string): SpeakLang | null {
  const langValues = Object.values(SpeakLang);
  if (langValues.includes(lang as SpeakLang)) {
    return lang as SpeakLang;
  }
  return null;
}

export function loadSpeakLangFromStore() {
  const lang = localStorage.getItem(StoredKeySelectedLang);
  if (lang == null) return null;
  return mapStoredLangToSpeakLang(lang);
}

export const getRecognitionLang = (lang: SpeakLang): string => {
  switch (lang) {
    case SpeakLang.zh:
      return 'zh-CN';
    case SpeakLang.en:
      return 'en-US';
    case SpeakLang.es:
      return 'es-ES';
    case SpeakLang.fr:
      return 'fr-FR';
    case SpeakLang.de:
      return 'de-DE';
    case SpeakLang.it:
      return 'it-IT';
    case SpeakLang.ja:
      return 'ja-JP';
    case SpeakLang.ko:
      return 'ko-KR';
    case SpeakLang.pt:
      return 'pt-PT';
    case SpeakLang.ru:
      return 'ru-RU';
    default:
      return '';
  }
};

export const getSpeechLang = (lang: SpeakLang): string => {
  switch (lang) {
    case SpeakLang.zh:
      return 'zh-CN';
    case SpeakLang.en:
      return 'en-US';
    case SpeakLang.es:
      return 'es-ES';
    case SpeakLang.fr:
      return 'fr-FR';
    case SpeakLang.de:
      return 'de-DE';
    case SpeakLang.it:
      return 'it-IT';
    case SpeakLang.ja:
      return 'ja-JP';
    case SpeakLang.ko:
      return 'ko-KR';
    case SpeakLang.pt:
      return 'pt-PT';
    case SpeakLang.ru:
      return 'ru-RU';
    default:
      return '';
  }
};

export const SelectLang: React.FC<SelectLangProps> = ({ onSelectLang }) => {
  const [lang, setLang] = useState<SpeakLang>(SpeakLang.zh);

  useEffect(() => {
    const storedLang = localStorage.getItem(StoredKeySelectedLang);
    setLang(storedLang as SpeakLang);
  }, []);

  const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = event.target.value as SpeakLang;
    setLang(selectedLang);
    localStorage.setItem(StoredKeySelectedLang, selectedLang);
    if (onSelectLang) onSelectLang(selectedLang);
  };

  return (
    <select
      className="rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-900"
      value={lang}
      onChange={handleLangChange}
    >
      <option value={SpeakLang.zh}>Chinese</option>
      <option value={SpeakLang.en}>English</option>
      <option value={SpeakLang.es}>Español</option>
      <option value={SpeakLang.fr}>Français</option>
      <option value={SpeakLang.de}>Deutsch</option>
      <option value={SpeakLang.it}>Italiano</option>
      <option value={SpeakLang.ja}>日本語</option>
      <option value={SpeakLang.ko}>한국어</option>
      <option value={SpeakLang.pt}>Português</option>
      <option value={SpeakLang.ru}>Русский</option>
    </select>
  );
};
