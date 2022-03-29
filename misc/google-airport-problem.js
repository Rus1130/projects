const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// if the inputted airport does not have a route to other airports, create it
const airports = [
    "BGI","CDG","DEL","DOH","DSM","EWR","EYW","HND","ICN","JFK","LGA","ORD","SAN","SFO","SIN","TLV","BUD"
]
const routes = [
    ["DSM","ORD"],
    ["ORD","BGI"],
    ["BGI","LGA"],
    ["SIN","CDG"],
    ["CDG","BUD"],
    ["DEL","DOH"],
    ["DEL","CDG"],
    ["TLV","DEL"],
    ["EWR","HND"],
    ["HND","ICN"],
    ["HND","JFK"],
    ["ICN","JFK"],
    ["JFK","LGA"],
    ["EYW","LHR"],
    ["LHR","SFO"],
    ["SFO","SAN"],
    ["SFO","DSM"],
    ["SAN", "EYW"]
]

readline.question('Input starting airport:\n', ap => {
    const airport = ap
    
    readline.close()
    if(airports.toString().search(airport) == -1) return console.log(`'${airport}' is not a valid airport`)

    function addFlights(airport){
        for(i = 0; i < airports.length; i++){
            console.log(routes[i].includes(airport))
        }
    }

    addFlights(airport)
});

