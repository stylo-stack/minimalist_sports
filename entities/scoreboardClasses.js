// ──────────────────────────────────────────────────────────────
// Utility helpers
// ──────────────────────────────────────────────────────────────
class DateRange {
    constructor({ startDate, endDate }) {
        this.start = new Date(startDate);
        this.end = new Date(endDate);
    }
    /** Returns true if a given Date falls inside the range */
    includes(date) {
        const d = date instanceof Date ? date : new Date(date);
        return d >= this.start && d <= this.end;
    }
    toString() {
        return `${this.start.toISOString()} – ${this.end.toISOString()}`;
    }
}

// ──────────────────────────────────────────────────────────────
// Core domain objects
// ──────────────────────────────────────────────────────────────
class Logo {
    constructor({ href, width, height, alt, rel, lastUpdated }) {
        this.href = href;
        this.width = width;
        this.height = height;
        this.alt = alt;
        this.rel = rel;               // array of strings
        this.lastUpdated = new Date(lastUpdated);
    }
}

class SeasonInfo {
    constructor({ year, startDate, endDate, displayName, type }) {
        this.year = year;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.displayName = displayName;
        this.type = type;              // { id, name, abbreviation }
    }
}

class CalendarEntry {
    constructor({ label, value, startDate, endDate, entries = [] }) {
        this.label = label;
        this.value = value;
        this.range = new DateRange({ startDate, endDate });
        this.subEntries = entries.map(e => new CalendarEntry(e));
    }
}

/** Represents a single league (e.g., NFL). */
class League {
    constructor(raw) {
        // Basic identifiers
        this.id = raw.id;
        this.uid = raw.uid;
        this.name = raw.name;
        this.abbreviation = raw.abbreviation;
        this.slug = raw.slug;

        // Season meta
        this.season = new SeasonInfo({
            year: raw.season?.year,
            startDate: raw.season?.startDate,
            endDate: raw.season?.endDate,
            displayName: raw.season?.displayName,
            type: raw.season?.type
        });

        // Logos
        this.logos = (raw.logos ?? []).map(l => new Logo(l));

        // Calendar
        this.calendarType = raw.calendarType;
        this.calendarIsWhitelist = raw.calendarIsWhitelist;
        this.calendarRange = new DateRange({
            startDate: raw.calendarStartDate,
            endDate: raw.calendarEndDate
        });
        this.calendar = (raw.calendar ?? [])
            .map(entry => new CalendarEntry(entry));

        // EspnEvents (games) – heavy nesting, but we keep a thin wrapper
        this.events = (raw.events ?? []).map(ev => new EspnEvent(ev));
    }

    /** Find a week by its number (e.g., 1‑18). */
    getWeek(number) {
        return this.calendar.find(c => c.subEntries.some(e => e.value == number));
    }
}

/** Wrapper for a game / event. */
class EspnEvent {
    constructor(raw) {
        this.id = raw.id;
        this.uid = raw.uid;
        this.date = new Date(raw.date);
        this.name = raw.name;
        this.shortName = raw.shortName;
        this.season = raw.season; // { year, type, slug }
        this.week = raw.week?.number;
        this.competition = (raw.competitions ?? []).map(c => new Competition(c))[0];
        this.link = raw.links[0]?.href
    }

    getGameStatus = () => this.competition.getStatus();

    getIsBefore = () => this.getGameStatus() === "pre"

    getHomeTeam = () => this.competition.competitors.find(it => it.homeAway === "home")

    getAwayTeam = () => this.competition.competitors.find(it => it.homeAway === "away")


    getDateString = () => this.competition.date.toLocaleString('fr-FR', {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
    });


    getTimeString = () => this.competition.date.toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    getScore = () => {
        const { score: homeScore } = this.getHomeTeam();
        const { score: awayScore } = this.getAwayTeam();
        return {
            homeScore,
            awayScore
        }
    }

    getScoreString = () => {
        if (this.competition.getStatus() === "pre") {
            return "- : -"
        }
        const {homeScore, awayScore} = this.getScore();
        return `${homeScore} : ${awayScore}`
    }

    getClockString = () => this.competition.status.displayClock;

    getPeriodString = () => this.competition.status.periodString;

}

/**
 * The game
 */
class Competition {
    constructor(raw) {
        this.id = raw.id;
        this.uid = raw.uid;
        this.date = new Date(raw.date);
        this.attendance = raw.attendance;
        this.type = raw.type;
        this.timeValid = raw.timeValid;
        this.neutralSite = raw.neutralSite;
        this.venue = raw.venue ? new Venue(raw.venue) : null;
        this.competitors = (raw.competitors ?? []).map(c => new Competitor(c));
        this.status = new Status(raw.status);
        this.broadcasts = raw.broadcasts;
    }

    /**
     * -  `"pre"`: Game has not started
     * - `"live"`: Game is ongoing
     * - `"end"`: Game is over
     */
    getStatus = () => {
        if (this.status.pre) {
            return "pre"
        }
        if (this.status.completed) {
            return "end"
        }
        return "live"
    }
}


class Status {
    getPeriodString = (period, completed, before) => {
        const str = ""
        if (before) {
            return "Pregame"
        }
        if (completed) {
            return "Final"
        }
        if (period > 5) {
            return String(period)
        }
        if (period === 5) {
            return "OT"
        }
        return `${period - 4}OT`
    }
    constructor(raw) {
        const before = raw.type.state === "pre";
        const completed = raw.type.completed;
        this.clock = raw.clock;
        this.displayClock = raw.displayClock;
        this.isTBDFlex = raw.isTBDFlex;
        this.period = raw.period;
        this.periodString = this.getPeriodString(raw.period, completed, before);
        this.completed = raw.type.completed;
        this.pre = before;
        this.completed = completed;
    }
}

class Competitor {
    constructor(raw) {
        this.id = raw.id;
        this.uid = raw.uid;
        this.type = raw.type;          // usually "team"
        this.order = raw.order;         // 0 = home, 1 = away
        this.homeAway = raw.homeAway;      // "home" | "away"
        this.team = raw.team ? new Team(raw.team) : null;
        this.score = raw.score;
        this.statistics = raw.statistics ?? [];
        this.records = raw.records ?? [];
        this.leaders = raw.leaders ?? []; // could be parsed further if needed
    }
}

/** Detailed team info. */
class Team {
    constructor(raw) {
        this.id = raw.id;
        this.uid = raw.uid;
        this.location = raw.location;
        this.name = raw.name;
        this.abbreviation = raw.abbreviation;
        this.displayName = raw.displayName;
        this.shortDisplayName = raw.shortDisplayName;
        this.color = raw.color;
        this.alternateColor = raw.alternateColor;
        this.isActive = raw.isActive;
        this.logo = raw.logo;
        this.links = raw.links; // array of link objects
        this.venueId = raw.venue?.id;
    }
}

/** Simple venue representation. */
class Venue {
    constructor(raw) {
        this.id = raw.id;
        this.fullName = raw.fullName;
        this.address = raw.address; // { city, state, country }
        this.indoor = raw.indoor;
    }
}