import { createWorker } from 'tesseract.js';
import { getEnvironmentConfig } from '../utils/environment';
import { mockCaptureInDevelopment } from '../utils/browser';

export async function captureVisibleTab(): Promise<string> {
  const { isDevelopment, isExtension } = getEnvironmentConfig();

  if (isDevelopment && !isExtension) {
    return mockCaptureInDevelopment();
  }

  return new Promise((resolve, reject) => {
    if (!chrome?.tabs?.captureVisibleTab) {
      reject(new Error('Chrome capture API not available'));
      return;
    }

    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(dataUrl);
    });
  });
}

export async function performOCR(imageData: string): Promise<string> {
  const { isDevelopment } = getEnvironmentConfig();

  if (isDevelopment) {
    // Return mock text in development for testing
    return Promise.resolve('Sample captured text for development testing.');
  }

  try {
    const worker = await createWorker({
      logger: () => {}, // Disable logging
    });
    
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();
    
    return text.trim();
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('Failed to process image text');
  }
}