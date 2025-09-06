

const gamesTableBody = document.getElementById("games-table");
const loadGames = async (games) => {
    gamesTableBody.replaceChildren([document.createElement("a")]);
    for await (const game of games) {
        const controller = new NflGameController(game);
        const display = controller.getGameDisplay();
        gamesTableBody.appendChild(display)
    }
}

const loadWeekVisuals = (weekType, weekNumber) => {
    const selectEl = document.getElementById("week-select");
    const value = `${weekType}-${weekNumber}`;
    selectEl.value = value;
}

const getCurrentWeek = async () => {
    const response = await fetch(currentWeek());
    const data = await response.json();
    const games = data.events.map(it => new EspnEvent(it))
    const weekType = data.season.type;
    const weekNumber = data.week.number;
    await loadGames(games);
    loadWeekVisuals(weekType, weekNumber)
}

const getSpecificWeek = async (weekNumber, weekType) => {
    const response = await fetch(scoreForWeek(weekType, weekNumber));
    const data = await response.json();
    const games = data.events.map(it => new EspnEvent(it))
    await loadGames(games)
    loadWeekVisuals(weekType, weekNumber)
}

function onLoad() {
    const { weekNumber, weekType } = getWeekNumberAndType();
    if (weekNumber) {
        getSpecificWeek(weekNumber, weekType ?? 2)
    } else {
        getCurrentWeek()
    }
}

async function getGameBoxScore(gameId){
    const url = summaryUrl(gameId);
    const res = await fetch(url);
    const {boxscore: data} = await res.json();
    const boxScore = new BoxScore(data);

    return boxScore;
}

onLoad()