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
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]]
]

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

function updateBoard(){
    board = JSON.stringify(gameboard).replaceAll("]],","]]\n").replaceAll("[[[","[").replaceAll("]]]","]").replaceAll("[[","[").replaceAll("]]","]").replaceAll(",\"","[").replaceAll("\",","],")
}

readline.question(`Choose your character: (${charNames.join(", ")})\n`, chosenCharacter => {
    
    let charIndex = charNames.indexOf(chosenCharacter)
    if(charIndex == -1) return console.log(`'${chosenCharacter}' is not a chooseable character.`)
    player.sprite = characters[charIndex].join()
    console.log(player.sprite)
    console.log("controls: 'wasd' to move, 'q' to exit")
    player.y = random(0, gameboard.length - 1)
    player.x = random(0, gameboard[player.y].length - 1)
    gameboard[player.y][player.x] = player.sprite
    updateBoard()
    console.log(board)
    
    readline.on('line', (input) => {
        if(input == "q"){
            console.log("quitting...")
            readline.close()
        }
        if(input == "w"){
            updateBoard()
            console.log(board)
        }
        if(input == "a"){
            updateBoard()
            console.log(board)
        }
        if(input == "s"){
            updateBoard()
            console.log(board)
        }
        if(input == "d"){
            updateBoard()
            console.log(board)
        }
    });
});

