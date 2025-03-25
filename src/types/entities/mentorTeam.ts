// src/types/entities/mentorTeam.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Hackathon } from "./hackathon";
import { Team } from "./team";

export type MentorTeam = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  mentor?: Partial<User>;
  mentorId?: string;
  team?: Partial<Team>;
  teamId?: string;
} & AuditCreatedBase;
