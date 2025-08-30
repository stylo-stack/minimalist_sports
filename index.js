

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

const gamesTableBody = document.getElementById("games-table-body");
const createRow = (columns, title) => {
    const row = document.createElement("tr");
    row.scope = "row"
    if (title) {
        row.classList.add("thead-light")
    }
    for (const [key, column] of Object.entries(columns)) {
        const cell = document.createElement(title ? "th" : "td");
        cell.classList.add("align-middle")
        if (key === "link") {
            const a = document.createElement("a");
            a.href = column;
            a.textContent = "See game"
            a.target = "_blank"
            cell.appendChild(a)
        } else {
            cell.textContent = column;
        }

        row.appendChild(cell);
    }
    return row;
}

const loadGames = async (games) => {
    gamesTableBody.replaceChildren([document.createElement("a")]);
    for await (const game of games) {
        const homeTeam = game.getHomeTeam();
        const awayTeam = game.getAwayTeam();
        const titleObject = {
            home: homeTeam.team.displayName,
            away: awayTeam.team.displayName,
            date: game.getDateString(),
            time: game.getTimeString(),
        }
        const gameObject = {
            score: game.getScoreString(),
            period: game.getPeriodString(),
            clock: game.getClockString(),
            link: game.link,
        }
        const row = createRow(titleObject, true);
        gamesTableBody.appendChild(row)
        gamesTableBody.appendChild(createRow(gameObject))
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
    console.log({ weekNumber, weekType, d: "onload" })
    if (weekNumber) {
        getSpecificWeek(weekNumber, weekType ?? 2)
    } else {
        getCurrentWeek()
    }
}

onLoad()