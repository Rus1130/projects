const ArrayGame = {
    bkgd: "%nbsp;",
    gb: [],
    gameboard: {
        create: function (gameboard_x, gameboard_y) {
            if(ArrayGame.gb == Array([])) {
                for (i = 0; i < parseInt(gameboard_y); i++) {
                    ArrayGame.gb.push([]);
                    for (j = 0; j < parseInt(gameboard_x); j++) {
                        ArrayGame.gb[i].push(ArrayGame.bkgd);
                    }
                }
                return ArrayGame.gb
            } else {
                return console.error("Gameboard already exists; call ArrayGame.gameboard.destroy() first.");
            }
        },
        destroy: function () {
            ArrayGame.gameboard = [];
            return ArrayGame.gb
        }
    },
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