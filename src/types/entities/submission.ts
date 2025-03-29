// src/types/entities/submission.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { FileUrl } from "./fileUrl";
import { JudgeSubmission } from "./judgeSubmission";

export type SubmissionStatus = "DRAFT" | "SUBMITTED" | "REVIEWED"; // adjust to your actual enum values

export type Submission = {
  id: string;
  round?: Round;
  roundId?: string;
  fileUrls: Partial<FileUrl>[];
  judgeSubmissions: Partial<JudgeSubmission>[];
  status: SubmissionStatus;
  submittedAt: string;
  finalScore?: number;
} & AuditCreatedBase;
