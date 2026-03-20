import { storage } from './firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const StorageService = {
  uploadFile: async (path: string, blob: Blob): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytesResumable(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  }
};
