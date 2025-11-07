import type {
  KnowledgeEntry,
  CreateKnowledgeEntryInput,
  UpdateKnowledgeEntryInput,
  ApiResponse,
} from '@/types';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    : 'http://localhost:3001';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const normalizedData = Array.isArray(data)
      ? data.map((item: any) => ({
          ...item,
          id: String(item.id),
        }))
      : data && typeof data === 'object' && 'id' in data
        ? { ...data, id: String(data.id) }
        : data;
    
    return { data: normalizedData as T };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function getKnowledgeEntries(): Promise<ApiResponse<KnowledgeEntry[]>> {
  return fetchApi<KnowledgeEntry[]>('/knowledge-entries');
}

export async function getKnowledgeEntry(id: string): Promise<ApiResponse<KnowledgeEntry>> {
  return fetchApi<KnowledgeEntry>(`/knowledge-entries/${id}`);
}

export async function createKnowledgeEntry(
  input: CreateKnowledgeEntryInput
): Promise<ApiResponse<KnowledgeEntry>> {
  const response = await fetchApi<KnowledgeEntry>('/knowledge-entries', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  });
  return response;
}

export async function updateKnowledgeEntry(
  id: string,
  input: UpdateKnowledgeEntryInput
): Promise<ApiResponse<KnowledgeEntry>> {
  return fetchApi<KnowledgeEntry>(`/knowledge-entries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...input,
      updatedAt: new Date().toISOString(),
    }),
  });
}

export async function deleteKnowledgeEntry(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/knowledge-entries/${id}`, {
    method: 'DELETE',
  });
}

