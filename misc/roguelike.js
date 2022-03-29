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
    [["0"],[],[],[],[]], // y0
    [["1"],[],[],[],[]], // y1
    [["2"],[],[],[],[]], // y2
    [["3"],[],[],[],[]], // y3
    [["4"],[],[],[],[]] // y4
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
    gameboard[player.y][player.x] = player.sprite
    console.log(gameboard)
}

readline.question(`Choose your character: (${charNames.join(", ")})\n`, chosenCharacter => {
    
    let charIndex = charNames.indexOf(chosenCharacter)
    if(charIndex == -1) return console.log(`'${chosenCharacter}' is not a chooseable character.`)
    player.sprite = characters[charIndex].join()
    player.y = random(0, 4)
    player.x = random(0, 4)
    console.log(player.y)
    console.log(player.x)
    gameboard[player.y][player.x] = player.sprite
    console.log("controls: 'wasd' to move, 'q' to exit")
    updateBoard()
    
    readline.on('line', (input) => {
        if(input == "q"){
            console.log("quitting...")
            readline.close()
        }
    });
});

