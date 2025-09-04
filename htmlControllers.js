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


class NflGameController {
    /**
     * 
     * @param {EspnEvent} event 
     */
    constructor(event) {
        this.event = event
    }

    buildBody = () => {
        const body = createElement("div", "game-wrapper");
        body.style = `background: ${createGradient(this.event.getAwayTeam().team.color, this.event.getHomeTeam().team.color)}`;
        body.id = this.event.id;
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
        teamBar.appendChild(buildTeamElement(this.event.getAwayTeam()))
        teamBar.appendChild(buildTeamElement(this.event.getHomeTeam()))
        return teamBar;
    }

    buildDateDisplay = () => {
        const element = createElement("div", "flex-column", "d-flex", "align-items-center", "game-component");
        const dateElement = createElement("p");
        dateElement.textContent = this.event.getDateString();
        const timeElement = createElement("p");
        timeElement.textContent = this.event.getTimeString();
        element.appendChild(dateElement);
        element.appendChild(timeElement);
        return element;
    }

    buildScoreDisplay = () => {
        const element = createElement("div", "flex-row", "d-flex", "align-items-center", "game-component", "score-line");
        const { homeScore, awayScore } = this.event.getScore();
        const awayScoreEl = createElement("p", "display-4");
        awayScoreEl.textContent = awayScore;
        const homeScoreEl = createElement("p", "display-4");
        homeScoreEl.textContent = homeScore;

        const clockWrapper = createElement("div");
        const periodEl = createElement("p", "lead");
        periodEl.textContent = this.event.getPeriodString();
        const clockEl = createElement("p", "lead");
        clockEl.textContent = this.event.getClockString();
        clockWrapper.appendChild(periodEl);
        clockWrapper.appendChild(clockEl);

        element.appendChild(awayScoreEl);
        element.appendChild(clockWrapper);
        element.appendChild(homeScoreEl);
        return element;
    }

    getGameDisplay = () => {
        const wrapper = this.buildBody()

        const dateDisplay = this.buildDateDisplay();
        wrapper.appendChild(dateDisplay);

        const teamBar = this.buildTeamBar();
        wrapper.appendChild(teamBar);

        const scoreDisplay = this.buildScoreDisplay();
        wrapper.appendChild(scoreDisplay)
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
        for (const { name, value} of this.items) {
            const option = createElement("option");
            option.textContent = name;
            option.value = value;
            selectEl.appendChild(option);
        }
        selectEl.addEventListener("change", (e)=> {
            const [type, number] = e.currentTarget.value.split("-");
            const url = this.buildWeekUrl(type, number);
            window.location = url;
        })
        return selectEl;
    }
}