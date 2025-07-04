// services/uniqueId.ts
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'user_unique_id';

/**
 * Récupère ou génère un identifiant unique persistant localement,
 * mais qui sera perdu si l'app est désinstallée.
 */
export async function getUniqueId(): Promise<string> {
  let existingId = await SecureStore.getItemAsync(STORAGE_KEY);

  if (!existingId) {
    const newId = uuidv4();
    await SecureStore.setItemAsync(STORAGE_KEY, newId);
    return newId;
  }

  return existingId;
}
