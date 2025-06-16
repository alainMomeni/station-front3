// src/components/ui/FileUpload.tsx
import React from 'react';
import { FiUpload, FiPaperclip, FiX } from 'react-icons/fi';
import { cn } from '../../config/design';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, selectedFile, onFileSelect, className, ...props }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {!selectedFile ? (
        <label htmlFor="file-upload" className={cn(
            "relative cursor-pointer bg-white rounded-xl border-2 border-dashed border-gray-300 flex justify-center items-center p-6 hover:border-purple-400 transition",
            className
        )}>
          <div className="text-center">
            <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm text-gray-600">
              Cliquez pour parcourir
            </span>
          </div>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} {...props} />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 border border-gray-300 bg-gray-50 rounded-xl">
            <div className="flex items-center text-sm text-gray-700">
                <FiPaperclip className="h-4 w-4 mr-2 text-gray-500"/>
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-gray-500 ml-2">({(selectedFile.size / 1024).toFixed(1)} Ko)</span>
            </div>
            <button type="button" onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-red-100">
                <FiX className="h-4 w-4 text-red-500" />
            </button>
        </div>
      )}
    </div>
  );
};