// src/app/[locale]/hackathon/[id]/_components/EnrollmentFormTab.tsx
"use client";
import { useState } from "react";

type EnrollmentFormTabProps = {
  hackathonId: string;
  minTeam: number;
  maxTeam: number;
};

export default function EnrollmentFormTab({
  hackathonId,
  minTeam,
  maxTeam,
}: EnrollmentFormTabProps) {
  const [activeTab, setActiveTab] = useState<"individual" | "team">(
    "individual"
  );
  const [teamMembers, setTeamMembers] = useState(
    Array(minTeam).fill({ email: "", phone: "" })
  );

  const handleInputChange = (
    index: number,
    field: "email" | "phone",
    value: string
  ) => {
    setTeamMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const addMember = () => {
    if (teamMembers.length < maxTeam) {
      setTeamMembers([...teamMembers, { email: "", phone: "" }]);
    }
  };

  const removeMember = (index: number) => {
    if (teamMembers.length > minTeam) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const handleEnroll = () => {
    console.log("Enrolling in hackathon:", hackathonId);
  };

  return (
    <div>
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("individual")}
          className={`flex-1 py-2 text-center ${
            activeTab === "individual"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Individual Registration
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`flex-1 py-2 text-center ${
            activeTab === "team" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Team Registration
        </button>
      </div>

      {activeTab === "individual" ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Register as an individual participant.
          </p>
          <button
            onClick={handleEnroll}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
          >
            Submit
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4 text-center">
            Your team must have between {minTeam} and {maxTeam} members.
          </p>

          {teamMembers.map((member, index) => (
            <div key={index} className="mb-2 flex gap-2">
              <input
                type="email"
                placeholder="Email"
                value={member.email}
                onChange={(e) =>
                  handleInputChange(index, "email", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={member.phone}
                onChange={(e) =>
                  handleInputChange(index, "phone", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              {teamMembers.length > minTeam && (
                <button
                  onClick={() => removeMember(index)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {teamMembers.length < maxTeam && (
            <button
              onClick={addMember}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              + Add Member
            </button>
          )}
          <button
            onClick={handleEnroll}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
