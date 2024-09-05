import { z } from "zod";

const _fileSchema = z.instanceof(File, { message: "Required" });

export const ImageSchema = _fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(6, { message: "Minimum password is 6 chars!" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum password is 6 chars!" }),
});

export const CountrySchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  flagUrl: ImageSchema.optional(),
});

export const TournamentSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  logoUrl: ImageSchema.optional(),
});

export const TeamSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  flagUrl: ImageSchema.optional(),
});

export const EditionSchema = z.object({
  tournamentId: z.coerce.number().int(),
  year: z.coerce.number().int(),
  logoUrl: ImageSchema.optional(),
  winnerId: z.union([z.coerce.number().optional(), z.string()]),
  titleHolderId: z.union([z.coerce.number().optional(), z.string()]),
  hostingCountries: z.string().optional(),
  teams: z.string().optional(),
});

export const GroupMatchSchema = z.object({
  homeTeamId: z.coerce.number().int(),
  awayTeamId: z.coerce.number().int(),
  homeGoals: z.coerce.number().optional(),
  awayGoals: z.coerce.number().optional(),
  date: z.union([z.coerce.date().optional(), z.string()]),
  groupId: z.coerce.number().int(),
  tournamentEditionId: z.coerce.number().int(),
  round: z.coerce.number().optional(),
});

export const GroupSchema = z.object({
  name: z.string().min(2),
  tournamentEditionId: z.coerce.number().int(),
  teams: z.string().optional(),
});

export const knockoutMatchSchema = z.object({
  homeTeamId: z.union([z.coerce.number().optional(), z.string()]),
  awayTeamId: z.union([z.coerce.number().optional(), z.string()]),
  homeGoals: z.coerce.number().optional(),
  awayGoals: z.coerce.number().optional(),
  homeExtraTimeGoals: z.coerce.number().optional(),
  awayExtraTimeGoals: z.coerce.number().optional(),
  homePenaltyGoals: z.coerce.number().optional(),
  awayPenaltyGoals: z.coerce.number().optional(),
  date: z.union([z.coerce.date().optional(), z.string()]),
  tournamentEditionId: z.coerce.number().int(),
  round: z.coerce.number().optional(),
  homeTeamPlacehlder: z.string().min(2),
  awayTeamPlacehlder: z.string().min(2),
});
