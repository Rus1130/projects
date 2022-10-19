let inventory = {}

const shop = {
    'ubp1': {
        name: 'Unsecure Bitram Partition Mk. 1',
        price: 2,
        unchangedPrice: this.price * 0.5,
        failedPrice: this.price * 0.25,
        hackedPrice: this.price * 1.5,
    }
}


const technicals = {
    ubp1 : {
        time: 30,
        gridSize: 2,
        puzzleLength: 2,
    }
}

const switcherLtS = {

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

function converter(type, name){
    return switcher[type][name]
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

/*
Unsecure
Weak
Protected
Secure
Bolted
Top-Security






*/