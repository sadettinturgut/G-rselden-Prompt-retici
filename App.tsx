
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { Loader } from './components/Loader';
import { generatePromptFromImage, GeneratedPrompts } from './services/geminiService';
import { MagicWandIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setGeneratedPrompts(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGeneratePrompt = useCallback(async () => {
    if (!imageFile) {
      setError('Lütfen önce bir resim yükleyin.');
      return;
    }

    setIsLoading(true);
    setGeneratedPrompts(null);
    setError(null);

    try {
      const prompts = await generatePromptFromImage(imageFile);
      setGeneratedPrompts(prompts);
    } catch (err: any) {
      console.error(err);
      setError(`Prompt oluşturulurken bir hata oluştu: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="w-full space-y-4">
              <h2 className="text-xl font-semibold text-cyan-400">1. Adım: Resim Yükle</h2>
              <ImageUploader onImageUpload={handleImageUpload} previewUrl={imageUrl} />
            </div>
            <div className="flex flex-col items-center justify-center space-y-6 md:mt-10">
                <button
                    onClick={handleGeneratePrompt}
                    disabled={!imageFile || isLoading}
                    className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                >
                    <MagicWandIcon className="w-6 h-6" />
                    <span>Prompt Oluştur</span>
                </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">2. Adım: Sonuç</h2>
            <div className="w-full min-h-[200px] bg-slate-800/50 rounded-lg p-6 border border-slate-700 flex items-center justify-center">
                {isLoading ? (
                <Loader />
                ) : error ? (
                <p className="text-red-400 text-center">{error}</p>
                ) : generatedPrompts ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-3 text-center md:text-left">Türkçe Prompt</h3>
                        <PromptDisplay prompt={generatedPrompts.turkish} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-3 text-center md:text-left">English Prompt</h3>
                        <PromptDisplay prompt={generatedPrompts.english} />
                    </div>
                  </div>
                ) : (
                <p className="text-slate-400 text-center">Prompt'larınız burada görünecek...</p>
                )}
            </div>
          </div>
        </main>
      </div>
       <footer className="text-center mt-12 py-4 text-slate-500 text-sm space-y-2">
        <p>Program Tasarımcısı: SADETTİN TURGUT</p>
        <p>Gemini AI ile güçlendirilmiştir.</p>
      </footer>
    </div>
  );
};

export default App;
