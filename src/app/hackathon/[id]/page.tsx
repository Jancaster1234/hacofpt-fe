// src/app/hackathon/[id]/page.tsx
"use client";
// TODO: [Lv1] check if should cache the page server side and revalidate
// TODO: [Lv1] check if nextjs able to cache this page client-side
import { Metadata } from "next";
import { useParams } from "next/navigation";
import HackathonBanner from "./_components/HackathonBanner";
import HackathonTabs from "./_components/HackathonTabs";
import HackathonOverview from "./_components/HackathonOverview";
import { Hackathon } from "@/types/entities/hackathon";
import { hackathonService } from "@/services/hackathon.service";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// TODO: [Lv1] check if memoization is enabled by default, without the need of enable force-cache

// This function should be memoized to avoid fetching the same data multiple times
async function getHackathon(id: string): Promise<Hackathon[]> {
  const response = await hackathonService.getHackathonById(id);
  return response.data.length > 0 ? response.data[0] : null;
}

export default function HackathonDetail() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: hackathon,
    error,
    isLoading,
  } = useQuery<Hackathon>({
    queryKey: ["hackathon", id],
    queryFn: () => getHackathon(id),
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false,
  });

  // For metadata-related side effects
  useEffect(() => {
    if (hackathon) {
      document.title = hackathon.title || "Hackathon Detail";
      // Update meta description if needed
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", hackathon.description || "");
      }
    }
  }, [hackathon]);

  if (isLoading) return <p>Loading hackathon details...</p>;
  if (error) return <p>Failed to load hackathon details.</p>;
  if (!hackathon) return <p>No hackathon found.</p>;

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
        endDate={hackathon.endDate}
      />
      <HackathonTabs
        content={{
          information: hackathon.information,
          description: hackathon.description,
          participant: hackathon.participant,
          documentation: hackathon.documentation,
          contact: hackathon.contact,
        }}
        hackathonId={id}
      />
    </div>
  );
}
