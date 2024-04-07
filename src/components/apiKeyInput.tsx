import { faKey, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

type ApiKeyInputProps = {
  onSave?: (apiKey: string) => void;
  onRemove?: () => void;
  onClose?: () => void;
};

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  onSave,
  onRemove,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState<string | null>();
  const [showInput, setShowInput] = useState<boolean>(!apiKey);

  const handleSave = () => {
    if (apiKey == null) return;

    localStorage.setItem('apiKey', apiKey);
    if (onSave) onSave(apiKey);
    setShowInput(false);
  };

  const handleRemove = () => {
    localStorage.removeItem('apiKey');
    setApiKey('');
    setShowInput(true);
    if (onRemove) onRemove();
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    if (localStorage.getItem('apiKey')) {
      setShowInput(false);
    }
    setApiKey(localStorage.getItem('apiKey'));
  }, []);

  return (
    <div className="items-center justify-center">
      <div className="rounded-md bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center">
          <h2 className="text-2xl font-bold">OpenAI API key</h2>
          <button
            onClick={handleCancel}
            className="ml-auto w-5 cursor-pointer text-gray-500  hover:text-gray-800"
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-gray-500 hover:text-gray-800"
            />
          </button>
        </div>
        {showInput ? (
          <div className="flex">
            <input
              className="mr-2 w-full rounded-md border-2 border-gray-400 p-2"
              type="text"
              value={apiKey || ''}
              onChange={handleApiKeyChange}
              placeholder="API key"
            />
            <button
              className="rounded-md bg-blue-500 py-2 px-4 text-white"
              onClick={handleSave}
              disabled={!apiKey}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex">
            <input
              className="mr-2 w-full rounded-md border-2 border-gray-400 p-2"
              type="text"
              value={apiKey || ''}
              onChange={handleApiKeyChange}
              placeholder="API key"
            />
            <button
              className="rounded-md bg-red-500 py-2 px-4 text-white"
              onClick={handleRemove}
              disabled={!apiKey}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ApiKeyMenu = () => {
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowApiKeyManager((prev) => !prev)}
        className="ml-4 w-auto rounded-md bg-gray-200 py-2 px-3 text-sm font-medium text-black hover:bg-gray-300"
      >
        <span className="flex w-auto">
          <FontAwesomeIcon icon={faKey} className="mr-2 w-4" />
          Api Key
        </span>
      </button>
      {showApiKeyManager && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}
      {showApiKeyManager && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white py-5 px-6">
          <ApiKeyInput onClose={() => setShowApiKeyManager(false)} />
        </div>
      )}
    </>
  );
};

export default ApiKeyMenu;
