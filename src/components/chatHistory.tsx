import React from 'react';

import type { MessageHistory } from '@/types';
import { ChatRole } from '@/types';

type ChatHistoryProps = {
  messages: MessageHistory[];
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const renderMessage = (message: MessageHistory, index: number) => {
    const { role, content } = message;
    const isSystem = role === ChatRole.system;
    const isUser = role === ChatRole.user;
    const isAssistant = role === ChatRole.assistant;
    const textColor = isSystem
      ? 'text-red-600'
      : isUser
      ? 'text-blue-300'
      : isAssistant
      ? 'text-black'
      : 'text-gray-900';

    return (
      <div key={index} className={`w-full rounded-lg`}>
        <div className={`text-sm ${textColor} py-1`}>{content}</div>
      </div>
    );
  };

  return (
    <div className="mt-10 max-h-20 w-full overflow-y-auto px-4 outline outline-1 outline-gray-200">
      {messages.filter((s) => s.role !== ChatRole.system).map(renderMessage)}
    </div>
  );
};

export default ChatHistory;
