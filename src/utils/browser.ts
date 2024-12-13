export function isChromeExtension(): boolean {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

export async function requestPermissions(permissions: string[]): Promise<boolean> {
  if (!isChromeExtension()) return true;
  
  try {
    return await chrome.permissions.request({ permissions });
  } catch {
    return false;
  }
}

export function mockCaptureInDevelopment(): Promise<string> {
  // Return a data URL of a small test image for development
  return Promise.resolve(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  );
}