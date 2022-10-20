let inventory = {}

const shop = {
    'ubp1': {
        name: 'Unsecure Bitram Partition Mk. 1',
        price: 2,
    },
    'ubp2': {
        name: 'Unsecure Bitram Partition Mk. 2',
        price: 3,
    },
    'ubp3': {
        name: 'Unsecure Bitram Partition Mk. 3',
        price: 4,
    }
}

const technicals = {
    ubp1 : {
        timeLimit: 5,
        gridSize: 2,
        puzzleLength: 2,
    },
    ubp2 : {
        timeLimit: 30,
        gridSize: 2,
        puzzleLength: 3,
    },
    ubp3 : {
        timeLimit: 30,
        gridSize: 3,
        puzzleLength: 2,
    }
}

const switcher = {
    LtS: {
        'Hacked': 'h',
        'Failed': 'f',
        'Unsecure Bitram Partition Mk. 1': 'ubp1',
        'Unsecure Bitram Partition Mk. 2': 'ubp2',
        'Unsecure Bitram Partition Mk. 3': 'ubp3',
        'Weak Bitram Partition Mk. 1': 'wbp1',
        'Weak Bitram Partition Mk. 2': 'wbp2',
        'Weak Bitram Partition Mk. 3': 'wbp3',
        'Protected Bitram Partition Mk. 1': 'pbp1',
        'Protected Bitram Partition Mk. 2': 'pbp2',
        'Protected Bitram Partition Mk. 3': 'pbp3',
        'Secure Bitram Partition Mk. 1': 'sbp1',
        'Secure Bitram Partition Mk. 2': 'sbp2',
        'Secure Bitram Partition Mk. 3': 'sbp3',
        'Bolted Bitram Partition Mk. 1': 'bbp1',
        'Bolted Bitram Partition Mk. 2': 'bbp2',
        'Bolted Bitram Partition Mk. 3': 'bbp3',
        'Top-Security Bitram Partition Mk. 1': 'tbp1',
        'Top-Security Bitram Partition Mk. 2': 'tbp2',
        'Top-Security Bitram Partition Mk. 3': 'tbp3',
    },
    StL : {
        'h': 'Hacked',
        'f': 'Failed',
        "ubp1": 'Unsecure Bitram Partition Mk. 1',
        "ubp2": 'Unsecure Bitram Partition Mk. 2',
        "ubp3": 'Unsecure Bitram Partition Mk. 3',
        "wbp1": 'Weak Bitram Partition Mk. 1',
        "wbp2": 'Weak Bitram Partition Mk. 2',
        "wbp3": 'Weak Bitram Partition Mk. 3',
        "pbp1": 'Protected Bitram Partition Mk. 1',
        "pbp2": 'Protected Bitram Partition Mk. 2',
        "pbp3": 'Protected Bitram Partition Mk. 3',
        "sbp1": 'Secure Bitram Partition Mk. 1',
        "sbp2": 'Secure Bitram Partition Mk. 2',
        "sbp3": 'Secure Bitram Partition Mk. 3',
        "bbp1": 'Bolted Bitram Partition Mk. 1',
        "bbp2": 'Bolted Bitram Partition Mk. 2',
        "bbp3": 'Bolted Bitram Partition Mk. 3',
        "tbp1": 'Top-Security Bitram Partition Mk. 1',
        "tbp2": 'Top-Security Bitram Partition Mk. 2',
        "tbp3": 'Top-Security Bitram Partition Mk. 3'
    }

}


function addToInventory(item){
    if(inventory[item] == undefined){
        inventory[item] = 1
    } else {
        inventory[item] += 1
    }
}

function removeFromInventory(item){
    for(i = 0; i < Object.keys(inventory).length; i++){
        if(inventory[item] > 1){
            inventory[item] -= 1
        } else {
            delete inventory[item]
        }
    }
}


function directions(){
    console.log("Welcome to Bitram Hacker!")
    console.log("To view your inventory, type 'inventory'. You should already have an Unsecure Bitram Partition Mk. 1 in it.")
    console.log("To hack Bitram Partitions, type hack('partition'). But do not use it's name, use its abbreviation instead.")
    console.log("The abbreviation is the first letter of each word, and the number of the partition.")
    console.log("For example, the Unsecure Bitram Partition Mk. 1 is 'ubp1'.")
    console.log("Be careful, though, because if you fail to hack the partition, it will be destroyed.")
    console.log("But it you succeed, it will double in value!")
    console.log("To sell your Bitram Partitions, type sell('partition'). Make sure to include an 'h' at the beginning of the abbreviation.")
    console.log("You can also sell normal Bitram Partitions, but they will only be worth half of what you bought them for.")
    console.log("When you sell Partitions, you get Partition Records, which can be used to buy more Partitions.")
    return 'Good Luck!'
}


/*
Unsecure
Weak
Protected
Secure
Bolted
Top-Security






*/