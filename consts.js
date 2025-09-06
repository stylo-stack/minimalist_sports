const baseUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl"
const currentWeek = () => `${baseUrl}/scoreboard`;
const scoreForWeek = (seasonType, weekNo) => `${baseUrl}/scoreboard?seasontype=${seasonType}&week=${weekNo}`;

const summaryUrl = (gameId) =>  `${baseUrl}/summary?event=${gameId}`;

const weekType = "weekType";
const weekNumber = "weekNumber";

const getWeekNumberAndType = () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    return { weekNumber: params.get(weekNumber), weekType: params.get(weekType) }
}

const teams = [
  { id: 1,  name: "ATL", conference: "AFC", division: "South" },
  { id: 2,  name: "BUF", conference: "AFC", division: "East" },
  { id: 3,  name: "CHI", conference: "NFC", division: "North" },
  { id: 4,  name: "CIN", conference: "AFC", division: "North" },
  { id: 5,  name: "CLE", conference: "AFC", division: "North" },
  { id: 6,  name: "DAL", conference: "NFC", division: "East" },
  { id: 7,  name: "DEN", conference: "AFC", division: "West" },
  { id: 8,  name: "DET", conference: "NFC", division: "North" },
  { id: 9,  name: "GB",  conference: "NFC", division: "North" },
  { id: 10, name: "TEN", conference: "AFC", division: "South" },
  { id: 11, name: "IND", conference: "AFC", division: "South" },
  { id: 12, name: "KC",  conference: "AFC", division: "West" },
  { id: 13, name: "LV",  conference: "AFC", division: "West" },
  { id: 14, name: "LAR", conference: "NFC", division: "West" },
  { id: 15, name: "MIA", conference: "AFC", division: "East" },
  { id: 16, name: "MIN", conference: "NFC", division: "North" },
  { id: 17, name: "NE",  conference: "AFC", division: "East" },
  { id: 18, name: "NO",  conference: "NFC", division: "South" },
  { id: 19, name: "NYG", conference: "NFC", division: "East" },
  { id: 20, name: "NYJ", conference: "AFC", division: "East" },
  { id: 21, name: "PHI", conference: "NFC", division: "East" },
  { id: 22, name: "ARI", conference: "NFC", division: "West" },
  { id: 23, name: "PIT", conference: "AFC", division: "North" },
  { id: 24, name: "LAC", conference: "AFC", division: "West" },
  { id: 25, name: "SF",  conference: "NFC", division: "West" },
  { id: 26, name: "SEA", conference: "NFC", division: "West" },
  { id: 27, name: "TB",  conference: "NFC", division: "South" },
  { id: 28, name: "WSH", conference: "NFC", division: "East" },
  { id: 29, name: "CAR", conference: "NFC", division: "South" },
  { id: 30, name: "JAX", conference: "AFC", division: "South" },
  { id: 31, name: "AFC", conference: "AFC", division: null },
  { id: 32, name: "NFC", conference: "NFC", division: null },
  { id: 33, name: "BAL", conference: "AFC", division: "North" },
  { id: 34, name: "HOU", conference: "AFC", division: "South" }
];