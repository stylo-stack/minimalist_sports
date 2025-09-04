const createNewArray = (count) => new Array(count).fill("").map((_, index) => index + 1);

const preSeasonNumbers = createNewArray(4).map(number => ({ name: `P${number}`, number }));;
const regSeasonNumbers = createNewArray(18).map(number => ({ name: `W${number}`, number }));
const postSeasonNumbers = [{ name: "WC", number: 1 }, { name: "DR", number: 2 }, { name: "CC", number: 3 }, { name: "SB", number: 4 }];

const weekGroups = [
    { name: "Preseason", items: preSeasonNumbers, number: 1 },
    { name: "Reg. Season", items: regSeasonNumbers, number: 2 },
    { name: "Post Season", items: postSeasonNumbers, number: 3 },
]

const weekUrl = (type, number) => {
    const url = new URL(window.location.href);
    url.searchParams.set(weekType, type);
    url.searchParams.set(weekNumber, number);
    return url.toString()
};

const weekItems = []
for (const { name, items, number: typeNumber } of weekGroups) {

    for (const item of items) {
        weekItems.push({
            name: `${name} - ${item.name}`,
            value: `${typeNumber}-${item.number}`
        })
    }
}


const weekSelectEl = new WeekSelectController(weekItems)
weekSelectEl.populateWeekSelector()

