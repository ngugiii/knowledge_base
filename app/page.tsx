'use client';

import { useState } from 'react';
import { Plus, AlertCircle, FileText } from 'lucide-react';
import { useKnowledgeEntries } from '@/hooks/useKnowledgeEntries';
import { KnowledgeEntryCard } from '@/components/KnowledgeEntryCard';
import { KnowledgeEntryForm } from '@/components/KnowledgeEntryForm';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { KnowledgeEntry, CreateKnowledgeEntryInput } from '@/types';

export default function Dashboard() {
  const { entries, loading, error, addEntry, editEntry, removeEntry } = useKnowledgeEntries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | undefined>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleOpenModal = (entry?: KnowledgeEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(undefined);
  };

  const handleSubmit = async (input: CreateKnowledgeEntryInput) => {
    const result = editingEntry
      ? await editEntry(editingEntry.id, input)
      : await addEntry(input);

    if (result.success) {
      setToast({
        message: editingEntry
          ? 'Knowledge entry updated successfully!'
          : 'Knowledge entry created successfully!',
        type: 'success',
      });
      handleCloseModal();
    } else {
      setToast({
        message: result.error || 'An error occurred. Please try again.',
        type: 'error',
      });
    }

    return result;
  };

  const handleDelete = async (id: string) => {
    const result = await removeEntry(id);
    if (result.success) {
      setToast({ message: 'Knowledge entry deleted successfully!', type: 'success' });
    } else {
      setToast({
        message: result.error || 'Failed to delete entry. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Knowledge Base
              </h1>
              <p className="mt-2 text-muted-foreground">
                Capture and share manufacturing knowledge
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-background"
              data-testid="add-entry-button"
            >
              <Plus className="h-5 w-5" />
              Add Entry
            </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading entries: {error}</span>
            </div>
          </div>
        )}

        {loading && <SkeletonLoader />}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              No knowledge entries yet
            </h2>
            <p className="mb-6 text-muted-foreground">
              Get started by creating your first knowledge entry
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Create First Entry
            </button>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <KnowledgeEntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <KnowledgeEntryForm
            entry={editingEntry}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </Modal>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
