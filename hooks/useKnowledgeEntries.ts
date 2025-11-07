'use client';

import { useState, useEffect, useCallback } from 'react';
import type { KnowledgeEntry, CreateKnowledgeEntryInput, UpdateKnowledgeEntryInput } from '@/types';
import {
  getKnowledgeEntries,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
} from '@/lib/api';

interface UseKnowledgeEntriesReturn {
  entries: KnowledgeEntry[];
  loading: boolean;
  error: string | null;
  refreshEntries: () => Promise<void>;
  addEntry: (input: CreateKnowledgeEntryInput) => Promise<{ success: boolean; error?: string }>;
  editEntry: (
    id: string,
    input: UpdateKnowledgeEntryInput
  ) => Promise<{ success: boolean; error?: string }>;
  removeEntry: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useKnowledgeEntries(): UseKnowledgeEntriesReturn {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getKnowledgeEntries();
    
    if (response.error) {
      setError(response.error);
      setEntries([]);
    } else if (response.data) {
      const sorted = response.data.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setEntries(sorted);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = useCallback(async (input: CreateKnowledgeEntryInput) => {
    const response = await createKnowledgeEntry(input);
    if (response.error) {
      return { success: false, error: response.error };
    }
    await fetchEntries();
    return { success: true };
  }, [fetchEntries]);

  const editEntry = useCallback(
    async (id: string, input: UpdateKnowledgeEntryInput) => {
      const response = await updateKnowledgeEntry(id, input);
      if (response.error) {
        return { success: false, error: response.error };
      }
      await fetchEntries();
      return { success: true };
    },
    [fetchEntries]
  );

  const removeEntry = useCallback(
    async (id: string) => {
      const response = await deleteKnowledgeEntry(id);
      if (response.error) {
        return { success: false, error: response.error };
      }
      await fetchEntries();
      return { success: true };
    },
    [fetchEntries]
  );

  return {
    entries,
    loading,
    error,
    refreshEntries: fetchEntries,
    addEntry,
    editEntry,
    removeEntry,
  };
}

