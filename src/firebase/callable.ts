import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import type { ManagePestOutput } from '@/ai/types';

type SavePestData = ManagePestOutput & { farmId: string };

const _savePestIdentification = httpsCallable<SavePestData, { success: boolean }>(functions, 'savePestIdentification');

export const savePestIdentification = async (data: SavePestData) => {
    return _savePestIdentification(data);
};
