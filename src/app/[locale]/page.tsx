// src/app/[locale]/page.tsx
import ScrollUp from "@/components/common/ScrollUp";
import Hero from "@/components/Hero";
import { Metadata } from "next";
import Services from "./_components/Services";
import FeaturedHackathons from "./_components/FeaturedHackathons";
import KeyFeatures from "./_components/KeyFeatures";
import FeaturedBlogPosts from "./_components/FeaturedBlogPosts";
export const metadata: Metadata = {
  title: "Hacof: homepage",
  description: "This is Homepage of Hacof",
  // other metadata
};
// TODO: {lv1} Update Home component then delete related asset in public/images
export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Services />
      <FeaturedHackathons />
      {/* <KeyFeatures /> */}
      <FeaturedBlogPosts />
    </>
  );
}
