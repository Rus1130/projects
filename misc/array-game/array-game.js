const ArrayGame = {
    entities: {
        player: {
            x: 0,
            y: 0,
            sprite: "",
            state: "",
            move: {
                up: function(cellAmount){
                    ArrayGame.entities.player.state = "up"
                    if(ArrayGame.entities.player.y > 0 && ArrayGame.entities.player.y + 1 - cellAmount > 0){
                        ArrayGame.entities.player.y -= cellAmount
                    }
                },
                down: function(cellAmount){
                    ArrayGame.entities.player.state = "down"
                    if(ArrayGame.entities.player.y < ArrayGame.gameboard.length - 1 && ArrayGame.entities.player.y + cellAmount < ArrayGame.gameboard.length){
                        ArrayGame.entities.player.y += cellAmount
                    }
                },
                left: function(cellAmount){
                    ArrayGame.entities.player.state = "left"
                    if(ArrayGame.entities.player.x > 0 && ArrayGame.entities.player.x + 1 - cellAmount > 0){
                        ArrayGame.entities.player.x -= cellAmount
                    }
    
                },
                right: function(cellAmount){
                    ArrayGame.entities.player.state = "right"
                    if(ArrayGame.entities.player.x <  ArrayGame.gameboard[0].length - 1 && ArrayGame.entities.player.x + cellAmount < ArrayGame.gameboard[0].length){
                        ArrayGame.entities.player.x += cellAmount
                    }
                }
            },
        },
        enemies: [],
        bullets: [],
    },
    settings: {
        bkgd: "&nbsp;",
        consoleWarns: true,
        game_state: 'start-up'
    },
    DNE: {
        stateTypes: {
            player : {
                up: "╧",
                down: "╤",
                left: "╢", 
                right: "╟"
            },
            bullet: {
                up: "|",
                down: "|",
                left: "-",
                right: "-"
            }
        },
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
        invert: function(base, inverter) {
            return base - inverter;
        },
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
        straightFrame: []
    },
    gameboard: [],
    presetBoard: function(screenID, gameboard_x, gameboard_y){
        ArrayGame.create.display.screen(screenID);
        ArrayGame.create.display.board(gameboard_x, gameboard_y);
        ArrayGame.display_setup()
        ArrayGame.display_update()
        if(ArrayGame.settings.consoleWarns) console.warn("Preset Board Created")
        return ArrayGame.gameboard;

    },
    create : {
        entity: {
            bullet: {

            },
            enemy: {

            }
        },
        display: {
            screen: function(screenID) {
                ArrayGame.settings.game_state = "screen_created"
                let newGameboardDisplay = document.createElement("div");
                newGameboardDisplay.id = "screen";
                newGameboardDisplay.style.fontFamily = "monospace";
                newGameboardDisplay.style.fontSize = "18px";
                document.getElementById(screenID).appendChild(newGameboardDisplay);
                if(ArrayGame.settings.consoleWarns) return console.warn("Screen Created")
            },
            board: function (gameboard_x, gameboard_y, enemy_amount) {
                if(gameboard_x > 64 || gameboard_y > 64) {
                    return console.error("Gameboard size is too large (maximum is 64x64)")
                } else {
                    if(ArrayGame.settings.game_state !== "screen_created") return console.error("Screen has not been created yet")
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
                    ArrayGame.settings.game_state = "board_created"
                    return ArrayGame.gameboard
                };
            },
        }
    },
    display_setup: function () {
        if(ArrayGame.settings.game_state !== "board_created") return console.error("Gameboard has not been created yet")
        let playerSetupState = ArrayGame.DNE.randomizer(ArrayGame.DNE.randomPlayerState)
        ArrayGame.entities.player.state = playerSetupState
        ArrayGame.entities.player.sprite = ArrayGame.DNE.stateTypes.player[playerSetupState]

        let playerX = ArrayGame.DNE.random(0, ArrayGame.DNE.gameboardX - 1)
        let playerY = ArrayGame.DNE.invert(ArrayGame.DNE.gameboardY, ArrayGame.DNE.random(0, ArrayGame.DNE.gameboardY - 1))

        ArrayGame.entities.player.x = playerX
        ArrayGame.entities.player.y = playerY

        ArrayGame.gameboard[playerY][playerX] = ArrayGame.entities.player.sprite

        for(k = 0; k < ArrayGame.gameboard[0].length; k++){
            ArrayGame.DNE.straightFrame.push("═")
        }
        let topFrame = "╔" + ArrayGame.DNE.straightFrame.join("") + "╗"
        let bottomFrame = "╚" + ArrayGame.DNE.straightFrame.join("") + "╝"

        document.getElementById("screen").innerHTML = topFrame + "<br>" + JSON.stringify(ArrayGame.gameboard).replaceAll("],[","║<br>║").replace("[[","║").replace("]]","║").replaceAll('"',"").replaceAll(",","") + "<br>" + bottomFrame
        ArrayGame.settings.game_state = "ready"
        if(ArrayGame.settings.consoleWarns) return console.warn("Board Setup Completed")
        
    },
    display_update: function () {
        if(ArrayGame.settings.game_state !== "ready") return console.error("Game is not ready to update")
        let topFrame = "╔" + ArrayGame.DNE.straightFrame.join("") + "╗"
        let bottomFrame = "╚" + ArrayGame.DNE.straightFrame.join("") + "╝"
    
        for (i = 0; i < ArrayGame.gameboard.length; i++) {
            for (j = 0; j < ArrayGame.gameboard[i].length; j++) {
                ArrayGame.gameboard[i][j] = ArrayGame.settings.bkgd;
            }
        }
        console.log(ArrayGame.entities.player.state)
        ArrayGame.entities.player.sprite = ArrayGame.DNE.stateTypes.player[ArrayGame.entities.player.state]
        ArrayGame.gameboard[ArrayGame.entities.player.y][ArrayGame.entities.player.x] = ArrayGame.entities.player.sprite

        document.getElementById("screen").innerHTML = topFrame + "<br>" + JSON.stringify(ArrayGame.gameboard).replaceAll("],[","║<br>║").replace("[[","║").replace("]]","║").replaceAll('"',"").replaceAll(",","")  + "<br>" + bottomFrame
    }
}