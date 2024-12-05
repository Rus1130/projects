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
     * @param {Object} options options object
     * @param {boolean} [options.enableAllOptions=false] set all log options to true
     * @param {boolean} [options.logIntervalCreation=false] log interval creation
     * @param {boolean} [options.logTimeoutCreation=false] log timeout creation
     * @param {boolean} [options.logTimerDistruction=false] log timer destruction
     * @param {boolean} [options.logIntervalCall=false] log interval call
     * @param {boolean} [options.logTimeoutCall=false] log timeout call
     * @param {Array<number>} [options.intervalIDsToLog=[]] will only log interval calls with these ids
     * @param {Array<number>} [options.timeoutIDsToLog=[]]  will only log timeout calls with these ids
     * @param {Array<number>} [options.intervalIDsToExclude=[]] will suppress interval call logging for these ids
     * @param {Array<number>} [options.timeoutIDsToExclude=[]] will suppress timeout call logging for these ids
     */
    static timerSniffer(options) {
        if(options == undefined) options = {};
        const opts = {
            enableAllOptions: options.enableAllOptions == undefined ? false : options.enableAllOptions,
            logIntervalCreation: options.logIntervalCreation == undefined ? false : options.logIntervalCreation,
            logTimeoutCreation: options.logTimeoutCreation == undefined ? false : options.logTimeoutCreation,
            logTimerDistruction: options.logTimerDistruction == undefined ? false : options.logTimerDistruction,
            logIntervalCall: options.logIntervalCall == undefined ? false : options.logIntervalCall,
            logTimeoutCall: options.logTimeoutCall == undefined ? false : options.logTimeoutCall,
            intervalIDsToLog: options.intervalIDsToLog == undefined ? [] : options.intervalIDsToLog,
            timeoutIDsToLog: options.timeoutIDsToLog == undefined ? [] : options.timeoutIDsToLog,
            intervalIDsToExclude: options.intervalIDsToExclude == undefined ? [] : options.intervalIDsToExclude,
            timeoutIDsToExclude: options.timeoutIDsToExclude == undefined ? [] : options.timeoutIDsToExclude
        };

        if(opts.enableAllOptions) {
            for(const key in opts) {
                if(key == 'timeoutIDsToLog' ||
                key == 'intervalIDsToLog' ||
                key == 'enableAllOptions' ||
                key == 'intervalIDsToExclude' ||
                key == 'timeoutIDsToExclude') continue;
                opts[key] = true;
            }
        }

        (function(w) {
            const oldST = w.setTimeout;
            const oldSI = w.setInterval;
            const oldCI = w.clearInterval;
            
            // Replace the array with an object
            const timers = {};
            Helper.Timers = timers;

            Helper.TimerDebugStartingTime = Date.now();

            function timestamp() {
                return `%c [timerSniffer ${Date.now()-Helper.TimerDebugStartingTime}ms]`;
            }

            if(opts.intervalIDsToLog.length != 0) console.log(`${timestamp()}%c Intervals with ID ${opts.intervalIDsToLog.join()} will only be logged`, "color: orange", "color: grey; font-style: italic;");
            if(opts.timeoutIDsToLog.length != 0) console.log(`${timestamp()}%c Intervals with ID ${opts.intervalIDsToLog.join()} will only be logged`,  "color: orange","color: grey; font-style: italic;");
            if(opts.intervalIDsToExclude.length != 0) console.log(`${timestamp()}%c Intervals with ID ${opts.intervalIDsToExclude.join()} will be excluded from logging`, "color: orange", "color: grey; font-style: italic;");
            if(opts.timeoutIDsToExclude.length != 0) console.log(`${timestamp()}%c Intervals with ID ${opts.timeoutIDsToExclude.join()} will be excluded from logging`, "color: orange", "color: grey; font-style: italic;");
    
            w.setTimeout = function(fn, delay) {
                const id = oldST(function() {
                    if (fn) fn();
                    if(opts.logTimeoutCall && timers[id]){
                        if(opts.timeoutIDsToLog.length != 0) {
                            if(opts.timeoutIDsToExclude.includes(id) == false) {
                                if(opts.timeoutIDsToLog.includes(id)) console.log(`${timestamp()}%c Timeout with ID of p${id}] called`, "color: orange", "color: blue;"); 
                            }
                        } else if(opts.timeoutIDsToExclude.includes(id) == false) console.log(`${timestamp()}%c Timeout with ID of [${id}] called`, "color: orange", "color: blue;");
                    }
                    removeTimer(id);
                }, delay);
                timers[id] = { type: "timeout", fn, delay }
                if(opts.logTimeoutCreation) console.log(`${timestamp()}%c Timeout with ID of [${id}] created`, "color: orange", "color: green;", timers[id])
                return id;
            };
    
            w.setInterval = function(fn, delay) {
                const id = oldSI(() => { 
                    fn();
                    if(opts.logIntervalCall){
                        if(opts.intervalIDsToLog.length != 0) {
                            if(opts.intervalIDsToExclude.includes(id) == false) {
                                if(opts.intervalIDsToLog.includes(id)) console.log(`${timestamp()}%c Interval with ID of [${id}] called`, "color: orange", "color: blue;"); 
                            }
                        } else if(opts.intervalIDsToExclude.includes(id) == false) console.log(`${timestamp()}%c Interval with ID of [${id}] called`, "color: orange", "color: blue;");
                    }
                }, delay);
                timers[id] = { type: "interval", fn, delay };
                if(opts.logIntervalCreation) console.log(`${timestamp()}%c Interval with ID of [${id}] created`, "color: orange", "color: green;", timers[id]);
                return id;
            };
    
            w.clearInterval = function(id) {
                oldCI(id);
                removeTimer(id);
            };
    
            w.clearTimeout = w.clearInterval;
    
            function removeTimer(id) {
                if (timers[id]) {
                    if(opts.logTimerDistruction) console.log(`${timestamp()}%c Timer type [${timers[id].type}] and ID [${id}] destroyed`, "color: orange", "color: red;");
                    delete timers[id];
                }
            }
        })(window);
    }
}