export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKnowledgeEntryInput {
  title: string;
  description: string;
  image?: string;
}

export interface UpdateKnowledgeEntryInput {
  title?: string;
  description?: string;
  image?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
}

