import prisma from "@/lib/db";
import {
  Continents,
  LeagueStages,
  LeagueTypes,
  MatchStatusOptions,
} from "@/types/enums";

async function main() {
  const germayCountry = await prisma.country.create({
    data: {
      name: "Germany",
      code: "GER",
      flagUrl:
        "/images/countries/91c80dec-81de-472f-9829-76f9ba38191c-germany (1).png",
      continent: Continents.Europe,
    },
  });

  const europeCountry = await prisma.country.create({
    data: {
      name: "Europe",
      code: null,
      flagUrl: null,
      continent: Continents.Europe,
    },
  });

  const teams = await prisma.team.createMany({
    data: [
      {
        name: "Germany",
        code: "GER",
        flagUrl:
          "/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Switzerland",
        code: "SUI",
        flagUrl:
          "/images/teams/f3d63190-f1fe-4f54-b153-110eb0b005d8-switzerland.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Hungary",
        code: "HUN",
        flagUrl:
          "/images/teams/d2d2056b-2b97-4e54-83b9-934b10637525-hungary.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Scotland",
        code: "SCO",
        flagUrl:
          "/images/teams/f7e71cf5-a49b-4b01-90fa-396c8ad40ce3-scotland.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Spain",
        code: "ESP",
        flagUrl:
          "/images/teams/33e87f35-f778-4f29-ad5c-ecaa8c316745-flag (1).png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Italy",
        code: "ITA",
        flagUrl: "/images/teams/08434f97-7fbb-4153-915c-5c587077b837-italy.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Croatia",
        code: "CRO",
        flagUrl:
          "/images/teams/c1eb3bd5-a5d2-4b83-9359-22b9438d5b81-croatia.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Albania",
        code: "ALB",
        flagUrl:
          "/images/teams/b3ac1eb0-e1b4-4025-b0be-eff4c29a6233-albania.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "England",
        code: "ENG",
        flagUrl:
          "/images/teams/d9d3ffa7-0c19-4606-bb97-78e5146626da-flag (2).png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Denmark",
        code: "DEN",
        flagUrl:
          "/images/teams/b98ac3b0-ba2a-48aa-8f97-14959fa59b98-denmark.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Slovenia",
        code: "SVN",
        flagUrl:
          "/images/teams/63518901-ca68-4ad6-866a-e4001870b886-flag (1).png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Serbia",
        code: "SRB",
        flagUrl:
          "/images/teams/446eb1af-77a5-40ae-8c33-992d007cf735-flag (2).png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Austria",
        code: "AUT",
        flagUrl:
          "/images/teams/73a3d555-6f01-451f-ab42-3ebd7586c1b4-austria.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "France",
        code: "FRA",
        flagUrl:
          "/images/teams/de153c75-acd3-42ea-ad98-ca40705c9139-france.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Netherlands",
        code: "NED",
        flagUrl: "/images/teams/f4b5ea04-5db6-498a-b2ab-e421455ec1e5-flag.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Poland",
        code: "POL",
        flagUrl:
          "/images/teams/6bc6d2bd-cfb6-49c9-ad04-8551c8cf26f2-poland.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Romania",
        code: "ROU",
        flagUrl:
          "/images/teams/f6167677-5a87-499b-bf69-17a42e109423-romania.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Belgium",
        code: "BEL",
        flagUrl:
          "/images/teams/a83cfe24-b578-4c6e-8ca6-607b10e376f3-belgium.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Slovakia",
        code: "SVK",
        flagUrl:
          "/images/teams/14366d44-6c0f-45f6-954e-34aabfdb50ab-slovakia.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Ukraine",
        code: "UKR",
        flagUrl:
          "/images/teams/0d123b32-3ef7-45f6-ae83-ef099a4a5958-ukraine.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Portugal",
        code: "POR",
        flagUrl:
          "/images/teams/391a6483-650e-47ab-9664-71a60c0a9794-portugal.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Turkiye",
        code: "TUR",
        flagUrl:
          "/images/teams/190bd4fd-23e8-496d-a21f-19e0cdb49a12-turkey.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Georgia",
        code: "GEO",
        flagUrl:
          "/images/teams/f902790b-b766-4df3-a82b-361081fb98df-georgia.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
      },
      {
        name: "Czechia",
        code: "CZE",
        flagUrl:
          "/images/teams/2f89dc1c-badc-44be-aa97-d2b7a5be3fef-czech-republic.png",
        continent: Continents.Europe,
        countryId: europeCountry.id,
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

  const euro2024Tournament = await prisma.league.create({
    data: {
      name: "Euro",
      continent: Continents.Europe,
      isPopular: true,
      countryId: europeCountry.id,
    },
  });

  const euro2024Edition = await prisma.season.create({
    data: {
      startYear: 2024,
      endYear: 2024,
      year: "2024",
      currentStage: LeagueStages.Finished,
      leagueId: euro2024Tournament.id,
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
      seasonId: euro2024Edition.id,
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
      seasonId: euro2024Edition.id,
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
      seasonId: euro2024Edition.id,
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
      seasonId: euro2024Edition.id,
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
      seasonId: euro2024Edition.id,
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
      seasonId: euro2024Edition.id,
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

  const euro2024GroupMatches = await prisma.match.createMany({
    data: [
      {
        homeTeamId: germany ? germany.id : 0,
        awayTeamId: scotland ? scotland.id : 0,
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
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
        seasonId: euro2024Edition.id,
        groupId: groupF ? groupF.id : 0,
        date: new Date("June 26, 2024 21:00:00"),
        round: "Round 3",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
      },
    ],
  });

  const euro2024KnockoutMatches = await prisma.match.createMany({
    data: [
      {
        homeTeamId: switzerland?.id,
        awayTeamId: italy?.id,
        seasonId: euro2024Edition.id,
        date: new Date("June 29, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: germany?.id,
        awayTeamId: denmark?.id,
        seasonId: euro2024Edition.id,
        date: new Date("June 29, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 2,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: england?.id,
        awayTeamId: slovakia?.id,
        seasonId: euro2024Edition.id,
        date: new Date("June 30, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 1,
        homeExtraTimeGoals: 1,
        awayExtraTimeGoals: 0,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: georgia?.id,
        seasonId: euro2024Edition.id,
        date: new Date("June 30, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 4,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: france?.id,
        awayTeamId: belgium?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 01, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 0,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: portugal?.id,
        awayTeamId: slovenia?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 01, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 0,
        awayGoals: 0,
        homeExtraTimeGoals: 0,
        awayExtraTimeGoals: 0,
        homePenaltyGoals: 3,
        awayPenaltyGoals: 0,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: romania?.id,
        awayTeamId: netherlands?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 02, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 0,
        awayGoals: 3,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: austria?.id,
        awayTeamId: turkiye?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 02, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: germany?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 05, 2024 18:00:00"),
        round: "Quarter Final",
        homeGoals: 1,
        awayGoals: 1,
        homeExtraTimeGoals: 1,
        awayExtraTimeGoals: 0,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: portugal?.id,
        awayTeamId: france?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 05, 2024 21:00:00"),
        round: "Quarter Final",
        homeGoals: 0,
        awayGoals: 0,
        homeExtraTimeGoals: 0,
        awayExtraTimeGoals: 0,
        homePenaltyGoals: 3,
        awayPenaltyGoals: 5,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: england?.id,
        awayTeamId: switzerland?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 06, 2024 18:00:00"),
        round: "Quarter Final",
        homeGoals: 1,
        awayGoals: 1,
        homeExtraTimeGoals: 0,
        awayExtraTimeGoals: 0,
        homePenaltyGoals: 5,
        awayPenaltyGoals: 3,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: netherlands?.id,
        awayTeamId: turkiye?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 06, 2024 21:00:00"),
        round: "Quarter Final",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: france?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 09, 2024 21:00:00"),
        round: "Semi Final",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: netherlands?.id,
        awayTeamId: england?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 10, 2024 21:00:00"),
        round: "Semi Final",
        homeGoals: 1,
        awayGoals: 2,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: england?.id,
        seasonId: euro2024Edition.id,
        date: new Date("July 14, 2024 21:00:00"),
        round: "Final",
        homeGoals: 2,
        awayGoals: 1,
        status: MatchStatusOptions.Ended,
        isKnockout: true,
      },
    ],
  });

  const spainCountry = await prisma.country.create({
    data: {
      name: "Spain",
      code: "ESP",
      flagUrl:
        "/images/teams/33e87f35-f778-4f29-ad5c-ecaa8c316745-flag (1).png",
      continent: Continents.Europe,
    },
  });

  const laLigaLeague = await prisma.league.create({
    data: {
      name: "LaLiga",
      continent: Continents.Europe,
      isClubs: true,
      isDomestic: true,
      countryId: spainCountry?.id,
      isPopular: true,
    },
  });

  const laLigaSeason = await prisma.season.create({
    data: {
      startYear: 2024,
      endYear: 2025,
      year: "2024-2025",
      leagueId: laLigaLeague.id,
      slug: "laliga-1",
      currentStage: LeagueStages.Running,
    },
  });

  const laLigaTeams = await prisma.team.createMany({
    data: [
      {
        name: "Barcelona",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
        code: "FCB",
        isPopular: true,
      },
      {
        name: "Real Madrid",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
        code: "RMA",
        isPopular: true,
      },
      {
        name: "Seville",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
      },
      {
        name: "Valencia",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
      },
      {
        name: "Reyal Maiorca",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
      },
      {
        name: "Reyal Valadwalid",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
      },
      {
        name: "Elchie",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
      },
      {
        name: "Osasuna",
        continent: Continents.Europe,
        isClub: true,
        countryId: spainCountry.id,
      },
    ],
  });

  const leagueMatches = await prisma.match.createMany({
    data: [
      {
        homeTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Barcelona" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Real Madrid" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.season.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Elchie" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Osasuna" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.season.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Seville" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Valencia" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.season.findFirst({
              where: { year: "2024-2025" },
            })
          )?.id || 0,
        status: MatchStatusOptions.Ended,
      },
      {
        homeTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Reyal Maiorca" },
            })
          )?.id || 0,
        awayTeamId:
          (
            await prisma.team.findFirst({
              where: { name: "Reyal Valadwalid" },
            })
          )?.id || 0,
        seasonId:
          (
            await prisma.season.findFirst({
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
      continent: Continents.Europe,
    },
  });

  const englandCountry = await prisma.country.create({
    data: {
      name: "England",
      code: "ENG",
      continent: Continents.Europe,
    },
  });

  const seriaALeague = await prisma.league.create({
    data: {
      name: "Seria A",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isPopular: true,
      isClubs: true,
      isDomestic: true,
    },
  });

  const PremierLeague = await prisma.league.create({
    data: {
      name: "Premier League",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isPopular: true,
      isClubs: true,
      isDomestic: true,
    },
  });

  const seriaASeason2024 = await prisma.season.create({
    data: {
      startYear: 2024,
      endYear: 2025,
      year: "2024-2025",
      leagueId: seriaALeague.id,
      slug: "seria-a-1",
      currentStage: LeagueStages.Running,
    },
  });
  const permierSeason2024 = await prisma.season.create({
    data: {
      startYear: 2024,
      endYear: 2025,
      year: "2024-2025",
      leagueId: PremierLeague.id,
      slug: "premier-league-1",
      currentStage: LeagueStages.Running,
    },
  });

  const napoliTeam = await prisma.team.create({
    data: {
      name: "Napoli",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const juventusTeam = await prisma.team.create({
    data: {
      name: "Juventus",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const acMilanTeam = await prisma.team.create({
    data: {
      name: "AC Milan",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const interMilanTeam = await prisma.team.create({
    data: {
      name: "Inter Milan",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const torinoTeam = await prisma.team.create({
    data: {
      name: "Torino",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const empoliTeam = await prisma.team.create({
    data: {
      name: "Empoli",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const lazioTeam = await prisma.team.create({
    data: {
      name: "Lazio",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const udineseTeam = await prisma.team.create({
    data: {
      name: "Udinese",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const asRomaTeam = await prisma.team.create({
    data: {
      name: "AS Roma",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const comoTeam = await prisma.team.create({
    data: {
      name: "Como",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const fiorentinaTeam = await prisma.team.create({
    data: {
      name: "Fiorentina",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const atalantaTeam = await prisma.team.create({
    data: {
      name: "Atalanta",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const bolognaTeam = await prisma.team.create({
    data: {
      name: "Bologna",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const hellasVeronaTeam = await prisma.team.create({
    data: {
      name: "Hellas Verona",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const parmaTeam = await prisma.team.create({
    data: {
      name: "Parma",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const genoaTeam = await prisma.team.create({
    data: {
      name: "Genoa",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const cagliariTeam = await prisma.team.create({
    data: {
      name: "Cagliari",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const lecceTeam = await prisma.team.create({
    data: {
      name: "Lecce",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const veneziaTeam = await prisma.team.create({
    data: {
      name: "Venezia",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const monzaTeam = await prisma.team.create({
    data: {
      name: "Monza",
      continent: Continents.Europe,
      countryId: italyCountry.id,
      isClub: true,
    },
  });
  const liverpoolTeam = await prisma.team.create({
    data: {
      name: "Liverpool",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const manchesterCityTeam = await prisma.team.create({
    data: {
      name: "Manchester City",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const arsenalTeam = await prisma.team.create({
    data: {
      name: "Arsenal",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const chelseaTeam = await prisma.team.create({
    data: {
      name: "Chelsea",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const astonVillaTeam = await prisma.team.create({
    data: {
      name: "Aston Villa",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const fulhamTeam = await prisma.team.create({
    data: {
      name: "Fulham",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const newCastleTeam = await prisma.team.create({
    data: {
      name: "NewCastle",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const tottenhamTeam = await prisma.team.create({
    data: {
      name: "Tottenham",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const brightonTeam = await prisma.team.create({
    data: {
      name: "Brighton",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const nottinghamForestTeam = await prisma.team.create({
    data: {
      name: "Nottingham Forest",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const bournemouthTeam = await prisma.team.create({
    data: {
      name: "Bournemouth",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const brentfordTeam = await prisma.team.create({
    data: {
      name: "Brentford",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const manchesterUnitedTeam = await prisma.team.create({
    data: {
      name: "Manchester United",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
      isPopular: true,
    },
  });
  const westHamTeam = await prisma.team.create({
    data: {
      name: "West Ham",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const ipswichTeam = await prisma.team.create({
    data: {
      name: "Ipswich",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const evertonTeam = await prisma.team.create({
    data: {
      name: "Everton",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const leicesterTeam = await prisma.team.create({
    data: {
      name: "Leicester",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const crystalPalaceTeam = await prisma.team.create({
    data: {
      name: "Crystal Palace",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const southhamptonTeam = await prisma.team.create({
    data: {
      name: "Southhampton",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });
  const wolvesTeam = await prisma.team.create({
    data: {
      name: "Wolves",
      continent: Continents.Europe,
      countryId: englandCountry.id,
      isClub: true,
    },
  });

  const seriaAandPremeirLeagueMatches = await prisma.match.createMany({
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
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 14:30:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: arsenalTeam.id,
        awayTeamId: southhamptonTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: brentfordTeam.id,
        awayTeamId: wolvesTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: leicesterTeam.id,
        awayTeamId: bournemouthTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: manchesterCityTeam.id,
        awayTeamId: fulhamTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: westHamTeam.id,
        awayTeamId: ipswichTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 17:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: evertonTeam.id,
        awayTeamId: newCastleTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 5, 2024 19:30:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: astonVillaTeam.id,
        awayTeamId: manchesterUnitedTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 6, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: chelseaTeam.id,
        awayTeamId: nottinghamForestTeam.id,
        seasonId: permierSeason2024.id,
        date: new Date("October 6, 2024 16:00:00"),
        round: "Round 7",
        status: MatchStatusOptions.Scheduled,
      },
      {
        homeTeamId: brightonTeam.id,
        awayTeamId: tottenhamTeam.id,
        seasonId: permierSeason2024.id,
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
