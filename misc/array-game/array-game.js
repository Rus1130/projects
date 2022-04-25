const ArrayGame = {
    settings: {
        bkgd: "#",
        consoleWarns: true
    },
    setup: true,
    DNE: {
        random(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        randomPlayerState: [{
            value: "up",
            probability: 0.25
        },{
            value: "left",
            probability: 0.25
        },{
            value: "down",
            probability: 0.25
        },{
            value: "right",
            probability: 0.25
        
        }],
        gameboardX: 0,
        gameboardY: 0,
        randomizer: (values) => {
            let i, pickedValue, 
            randomNr = Math.random(),
            threshold = 0;
            for (i = 0; i < values.length; i++) {
                if (values[i].probability === '*'){ 
                    continue;
                }
                threshold += values[i].probability; 
                if(threshold > randomNr) {
                    pickedValue = values[i].value;
                    break;
                }
                if (!pickedValue) {
                    pickedValue = values.filter((value) => value.probability === '*');
                }
            }
            return pickedValue;
        },
    },
    gameboard: [],
    presetBoard: function(screenID, gameboard_x, gameboard_y){
        ArrayGame.display.create.screen(screenID);
        ArrayGame.display.create.board(gameboard_x, gameboard_y);
        ArrayGame.display.setup()
        if(ArrayGame.settings.consoleWarns) console.warn("Preset Board Created")
        return ArrayGame.gameboard;

    },
    display: {
        create : {
            screen: function(screenID) {
                let newGameboardDisplay = document.createElement("div");
                newGameboardDisplay.id = "screen";
                newGameboardDisplay.style.fontFamily = "monospace";
                newGameboardDisplay.style.fontSize = "18px";
                document.getElementById(screenID).appendChild(newGameboardDisplay);
                if(ArrayGame.settings.consoleWarns) return console.warn("Screen Created")
            },
            board: function (gameboard_x, gameboard_y) {
                if(gameboard_x > 64 || gameboard_y > 64) {
                    return console.error("Gameboard size is too large (maximum is 64x64)")
                } else {
                    ArrayGame.gameboard = []
                    ArrayGame.DNE.gameboardX = gameboard_x;
                    ArrayGame.DNE.gameboardY = gameboard_y;
                    for (i = 0; i < parseInt(gameboard_y); i++) {
                        ArrayGame.gameboard.push([]);
                        for (j = 0; j < parseInt(gameboard_x); j++) {
                            ArrayGame.gameboard[i].push(ArrayGame.settings.bkgd);
                        }
                    }
                    if(ArrayGame.settings.consoleWarns) console.warn("Gameboard Created")
                    return ArrayGame.gameboard
                };
            },
        },
        setup: function () {
            let playerSetupState = ArrayGame.do_not_edit.randomizer(ArrayGame.do_not_edit.randomPlayerState)
            ArrayGame.entities.player.state = playerSetupState
            ArrayGame.entities.player.sprite = ArrayGame.entities.player.states[playerSetupState]

            let newPlayerX = ArrayGame.do_not_edit.random(0, ArrayGame.DNE.gameboardX - 1)
            let newPlayerY = ArrayGame.do_not_edit.random(0, ArrayGame.DNE.gameboardY - 1)

            ArrayGame.entities.player.x = newPlayerX
            ArrayGame.entities.player.y = newPlayerY

            ArrayGame.gameboard[newPlayerY][newPlayerX] = ArrayGame.entities.player.sprite

            document.getElementById("screen").innerHTML = JSON.stringify(ArrayGame.gameboard).replaceAll("],[","<br>").replace("[[","").replace("]]","").replaceAll('"',"").replaceAll(",","")
            if(ArrayGame.settings.consoleWarns) return console.warn("Board Setup Completed")
            
        },
        update: function () {
            document.getElementById("screen").innerHTML = JSON.stringify(ArrayGame.gameboard).replaceAll("],[","<br>").replace("[[","").replace("]]","").replaceAll('"',"").replaceAll(",","")
            if(ArrayGame.settings.consoleWarns) return console.warn("Board Updated")
            
        }
    },
    entities: {
        player: {
            x: 0,
            y: 0,
            sprite: "",
            state: "",
            states: {
                up: "╧",
                down: "╤",
                left: "╢", 
                right: "╟"
            }
        },
        bullet: {
            state: "",
            states: {
                up: "|",
                down: "|",
                left: "-",
                right: "-"
            }
        },
        enemies: [],
        bullets: [],
    }
}