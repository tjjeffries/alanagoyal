import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "notes",
    openGraph: {
      images: [
        `/notes/api/og/?title=${encodeURIComponent("notes")}&emoji=${encodeURIComponent("✏️")}`,
      ],
    },
  };
}

export default function NotesIndexPage() {
  // change "about-me" to whatever your default slug is
  return redirect("/notes/about-me");
}
