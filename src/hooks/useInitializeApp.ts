import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useInitializeApp() {
  const { loadInitialData } = useStore();

  useEffect(() => {
    loadInitialData().catch(console.error);
  }, [loadInitialData]);
}