const ArrayGame = {
    bkgd: "#",
    gameboard: [],
    presetBoard: function(screenID, board_X, board_Y){
        ArrayGame.display.create.screen(screenID);
        ArrayGame.display.create.board(board_X, board_Y);
        ArrayGame.display.update()

    },
    display: {
        create : {
            screen: function(elementID) {
                let newGameboardDisplay = document.createElement("div");
                newGameboardDisplay.id = "screen";
                newGameboardDisplay.style.fontFamily = "monospace";
                newGameboardDisplay.style.fontSize = "18px";
                document.getElementById(elementID).appendChild(newGameboardDisplay);
            },
            board: function (gameboard_x, gameboard_y) {
                if(gameboard_x > 64 || gameboard_y > 64) {
                    return console.error("Gameboard size is too large (maximum is 64x64)")
                } else {
                    if(JSON.stringify(ArrayGame.gameboard) != "[]") {
                        return console.error("Gameboard already exists; call ArrayGame.gameboard.destroy() first.")
                    } else {
                        for (i = 0; i < parseInt(gameboard_y); i++) {
                            ArrayGame.gameboard.push([]);
                            for (j = 0; j < parseInt(gameboard_x); j++) {
                                ArrayGame.gameboard[i].push(ArrayGame.bkgd);
                            }
                        }
                        return ArrayGame.gameboard
                    };
                };
            },
        },
        update: function () {
            document.getElementById("screen").innerHTML = JSON.stringify(ArrayGame.gameboard).replaceAll("],[","<br>").replace("[[","").replace("]]","").replaceAll('"',"").replaceAll(",","")
            
        },
        destroy: {
            board: function () {
                ArrayGame.gameboard = [];
                return ArrayGame.gameboard
            }
        }
    },
    system: {
        entities: {
            sprites: {
                player: {
                    up: "╧",
                    down: "╤",
                    left: "╢", 
                    right: "╟"
                },
                enemy: "",
                bullet: {
                    up: "|",
                    down: "|",
                    left: "-",
                    right: "-"
                }
            },
            player: {
                x: 0,
                y: 0,
            },
            enemies: [],
            bullets: [],
        }
    }
}