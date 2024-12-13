import React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useScreenCapture } from '../hooks/useScreenCapture';
import { Toast } from './Toast';

export const ScreenCapture: React.FC = () => {
  const { isCapturing, captureScreen, error } = useScreenCapture();

  return (
    <>
      <button
        onClick={captureScreen}
        disabled={isCapturing}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
          isCapturing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {isCapturing ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Camera size={20} />
        )}
        <span>
          {isCapturing ? 'Processing...' : 'Capture Screen'}
        </span>
      </button>

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