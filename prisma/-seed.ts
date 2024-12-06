import prisma from "@/lib/db";
import {
  Continents,
  LeagueStages,
  LeagueTypes,
  MatchStatusOptions,
  LeagueStages,
  TournamentTypes,
} from "@/types/enums";

async function main() {
  const teams = await prisma.team.createMany({
    data: [
      {
        name: "Germany",
        code: "GER",
        flagUrl:
          "/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png",
        type: Continents.Europe,
      },
      {
        name: "Switzerland",
        code: "SUI",
        flagUrl:
          "/images/teams/f3d63190-f1fe-4f54-b153-110eb0b005d8-switzerland.png",
        type: Continents.Europe,
      },
      {
        name: "Hungary",
        code: "HUN",
        flagUrl:
          "/images/teams/d2d2056b-2b97-4e54-83b9-934b10637525-hungary.png",
        type: Continents.Europe,
      },
      {
        name: "Scotland",
        code: "SCO",
        flagUrl:
          "/images/teams/f7e71cf5-a49b-4b01-90fa-396c8ad40ce3-scotland.png",
        type: Continents.Europe,
      },
      {
        name: "Spain",
        code: "ESP",
        flagUrl:
          "/images/teams/33e87f35-f778-4f29-ad5c-ecaa8c316745-flag (1).png",
        type: Continents.Europe,
      },
      {
        name: "Italy",
        code: "ITA",
        flagUrl: "/images/teams/08434f97-7fbb-4153-915c-5c587077b837-italy.png",
        type: Continents.Europe,
      },
      {
        name: "Croatia",
        code: "CRO",
        flagUrl:
          "/images/teams/c1eb3bd5-a5d2-4b83-9359-22b9438d5b81-croatia.png",
        type: Continents.Europe,
      },
      {
        name: "Albania",
        code: "ALB",
        flagUrl:
          "/images/teams/b3ac1eb0-e1b4-4025-b0be-eff4c29a6233-albania.png",
        type: Continents.Europe,
      },
      {
        name: "England",
        code: "ENG",
        flagUrl:
          "/images/teams/d9d3ffa7-0c19-4606-bb97-78e5146626da-flag (2).png",
        type: Continents.Europe,
      },
      {
        name: "Denmark",
        code: "DEN",
        flagUrl:
          "/images/teams/b98ac3b0-ba2a-48aa-8f97-14959fa59b98-denmark.png",
        type: Continents.Europe,
      },
      {
        name: "Slovenia",
        code: "SVN",
        flagUrl:
          "/images/teams/63518901-ca68-4ad6-866a-e4001870b886-flag (1).png",
        type: Continents.Europe,
      },
      {
        name: "Serbia",
        code: "SRB",
        flagUrl:
          "/images/teams/446eb1af-77a5-40ae-8c33-992d007cf735-flag (2).png",
        type: Continents.Europe,
      },
      {
        name: "Austria",
        code: "AUT",
        flagUrl:
          "/images/teams/73a3d555-6f01-451f-ab42-3ebd7586c1b4-austria.png",
        type: Continents.Europe,
      },
      {
        name: "France",
        code: "FRA",
        flagUrl:
          "/images/teams/de153c75-acd3-42ea-ad98-ca40705c9139-france.png",
        type: Continents.Europe,
      },
      {
        name: "Netherlands",
        code: "NED",
        flagUrl: "/images/teams/f4b5ea04-5db6-498a-b2ab-e421455ec1e5-flag.png",
        type: Continents.Europe,
      },
      {
        name: "Poland",
        code: "POL",
        flagUrl:
          "/images/teams/6bc6d2bd-cfb6-49c9-ad04-8551c8cf26f2-poland.png",
        type: Continents.Europe,
      },
      {
        name: "Romania",
        code: "ROU",
        flagUrl:
          "/images/teams/f6167677-5a87-499b-bf69-17a42e109423-romania.png",
        type: Continents.Europe,
      },
      {
        name: "Belgium",
        code: "BEL",
        flagUrl:
          "/images/teams/a83cfe24-b578-4c6e-8ca6-607b10e376f3-belgium.png",
        type: Continents.Europe,
      },
      {
        name: "Slovakia",
        code: "SVK",
        flagUrl:
          "/images/teams/14366d44-6c0f-45f6-954e-34aabfdb50ab-slovakia.png",
        type: Continents.Europe,
      },
      {
        name: "Ukraine",
        code: "UKR",
        flagUrl:
          "/images/teams/0d123b32-3ef7-45f6-ae83-ef099a4a5958-ukraine.png",
        type: Continents.Europe,
      },
      {
        name: "Portugal",
        code: "POR",
        flagUrl:
          "/images/teams/391a6483-650e-47ab-9664-71a60c0a9794-portugal.png",
        type: Continents.Europe,
      },
      {
        name: "Turkiye",
        code: "TUR",
        flagUrl:
          "/images/teams/190bd4fd-23e8-496d-a21f-19e0cdb49a12-turkey.png",
        type: Continents.Europe,
      },
      {
        name: "Georgia",
        code: "GEO",
        flagUrl:
          "/images/teams/f902790b-b766-4df3-a82b-361081fb98df-georgia.png",
        type: Continents.Europe,
      },
      {
        name: "Czechia",
        code: "CZE",
        flagUrl:
          "/images/teams/2f89dc1c-badc-44be-aa97-d2b7a5be3fef-czech-republic.png",
        type: Continents.Europe,
      },
    ],
  });

  const germany = await prisma.team.findFirst({ where: { name: "Germany" } });
  const scotland = await prisma.team.findFirst({ where: { name: "Scotland" } });
  const hungary = await prisma.team.findFirst({ where: { name: "Hungary" } });
  const switzerland = await prisma.team.findFirst({
    where: { name: "Switzerland" },
  });
  const spain = await prisma.team.findFirst({ where: { name: "Spain" } });
  const croatia = await prisma.team.findFirst({ where: { name: "Croatia" } });
  const italy = await prisma.team.findFirst({ where: { name: "Italy" } });
  const albania = await prisma.team.findFirst({
    where: { name: "Albania" },
  });
  const poland = await prisma.team.findFirst({ where: { name: "Poland" } });
  const netherlands = await prisma.team.findFirst({
    where: { name: "Netherlands" },
  });
  const slovenia = await prisma.team.findFirst({ where: { name: "Slovenia" } });
  const denmark = await prisma.team.findFirst({
    where: { name: "Denmark" },
  });
  const serbia = await prisma.team.findFirst({ where: { name: "Serbia" } });
  const england = await prisma.team.findFirst({
    where: { name: "England" },
  });
  const romania = await prisma.team.findFirst({ where: { name: "Romania" } });
  const ukraine = await prisma.team.findFirst({ where: { name: "Ukraine" } });
  const belgium = await prisma.team.findFirst({ where: { name: "Belgium" } });
  const slovakia = await prisma.team.findFirst({ where: { name: "Slovakia" } });
  const austria = await prisma.team.findFirst({ where: { name: "Austria" } });
  const france = await prisma.team.findFirst({ where: { name: "France" } });
  const turkiye = await prisma.team.findFirst({ where: { name: "Turkiye" } });
  const georgia = await prisma.team.findFirst({ where: { name: "Georgia" } });
  const portugal = await prisma.team.findFirst({ where: { name: "Portugal" } });
  const czechia = await prisma.team.findFirst({ where: { name: "Czechia" } });

  const countries = await prisma.country.create({
    data: {
      name: "Germany",
      code: "GER",
      flagUrl:
        "/images/countries/91c80dec-81de-472f-9829-76f9ba38191c-germany (1).png",
      type: Continents.Europe,
    },
  });

  const tournament = await prisma.tournament.create({
    data: {
      name: "Euro",
      type: TournamentTypes.Europe,
      isPopular: true,
    },
  });

  const edition = await prisma.tournamentEdition.create({
    data: {
      startYear: 2024,
      endYear: 2024,
      year: "2024",
      currentStage: "Finished",
      tournamentId: tournament.id,
      slug: "euro-1",
      winnerId: spain?.id,
      titleHolderId: italy?.id,
      hostingCountries: {
        connect: await prisma.country.findMany({ where: { name: "Germany" } }),
      },
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "Germany" },
              { name: "Switzerland" },
              { name: "Hungary" },
              { name: "Scotland" },
              { name: "Spain" },
              { name: "Italy" },
              { name: "Croatia" },
              { name: "Albania" },
              { name: "England" },
              { name: "Denmark" },
              { name: "Slovenia" },
              { name: "Serbia" },
              { name: "Austria" },
              { name: "France" },
              { name: "Netherlands" },
              { name: "Poland" },
              { name: "Romania" },
              { name: "Belgium" },
              { name: "Slovakia" },
              { name: "Ukraine" },
              { name: "Portugal" },
              { name: "Turkiye" },
              { name: "Georgia" },
              { name: "Czechia" },
            ],
          },
        }),
      },
    },
  });

  const groupA = await prisma.group.create({
    data: {
      name: "Group A",
      tournamentEditionId: edition.id,
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "Germany" },
              { name: "Switzerland" },
              { name: "Hungary" },
              { name: "Scotland" },
            ],
          },
        }),
      },
    },
  });
  const groupB = await prisma.group.create({
    data: {
      name: "Group B",
      tournamentEditionId: edition.id,
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "Spain" },
              { name: "Italy" },
              { name: "Croatia" },
              { name: "Albania" },
            ],
          },
        }),
      },
    },
  });
  const groupC = await prisma.group.create({
    data: {
      name: "Group C",
      tournamentEditionId: edition.id,
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "England" },
              { name: "Denmark" },
              { name: "Slovenia" },
              { name: "Serbia" },
            ],
          },
        }),
      },
    },
  });
  const groupD = await prisma.group.create({
    data: {
      name: "Group D",
      tournamentEditionId: edition.id,
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "Austria" },
              { name: "France" },
              { name: "Netherlands" },
              { name: "Poland" },
            ],
          },
        }),
      },
    },
  });
  const groupE = await prisma.group.create({
    data: {
      name: "Group E",
      tournamentEditionId: edition.id,
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "Romania" },
              { name: "Belgium" },
              { name: "Slovakia" },
              { name: "Ukraine" },
            ],
          },
        }),
      },
    },
  });
  const groupF = await prisma.group.create({
    data: {
      name: "Group F",
      tournamentEditionId: edition.id,
      teams: {
        connect: await prisma.team.findMany({
          where: {
            OR: [
              { name: "Portugal" },
              { name: "Turkiye" },
              { name: "Georgia" },
              { name: "Czechia" },
            ],
          },
        }),
      },
    },
  });

  const matches = await prisma.match.createMany({
    data: [
      {
        homeTeamId: germany ? germany.id : 0,
        awayTeamId: scotland ? scotland.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupA ? groupA.id : 0,
        date: new Date("June 14, 2024 21:00:00"),
        round: "Round 1",
        homeGoals: 5,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: hungary ? hungary.id : 0,
        awayTeamId: switzerland ? switzerland.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupA ? groupA.id : 0,
        date: new Date("June 15, 2024 15:00:00"),
        round: "Round 1",
        homeGoals: 1,
        awayGoals: 3,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: spain ? spain.id : 0,
        awayTeamId: croatia ? croatia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupB ? groupB.id : 0,
        date: new Date("June 15, 2024 18:00:00"),
        round: "Round 1",
        homeGoals: 3,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: italy ? italy.id : 0,
        awayTeamId: albania ? albania.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupB ? groupB.id : 0,
        date: new Date("June 15, 2024 21:00:00"),
        round: "Round 1",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: poland ? poland.id : 0,
        awayTeamId: netherlands ? netherlands.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupD ? groupD.id : 0,
        date: new Date("June 16, 2024 15:00:00"),
        round: "Round 1",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: slovenia ? slovenia.id : 0,
        awayTeamId: denmark ? denmark.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupC ? groupC.id : 0,
        date: new Date("June 16, 2024 18:00:00"),
        round: "Round 1",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: serbia ? serbia.id : 0,
        awayTeamId: england ? england.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupC ? groupC.id : 0,
        date: new Date("June 16, 2024 21:00:00"),
        round: "Round 1",
        homeGoals: 0,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: romania ? romania.id : 0,
        awayTeamId: ukraine ? ukraine.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupE ? groupE.id : 0,
        date: new Date("June 17, 2024 15:00:00"),
        round: "Round 1",
        homeGoals: 3,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: belgium ? belgium.id : 0,
        awayTeamId: slovakia ? slovakia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupE ? groupE.id : 0,
        date: new Date("June 17, 2024 18:00:00"),
        round: "Round 1",
        homeGoals: 0,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: austria ? austria.id : 0,
        awayTeamId: france ? france.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupD ? groupD.id : 0,
        date: new Date("June 17, 2024 21:00:00"),
        round: "Round 1",
        homeGoals: 0,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: turkiye ? turkiye.id : 0,
        awayTeamId: georgia ? georgia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 18, 2024 18:00:00"),
        round: "Round 1",
        homeGoals: 3,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: portugal ? portugal.id : 0,
        awayTeamId: czechia ? czechia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 18, 2024 21:00:00"),
        round: "Round 1",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: croatia ? croatia.id : 0,
        awayTeamId: albania ? albania.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupB ? groupB.id : 0,
        date: new Date("June 19, 2024 15:00:00"),
        round: "Round 2",
        homeGoals: 2,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: germany ? germany.id : 0,
        awayTeamId: hungary ? hungary.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupA ? groupA.id : 0,
        date: new Date("June 19, 2024 18:00:00"),
        round: "Round 2",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: scotland ? scotland.id : 0,
        awayTeamId: switzerland ? switzerland.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupA ? groupA.id : 0,
        date: new Date("June 19, 2024 21:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: slovenia ? slovenia.id : 0,
        awayTeamId: serbia ? serbia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupC ? groupC.id : 0,
        date: new Date("June 20, 2024 15:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: denmark ? denmark.id : 0,
        awayTeamId: england ? england.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupC ? groupC.id : 0,
        date: new Date("June 20, 2024 18:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: spain ? spain.id : 0,
        awayTeamId: italy ? italy.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupB ? groupB.id : 0,
        date: new Date("June 20, 2024 21:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: slovakia ? slovakia.id : 0,
        awayTeamId: ukraine ? ukraine.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupE ? groupE.id : 0,
        date: new Date("June 21, 2024 15:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: poland ? poland.id : 0,
        awayTeamId: austria ? austria.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupD ? groupD.id : 0,
        date: new Date("June 21, 2024 18:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 3,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: netherlands ? netherlands.id : 0,
        awayTeamId: france ? france.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupD ? groupD.id : 0,
        date: new Date("June 21, 2024 21:00:00"),
        round: "Round 2",
        homeGoals: 0,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: georgia ? georgia.id : 0,
        awayTeamId: czechia ? czechia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 22, 2024 15:00:00"),
        round: "Round 2",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: turkiye ? turkiye.id : 0,
        awayTeamId: portugal ? portugal.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 22, 2024 18:00:00"),
        round: "Round 2",
        homeGoals: 0,
        awayGoals: 3,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: belgium ? belgium.id : 0,
        awayTeamId: romania ? romania.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupE ? groupE.id : 0,
        date: new Date("June 22, 2024 21:00:00"),
        round: "Round 2",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: switzerland ? switzerland.id : 0,
        awayTeamId: germany ? germany.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupA ? groupA.id : 0,
        date: new Date("June 23, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: scotland ? scotland.id : 0,
        awayTeamId: hungary ? hungary.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupA ? groupA.id : 0,
        date: new Date("June 23, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 0,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: albania ? albania.id : 0,
        awayTeamId: spain ? spain.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupB ? groupB.id : 0,
        date: new Date("June 24, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 0,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: croatia ? croatia.id : 0,
        awayTeamId: italy ? italy.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupB ? groupB.id : 0,
        date: new Date("June 24, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: netherlands ? netherlands.id : 0,
        awayTeamId: austria ? austria.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupD ? groupD.id : 0,
        date: new Date("June 25, 2024 18:00:00"),
        round: "Round 3",
        homeGoals: 2,
        awayGoals: 3,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: france ? france.id : 0,
        awayTeamId: poland ? poland.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupD ? groupD.id : 0,
        date: new Date("June 25, 2024 18:00:00"),
        round: "Round 3",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: england ? england.id : 0,
        awayTeamId: slovenia ? slovenia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupC ? groupC.id : 0,
        date: new Date("June 25, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 0,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: denmark ? denmark.id : 0,
        awayTeamId: serbia ? serbia.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupC ? groupC.id : 0,
        date: new Date("June 25, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 0,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: slovakia ? slovakia.id : 0,
        awayTeamId: romania ? romania.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupE ? groupE.id : 0,
        date: new Date("June 26, 2024 18:00:00"),
        round: "Round 3",
        homeGoals: 1,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: ukraine ? ukraine.id : 0,
        awayTeamId: belgium ? belgium.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupE ? groupE.id : 0,
        date: new Date("June 26, 2024 18:00:00"),
        round: "Round 3",
        homeGoals: 0,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: czechia ? czechia.id : 0,
        awayTeamId: turkiye ? turkiye.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 26, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: georgia ? georgia.id : 0,
        awayTeamId: portugal ? portugal.id : 0,
        tournamentEditionId: edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 26, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
    ],
  });

  const knockoutMatches = await prisma.knockoutMatch.createMany({
    data: [
      {
        homeTeamId: switzerland?.id,
        awayTeamId: italy?.id,
        tournamentEditionId: edition.id,
        date: new Date("June 29, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: germany?.id,
        awayTeamId: denmark?.id,
        tournamentEditionId: edition.id,
        date: new Date("June 29, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: england?.id,
        awayTeamId: slovakia?.id,
        tournamentEditionId: edition.id,
        date: new Date("June 30, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 1,
        homeExtraTimeGoals: 1,
        awayExtraTimeGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: georgia?.id,
        tournamentEditionId: edition.id,
        date: new Date("June 30, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 4,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: france?.id,
        awayTeamId: belgium?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 01, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: portugal?.id,
        awayTeamId: slovenia?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 01, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 0,
        awayGoals: 0,
        homeExtraTimeGoals: 0,
        awayExtraTimeGoals: 0,
        homePenaltyGoals: 3,
        awayPenaltyGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: romania?.id,
        awayTeamId: netherlands?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 02, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 0,
        awayGoals: 3,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: austria?.id,
        awayTeamId: turkiye?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 02, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: germany?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 05, 2024 18:00:00"),
        round: "Quarter Final",
        homeGoals: 1,
        awayGoals: 1,
        homeExtraTimeGoals: 1,
        awayExtraTimeGoals: 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: portugal?.id,
        awayTeamId: france?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 05, 2024 21:00:00"),
        round: "Quarter Final",
        homeGoals: 0,
        awayGoals: 0,
        homeExtraTimeGoals: 0,
        awayExtraTimeGoals: 0,
        homePenaltyGoals: 3,
        awayPenaltyGoals: 5,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: england?.id,
        awayTeamId: switzerland?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 06, 2024 18:00:00"),
        round: "Quarter Final",
        homeGoals: 1,
        awayGoals: 1,
        homeExtraTimeGoals: 0,
        awayExtraTimeGoals: 0,
        homePenaltyGoals: 5,
        awayPenaltyGoals: 3,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: netherlands?.id,
        awayTeamId: turkiye?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 06, 2024 21:00:00"),
        round: "Quarter Final",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: france?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 09, 2024 21:00:00"),
        round: "Semi Final",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: netherlands?.id,
        awayTeamId: england?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 10, 2024 21:00:00"),
        round: "Semi Final",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: england?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 14, 2024 21:00:00"),
        round: "Final",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
      },
    ],
  });

  const spainCountry = await prisma.country.create({
    data: {
      name: "Spain",
      code: "ESP",
      flagUrl:
        "/images/teams/33e87f35-f778-4f29-ad5c-ecaa8c316745-flag (1).png",
      type: Continents.Europe,
    },
  });

  const league = await prisma.league.create({
    data: {
      name: "LaLiga",
      type: LeagueTypes.Domestic,
      countryId: spainCountry?.id,
      isPopular: true,
    },
  });

  const leagueSeason = await prisma.leagueSeason.create({
    data: {
      startYear: 2024,
      endYear: 2025,
      year: "2024-2025",
      leagueId: league.id,
      slug: "laliga-1",
      currentStage: LeagueStages.Running,
    },
  });

  const leagueTeams = await prisma.leagueTeam.createMany({
    data: [
      {
        name: "Barcelona",
        type: Continents.Europe,
      },
      {
        name: "Real Madrid",
        type: Continents.Europe,
      },
      {
        name: "Seville",
        type: Continents.Europe,
      },
      {
        name: "Valencia",
        type: Continents.Europe,
      },
      {
        name: "Reyal Maiorca",
        type: Continents.Europe,
      },
      {
        name: "Reyal Valadwalid",
        type: Continents.Europe,
      },
      {
        name: "Elchie",
        type: Continents.Europe,
      },
      {
        name: "Osasuna",
        type: Continents.Europe,
      },
    ],
  });

  const leagueMatches = await prisma.leagueMatch.createMany({
    data: [
      {
        homeTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Barcelona" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Real Madrid" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.leagueSeason.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Elchie" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Osasuna" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.leagueSeason.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Seville" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Valencia" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.leagueSeason.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Reyal Maiorca" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.leagueTeam.findFirst({
              where: { name: "Reyal Valadwalid" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.leagueSeason.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
    ],
  });

  const italyCountry = await prisma.country.create({
    data: {
      name: "Italy",
      code: "ITA",
      type: Continents.Europe,
    },
  });

  const englandCountry = await prisma.country.create({
    data: {
      name: "England",
      code: "ENG",
      type: Continents.Europe,
    },
  });

  const seriaALeague = await prisma.league.create({
    data: {
      name: "Seria A",
      type: LeagueTypes.Domestic,
      countryId: italyCountry.id,
      isPopular: true,
    },
  });

  const PermierLeague = await prisma.league.create({
    data: {
      name: "Permier League",
      type: LeagueTypes.Domestic,
      countryId: englandCountry.id,
      isPopular: true,
    },
  });

  const seriaASeason2024 = await prisma.leagueSeason.create({
    data: {
      startYear: 2024,
      endYear: 2025,
      year: "2024-2025",
      leagueId: seriaALeague.id,
      slug: "seria-a-1",
      currentStage: LeagueStages.Running,
    },
  });
  const permierLeagueSeason2024 = await prisma.leagueSeason.create({
    data: {
      startYear: 2024,
      endYear: 2025,
      year: "2024-2025",
      leagueId: PermierLeague.id,
      slug: "premier-league-1",
      currentStage: LeagueStages.Running,
    },
  });
  const napoliTeam = await prisma.leagueTeam.create({
    data: {
      name: "Napoli",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const juventusTeam = await prisma.leagueTeam.create({
    data: {
      name: "Juventus",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const acMilanTeam = await prisma.leagueTeam.create({
    data: {
      name: "AC Milan",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const interMilanTeam = await prisma.leagueTeam.create({
    data: {
      name: "Inter Milan",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const torinoTeam = await prisma.leagueTeam.create({
    data: {
      name: "Torino",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const empoliTeam = await prisma.leagueTeam.create({
    data: {
      name: "Empoli",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const lazioTeam = await prisma.leagueTeam.create({
    data: {
      name: "Lazio",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const udineseTeam = await prisma.leagueTeam.create({
    data: {
      name: "Udinese",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const asRomaTeam = await prisma.leagueTeam.create({
    data: {
      name: "AS Roma",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const comoTeam = await prisma.leagueTeam.create({
    data: {
      name: "Como",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const fiorentinaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Fiorentina",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const atalantaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Atalanta",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const bolognaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Bologna",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const hellasVeronaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Hellas Verona",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const parmaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Parma",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const genoaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Genoa",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const cagliariTeam = await prisma.leagueTeam.create({
    data: {
      name: "Cagliari",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const lecceTeam = await prisma.leagueTeam.create({
    data: {
      name: "Lecce",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const veneziaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Venezia",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const monzaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Monza",
      type: Continents.Europe,
      countryId: italyCountry.id,
    },
  });
  const liverpoolTeam = await prisma.leagueTeam.create({
    data: {
      name: "Liverpool",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const manchesterCityTeam = await prisma.leagueTeam.create({
    data: {
      name: "Manchester City",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const arsenalTeam = await prisma.leagueTeam.create({
    data: {
      name: "Arsenal",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const chelseaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Chelsea",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const astonVillaTeam = await prisma.leagueTeam.create({
    data: {
      name: "Aston Villa",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const fulhamTeam = await prisma.leagueTeam.create({
    data: {
      name: "Fulham",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const newCastleTeam = await prisma.leagueTeam.create({
    data: {
      name: "NewCastle",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const tottenhamTeam = await prisma.leagueTeam.create({
    data: {
      name: "Tottenham",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const brightonTeam = await prisma.leagueTeam.create({
    data: {
      name: "Brighton",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const nottinghamForestTeam = await prisma.leagueTeam.create({
    data: {
      name: "Nottingham Forest",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const bournemouthTeam = await prisma.leagueTeam.create({
    data: {
      name: "Bournemouth",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const brentfordTeam = await prisma.leagueTeam.create({
    data: {
      name: "Brentford",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const manchesterUnitedTeam = await prisma.leagueTeam.create({
    data: {
      name: "Manchester United",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const westHamTeam = await prisma.leagueTeam.create({
    data: {
      name: "West Ham",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const ipswichTeam = await prisma.leagueTeam.create({
    data: {
      name: "Ipswich",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const evertonTeam = await prisma.leagueTeam.create({
    data: {
      name: "Everton",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const leicesterTeam = await prisma.leagueTeam.create({
    data: {
      name: "Leicester",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const crystalPalaceTeam = await prisma.leagueTeam.create({
    data: {
      name: "Crystal Palace",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const southhamptonTeam = await prisma.leagueTeam.create({
    data: {
      name: "Southhampton",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });
  const wolvesTeam = await prisma.leagueTeam.create({
    data: {
      name: "Wolves",
      type: Continents.Europe,
      countryId: englandCountry.id,
    },
  });

  const seriaAandPremeirLeagueMatches = await prisma.leagueMatch.createMany({
    data: [
      {
        homeTeamId: napoliTeam.id,
        awayTeamId: comoTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 4, 2024 19:30:00"),
        round: "Round 7",
        isFeatured: true,
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: hellasVeronaTeam.id,
        awayTeamId: veneziaTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 4, 2024 21:45:00"),
        round: "Round 7",
        isFeatured: true,
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: udineseTeam.id,
        awayTeamId: lecceTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 5, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: atalantaTeam.id,
        awayTeamId: genoaTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 5, 2024 19:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: interMilanTeam.id,
        awayTeamId: torinoTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 5, 2024 21:45:00"),
        round: "Round 7",
        isFeatured: true,
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: juventusTeam.id,
        awayTeamId: cagliariTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 6, 2024 13:30:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: bolognaTeam.id,
        awayTeamId: parmaTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 6, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: lazioTeam.id,
        awayTeamId: empoliTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 6, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: monzaTeam.id,
        awayTeamId: asRomaTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 6, 2024 19:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: fiorentinaTeam.id,
        awayTeamId: acMilanTeam.id,
        seasonId: seriaASeason2024.id,
        date: new Date("October 6, 2024 21:45:00"),
        round: "Round 7",
        isFeatured: true,
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: crystalPalaceTeam.id,
        awayTeamId: liverpoolTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 14:30:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: arsenalTeam.id,
        awayTeamId: southhamptonTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: brentfordTeam.id,
        awayTeamId: wolvesTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: leicesterTeam.id,
        awayTeamId: bournemouthTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: manchesterCityTeam.id,
        awayTeamId: fulhamTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: westHamTeam.id,
        awayTeamId: ipswichTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: evertonTeam.id,
        awayTeamId: newCastleTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 5, 2024 19:30:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: astonVillaTeam.id,
        awayTeamId: manchesterUnitedTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 6, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: chelseaTeam.id,
        awayTeamId: nottinghamForestTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 6, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: brightonTeam.id,
        awayTeamId: tottenhamTeam.id,
        seasonId: permierLeagueSeason2024.id,
        date: new Date("October 6, 2024 18:30:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
