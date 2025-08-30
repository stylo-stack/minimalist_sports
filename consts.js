const baseUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl"
const currentWeek = () => `${baseUrl}/scoreboard`;
const scoreForWeek = (seasonType, weekNo) => `${baseUrl}/scoreboard?seasontype=${seasonType}&week=${weekNo}`;

const weekType = "weekType";
const weekNumber = "weekNumber";

const getWeekNumberAndType = () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    return { weekNumber: params.get(weekNumber), weekType: params.get(weekType) }
}

const teams = [
    { id: 1, name: "ATL" },
    { id: 2, name: "BUF" },
    { id: 3, name: "CHI" },
    { id: 4, name: "CIN" },
    { id: 5, name: "CLE" },
    { id: 6, name: "DAL" },
    { id: 7, name: "DEN" },
    { id: 8, name: "DET" },
    { id: 9, name: "GB" },
    { id: 10, name: "TEN" },
    { id: 11, name: "IND" },
    { id: 12, name: "KC" },
    { id: 13, name: "LV" },
    { id: 14, name: "LAR" },
    { id: 15, name: "MIA" },
    { id: 16, name: "MIN" },
    { id: 17, name: "NE" },
    { id: 18, name: "NO" },
    { id: 19, name: "NYG" },
    { id: 20, name: "NYJ" },
    { id: 21, name: "PHI" },
    { id: 22, name: "ARI" },
    { id: 23, name: "PIT" },
    { id: 24, name: "LAC" },
    { id: 25, name: "SF" },
    { id: 26, name: "SEA" },
    { id: 27, name: "TB" },
    { id: 28, name: "WSH" },
    { id: 29, name: "CAR" },
    { id: 30, name: "JAX" },
    { id: 31, name: "AFC" },
    { id: 32, name: "NFC" },
    { id: 33, name: "BAL" },
    { id: 34, name: "HOU" }
]