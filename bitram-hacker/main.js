

const shop = {
    'ubp1': {
        name: 'Unsecure Bitram Partition Mk. 1',
        price: 1,
        levelRequirement: 1,
    },
    'ubp2': {
        name: 'Unsecure Bitram Partition Mk. 2',
        price: 2,
        levelRequirement: 2,
    },
    'ubp3': {
        name: 'Unsecure Bitram Partition Mk. 3',
        price: 3,
        levelRequirement: 5,
    }
}

const technicals = {
    ubp1 : {
        timeLimit: 20,
        gridSize: 2,
        puzzleLength: 2,
        exp: 2,
        levelReq: 1,
        attention: 8,
    },
    ubp2 : {
        timeLimit: 20,
        gridSize: 2,
        puzzleLength: 3,
        exp: 4,
        levelReq: 2,
        attention: 10,
    },
    ubp3 : {
        timeLimit: 20,
        gridSize: 2,
        puzzleLength: 4,
        exp: 6,
        levelReq: 5,
        attention: 12,
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





function directions(){
    console.log("Welcome to Bitram Hacker!")
    console.log("To view your inventory, type 'inventory'. You should already have an Unsecure Bitram Partition Mk. 1 in it.")
    console.log("To hack Bitram Partitions, type hack('partition'). But do not use it's name, use its abbreviation instead.")
    console.log("The abbreviation is the first letter of each word, and the number of the partition.")
    console.log("For example, the abbreviation of Unsecure Bitram Partition Mk. 1 is 'ubp1'.")
    console.log("Be careful, though, because if you take too long to hack the partition or put in the wrong pattern, it will be destroyed.")
    console.log("But if you succeed, it will double in value!")
    console.log("To sell your Bitram Partitions, type sell('partition'). Make sure to include an 'h' at the beginning of the abbreviation.")
    console.log("You can also sell normal Bitram Partitions, but they will only be worth half of what you bought them for.")
    console.log("When you sell Partitions, you get Partition Records, which can be used to buy more Partitions.")
    console.log("Everytime you hack a partition, you draw attention to yourself, shown through the attention meter. If it reaches 100, HackWatch will lock out and cannot do anything until the next day.")
    console.log("To buy Partitions, type buy('partition').")
    console.log("To view the shop, type 'shop'.")
    // console.log("Soon, people will start to offer you contracts. to view your contracts, type 'acceptableContracts'.")
    // console.log("Contracts will have an end day, and a reward. If you complete the contract before the end day, you will get the reward and gain reputation with that contractor.")
    // console.log("But be careful, but if you fail to complete the contract, you will lose reputation instead.")
    // console.log("You can only accept one contract at a time. To accept one type accept('contractName').")
    // console.log("To view your current contract, type 'currentContract'.")
    return 'Good Luck!'
}


let reputations = {
    'Nicholas M.': 0,
    "Baheer Jamati": 0,
}

let contractTech = {
    'Nicholas M.': {
        "What's up :)": {
            rep: 0,
            offerDay: 2,
        },
    },
    "Baheer Jamati": {
        "I'll give you a chance": {
            rep: 0,
            offerDay: 4,
        }
    }
}


const contractList = {
    "Nicholas M." : {
        "What's up :)" : {
            contractName: "What's up :)",
            contractor: "Nicholas M.",
            completeBy: 3,
            reward: 15,
            rep: 1,
            requirements: {
                'ubp2': 1,
            },
            description: {
                0: "Welcome to the wide world of Bitram Hacking!",
                1: "I'm Nicholas M., and I'm pretty well known around here (😎😏)." ,
                2: "I heard you're new to this, so I'll give you a contract to get you started. You have 1 day to complete it.",
                3: "I need you to hack an Unsecure Bitram Partition Mk. 2.",
                4: "I'll give you 15 Partition Records for it. You can find it in the shop. Good luck!"
            }
        }

    },
    "Baheer Jamati": {
        "I'll give you a chance" : {
            contractName: "I'll give you a chance",
            contractor: "Baheer Jamati",
            completeBy: 5,
            reward: 5,
            rep: 1,
            requirements: {
                'ubp3': 3,
            },
            description: {
                0: "I'll get straight to the point; You're not welcome here.",
                1: "I do low-level business, and I got a notif on HackMail that you're new in town.",
                2: "I need you to hack 3 Unsecure Bitram Partitions Mk. 3 for me.",
                3: "I'll give you 5 Partition Records for it. It better be complete by tomorrow."
            }
        }
    }
}

function contractCheck(contractor, contractName, d){
    if(d < contractList[contractor][contractName].offerDay || d >= contractList[contractor][contractName].completeBy) return false
    if(relations[contractor] < relationRequirements[contractor][contractName]) return false
    return true;

}


/*
Unsecure
Weak
Protected
Secure
Bolted
Top-Security






*/