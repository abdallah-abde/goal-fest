export const homePageStandingsHeaders = new Array(
  {
    labels: [{ name: "Team" }],
    className: "dashboard-head-table-cell min-w-[150px] max-2xs:min-w-[100px]",
  },
  {
    labels: [
      { name: "P", className: "hidden max-xs:block" },
      { name: "Played", className: "hidden xs:block" },
    ],
    className: "w-1/12 max-xs:w-1/6 max-sm:w-1/3 text-center",
  },
  {
    labels: [{ name: "W" }],
    className: "w-1/12 hidden sm:table-cell",
  },
  {
    labels: [{ name: "L" }],
    className: "w-1/12 hidden sm:table-cell",
  },
  {
    labels: [{ name: "D" }],
    className: "w-1/12 hidden sm:table-cell",
  },
  {
    labels: [{ name: "GF" }],
    className: "w-1/12 hidden sm:table-cell",
  },
  {
    labels: [{ name: "GA" }],
    className: "w-1/12 hidden sm:table-cell",
  },
  {
    labels: [{ name: "+/-" }],
    className: "w-1/12 max-xs:w-1/6 max-sm:w-1/3",
  },
  {
    labels: [
      { name: "Pts", className: "hidden max-xs:block" },
      { name: "Points", className: "hidden xs:block" },
    ],
    className: "w-1/12 max-xs:w-1/6 max-sm:w-1/3",
  }
);
