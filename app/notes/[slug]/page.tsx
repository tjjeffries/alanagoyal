import Note from "@/components/note";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Note as NoteType } from "@/lib/types";

// Enable ISR with a reasonable revalidation period for public notes
export const revalidate = 60 * 60; // 1 hour

// Dynamically determine if this is a user note
export async function generateStaticParams() {
  const supabase = createBrowserClient();
  const { data: posts } = await supabase
    .from("Public Notes")
    .select("slug")
    .eq("public", true);
  
  console.log(posts);

  return posts!.map(({ slug }) => ({
    slug,
  }));
}

// Use dynamic rendering for non-public notes
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createBrowserClient();
  const slug = params.slug.replace(/^notes\//, '');

  // const { data: note } = await supabase.rpc("select_note", {
  //   note_slug_arg: slug,
  // }).single() as { data: NoteType | null };

  const {data: note} = await supabase
    .from("Public Notes")
    .select("*")
    .eq("slug", params.slug)
    .eq("public", true);

  const title = "new note";
  const emoji = "👋🏼";

  return {
    title: `Tara Jeffries`,
    openGraph: {
      images: [
        `/notes/api/og/?title=${encodeURIComponent(title)}&emoji=${encodeURIComponent(
          emoji
        )}`,
      ],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createBrowserClient();
  const slug = params.slug.replace(/^notes\//, '');

    const {data: note} = await supabase
    .from("Public Notes")
    .select("*")
    .eq("slug", params.slug)
    .eq("public", true)
    .maybeSingle();

  if (!note) {
    return redirect("/notes/error");
  }

  return (
    <div className="w-full min-h-dvh p-3">
      <Note note={note} />
    </div>
  );
}