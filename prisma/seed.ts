import prisma from "@/lib/db";

async function main() {
  const teams = await prisma.team.createMany({
    data: [
      {
        name: "Germany",
        code: "GER",
        flagUrl:
          "/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png",
      },
      {
        name: "Switzerland",
        code: "SUI",
        flagUrl:
          "/images/teams/f3d63190-f1fe-4f54-b153-110eb0b005d8-switzerland.png",
      },
      {
        name: "Hungary",
        code: "HUN",
        flagUrl:
          "/images/teams/d2d2056b-2b97-4e54-83b9-934b10637525-hungary.png",
      },
      {
        name: "Scotland",
        code: "SCO",
        flagUrl:
          "/images/teams/f7e71cf5-a49b-4b01-90fa-396c8ad40ce3-scotland.png",
      },
      {
        name: "Spain",
        code: "ESP",
        flagUrl:
          "/images/teams/33e87f35-f778-4f29-ad5c-ecaa8c316745-flag (1).png",
      },
      {
        name: "Italy",
        code: "ITA",
        flagUrl: "/images/teams/08434f97-7fbb-4153-915c-5c587077b837-italy.png",
      },
      {
        name: "Croatia",
        code: "CRO",
        flagUrl:
          "/images/teams/c1eb3bd5-a5d2-4b83-9359-22b9438d5b81-croatia.png",
      },
      {
        name: "Albania",
        code: "ALB",
        flagUrl:
          "/images/teams/b3ac1eb0-e1b4-4025-b0be-eff4c29a6233-albania.png",
      },
      {
        name: "England",
        code: "ENG",
        flagUrl:
          "/images/teams/d9d3ffa7-0c19-4606-bb97-78e5146626da-flag (2).png",
      },
      {
        name: "Denmark",
        code: "DEN",
        flagUrl:
          "/images/teams/b98ac3b0-ba2a-48aa-8f97-14959fa59b98-denmark.png",
      },
      {
        name: "Slovenia",
        code: "SVN",
        flagUrl:
          "/images/teams/63518901-ca68-4ad6-866a-e4001870b886-flag (1).png",
      },
      {
        name: "Serbia",
        code: "SRB",
        flagUrl:
          "/images/teams/446eb1af-77a5-40ae-8c33-992d007cf735-flag (2).png",
      },
      {
        name: "Austria",
        code: "AUT",
        flagUrl:
          "/images/teams/73a3d555-6f01-451f-ab42-3ebd7586c1b4-austria.png",
      },
      {
        name: "France",
        code: "FRA",
        flagUrl:
          "/images/teams/de153c75-acd3-42ea-ad98-ca40705c9139-france.png",
      },
      {
        name: "Netherlands",
        code: "NED",
        flagUrl: "/images/teams/f4b5ea04-5db6-498a-b2ab-e421455ec1e5-flag.png",
      },
      {
        name: "Poland",
        code: "POL",
        flagUrl:
          "/images/teams/6bc6d2bd-cfb6-49c9-ad04-8551c8cf26f2-poland.png",
      },
      {
        name: "Romania",
        code: "ROU",
        flagUrl:
          "/images/teams/f6167677-5a87-499b-bf69-17a42e109423-romania.png",
      },
      {
        name: "Belgium",
        code: "BEL",
        flagUrl:
          "/images/teams/a83cfe24-b578-4c6e-8ca6-607b10e376f3-belgium.png",
      },
      {
        name: "Slovakia",
        code: "SVK",
        flagUrl:
          "/images/teams/14366d44-6c0f-45f6-954e-34aabfdb50ab-slovakia.png",
      },
      {
        name: "Ukraine",
        code: "UKR",
        flagUrl:
          "/images/teams/0d123b32-3ef7-45f6-ae83-ef099a4a5958-ukraine.png",
      },
      {
        name: "Portugal",
        code: "POR",
        flagUrl:
          "/images/teams/391a6483-650e-47ab-9664-71a60c0a9794-portugal.png",
      },
      {
        name: "Turkiye",
        code: "TUR",
        flagUrl:
          "/images/teams/190bd4fd-23e8-496d-a21f-19e0cdb49a12-turkey.png",
      },
      {
        name: "Georgia",
        code: "GEO",
        flagUrl:
          "/images/teams/f902790b-b766-4df3-a82b-361081fb98df-georgia.png",
      },
      {
        name: "Czechia",
        code: "CZE",
        flagUrl:
          "/images/teams/2f89dc1c-badc-44be-aa97-d2b7a5be3fef-czech-republic.png",
      },
    ],
  });

  const countries = await prisma.country.create({
    data: {
      name: "Germany",
      code: "GER",
      flagUrl:
        "/images/countries/91c80dec-81de-472f-9829-76f9ba38191c-germany (1).png",
    },
  });

  const tournament = await prisma.tournament.create({
    data: {
      name: "Euro",
    },
  });

  const edition = await prisma.tournamentEdition.create({
    data: {
      year: 2024,
      yearAsString: "2024",
      currentStage: "Finished",
      tournamentId: tournament.id,
      winnerId: (await prisma.team.findFirst({ where: { name: "Spain" } }))?.id,
      titleHolderId: (
        await prisma.team.findFirst({ where: { name: "Italy" } })
      )?.id,
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
      },
      {
        homeTeamId: germany?.id,
        awayTeamId: denmark?.id,
        tournamentEditionId: edition.id,
        date: new Date("June 29, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 2,
        awayGoals: 0,
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
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: georgia?.id,
        tournamentEditionId: edition.id,
        date: new Date("June 30, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 4,
        awayGoals: 1,
      },
      {
        homeTeamId: france?.id,
        awayTeamId: belgium?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 01, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 0,
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
      },
      {
        homeTeamId: romania?.id,
        awayTeamId: netherlands?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 02, 2024 18:00:00"),
        round: "Round of 16",
        homeGoals: 0,
        awayGoals: 3,
      },
      {
        homeTeamId: austria?.id,
        awayTeamId: turkiye?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 02, 2024 21:00:00"),
        round: "Round of 16",
        homeGoals: 1,
        awayGoals: 2,
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
      },
      {
        homeTeamId: netherlands?.id,
        awayTeamId: turkiye?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 06, 2024 21:00:00"),
        round: "Quarter Final",
        homeGoals: 2,
        awayGoals: 1,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: france?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 09, 2024 21:00:00"),
        round: "Semi Final",
        homeGoals: 2,
        awayGoals: 1,
      },
      {
        homeTeamId: netherlands?.id,
        awayTeamId: england?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 10, 2024 21:00:00"),
        round: "Semi Final",
        homeGoals: 1,
        awayGoals: 2,
      },
      {
        homeTeamId: spain?.id,
        awayTeamId: england?.id,
        tournamentEditionId: edition.id,
        date: new Date("July 14, 2024 21:00:00"),
        round: "Final",
        homeGoals: 2,
        awayGoals: 1,
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