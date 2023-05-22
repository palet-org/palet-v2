import Landing from "@/components/Landing";
import { currentUser } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palet",
  description: "More than just music.",
  openGraph: {
    images: "/images/landing-bg-v2.jpg",
    title: "Palet",
    description: "More than just music.",
    siteName: "paletapp.com",
    url: "https://paletapp.com",
  },
};

export default function Home({ params }: { params: any }) {
  return <Landing />;
}
