import type { ReactNode } from 'react';

import { ApiKeyMenu } from '@/components/apiKeyInput';
import { ApiUrlMenu } from '@/components/apiUrlInput';
import { SelectLang } from '@/components/selectLang';
import { SelectPrompt } from '@/components/selectPrompt';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  return (
    <div className="w-full text-gray-700 antialiased">
      {props.meta}

      <div className="mx-auto flex h-screen w-auto max-w-screen-md flex-col justify-between overflow-scroll">
        <header className="w-auto overflow-scroll border-b border-gray-300">
          <div className="flex w-auto items-center justify-between overflow-scroll py-8">
            <div>
              <p className="text-md font-bold capitalize text-gray-900">
                {AppConfig.title}
              </p>
            </div>
            <div className="flex w-auto items-center space-x-4 overflow-scroll">
              <ApiUrlMenu />
              <ApiKeyMenu />
              <SelectPrompt />
              <SelectLang />
            </div>
          </div>
        </header>

        <main className="content text-xl">{props.children}</main>

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
