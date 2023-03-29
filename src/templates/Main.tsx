import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import { useState } from 'react';

import ApiKeyInput from '@/components/apiKeyInput';
import { SelectLang } from '@/components/selectLang';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}

      <div className="mx-auto max-w-screen-md">
        <header className="border-b border-gray-300">
          <div className="flex items-center justify-between py-8">
            <div>
              <p className="text-md font-bold capitalize text-gray-900">
                {AppConfig.title}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowApiKeyManager((prev) => !prev)}
                className="ml-4 w-full rounded-md bg-gray-200 py-2 px-3 text-sm font-medium text-black hover:bg-gray-300"
              >
                <span className="flex w-full">
                  <FontAwesomeIcon icon={faKey} className="mr-2 w-4" />
                  Api Key
                </span>
              </button>
              <SelectLang />
            </div>
            {showApiKeyManager && (
              <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
            )}
            {showApiKeyManager && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white py-5 px-6">
                <ApiKeyInput onClose={() => setShowApiKeyManager(false)} />
              </div>
            )}
          </div>
        </header>

        <main className="content py-5 text-xl">{props.children}</main>

        <footer className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}. Made by{' '}
          <a href="https://github.com/RetricSu/VoiceGPT">
            A Real Monkey not AI
          </a>
          .
        </footer>
      </div>
    </div>
  );
};

export { Main };
