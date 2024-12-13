import { StudyMaterial } from '../types';

export async function processFile(file: File): Promise<Omit<StudyMaterial, 'id' | 'timestamp'>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileType = getFileType(file);

    reader.onload = async () => {
      try {
        const content = reader.result as string;
        resolve({
          name: file.name,
          type: fileType,
          content,
        });
      } catch (error) {
        reject(new Error('Failed to process file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    if (fileType === 'pdf') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
}

function getFileType(file: File): StudyMaterial['type'] {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'note';
  }
}