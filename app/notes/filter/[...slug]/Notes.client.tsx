// app/notes/filter/[...slug]/Notes.client.tsx
"use client";

import css from "./NotesPage.module.css";
import "modern-normalize";
import { useEffect, useState, useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

type NotesClientProps = {
  readonly tag?: string;
};

const PER_PAGE = 12;

export default function NotesClient({ tag }: NotesClientProps) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleSearchChange = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 500);

 
  const { data, isSuccess } = useQuery({
    queryKey: ["notes", page, search, tag ?? ""],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: tag === "all" ? undefined : tag,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = useMemo(() => data?.notes ?? [], [data?.notes]);
  const totalPages = useMemo(() => data?.totalPages ?? 0, [data?.totalPages]);

 
  useEffect(() => {
    if (isSuccess && notes.length === 0 && search) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, notes.length, search]);


  const handleNoteCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    setIsModalOpen(false);
    toast.success("Note created successfully!");
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onSetPage={setPage} />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCloseModal={handleNoteCreated} />
        </Modal>
      )}

      <Toaster />
    </div>
  );
}
