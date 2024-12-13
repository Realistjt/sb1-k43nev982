import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';
import { Toast } from './Toast';
import { formatFileSize } from '../utils/format';

const ACCEPTED_FILES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'image/*': ['.png', '.jpg', '.jpeg'],
};

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export const MaterialUpload: React.FC = () => {
  const { isUploading, error, handleFiles, handleRejected } = useFileUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: handleFiles,
    onDropRejected: handleRejected,
    accept: ACCEPTED_FILES,
    maxSize: MAX_SIZE,
    multiple: true,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="animate-spin text-blue-600" size={24} />
          ) : (
            <Upload className="text-blue-600" size={24} />
          )}
          <p className="text-gray-600">
            {isUploading ? 'Uploading...' : isDragActive
              ? 'Drop your files here'
              : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-sm text-gray-500">
            Supports PDF, TXT, PNG, and JPG (max {formatFileSize(MAX_SIZE)})
          </p>
        </div>
      </div>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => {}}
        />
      )}
    </>
  );
};