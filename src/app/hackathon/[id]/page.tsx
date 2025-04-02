// src/app/hackathon/[id]/page.tsx
"use client";
// TODO: [Lv1] check if should cache the page server side and revalidate
// TODO: [Lv1] check if nextjs able to cache this page client-side
import { Metadata } from "next";
import HackathonBanner from "./_components/HackathonBanner";
import HackathonTabs from "./_components/HackathonTabs";
import HackathonOverview from "./_components/HackathonOverview";
import { Hackathon } from "@/types/entities/hackathon"; // Import type
import { hackathonService } from "@/services/hackathon.service";
import { useEffect, useState, use } from "react";

type HackathonProps = {
  params: Promise<{ id: string }>;
};

// TODO: [Lv1] check if memoization is enabled by default, without the need of enable force-cache

// This function should be memoized to avoid fetching the same data multiple times
// async function getHackathon(id: string): Promise<Partial<Hackathon>> {
//   return await hackathonService.getHackathonById(id);
// }

//`params` is necessary here for fetching metadata dynamically, SEO purposes
// export async function generateMetadata({
//   params,
// }: HackathonProps): Promise<Metadata> {
//   // Await the params object
//   const id = (await params).id;
//   const hackathon = await hackathonService.getHackathonById(id);
//   return {
//     title: hackathon.title,
//     description: hackathon.description,
//   };
// }

export default function HackathonDetail({ params }: HackathonProps) {
  const { id } = use(params);
  const [hackathon, setHackathon] = useState<any>(null);

  useEffect(() => {
    async function fetchHackathon() {
      const data = await hackathonService.getHackathonById(id);

      // ✅ Ensure we're setting the first object if it's an array
      if (Array.isArray(data) && data.length > 0) {
        setHackathon(data[0]);
      } else {
        setHackathon(data); // Fallback in case data is an object
      }
    }

    fetchHackathon();
  }, [id]);

  if (!hackathon) return <p>Loading...</p>;
  console.log("🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹Hackathon data:", hackathon); // Debugging line
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <HackathonBanner
        bannerImageUrl={hackathon.bannerImageUrl}
        altText={hackathon.title}
      />
      <HackathonOverview
        title={hackathon.title}
        subtitle={hackathon.subtitle}
        date={hackathon.enrollStartDate}
        enrollmentCount={hackathon.enrollmentCount}
        id={id}
        minimumTeamMembers={hackathon.minimumTeamMembers}
        maximumTeamMembers={hackathon.maximumTeamMembers}
      />
      <HackathonTabs
        content={{
          information: hackathon.information,
          description: hackathon.description,
          participant: hackathon.participant,
          documentation: hackathon.documentation,
          contact: hackathon.contact,
        }}
      />
    </div>
  );
}
