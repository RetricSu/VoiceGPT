import React, { useEffect, useState } from 'react';

import ChatHistory from '@/components/chatHistory';
import Loading from '@/components/loading';
import {
  getRecognitionLang,
  getSpeechLang,
  loadSpeakLangFromStore,
  SpeakLang,
} from '@/components/selectLang';
import SpeechAnimation from '@/components/speechAnimation';
import TalkingWave from '@/components/talkingWave';
import { Meta } from '@/layouts/Meta';
import { OpenAI } from '@/service/chatGPT';
import { Main } from '@/templates/Main';
import type { MessageHistory } from '@/types';
import { ChatRole } from '@/types';

const Chatbot: React.FC = () => {
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition>();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>();
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition>();
  const [history, setHistory] = useState<MessageHistory[]>([
    {
      role: ChatRole.system,
      content:
        'you need to pretend to be a human chatter. the input text is converting from speech recognition, you need to guess what the user trying to say if the input text feels wrong due to the speech recognition precision',
    },
  ]);

  useEffect(() => {
    try {
      requestMicrophonePermission();
      setSpeechRecognition(
        new (window.SpeechRecognition ||
          (window as any).webkitSpeechRecognition ||
          (window as any).mozSpeechRecognition ||
          (window as any).msSpeechRecognition)()
      );
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  async function requestMicrophonePermission(): Promise<boolean> {
    if (!window.navigator) return false;

    const permission: PermissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });

    if (permission.state === 'granted') {
      return true;
    }
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        (window as any).localStream = stream;
        (window as any).localAudio.srcObject = stream;
        (window as any).localAudio.autoplay = true;
      })
      .catch((err) => {
        console.error(`getUserMedia got an error: ${err}`);
      });
    return new Promise((resolve) => {
      // Set the event handler for the change event
      permission.onchange = () => {
        // Resolve the promise with the current state of the permission
        resolve(permission.state === 'granted');
      };
    });
  }

  const toggleListening = () => {
    // clear previous output
    setMessage('');

    if (isListening) {
      // stop listening
      recognition?.stop();
    } else {
      // start listening
      const reco = createSpeechRecognition();
      setRecognition(reco);
      reco.start();
    }
  };

  const createSpeechRecognition = () => {
    // Use Web Speech API to recognize speech
    const rec = speechRecognition!;

    rec.lang = getRecognitionLang(loadSpeakLangFromStore() || SpeakLang.zh);
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = function () {
      setIsListening(true);
      console.log('start recognizing!!');
    };
    rec.onend = function () {
      setIsListening(false);
      console.log('recognizing end!!');
    };
    rec.onerror = function (event) {
      setIsListening(false);
      console.log('recognizing error!!', event.message);
    };
    rec.onresult = (event: any) => {
      const { transcript } = event.results[0][0];
      setMessage(transcript);
    };
    return rec;
  };

  const thinking = async () => {
    const key = localStorage.getItem('apiKey');
    if (key == null) return alert('you need to set api key first!');

    const question: MessageHistory = {
      role: ChatRole.user,
      content: message,
    };
    if (
      history.filter(
        (d) => d.role === question.role && d.content === question.content
      ).length > 0
    ) {
      // duplicated, abort
      return;
    }

    setIsThinking(true);
    setResponse('');
    const api = new OpenAI({
      apiKey: key,
    });
    const text = await api.sendContextMessages({
      messages: [...history, question],
    });
    setResponse(text);
    setHistory((prev) => {
      const newData = prev;
      const answer: MessageHistory = {
        role: ChatRole.assistant,
        content: text,
      };
      if (
        newData.filter(
          (d) => d.role === question.role && d.content === question.content
        ).length > 0
      ) {
        // duplicated, abort
        return prev;
      }
      newData.push(question);
      newData.push(answer);
      return newData;
    });
    setIsThinking(false);
  };

  const findCorrectVoice = (lang: SpeakLang) => {
    const { speechSynthesis } = window;
    if (lang === SpeakLang.zh) {
      const voices = speechSynthesis
        .getVoices()
        .filter(
          (voice) => voice.name === 'Ting-Ting' && voice.lang === 'zh-CN'
        );
      if (voices.length > 0) {
        return voices[0]!;
      }
    } else if (lang === SpeakLang.en) {
      const voices = speechSynthesis
        .getVoices()
        .filter((voice) => voice.name === 'Alex' && voice.lang === 'en-US');
      if (voices.length > 0) {
        return voices[0]!;
      }
    }

    return window.speechSynthesis.getVoices()[44]!;
  };

  const speakLang = (texts: string) => {
    setIsAiTalking(true);
    const utter = new window.SpeechSynthesisUtterance();
    const la = loadSpeakLangFromStore() || SpeakLang.zh;
    utter.text = texts;
    utter.lang = getSpeechLang(la);
    utter.voice = findCorrectVoice(la);
    utter.volume = 5;
    utter.onend = () => {
      handleMute();
    };
    utter.onerror = () => {
      handleMute();
    };
    utter.onpause = function () {
      // workaround for mobile issue
      if (window.speechSynthesis.paused) {
        handleMute();
      }
    };
    setUtterance(utter);

    // Speak the text using the SpeechSynthesisUtterance API
    window.speechSynthesis.speak(utter);
  };

  const handleMute = () => {
    setIsAiTalking(false);
    window.speechSynthesis.cancel();
    setUtterance(undefined);
  };

  useEffect(() => {
    if (message == null || message.length === 0) return;

    thinking();
  }, [message]);

  useEffect(() => {
    if (response == null || response.length === 0) return;

    speakLang(response);
  }, [response]);

  return (
    <Main
      meta={
        <Meta
          title={'VoiceGTP'}
          description="talking with ai in voice, learn speaking second language from chatGPT"
        />
      }
    >
      <div className="flex flex-col items-center justify-center">
        {utterance && (
          <SpeechAnimation utter={utterance} isSpeaking={isAiTalking} />
        )}
        {isAiTalking && (
          <div className="w-40">
            <TalkingWave />
          </div>
        )}
        <div className="mt-2 h-40 overflow-y-hidden">
          {isThinking && <Loading text="Thinking.." />}
        </div>

        {message && (
          <div className="mt-4">
            <p>{message}</p>
          </div>
        )}
        <div className="mb-2 flex items-center justify-center">
          {!isAiTalking && (
            <button
              className={`${isListening ? 'bg-red-500' : 'bg-blue-500'} ${
                isListening ? 'hover:bg-red-700' : 'hover:bg-blue-700'
              } focus:shadow-outline w-full rounded-full py-2 px-4 text-3xl font-bold text-white focus:outline-none`}
              onClick={toggleListening}
            >
              {isListening ? 'Listening..' : 'Click to Talk'}
            </button>
          )}

          {isAiTalking && (
            <button
              className="focus:shadow-outline ml-2 rounded-full bg-gray-300 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-700 focus:outline-none"
              onClick={handleMute}
            >
              Mute
            </button>
          )}

          {isListening && (
            <div className="ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <button
            className="text-sm capitalize text-gray-400"
            onClick={() => speakLang('fix it! please try again')}
          >
            no sound on mobile? click here to fix it
          </button>
        </div>

        <ChatHistory messages={history} />
      </div>
    </Main>
  );
};

export default Chatbot;
