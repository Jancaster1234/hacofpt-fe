// src/app/profile/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { User } from "@/types/entities/user";
import InformationTab from "@/app/profile/_components/InformationTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HackathonParticipatedTab from "@/app/profile/_components/HackathonParticipatedTab";
import AwardTab from "@/app/profile/_components/AwardTab";

const userMock: User = {
  id: "1",
  firstName: "Phan Thanh Phuc",
  lastName: "Bui",
  avatarUrl:
    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
  email: "yemmbakpierre@gmail.com",
  phone: "+21298309827",
  bio: "Full-Stack developer passionate about building useful web products.",
  city: "Casablanca",
  country: "Morocco",
  githubUrl: "https://github.com/yourprofile",
  linkedinUrl: "https://linkedin.com/in/yourprofile",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  experienceLevel: "Intermediate",
  createdUsers: [],
  userRoles: [
    {
      id: "ur4",
      user: {
        id: "1",
      },
      role: { id: "6", name: "TEAM_MEMBER" },
    },
  ],
  userHackathons: [
    {
      id: "1",
      hackathon: {
        id: "hackathon-1",
        bannerImageUrl:
          "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
        title: "HACKCOVY - Online hackathon 2024",
        startDate: "2024-04-24",
        endDate: "2024-04-26",
        status: "CLOSED",
        hackathonResults: [
          { id: "r1", teamId: "team-1", placement: 1, totalScore: 95 },
          { id: "r2", teamId: "team-2", placement: 2, totalScore: 90 },
        ],
      },
      role: "Participant",
    },
    {
      id: "2",
      hackathon: {
        id: "hackathon-2",
        bannerImageUrl:
          "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
        title: "HACKCOVY - Online hackathon 2023",
        startDate: "2023-04-20",
        endDate: "2023-04-22",
        status: "CLOSED",
        hackathonResults: [
          { id: "r3", teamId: "team-3", placement: 1, totalScore: 98 },
          { id: "r4", teamId: "team-4", placement: 3, totalScore: 85 },
        ],
      },
      role: "Participant",
    },
  ],
  userTeams: [
    {
      id: "ut1",
      userId: "1",
      teamId: "team-1",
      team: {
        id: "team-1",
        hackathonId: "hackathon-1",
        name: "Team Alpha",
        isDeleted: false,
      },
    },
    {
      id: "ut2",
      userId: "1",
      teamId: "team-3",
      team: {
        id: "team-3",
        hackathonId: "hackathon-2",
        name: "Team Beta",
        isDeleted: false,
      },
    },
  ],
  createdAt: new Date().toISOString(),
  createdByUserName: undefined,
};

export default function ProfilePage() {
  const [user, setUser] = useState<User>(userMock);

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-8 items-center mb-8">
        <div className="relative">
          <Image
            src={user.avatarUrl || "/placeholder.png"}
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full object-cover border shadow-md"
          />
          <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow cursor-pointer">
            ✏️
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      </div>

      <Tabs defaultValue="information" className="w-full">
        <TabsList>
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathon Participated</TabsTrigger>
          <TabsTrigger value="award">Award</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <InformationTab user={user} setUser={(updated) => setUser(updated)} />
        </TabsContent>

        <TabsContent value="hackathon">
          <HackathonParticipatedTab user={user} />
        </TabsContent>

        <TabsContent value="award">
          <AwardTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
