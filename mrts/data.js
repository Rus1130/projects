const data = {
    units: {
        "basic horse": 10,
        "fast horse": 20,
        "strong horse": 25,

        "spearman": 20,
        "knight": 25,
        "shieldman": 30,
        "longbower": 35,
        "crossbower": 40,
        "wizard": 50,

        "medic": 30,

        "fishing boat": 15,
        "transport ship": 30,
        "siege ferry": 35,
        "attack ship": 40,
        "battle ship": 150,
        
        "battering ram": 120,
        "war wagon": 55,
        "ballista": 100,
        "trebuchet": 110,
        "catapult": 150,
        "balloon": 50
    },
    buildings: {
        stables: { 
            price: 40,
            units: ["basic horse", "fast horse", "strong horse"]
        },
        "siege workshop": {
            price: 120,
            units: ["battering ram", "war wagon", "ballista", "trebuchet", "catapult", "balloon"]
        },
        barracks: {
            price: 60,
            units: ["spearman", "knight", "shieldman", "longbower", "crossbower", "wizard"]
        },
        hospital: {
            price: 125,
            units: ["medic"]
        },
        port: {
            price: 55,
            units: ["fishing boat", "transport ship", "siege ferry", "attack ship", "battle ship"]
        }
    }
}