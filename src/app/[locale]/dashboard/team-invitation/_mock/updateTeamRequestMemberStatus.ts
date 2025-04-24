// src/app/[locale]/dashboard/team-invitation/_mock/updateTeamRequestMemberStatus.ts
import {
  TeamRequestMember,
  TeamRequestMemberStatus,
} from "@/types/entities/teamRequestMember";

type UpdateStatusParams = {
  teamRequestMemberId: string;
  status: TeamRequestMemberStatus;
};

export const updateTeamRequestMemberStatus = (
  params: UpdateStatusParams
): Promise<TeamRequestMember> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This would be replaced with an actual API call in production
      const updatedMember: TeamRequestMember = {
        id: params.teamRequestMemberId,
        status: params.status,
        respondedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      resolve(updatedMember);
    }, 500);
  });
};
