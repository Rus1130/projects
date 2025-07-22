export class GamblerFramework {
    
    static MIN_LUCK = 0.0009
    static MAX_LUCK = 0.95
    static OBJECT_BANK = {}
    static gamblers = new Map();

    /**
     * 
     * @param {Number[]} rarities - array of rarity names. e.g. ["common", "uncommon", "rare", "epic", "legendary"]
     * @param {Number[]} probabilities - array of probabilities corresponding to each rarity. e.g. [0.5, 0.3, 0.15, 0.04, 0.01]
     * @param {Boolean[]} isRare - array of booleans indicating if the rarity is considered "rare". e.g. [false, false, true, true, true]
     */
    constructor(rarities, probabilities, isRare, object_bank = {}) {
        if (rarities.length !== probabilities.length || rarities.length !== isRare.length) {
            throw new Error("Rarities, probabilities, and isRare must all be the same length");
        }
        this.rarities = rarities;
        this.probabilities = probabilities;
        this.isRare = isRare;

        GamblerFramework.OBJECT_BANK = object_bank;
    }

    /**
     * Creates a new Gambler instance and registers it in the gamblers map.
     * @param {*} uid - Unique identifier for the gambler
     * @returns {Gambler}
     */
    createGambler(uid) {
        let gambler = new Gambler(uid, this);
        if (GamblerFramework.gamblers.has(uid)) {
            throw new Error(`Gambler with UID ${uid} already exists.`);
        }
        GamblerFramework.gamblers.set(uid, gambler);
        return gambler;
    }

    /**
     * Allows access to a Gambler instance through the GamblerFramework.
     * @param {String} uid - Unique identifier for the gambler
     * @return {Object} - a proxy object with methods to interact with the gambler
     */
    gamblerProxy(uid){
        if (!GamblerFramework.gamblers.has(uid)) {
            throw new Error(`Gambler with UID ${uid} does not exist.`);
        }

        return {
            // test method
            getRandomItem: () => {
                const gambler = GamblerFramework.gamblers.get(uid);
                return gambler.getRandomItem();
            }
        }
    }

    createGamblersFromJSON(json) {
        if (!json || !Array.isArray(json)) {
            throw new Error("Invalid JSON format for gamblers");
        }
        json.forEach(gamblerData => {
            if (!gamblerData.uid) {
                throw new Error("Gambler data must contain a UID");
            }
            if (GamblerFramework.gamblers.has(gamblerData.uid)) {
                throw new Error(`Gambler with UID ${gamblerData.uid} already exists.`);
            }
            const gambler = this.createGambler(gamblerData.uid);

            // ...
        });
    }
                

    /**
     * Generates a random rarity based on the provided probabilities and skew.
     * @param {Number} times - Number of times to draw a rarity
     * @param {Number} skew - Skew factor to adjust the probabilities
     * @return {GamblerResult} - An object containing the results of the random draws
     */
    getRandomRarity(times, skew) {
        if(skew > GamblerFramework.MAX_LUCK) skew = GamblerFramework.MAX_LUCK;
        // Adjust probabilities based on isRare and skew
        const adjustedProbs = this.probabilities.map((p, i) => {
            return p * (this.isRare[i] ? (1 + skew) : (1 - skew));
        });

        // Normalize
        const totalAdjusted = adjustedProbs.reduce((a, b) => a + b, 0);
        const normalizedProbs = adjustedProbs.map(p => p / totalAdjusted);

        // Initialize result object with all rarities set to 0
        const base = {};
        this.rarities.forEach(r => base[r] = 0);
        const result = new GamblerResult(base);

        // Perform random draws
        for (let i = 0; i < times; i++) {
            const r = Math.random();
            let cumulative = 0;
            for (let j = 0; j < normalizedProbs.length; j++) {
                cumulative += normalizedProbs[j];
                if (r < cumulative) {
                    result.increment(this.rarities[j]);
                    break;
                }
            }
        }

        return result;
    }

    /**
     * 
     * @param {String} rarity 
     * @param {Number} amount how many times per attempt to get the rarity
     * @param {Number} attempts how many total loops to perform
     * @param {Number} skew skew
     * @returns {Promise<GamblerResult>}
     */
    async search(rarity, amount, attempts, skew) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < attempts; i++) {
                const result = this.getRandomRarity(amount, skew);

                if (result.has(rarity)) {
                    console.log(`Found ${rarity} in attempt ${(i + 1).toLocaleString()}.`);
                    result.result.iteration = i + 1;
                    return resolve(result);
                }

                if (i === attempts - 1) {
                    return reject(new Error(`Failed to find ${rarity} ${amount}x in ${attempts.toLocaleString()} attempts.`));
                }
            }
        });
    }
}

class GamblerResult {
    constructor(object = {}) {
        this.result = new Map();
        for (const [key, value] of Object.entries(object)) {
            this.result.set(key, value);
        }
        this.iteration = null;
    }

    /**
     * Increments the count for a given rarity.
     * @param {String} rarity - The rarity to increment
     * @returns {void}
     */
    increment(rarity) {
        const current = this.result.get(rarity) || 0;
        this.result.set(rarity, current + 1);
    }

    /**
     * Checks if the result contains a specific rarity.
     * @param {String} rarity - The rarity to check
     * @returns {Boolean} - True if the rarity exists and its count is greater than 0, otherwise false
     */
    has(rarity) {
        return this.result.has(rarity) && this.result.get(rarity) > 0;
    }

    /**
     * Gets the count for a specific rarity.
     * @param {String} rarity - The rarity to get the count for
     * @return {Number} - The count of the rarity, or 0 if it does not exist
     */
    get(rarity) {
        return this.result.get(rarity) || 0;
    }
}

class Gambler {
    /**
     * Creates a new Gambler instance.
     * @param {String} uid - Unique identifier for the gambler
     * @param {GamblerFramework} gfw - Instance of the GamblerFramework
     */
    constructor(uid, gfw) {
        if(!uid) {
            throw new Error("UID is required for Gambler");
        }
        this.coins = 10;
        this.uid = uid;
        this.gfw = gfw;
        this.base_luck = GamblerFramework.MIN_LUCK;
        this.stats = {
            luck: this.base_luck,
            level: 1,
            exp: 0,
            inventory: [],
            equipment: {
                head: null,
                body: null,
                legs: null,
                feet: null,
                hands: null,
                weapon: null,
            },
            totalAttempts: 0,
        };
    }

    // test method
    getRandomItem(){
        this.stats.totalAttempts++;
        let result = this.gfw.getRandomRarity(1, this.stats.luck).result;
        result = [...result.entries()].find(([_, value]) => value !== 0)[0];
        return result;
    }
}

class Item {
    constructor(name, rarity) {
        this.name = name;
        this.rarity = rarity;
    }
}