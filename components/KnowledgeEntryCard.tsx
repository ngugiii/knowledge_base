'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Edit, Trash2, Clock } from 'lucide-react';
import type { KnowledgeEntry } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import { ConfirmationModal } from './ConfirmationModal';

interface KnowledgeEntryCardProps {
  entry: KnowledgeEntry;
  onEdit: (entry: KnowledgeEntry) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeEntryCard({ entry, onEdit, onDelete }: KnowledgeEntryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await onDelete(entry.id);
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  const description = showFullDescription
    ? entry.description
    : truncateText(entry.description, 150);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg animate-scale-in bg-card text-card-foreground border border-border"
      data-testid={`knowledge-entry-${entry.id}`}
    >
      {entry.image && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="flex-1 text-xl font-semibold text-card-foreground">
            {entry.title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(entry)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label={`Edit ${entry.title}`}
              data-testid={`edit-button-${entry.id}`}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              aria-label={`Delete ${entry.title}`}
              data-testid={`delete-button-${entry.id}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {description}
          {entry.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="ml-1 text-primary hover:underline"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Updated {formatDate(entry.updatedAt)}</span>
        </div>
      </div>

      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Knowledge Entry"
        message={`Are you sure you want to delete "${entry.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </article>
  );
}

