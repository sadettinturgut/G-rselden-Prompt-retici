
import React, { useState, useCallback } from 'react';
import { ClipboardIcon, CheckIcon } from './Icons';

interface PromptDisplayProps {
  prompt: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [prompt]);

  return (
    <div className="w-full bg-slate-900/70 p-4 rounded-md relative text-left">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Prompt'u kopyala"
      >
        {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-slate-300" />}
      </button>
      <p className="text-slate-200 font-mono text-sm leading-relaxed pr-10">
        {prompt}
      </p>
       {isCopied && <div className="absolute top-12 right-3 text-xs bg-green-500 text-white px-2 py-1 rounded-md">Kopyalandı!</div>}
    </div>
  );
};
