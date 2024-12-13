import { isChromeExtension } from './browser';

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export function getEnvironmentConfig() {
  return {
    isDevelopment,
    isProduction,
    isExtension: isChromeExtension(),
  };
}