const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const characters = [
    smile = [
        "🙂"
    ],
    grin = [
        "😀"
    ],
    noface = [
        "😶"
    ],
    poker = [
        "😐"
    ],
    devil = [
        "😈"
    ],
    tongue = [
        "😋"
    ],
    nerd = [
        "🤓"
    ],
    sunglasses = [
        "😎"
    ],
    hearts = [
        "🥰"
    ],
    kiss = [
        "😘"
    ]
]

let gameboard = [
    [[],[],[],[],[],[],[],[],[]], // 0
    [[],[],[],[],[],[],[],[],[]], // 1
    [[],[],[],[],[],[],[],[],[]], // 2
    [[],[],[],[],[],[],[],[],[]], // 3
    [[],[],[],[],[],[],[],[],[]], // 4
    [[],[],[],[],[],[],[],[],[]], // 5
    [[],[],[],[],[],[],[],[],[]], // 6
]

const minX = 0;
const minY = 0;
const maxX = 8;
const maxY = 6;

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const charNames = ["smile","grin","noface","poker","devil","tongue","nerd","sunglasses","hearts","kiss"]
let player = [
    sprite = '',
    x = '',
    y = ''
];
let board;

player.y = random(0, gameboard.length - 1)
player.x = random(0, gameboard[player.y].length - 1)
gameboard[player.y][player.x] = `[${player.sprite}]`

function updateBoard(){
    gameboard[player.y][player.x] = `[${player.sprite}]`
    console.log(JSON.stringify(gameboard).replaceAll("\"[","[").replaceAll("]\"","]").replaceAll("]],[[","]\n[").replaceAll("[[[","[").replaceAll("]]]","]").replaceAll(",",""))
}

readline.question(`Choose your character: (${charNames.join(", ")})\n`, chosenCharacter => {
    
    let charIndex = charNames.indexOf(chosenCharacter)
    if(charIndex == -1) return console.log(`'${chosenCharacter}' is not a chooseable character. `), readline.close()
    player.sprite = characters[charIndex].join()
    console.log("controls: 'wasd' to move, 'q' to exit")
    
    console.log(`${player.x}\n${player.y}`)
    updateBoard()
    
    readline.on('line', (input) => {
        switch(input){
            case "q":
                console.log("quitting...")
                readline.close()
                break;
            case "w":
                if(player.y > minY){
                    gameboard[player.y][player.x] = []
                    player.y -= 1
                    updateBoard()
                } else {
                    return console.log("You cannot move in this direction anymore!")
                }
                break;
            case "a":
                if(player.x > minX){
                    gameboard[player.y][player.x] = []
                    player.x -= 1
                    updateBoard()
                } else {
                    return console.log("You cannot move in this direction anymore!")
                }
                break;
            case "s":
                if(player.y < maxY){
                    gameboard[player.y][player.x] = []
                    player.y += 1
                    updateBoard()
                } else {
                    return console.log("You cannot move in this direction anymore!")
                }
                break;
            case "d":
                if(player.x < maxX){
                    gameboard[player.y][player.x] = []
                    player.x += 1
                    updateBoard()
                } else {
                    return console.log("You cannot move in this direction anymore!")
                }
                break;
            default:
                console.log("That is not a valid control!")
        }
    });
});

