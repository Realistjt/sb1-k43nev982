import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { processFile } from '../services/fileProcessing';
import type { FileRejection } from 'react-dropzone';

interface UseFileUploadReturn {
  isUploading: boolean;
  error: string | null;
  handleFiles: (files: File[]) => Promise<void>;
  handleRejected: (fileRejections: FileRejection[]) => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addMaterial = useStore((state) => state.addMaterial);

  const handleFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      await Promise.all(
        files.map(async (file) => {
          const processedFile = await processFile(file);
          await addMaterial(processedFile);
        })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload file';
      setError(message);
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [addMaterial]);

  const handleRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors = fileRejections.map(({ file, errors }) => 
      `${file.name}: ${errors.map(e => e.message).join(', ')}`
    );
    setError(errors.join('\n'));
  }, []);

  return { isUploading, error, handleFiles, handleRejected };
}