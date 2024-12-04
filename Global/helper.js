class Helper {
    constructor() {
        return console.error(new Error('Useless to instantiate this class, all methods are static'));
    }

    static Timers = {};

    /**
     * @param {number} ms The time interval in milliseconds between each iteration.
     * @param {number} iterations The total number of iterations to execute the callback.
     * @param {function(number): void} callback A callback function that gets called on each iteration. Receives the current iteration index (starting from 0) as an argument.
     */
    static timedLoop(ms, iterations, callback) {
        let i = 0;
        let interval = setInterval(() => {
            callback(i);
            i++;
            if(i == iterations) clearInterval(interval);
        }, ms);
    }

    /**
     * @param {number} n The length of the random string to generate.
     * @returns {string} A random string of the specified length.
     */
    static randomString(n) {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]\{}|;\':\",./<>?\"';
        let result = '';
        for (let i = 0; i < n; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    /**
     * A static method to override the default `setTimeout`, `setInterval`, `clearTimeout`, 
     * and `clearInterval` functions in the browser's `window` object. This implementation 
     * keeps track of active timers by storing metadata (type, function, delay) in a static 
     * `Helper.Timers` object for debugging or management purposes.
     *
     * @example
     * // Enable the timer sniffer
     * Helper.timerSniffer();
     * 
     * // Example usage of setTimeout and setInterval
     * const timeoutId = setTimeout(() => console.log("Hello after 1 second"), 1000);
     * const intervalId = setInterval(() => console.log("Repeating every 2 seconds"), 2000);
     * 
     * // Access the Helper.Timers object to see active timers
     * console.log(Helper.Timers);
     * // Example Output:
     * // {
     * //   1: { type: "timeout", fn: [Function], delay: 1000 },
     * //   2: { type: "interval", fn: [Function], delay: 2000 }
     * // }
     * 
     * // Clear a timer
     * clearTimeout(timeoutId);
     * console.log(Helper.Timers); 
     * // Output: { 2: { type: "interval", fn: [Function], delay: 2000 } }
     * 
     * // Clear all intervals when done
     * clearInterval(intervalId);
     * 
     * @param {boolean} log Whether to log the timers to the console.
     */
    static timerSniffer(log) {
        (function(w) {
            const oldST = w.setTimeout;
            const oldSI = w.setInterval;
            const oldCI = w.clearInterval;
            
            // Replace the array with an object
            const timers = {};
            Helper.Timers = timers;
    
            w.setTimeout = function(fn, delay) {
                const id = oldST(function() {
                    if (fn) fn();
                    removeTimer(id);
                }, delay);
                timers[id] = { type: "timeout", fn, delay }
                if(log) console.warn(`[timerSniffer] Timeout ${id} created`, timers[id]);
                return id;
            };
    
            w.setInterval = function(fn, delay) {
                const id = oldSI(fn, delay);
                timers[id] = { type: "interval", fn, delay };
                if(log) console.warn(`[timerSniffer] Interval ${id} created`, timers[id]);
                return id;
            };
    
            w.clearInterval = function(id) {
                oldCI(id);
                removeTimer(id);
            };
    
            w.clearTimeout = w.clearInterval;
    
            function removeTimer(id) {
                if (timers[id]) delete timers[id];
                if(log) console.warn(`[timerSniffer] Timer ${id} destroyed`);
            }
        })(window);
    }
}