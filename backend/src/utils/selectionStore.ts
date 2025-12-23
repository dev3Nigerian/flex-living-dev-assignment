import { promises as fs } from 'fs';
import path from 'path';

interface SelectionFile {
  selectedIds: number[];
}

const STORAGE_PATH = path.resolve(process.cwd(), 'storage/selectedReviews.json');

const ensureStore = async (): Promise<void> => {
  try {
    await fs.access(STORAGE_PATH);
  } catch {
    const initial: SelectionFile = { selectedIds: [] };
    await fs.writeFile(STORAGE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
  }
};

export const readSelection = async (): Promise<number[]> => {
  await ensureStore();
  const file = await fs.readFile(STORAGE_PATH, 'utf-8');
  const parsed: SelectionFile = JSON.parse(file);
  return Array.isArray(parsed.selectedIds) ? parsed.selectedIds : [];
};

export const writeSelection = async (selectedIds: number[]): Promise<void> => {
  await ensureStore();
  const uniqueIds = Array.from(new Set(selectedIds.filter((id) => Number.isFinite(id))));
  const payload: SelectionFile = { selectedIds: uniqueIds };
  await fs.writeFile(STORAGE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
};

