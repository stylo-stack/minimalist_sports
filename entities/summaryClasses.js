
class BoxScoreTeamStatistic{
    constructor({name, displayValue, value, label}){
        this.name = name;
        this.displayValue = displayValue;
        this.value = value;
        this.label = label;
    }
}

class BoxScoreAthlete{
    constructor({firstName, lastName, displayName, id, headshot}){
        this.firstName = firstName;
        this.lastName = lastName;
        this.displayName = displayName;
        this.id = id;
        this.photo = headshot?.href;
    }
}

class PlayerStatistic{
    individualStatistics = [];
    constructor(key, label, description, total){
        this.key = key;
        this.label = label;
        this.description = description;
        this.total = total;
    }
    addIndividual = (athlete, stat) => {
        this.individualStatistics.push({athlete, stat})
    }
}

class PlayerStatisticsGroup{
    constructor({name, text, keys, labels, athletes, totals, descriptions}){
        /** statistic name */
        this.name = name;
        /** statistic display name*/
        this.displayName = text;
        this.labels = labels;
        const statistics = keys.map((key, index) => new PlayerStatistic(key, labels[index], descriptions[index], totals[index]))
        this.statistics = statistics;
        for(const {athlete, stats} of athletes){
            const boxScoreAthlete = new BoxScoreAthlete(athlete);
            stats.forEach((stat, index) => {
                statistics[index].addIndividual(boxScoreAthlete, stat)
            })
        }
    }
}

class BoxScoreTeam{
    constructor(team, players){
        const {team: {id, name}, statistics: teamStatistics, homeAway} = team;
        const {statistics: playerStatistics} = players;
        this.homeAway = homeAway;
        this.teamId = id;
        this.name = name;
        this.teamStatistics = teamStatistics.map(it => new BoxScoreTeamStatistic(it));
        this.playerStatistics = playerStatistics.map(it => new PlayerStatisticsGroup(it));
    }

    isHomeTeam = () => this.homeAway === "home";
}

class BoxScore{
    constructor({teams, players}){
        const team1 = new BoxScoreTeam(teams[0], players[0]);
        const team2 = new BoxScoreTeam(teams[1], players[1]);
        this.homeTeam = team1.isHomeTeam() ? team1 : team2;
        this.awayTeam = team1.isHomeTeam() ? team2 : team1;
    }
}

