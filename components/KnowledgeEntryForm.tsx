'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import type { KnowledgeEntry, CreateKnowledgeEntryInput, FormErrors } from '@/types';
import { fileToBase64, validateImageFile } from '@/lib/utils';

interface KnowledgeEntryFormProps {
  entry?: KnowledgeEntry;
  onSubmit: (input: CreateKnowledgeEntryInput) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export function KnowledgeEntryForm({
  entry,
  onSubmit,
  onCancel,
}: KnowledgeEntryFormProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [description, setDescription] = useState(entry?.description || '');
  const [image, setImage] = useState<string | undefined>(entry?.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setDescription(entry.description);
      setImage(entry.image);
    }
  }, [entry]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors({ ...errors, image: validation.error });
      return;
    }

    setErrors({ ...errors, image: undefined });
    setImageFile(file);
    try {
      const base64 = await fileToBase64(file);
      setImage(base64);
    } catch (error) {
      setErrors({ ...errors, image: 'Failed to process image' });
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      image,
    });
    setIsSubmitting(false);

    if (!result.success && result.error) {
      setErrors({ ...errors, title: result.error });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl p-6 shadow-lg bg-card text-card-foreground border border-border"
      data-testid="knowledge-entry-form"
    >
      <h2 className="text-2xl font-bold text-card-foreground">
        {entry ? 'Edit Knowledge Entry' : 'Create Knowledge Entry'}
      </h2>

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          placeholder="Enter a descriptive title"
          maxLength={100}
          data-testid="form-title-input"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          placeholder="Describe the knowledge or procedure..."
          maxLength={1000}
          data-testid="form-description-input"
        />
        <div className="mt-1 flex justify-between">
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
          <p className="ml-auto text-xs text-muted-foreground">
            {description.length}/1000
          </p>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Image (Optional)
        </label>
        {image ? (
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border">
              <Image
                src={image}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 text-sm text-destructive hover:underline"
            >
              Remove image
            </button>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              data-testid="form-image-input"
            />
            <label
              htmlFor="image-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted p-8 transition-colors hover:border-primary hover:bg-accent"
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Click to upload an image
              </span>
              <span className="text-xs text-muted-foreground">
                JPEG, PNG, or WebP (max 5MB)
              </span>
            </label>
          </div>
        )}
        {errors.image && (
          <p className="mt-1 text-sm text-destructive">{errors.image}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="form-submit-button"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              {entry ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            entry ? 'Update Entry' : 'Create Entry'
          )}
        </button>
      </div>
    </form>
  );
}

