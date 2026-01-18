import css from './NoteList.module.css';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNote } from '@/lib/api';
import type { Note } from '../../types/note';
import Link from 'next/link';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: (id) => setDeletingId(id),
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSuccess: () => {
      toast.success('Note deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete the note. Please try again.');
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>

            <Link href={`/notes/${id}`} className={css.view}>
              View details
            </Link>

            <button
              className={css.button}
              disabled={deletingId === id}
              onClick={() => deleteNoteMutation.mutate(id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
