import { useEffect, useRef, useState } from 'react';

type SpeechAnimationProps = {
  utter: SpeechSynthesisUtterance;
  isSpeaking: boolean;
};

function splitSentenceIntoWords(sentence: string): string[] {
  const words: string[] = [];

  let wordStart = 0;
  for (let i = 0; i < sentence.length; i += 1) {
    const char = sentence[i]!;
    if (/\s|[,.!?]/.test(char)) {
      if (i > wordStart) {
        words.push(sentence.slice(wordStart, i));
      }
      if (/\S/.test(char)) {
        words.push(char);
      }
      wordStart = i + 1;
    }
  }

  if (wordStart < sentence.length) {
    words.push(sentence.slice(wordStart));
  }

  return words;
}

const SpeechAnimation: React.FC<SpeechAnimationProps> = ({
  utter,
  isSpeaking,
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!utter) return;

    const array = splitSentenceIntoWords(utter.text);
    console.log(array);
    setWords(array);
    setActiveIndex(-1);
  }, [utter]);

  useEffect(() => {
    if (!isSpeaking || !words.length) return;
    setActiveIndex(0);
  }, [isSpeaking, words]);

  useEffect(() => {
    if (!isSpeaking || !words.length || activeIndex === -1) return;
    const speakingDuration = (words[activeIndex]!.length / utter.rate) * 110;
    const timeout = setTimeout(() => {
      setActiveIndex((i) => (i === words.length - 1 ? -1 : i + 1));
    }, speakingDuration);

    return () => clearTimeout(timeout);
  }, [isSpeaking, words, activeIndex, utter]);

  return (
    <>
      {isSpeaking && (
        <div
          className="speech-container rounded-lg bg-white p-5 shadow-md"
          ref={containerRef}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className={`speech-word text-3xl font-bold capitalize text-gray-700 ${
                i === activeIndex || i === activeIndex - 1 ? 'inline' : 'hidden'
              } ${i === activeIndex ? 'visible' : 'hidden'}`}
            >
              {word}&nbsp;
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default SpeechAnimation;
