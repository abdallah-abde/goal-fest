import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import prisma from "@/lib/db";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import TournamentsCards from "@/components/lists/cards/TournamentsCards";

export default async function HomePage() {
  const tournaments = await prisma.tournament.findMany();

  return <TournamentsCards tournaments={tournaments} />;
}
