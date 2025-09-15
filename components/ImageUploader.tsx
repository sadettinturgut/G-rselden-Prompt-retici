
import React, { useCallback, useState } from 'react';
import { UploadCloudIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleDrag = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const uploaderContent = (
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <UploadCloudIcon className="w-10 h-10 mb-3 text-slate-400" />
      <p className="mb-2 text-sm text-slate-400">
        <span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın
      </p>
      <p className="text-xs text-slate-500">PNG, JPG veya WEBP (Maks. 10MB)</p>
    </div>
  );

  return (
    <div className="w-full">
      <label
        htmlFor="dropzone-file"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800/80 transition-colors ${isDragging ? 'border-cyan-500 bg-slate-800' : ''}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Yüklenen önizleme" className="object-contain w-full h-full p-2 rounded-lg" />
        ) : (
          uploaderContent
        )}
        <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </label>
    </div>
  );
};
