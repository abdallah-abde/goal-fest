import { z } from "zod";

const _fileSchema = z.instanceof(File, { message: "Required" });

export const ImageSchema = _fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

// AUTH SCHEMAS

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

// END OF AUTH SCHEMAS

export const CountrySchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  flagUrl: ImageSchema.optional(),
  code: z.string().optional(),
  continent: z.string().min(1, { message: "Continent is required!" }),
});

export const TeamSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  flagUrl: ImageSchema.optional(),
  code: z.string().optional(),
  type: z.string().min(1, { message: "Type is required!" }),
});

export const TournamentSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  logoUrl: ImageSchema.optional(),
  type: z.string().min(1, { message: "Type is required!" }),
  isPopular: z.string().refine((data) => data === "Yes" || data === "No"),
});

export const EditionSchema = z.object({
  tournamentId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Tournament is required" }),
  startYear: z.coerce
    .number({ message: "Please enter a valid start year" })
    .int()
    .refine((data) => data > 1900 && data < new Date().getFullYear() + 10, {
      message: `Start Year is required and must be between 1900 & ${
        new Date().getFullYear() + 10
      } `,
    }),
  endYear: z.coerce
    .number({ message: "Please enter a valid end year" })
    .int()
    .refine((data) => data > 1900 && data < new Date().getFullYear() + 10, {
      message: `End Year is required and must be between 1900 & ${
        new Date().getFullYear() + 10
      } `,
    }),
  logoUrl: ImageSchema.optional(),
  winnerId: z.union([z.coerce.number().optional(), z.string()]),
  titleHolderId: z.union([z.coerce.number().optional(), z.string()]),
  hostingCountries: z.string().optional(),
  teams: z.string().optional(),
  // currentStage: z.string().optional(),
});

export const CurrentStageSchema = z.object({
  currentStage: z.string(),
});

export const GroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  tournamentEditionId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Tournament Edition is required" }),
  teams: z.string().optional(),
});

export const GroupMatchSchema = z.object({
  homeTeamId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Home Team is required" }),
  awayTeamId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Away Team is required" }),
  homeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  date: z.union([z.coerce.date().optional(), z.string()]),
  groupId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Group is required" }),
  tournamentEditionId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Tournament Edition is required" }),
  round: z.string().optional(),
});

export const MatchScoreSchema = z.object({
  homeGoals: z.coerce.number({ message: "Please enter a valid number" }),
  awayGoals: z.coerce.number({ message: "Please enter a valid number" }),
  homeExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homePenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayPenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
});

export const MatchStatusSchema = z.object({
  status: z.string().optional(),
});

export const knockoutMatchSchema = z.object({
  homeTeamId: z.union([
    z.coerce
      .number()
      .refine((data) => data > 0, { message: "Home Team is required" })
      .optional(),
    z.string(),
  ]),
  awayTeamId: z.union([
    z.coerce
      .number()
      .refine((data) => data > 0, { message: "Away Team is required" })
      .optional(),
    z.string(),
  ]),
  homeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homeExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homePenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayPenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  date: z.union([z.coerce.date().optional(), z.string()]),
  tournamentEditionId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Tournament Edition is required" }),
  round: z.string().optional(),
  homeTeamPlacehlder: z
    .string()
    .min(2, { message: "Home Team Placeholder is required" }),
  awayTeamPlacehlder: z
    .string()
    .min(2, { message: "Away Team Placeholder is required" }),
});

export const knockoutMatchScoreSchema = z.object({
  homeGoals: z.coerce.number({ message: "Please enter a valid number" }),
  awayGoals: z.coerce.number({ message: "Please enter a valid number" }),
  homeExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homePenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayPenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
});

export const LeagueSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  flagUrl: ImageSchema.optional(),
  countryId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Country is required" }),
  continent: z.string().min(1, { message: "Continent is required!" }),
  isDomestic: z.string().min(1, { message: "Is Domestic is required!" }),
  isClubs: z.string().min(1, { message: "Is Clubs is required!" }),
  isPopular: z.string().min(1, { message: "Is Popular is required!" }),
});

export const SeasonSchema = z.object({
  leagueId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "League is required" }),
  startYear: z.coerce
    .number({ message: "Please enter a valid year" })
    .int()
    .refine((data) => data > 1900 && data < new Date().getFullYear() + 10, {
      message: `Start year is required and must be between 1900 & ${
        new Date().getFullYear() + 10
      } `,
    }),
  endYear: z.coerce
    .number({ message: "Please enter a valid year" })
    .int()
    .refine((data) => data > 1900 && data < new Date().getFullYear() + 10, {
      message: `End year is required and must be between 1900 & ${
        new Date().getFullYear() + 10
      } `,
    }),
  flagUrl: ImageSchema.optional(),
  teams: z.string().optional(),
  hostingCountries: z.string().optional(),
  currentStage: z.string().optional(),
  winnerId: z.union([z.coerce.number().optional(), z.string()]),
  titleHolderId: z.union([z.coerce.number().optional(), z.string()]),
});

export const LeagueTeamSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  flagUrl: ImageSchema.optional(),
  code: z.string().optional(),
  countryId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Country is required" }),
  continent: z.string().min(1, { message: "Continent is required!" }),
  isClub: z.string().min(1, { message: "Is Club is required!" }),
  isPopular: z.string().min(1, { message: "Is Popular is required!" }),
});

export const LeagueGroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  seasonId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Season is required" }),
  teams: z.string().optional(),
});

export const LeagueMatchSchema = z.object({
  homeTeamId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Home Team is required" }),
  awayTeamId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Away Team is required" }),
  homeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homeExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homePenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayPenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  date: z.union([z.coerce.date().optional(), z.string()]),
  seasonId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "Season is required" }),
  round: z.string().optional(),
  groupId: z.union([z.coerce.number().optional(), z.string()]),
  homeTeamPlacehlder: z
    .string()
    .min(2, { message: "Home Team Placeholder is required" }),
  awayTeamPlacehlder: z
    .string()
    .min(2, { message: "Away Team Placeholder is required" }),
  isKnockout: z.string().min(1, { message: "Is Knockout is required!" }),
});

export const LeagueKnockoutMatchSchema = z.object({
  homeTeamId: z.union([
    z.coerce
      .number()
      .refine((data) => data > 0, { message: "Home Team is required" })
      .optional(),
    z.string(),
  ]),
  awayTeamId: z.union([
    z.coerce
      .number()
      .refine((data) => data > 0, { message: "Away Team is required" })
      .optional(),
    z.string(),
  ]),
  homeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homeExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayExtraTimeGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  homePenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  awayPenaltyGoals: z.coerce
    .number({ message: "Please enter a valid number" })
    .optional(),
  date: z.union([z.coerce.date().optional(), z.string()]),
  seasonId: z.coerce
    .number()
    .int()
    .refine((data) => data > 0, { message: "League Season is required" }),
  round: z.string().optional(),
  homeTeamPlacehlder: z
    .string()
    .min(2, { message: "Home Team Placeholder is required" }),
  awayTeamPlacehlder: z
    .string()
    .min(2, { message: "Away Team Placeholder is required" }),
});
