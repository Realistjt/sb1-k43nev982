import { StorageValue } from 'zustand/middleware';

const CHUNK_SIZE = 450 * 1024; // 450KB per chunk to stay well under the 512KB limit

interface ChunkedStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

export function createChunkedStorage(prefix: string): ChunkedStorage {
  return {
    getItem: (name: string): string | null => {
      try {
        const chunkCount = localStorage.getItem(`${prefix}-${name}-chunks`);
        if (!chunkCount) return null;

        const chunks: string[] = [];
        for (let i = 0; i < parseInt(chunkCount, 10); i++) {
          const chunk = localStorage.getItem(`${prefix}-${name}-${i}`);
          if (chunk === null) return null;
          chunks.push(chunk);
        }

        return chunks.join('');
      } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
      }
    },

    setItem: (name: string, value: string): void => {
      try {
        // Clear existing chunks first
        const existingCount = localStorage.getItem(`${prefix}-${name}-chunks`);
        if (existingCount) {
          for (let i = 0; i < parseInt(existingCount, 10); i++) {
            localStorage.removeItem(`${prefix}-${name}-${i}`);
          }
        }

        // Split value into chunks
        const chunks: string[] = [];
        for (let i = 0; i < value.length; i += CHUNK_SIZE) {
          chunks.push(value.slice(i, i + CHUNK_SIZE));
        }

        // Store chunks
        chunks.forEach((chunk, index) => {
          localStorage.setItem(`${prefix}-${name}-${index}`, chunk);
        });
        localStorage.setItem(`${prefix}-${name}-chunks`, chunks.length.toString());
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'QuotaExceededError') {
            // If we hit quota, try to clear old data
            clearOldData(prefix);
            // Retry once after clearing
            try {
              this.setItem(name, value);
              return;
            } catch {
              // If it fails again, throw the original error
            }
          }
        }
        throw error;
      }
    },

    removeItem: (name: string): void => {
      try {
        const chunkCount = localStorage.getItem(`${prefix}-${name}-chunks`);
        if (chunkCount) {
          for (let i = 0; i < parseInt(chunkCount, 10); i++) {
            localStorage.removeItem(`${prefix}-${name}-${i}`);
          }
          localStorage.removeItem(`${prefix}-${name}-chunks`);
        }
      } catch (error) {
        console.error('Error removing from storage:', error);
      }
    },
  };
}

function clearOldData(prefix: string): void {
  // Remove items older than 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  try {
    const db = window.indexedDB.open('StudyDB');
    db.onsuccess = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      const transaction = database.transaction(['questions', 'materials', 'flashcards'], 'readwrite');
      
      ['questions', 'materials', 'flashcards'].forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.index('timestamp').openCursor(IDBKeyRange.upperBound(thirtyDaysAgo));
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            store.delete(cursor.primaryKey);
            cursor.continue();
          }
        };
      });
    };
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
}