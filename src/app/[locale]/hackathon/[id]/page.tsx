"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import { Hackathon } from "@/types/entities/hackathon";
import { hackathonService } from "@/services/hackathon.service";
import { teamService } from "@/services/team.service";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import HackathonBanner from "./_components/HackathonBanner";
import HackathonTabs from "./_components/HackathonTabs";
import HackathonOverview from "./_components/HackathonOverview";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

async function getHackathon(id: string): Promise<Hackathon | null> {
  const response = await hackathonService.getHackathonById(id);
  return response.data.length > 0 ? response.data[0] : null;
}

export default function HackathonDetail() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations("hackathonDetail");
  const toast = useToast();
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);

  const {
    data: hackathon,
    error,
    isLoading,
  } = useQuery<Hackathon | null>({
    queryKey: ["hackathon", id],
    queryFn: () => getHackathon(id),
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      toast.error(error.message || t("errorLoading"));
    },
    onSuccess: (data) => {
      if (data) {
        toast.success(t("loadedSuccessfully"));
      }
    },
  });

  // Fetch teams and individual registrations to calculate enrollmentCount
  useEffect(() => {
    if (!id) return;

    const calculateEnrollmentCount = async () => {
      try {
        // Fetch teams for this hackathon
        const teamsResponse = await teamService.getTeamsByHackathonId(id);
        const teams = teamsResponse.data;

        // Fetch approved individual registrations
        const individualRegistrationsResponse =
          await individualRegistrationRequestService.getApprovedIndividualRegistrationsByHackathonId(
            id
          );
        const approvedIndividualRegistrations =
          individualRegistrationsResponse.data;

        // Calculate total enrollment count
        // Sum of all team members plus approved individual registrations
        const teamMembersCount = teams.reduce(
          (acc, team) => acc + team.teamMembers.length,
          0
        );
        const totalEnrollmentCount =
          teamMembersCount + approvedIndividualRegistrations.length;

        setEnrollmentCount(totalEnrollmentCount);
      } catch (error) {
        console.error("Error calculating enrollment count:", error);
        // If there's an error, set enrollmentCount to 0 or handle appropriately
        setEnrollmentCount(0);
      }
    };

    calculateEnrollmentCount();
  }, [id]);

  // For metadata-related side effects
  useEffect(() => {
    if (hackathon) {
      document.title = hackathon.title || t("pageTitle");
      // Update meta description if needed
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", hackathon.description || "");
      }
    }
  }, [hackathon, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-700 dark:text-gray-300">
          {t("loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 dark:text-red-400 font-medium text-lg">
          {t("failedToLoad")}
        </p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
          {t("noHackathonFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 transition-colors duration-300">
      <HackathonBanner
        bannerImageUrl={hackathon.bannerImageUrl}
        altText={hackathon.title}
      />
      <HackathonOverview
        title={hackathon.title}
        subtitle={hackathon.subtitle}
        date={hackathon.enrollStartDate}
        enrollmentCount={enrollmentCount}
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
