import { useState, useCallback } from 'react';
import { captureVisibleTab, performOCR } from '../services/capture';
import { useStore } from '../store/useStore';
import { getEnvironmentConfig } from '../utils/environment';
import { requestPermissions } from '../utils/browser';

interface UseScreenCaptureReturn {
  isCapturing: boolean;
  captureScreen: () => Promise<void>;
  error: string | null;
}

export function useScreenCapture(): UseScreenCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addQuestion = useStore((state) => state.addQuestion);
  const { isExtension } = getEnvironmentConfig();

  const captureScreen = useCallback(async () => {
    setIsCapturing(true);
    setError(null);

    try {
      if (isExtension) {
        const granted = await requestPermissions(['activeTab']);
        if (!granted) {
          throw new Error('Screen capture permission denied');
        }
      }

      const imageData = await captureVisibleTab();
      const text = await performOCR(imageData);
      
      if (!text) {
        throw new Error('No text detected in the captured image');
      }

      await addQuestion({
        text: `Captured Text: ${text}`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to capture screen';
      setError(errorMessage);
      console.error('Screen capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  }, [addQuestion, isExtension]);

  return { isCapturing, captureScreen, error };
}