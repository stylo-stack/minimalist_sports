const createElement = (tag, ...classList) => {
    const element = document.createElement(tag);
    for (const classItem of classList) {
        element.classList.add(classItem)
    }
    return element;
}

const createGradient = (startHex, endHex) => {
    const normalize = hex => hex.replace(/^#/, '').padStart(6, '0').slice(0, 6);
    const opacityHex = '94';

    const startWithAlpha = `#${normalize(startHex)}${opacityHex}`;
    const endWithAlpha = `#${normalize(endHex)}${opacityHex}`;
    return `linear-gradient(
    115deg,
    ${startWithAlpha} 0%,
    ${endWithAlpha} 100%
  )`;
};


const spinner = (anchor) => {
    const spinnerSizes = new Array(10).fill("")
    const wrapper = createElement("div", "container", "container-fluid", "d-flex", "justify-content-center", "align-items-center", "min-vh-5")

    for (const size of spinnerSizes) {
        const spinnerEl = createElement("div", "spinner-grow", "text-primary");
        spinnerEl.setAttribute("style", `width: ${size}vh; height: ${size}vh; margin: 5px;`)
        spinnerEl.setAttribute("role", "status");
        const spanEl = createElement("span", "sr-only");
        spanEl.textContent = "";
        spinnerEl.appendChild(spanEl);
        wrapper.appendChild(spinnerEl)
    }



    anchor.appendChild(wrapper);

    return () => wrapper.remove();

}

class StatsTableController {

    /**
     * @param {string} id
     * @param {BoxScore} boxScore 
     */
    constructor(id, boxScore) {
        this.tableId = `${id}-stats-table`;
        this.tableBodyId = `${id}-stats-table-body`;

        const existingTable = document.getElementById(this.tableId);

        if (existingTable) {
            this.table = existingTable;
            this.tableBody = document.getElementById(this.tableBodyId)
            this.populateWithData(boxScore);
            return;
        }

        const table = createElement("table", "table");
        table.id = this.tableId;
        const tableHead = createElement("thead");

        const placeHolderTh = createElement("th");

        const awayTeamTh = createElement("th");
        awayTeamTh.innerText = boxScore.awayTeam.name;

        const homeTeamTh = createElement("th");
        homeTeamTh.innerText = boxScore.homeTeam.name;

        tableHead.appendChild(placeHolderTh);
        tableHead.appendChild(awayTeamTh);
        tableHead.appendChild(homeTeamTh);

        table.appendChild(tableHead);
        const tableBodyEl = createElement("tbody");
        tableBodyEl.id = this.tableBodyId;
        this.tableBody = tableBodyEl;
        table.appendChild(tableBodyEl);

        this.table = table;
        this.populateWithData(boxScore)
    }


    buildRow = (name, awayValue, homeValue) => {
        const row = createElement("tr");

        const nameTd = createElement("td");
        nameTd.innerText = name;

        const awayValueTd = createElement("td");
        awayValueTd.innerText = awayValue;

        const homeValueTd = createElement("td");
        homeValueTd.innerText = homeValue;

        row.appendChild(nameTd);
        row.appendChild(awayValueTd);
        row.appendChild(homeValueTd);

        return row
    }

    /**
     * 
     * @param {BoxScore} boxScore 
     */
    populateWithData({ homeTeam, awayTeam }) {
        this.tableBody.replaceChildren([])
        let i = 0;
        while (true) {
            const awayStats = awayTeam.teamStatistics[i];
            const homeStats = homeTeam.teamStatistics[i];

            if (!awayStats) {
                break;
            }

            const row = this.buildRow(awayStats.label, awayStats.displayValue, homeStats.displayValue)
            this.tableBody.appendChild(row)
            i++;
        }
    }

    getTable = () => this.table;

}

const statsActiveClass = "active";
const statsHiddenClass = "hidden"

class NflGameController {
    /**
     * 
     * @param {EspnEvent} event 
     */
    constructor(event) {
        this.event = event;
        this.statsContainerId = `${event.id}-stats`
    }

    handleStats = async () => {
        const elements = document.querySelectorAll(`.stats-container.${statsActiveClass}`);
        const statsContainerEl = document.getElementById(this.statsContainerId);
        const shouldOpenContainer = statsContainerEl.classList.contains(statsHiddenClass)

        for (const element of elements) {
            element.classList.remove(statsActiveClass);
            element.classList.add(statsHiddenClass)
        }

        if (!shouldOpenContainer) return;

        statsContainerEl.classList.add(statsActiveClass);
        statsContainerEl.classList.remove(statsHiddenClass);
        const killSpinner = spinner(statsContainerEl);

        const boxScoreData = await getGameBoxScore(this.event.id);
        const tableController = new StatsTableController(this.event.id, boxScoreData)
        statsContainerEl.appendChild(tableController.getTable())
        killSpinner();
    }

    buildBody = () => {
        const body = createElement("div", "game-wrapper");
        body.style = `background: ${createGradient(this.event.getAwayTeam().team.color, this.event.getHomeTeam().team.color)}`;
        body.id = this.event.id;
        if (!this.event.getIsBefore()) {
            body.addEventListener("click", () => {
                this.handleStats()
            })
        }

        return body;
    };

    buildTeamBar = () => {
        const teamBar = createElement("div", "flex-row", "d-flex", "align-items-center", "game-component");
        const buildTeamElement = ({ team }) => {
            const teamWrapper = createElement("div", "d-flex", "flex-column", "align-items-center", "team");
            teamWrapper.id = team.id;
            const logoEl = createElement("img", "team-logo");
            logoEl.src = team.logo;
            const nameEl = createElement("p", "team-name");
            nameEl.textContent = team.shortDisplayName;
            teamWrapper.appendChild(logoEl);
            teamWrapper.appendChild(nameEl)
            return teamWrapper;
        }

        const clockWrapper = createElement("div");
        const periodEl = createElement("p", "lead");
        periodEl.textContent = this.event.getPeriodString();
        const clockEl = createElement("p", "lead");
        clockEl.textContent = this.event.getClockString();
        clockWrapper.appendChild(periodEl);
        clockWrapper.appendChild(clockEl);

        teamBar.appendChild(buildTeamElement(this.event.getAwayTeam()))
        teamBar.appendChild(clockWrapper);
        teamBar.appendChild(buildTeamElement(this.event.getHomeTeam()))
        return teamBar;
    }

    buildDateDisplay = () => {
        const element = createElement("div", "flex-column", "d-flex", "align-items-center", "game-component");
        const dateElement = createElement("p", "fs-5");
        dateElement.textContent = this.event.getDateString();
        if (this.event.getIsBefore()) {
            dateElement.textContent += " " + this.event.getTimeString();
        }
        element.appendChild(dateElement);
        return element;
    }

    buildScoreDisplay = () => {
        const element = createElement("div", "flex-row", "d-flex", "game-component", "score-line");
        const { homeScore, awayScore } = this.event.getScore();
        const awayScoreWrapper = createElement("div", "d-flex", "flex-row", "score")
        const awayScoreEl = createElement("p", "display-4");
        awayScoreEl.textContent = awayScore;
        //Yeah, I get that this is shit, but I can't figure out why the alignment is off, and I have a day job.
        console.log({ awayScore })
        if (Number(awayScore) < 10) {
            const placeHolder = createElement("p", "display-4", "opacity-0");
            placeHolder.textContent = "0";
            awayScoreWrapper.appendChild(placeHolder)
        }
        awayScoreWrapper.appendChild(awayScoreEl)

        const homeScoreWrapper = createElement("div", "d-flex", "flex-row", "score")
        const homeScoreEl = createElement("p", "display-4");
        homeScoreEl.textContent = homeScore;
        homeScoreWrapper.appendChild(homeScoreEl)
        //Yeah, I get that this is shit, but I can't figure out why the alignment is off, and I have a day job.
        if (Number(homeScore) < 10) {
            const placeHolder = createElement("p", "display-4", "opacity-0");
            placeHolder.textContent = "0";
            homeScoreWrapper.appendChild(placeHolder)
        }


        element.appendChild(awayScoreWrapper);
        element.appendChild(homeScoreWrapper);
        return element;
    }

    buildStatsDisplay = () => {
        const wrapperEl = createElement("div", "stats-container", "hidden");
        wrapperEl.id = this.statsContainerId;
        return wrapperEl;
    }

    getGameDisplay = () => {
        const wrapper = this.buildBody()

        const dateDisplay = this.buildDateDisplay();
        wrapper.appendChild(dateDisplay);

        const teamBar = this.buildTeamBar();
        wrapper.appendChild(teamBar);

        const scoreDisplay = this.buildScoreDisplay();
        wrapper.appendChild(scoreDisplay)

        const statsDisplay = this.buildStatsDisplay();
        wrapper.appendChild(statsDisplay);

        return wrapper;
    }
}

class WeekSelectController {
    constructor(items) {
        this.items = items;
    }

    buildWeekUrl = (type, number) => {
        const url = new URL(window.location.href);
        url.searchParams.set(weekType, type);
        url.searchParams.set(weekNumber, number);
        return url.toString()
    }

    populateWeekSelector = () => {
        const selectEl = document.getElementById("week-select")
        for (const { name, value } of this.items) {
            const option = createElement("option");
            option.textContent = name;
            option.value = value;
            selectEl.appendChild(option);
        }
        selectEl.addEventListener("change", (e) => {
            const [type, number] = e.currentTarget.value.split("-");
            const url = this.buildWeekUrl(type, number);
            window.location = url;
        })
        return selectEl;
    }
}