// app/notes/filter/[...slug]/page.tsx

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

interface PageProps {
  params: {
    slug?: string[];
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const queryClient = new QueryClient();

  const selectedTag = params.slug?.[0];

  const tag = selectedTag === "all" ? undefined : selectedTag;

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, tag ?? ""],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        tag,
        search: "",
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
