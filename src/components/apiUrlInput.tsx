import { faGlobe, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

type ApiUrlInputProps = {
  onSave?: (apiUrl: string) => void;
  onRemove?: () => void;
  onClose?: () => void;
};

const ApiUrlInput: React.FC<ApiUrlInputProps> = ({
  onSave,
  onRemove,
  onClose,
}) => {
  const [apiUrl, setApiUrl] = useState<string | null>();
  const [showInput, setShowInput] = useState<boolean>(!apiUrl);

  const handleSave = () => {
    if (apiUrl == null) return;

    localStorage.setItem('apiUrl', apiUrl);
    if (onSave) onSave(apiUrl);
    setShowInput(false);
  };

  const handleRemove = () => {
    localStorage.removeItem('apiUrl');
    setApiUrl('');
    setShowInput(true);
    if (onRemove) onRemove();
  };

  const handleApiUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(event.target.value);
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    if (localStorage.getItem('apiUrl')) {
      setShowInput(false);
    }
    setApiUrl(localStorage.getItem('apiUrl'));
  }, []);

  return (
    <div className="w-auto items-center justify-center">
      <div className="w-auto rounded-md bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center">
          <h2 className="text-2xl font-bold">OpenAI API Url</h2>
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

        <div className="flex w-full">
          <input
            className="mr-2 w-full rounded-md border-2 border-gray-400 p-2"
            type="text"
            value={apiUrl || ''}
            onChange={handleApiUrlChange}
            placeholder="https://api.openai.com"
          />
          {showInput ? (
            <button
              className="rounded-md bg-blue-500 py-2 px-4 text-white"
              onClick={handleSave}
              disabled={!apiUrl}
            >
              Save
            </button>
          ) : (
            <button
              className="rounded-md bg-red-500 py-2 px-4 text-white"
              onClick={handleRemove}
              disabled={!apiUrl}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ApiUrlMenu = () => {
  const [showApiUrlManager, setShowApiUrlManager] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowApiUrlManager((prev) => !prev)}
        className="ml-4 w-auto rounded-md bg-gray-200 py-2 px-3 text-sm font-medium text-black hover:bg-gray-300"
      >
        <span className="flex w-auto">
          <FontAwesomeIcon icon={faGlobe} className="mr-2 w-4" />
          Api Url
        </span>
      </button>
      {showApiUrlManager && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}
      {showApiUrlManager && (
        <div className="absolute inset-0 z-50 flex h-screen w-full flex-col justify-center bg-white">
          <ApiUrlInput onClose={() => setShowApiUrlManager(false)} />
        </div>
      )}
    </>
  );
};

export default ApiUrlMenu;
