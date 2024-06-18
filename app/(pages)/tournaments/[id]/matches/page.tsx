import { FC } from "react";
import prisma from "@/lib/db";
import MatchList from "@/components/MatchList";

const MatchesPage: FC = async () => {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
  });

  return <MatchList matches={matches} />;
};

export default MatchesPage;
