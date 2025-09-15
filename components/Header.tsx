
import React from 'react';
import { ImageIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center py-6">
      <div className="flex justify-center items-center gap-4 mb-4">
        <ImageIcon className="w-12 h-12 text-cyan-400" />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Görselden Prompt Üretici
        </h1>
      </div>
      <p className="max-w-2xl mx-auto mt-4 text-slate-300">
        Bir resim yükleyin, yapay zeka resmi analiz etsin ve AI görüntü oluşturucular için kullanabileceğiniz yaratıcı bir prompt oluştursun.
      </p>
    </header>
  );
};
