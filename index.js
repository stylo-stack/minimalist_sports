

// const columnObj = {
//     home: "home",
//     away: "away",
//     date: "date",
//     time: "time",
//     score: "score",
//     period: "period",
//     clock: "clock",
//     link: "link"
// }

const gamesTableBody = document.getElementById("games-table");

const loadGames = async (games) => {
    gamesTableBody.replaceChildren([document.createElement("a")]);
    for await (const game of games) {
        const controller = new NflGameController(game);
        const display = controller.getGameDisplay();
        console.log({display})
        gamesTableBody.appendChild(display)
    }
}

const loadWeekVisuals = (weekType, weekNumber) => {
    const id = `w-${weekType}-${weekNumber}`;
    const el = document.getElementById(id);
    el.classList.remove("btn-secondary");
    el.classList.add("btn-primary")
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

onLoad()