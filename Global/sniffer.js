class AllSniffer {
    /**
     * @example
     * // timer only
     * new AllSniffer({eventOptions: {enableAllOptions: false}});
     * 
     * // event only
     * new AllSniffer({timerOptions: {enableAllOptions: false}});
     */
    constructor(options) {
        if(options == undefined) options = {};
        if(options.timerOptions == undefined) options.timerOptions = {};
        if(options.eventOptions == undefined) options.eventOptions = {};

        if(options.timerOptions.enableAllOptions == undefined) options.timerOptions.enableAllOptions = true;
        if(options.eventOptions.enableAllOptions == undefined) options.eventOptions.enableAllOptions = true;

        new TimerSniffer(options.timerOptions);
        new EventSniffer(options.eventOptions);
    }
}

/**
 * A class that overrides the default `setTimeout`, `setInterval`, `clearTimeout`, and `clearInterval`
 * functions in the browser's `window` object. This implementation keeps track of active timers by storing
 * metadata (type, function, delay) in a static `TimerSniffer.timers` object for debugging or management purposes.
 */
class TimerSniffer {
    static timers;
    static startTime = Date.now();
    static timestamp() {
        return `%c [timerSniffer ${Date.now()-TimerSniffer.startTime}ms]`;
    }
    /**
    * @example
    * // Enable the timer sniffer
    * new Sniffer();
    * 
    * // Example usage of setTimeout and setInterval
    * const timeoutId = setTimeout(() => console.log("Hello after 1 second"), 1000);
    * const intervalId = setInterval(() => console.log("Repeating every 2 seconds"), 2000);
    * 
    * // Access the Sniffer.timers object to see active timers
    * console.log(Sniffer.timers);
    * // Example Output:
    * // {
    * //   1: { type: "timeout", fn: [Function], delay: 1000 },
    * //   2: { type: "interval", fn: [Function], delay: 2000 }
    * // }
    * 
    * // Clear a timer
    * clearTimeout(timeoutId);
    * console.log(Sniffer.timers); 
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
    constructor(options) {
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

        function run(w) {
            const oldST = w.setTimeout;
            const oldSI = w.setInterval;
            const oldCI = w.clearInterval;
            
            // Replace the array with an object
            const timers = {};
            TimerSniffer.timers = timers;

            if(opts.intervalIDsToLog.length != 0) console.log(`${TimerSniffer.timestamp()}%c calls from Intervals with ID ${opts.intervalIDsToLog.join()} will only be logged`, "color: orange", "color: grey; font-style: italic;");
            if(opts.timeoutIDsToLog.length != 0) console.log(`${TimerSniffer.timestamp()}%c calls from Timeouts with ID ${opts.intervalIDsToLog.join()} will only be logged`,  "color: orange","color: grey; font-style: italic;");
            if(opts.intervalIDsToExclude.length != 0) console.log(`${TimerSniffer.timestamp()}%c Intervals with ID ${opts.intervalIDsToExclude.join()} will be excluded from call logging`, "color: orange", "color: grey; font-style: italic;");
            if(opts.timeoutIDsToExclude.length != 0) console.log(`${TimerSniffer.timestamp()}%c Timeouts with ID ${opts.timeoutIDsToExclude.join()} will be excluded from call logging`, "color: orange", "color: grey; font-style: italic;");
    
            w.setInterval = function(fn, delay) {
                const id = oldSI(() => { 
                    if(opts.logIntervalCall){
                        if(opts.intervalIDsToLog.length != 0) {
                            if(opts.intervalIDsToExclude.includes(id) == false) {
                                if(opts.intervalIDsToLog.includes(id)) console.log(`${TimerSniffer.timestamp()}%c Interval with ID of [${id}] called`, "color: orange", "color: blue;", timers[id]); 
                            }
                        } else if(opts.intervalIDsToExclude.includes(id) == false) console.log(`${TimerSniffer.timestamp()}%c Interval with ID of [${id}] called`, "color: orange", "color: blue;", timers[id]);
                    }
                    fn();
                }, delay);

                let location = new Error().stack.split("\n");
                location.shift();
                
                location.forEach((line, i) => {
                    location[i] = location[i].split("").reverse().join("").trim().split("").reverse().join("");
                });

                timers[id] = {
                    type: "interval",
                    fn: fn,
                    delay: delay,
                    location: location
                };

                if(opts.logIntervalCreation) console.log(`${TimerSniffer.timestamp()}%c Interval with ID of [${id}] created`, "color: orange", "color: green;", timers[id]);
                return id;
            };

            w.setTimeout = function(fn, delay) {
                const id = oldST(function() {
                    if (fn) fn();
                    if(opts.logTimeoutCall && timers[id]){
                        if(opts.timeoutIDsToLog.length != 0) {
                            if(opts.timeoutIDsToExclude.includes(id) == false) {
                                if(opts.timeoutIDsToLog.includes(id)) console.log(`${TimerSniffer.timestamp()}%c Timeout with ID of p${id}] called`, "color: orange", "color: blue;", timers[id]); 
                            }
                        } else if(opts.timeoutIDsToExclude.includes(id) == false) console.log(`${TimerSniffer.timestamp()}%c Timeout with ID of [${id}] called`, "color: orange", "color: blue;", timers[id]);
                    }
                    removeTimer(id);
                }, delay);

                let location = new Error().stack.split("\n");
                location.shift();
                
                location.forEach((line, i) => {
                    location[i] = location[i].split("").reverse().join("").trim().split("").reverse().join("");
                });

                timers[id] = {
                    type: "timeout",
                    fn: fn, 
                    delay: delay,
                    location: location
                }

                if(opts.logTimeoutCreation) console.log(`${TimerSniffer.timestamp()}%c Timeout with ID of [${id}] created`, "color: orange", "color: green;", timers[id])
                return id;
            };
    
            w.clearInterval = function(id) {
                oldCI(id);
                removeTimer(id);
            };
    
            w.clearTimeout = w.clearInterval;
    
            function removeTimer(id) {
                if (timers[id]) {
                    if(opts.logTimerDistruction) console.log(`${TimerSniffer.timestamp()}%c Timer type [${timers[id].type}] and ID [${id}] destroyed`, "color: orange", "color: red;");
                    delete timers[id];
                }
            }
        }

        run(window);
    }
}

/**
 * A class that overrides the `addEventListener` and `removeEventListener` methods of the `EventTarget` prototype.
 * It provides additional logging and tracking functionalities for event listeners, such as logging their creation, 
 * destruction, and calls. Additionally, it allows filtering logs based on specific eventIDs.
 * This class also adds many static methods. NOTE: This class will only log events that are added after the class is instantiated.
 */
class EventSniffer {
    static events;
    static eventIDIncrementer = 0;
    static startTime = Date.now();

    static timestamp() {
        return `%c [eventSniffer ${Date.now()-EventSniffer.startTime}ms]`;
    }

    static logCreated(id, obj) {
        console.log(`${EventSniffer.timestamp()}%c Event listener with EventsID [${id}] created`, "color: darkBlue", "color: green;", obj);
    } 
    static logCalled(id, type, obj) {
        console.log(`${EventSniffer.timestamp()}%c Event listener with EventsID [${id}] and type [${type}] called`, "color: darkBlue", "color: blue;", obj);
    }
    static logDestroyed(id, obj) {
        console.log(`${EventSniffer.timestamp()}%c Event listener with EventsID [${id}] destroyed`, "color: darkBlue", "color: red;", obj);
    }

    static logErrorAttemptFailed(fn) {
        console.error(`${EventSniffer.timestamp()}%c Attempted to delete event listener, failed (may not exist)`, "color: darkBlue", "color: darkRed", {fn});
    }
    static logErrorDNE(id) {
        console.error(`${EventSniffer.timestamp()}%c Event listener with EventID [${id}] does not exist`, "color: darkBlue", "color: darkRed");
    }


    /*
         * @param {number[]} [options.eventTypesToLog=[]] A list of specific event types to log. If set, only these event types will be logged.
         * @param {number[]} [options.eventTypesToExclude=[]] A list of specific event types to exclude from logging.
    */
    /**
     * Creates an instance of `EventSniffer`.
     * This constructor modifies the global `EventTarget` prototype's `addEventListener` and `removeEventListener` methods.
     * 
     * @constructor
     * @param {Object} [options] Configuration options for the `EventSniffer`.
     * @param {boolean} [options.enableAllOptions=false] If true, enables all logging options by default.
     * @param {boolean} [options.logEventCreation=false] If true, logs the creation of event listeners.
     * @param {boolean} [options.logEventDestruction=false] If true, logs the destruction of event listeners.
     * @param {boolean} [options.logEventCall=false] If true, logs every call to an event listener.
     * @param {boolean} [options.logErrors=false] If true, logs errors.
     * @param {number[]} [options.eventIDsToLog=[]] A list of specific eventIDs to log. If set, only these eventIDs will be logged.
     * @param {number[]} [options.eventIDsToExclude=[]] A list of specific eventIDs to exclude from logging.
     *
     * @example
     * // Create an instance with logging options
     * const sniffer = new EventSniffer({
     *   logEventCreation: true,
     *   logEventDestruction: true,
     *   logEventCall: true,
     *   eventIDsToLog: [1, 2],
     * });
     *
     * // Add an event listener
     * document.body.addEventListener('click', () => console.log('Body clicked'));
     * 
     * // Access all registered events
     * console.log(EventSniffer.events);
     * 
     * // Remove an event listener using its eventID
     * removeEventListenerByEventID(1);
     * 
     * // Check if an event listener with a specific eventID exists
     * console.log(eventWithIDExists(2));
     */
    constructor(options) {
        if(options == undefined) options = {};
        const opts = {
            enableAllOptions: options.enableAllOptions == undefined ? false : options.enableAllOptions,
            logEventCreation: options.logEventCreation == undefined ? false : options.logEventCreation,
            logEventDestruction: options.logEventDestruction == undefined ? false : options.logEventDestruction,
            logEventCall: options.logEventCall == undefined ? false : options.logEventCall,
            logErrors: options.logErrors == undefined ? false : options.logErrors,
            eventIDsToLog: options.eventIDsToLog == undefined ? [] : options.eventIDsToLog,
            eventIDsToExclude: options.eventIDsToExclude == undefined ? [] : options.eventIDsToExclude,
            // eventTypesToLog: options.eventTypesToLog == undefined ? [] : options.eventTypesToLog,
            // eventTypesToExclude: options.eventTypesToExclude == undefined ? [] : options.eventTypesToExclude
        }

        if(opts.enableAllOptions) {
            for(const key in opts) {
                if(key == 'eventIDsToLog' ||
                key == 'eventIDsToExclude' ||
                key == 'enableAllOptions' ||
                key == 'eventTypesToLog' ||
                key == 'eventTypesToExclude') continue;
                opts[key] = true;
            }
        }

        function run(w) {
            const oldAddEventListener = w.EventTarget.prototype.addEventListener;
            const oldRemoveEventListener = w.EventTarget.prototype.removeEventListener;
            const events = {};
            EventSniffer.events = events;

            if(opts.eventIDsToLog.length != 0) console.log(`${EventSniffer.timestamp()}%c calls from Events with EventID ${opts.eventIDsToLog.join()} will only be logged`, "color: darkViolet", "color: grey; font-style: italic;");
            if(opts.eventIDsToExclude.length != 0) console.log(`${EventSniffer.timestamp()}%c Events with EventID ${opts.eventIDsToExclude.join()} will be excluded from call logging`, "color: darkViolet", "color: grey; font-style: italic;");

            w.EventTarget.prototype.addEventListener = function(type, fn, options) {
                let location = new Error().stack.split("\n");
                location.shift();
                
                location.forEach((line, i) => {
                    location[i] = location[i].split("").reverse().join("").trim().split("").reverse().join("");
                });

                events[fn] = {
                    type: type,
                    fn: fn,
                    options: options,
                    eventID: EventSniffer.eventIDIncrementer,
                    location: location,
                    event: null
                }

                oldAddEventListener.call(this, type, (event) => {
                    if(events[fn] == undefined) return; // doesnt actually remove the event listener, just makes it so it cannot be called
                    const eventObject = events[fn];
                    if(opts.logEventCall){
                        // // if the filter is not empty
                        // if(opts.eventTypesToLog.length != 0) {
                        //     // if the event type is not in the exclude list
                        //     if(opts.eventTypesToExclude.includes(eventObject.type) == false) {
                        //         // if the event type is in the include list
                        //         if(opts.eventTypesToLog.includes(eventObject.type)) EventSniffer.logCalled(eventObject.eventID, eventObject.type, eventObject);
                        //     }
                        //     // if the event type is in the exclude list
                        // } else if(opts.eventTypesToExclude.includes(eventObject.type) == false) EventSniffer.logCalled(eventObject.eventID, eventObject.type, eventObject);

                        // if the filter is not empty
                        if(opts.eventIDsToLog.length != 0) {
                            // if the event id is not in the exclude list
                            if(opts.eventIDsToExclude.includes(eventObject.eventID) == false) {
                                // if the event id is in the include list
                                if(opts.eventIDsToLog.includes(eventObject.eventID)) EventSniffer.logCalled(eventObject.eventID, eventObject.type, eventObject);
                            }
                            // if the event id is in the exclude list
                        } else if(opts.eventIDsToExclude.includes(eventObject.eventID) == false) EventSniffer.logCalled(eventObject.eventID, eventObject.type, eventObject);
                    }
                    fn.call(this, event);
                    eventObject.event = event;
                }, options);
                EventSniffer.eventIDIncrementer++;
                if(opts.logEventCreation) EventSniffer.logCreated(events[fn].eventID, events[fn]);
            }

            w.EventTarget.prototype.removeEventListener = function(type, fn, op) {
                const eventNotFound = events[fn] == undefined;

                let eventProperties = {
                    type: type,
                    fn: fn,
                    options: op,
                    eventID: eventNotFound ? null : events[fn].eventID,
                    event: null
                }

                if(eventNotFound) {
                    if(opts.logErrors) EventSniffer.logErrorAttemptFailed(fn);
                    return;
                } else {
                    if(opts.logEventDestruction) EventSniffer.logDestroyed(eventProperties.eventID, eventProperties);
                    oldRemoveEventListener.call(this, type, fn, op);
                    delete events[fn];
                }
            }

            // static methods ========================================
            // putting them here makes it easy to access options bc i dont feel like putting the options on the class

            /**
             * Removes an event listener by its eventID.
             * @param {number} eventID The eventID of the event listener to remove.
             * @returns {void}
             * @example
             * EventSniffer.removeEventListenerByEventID(1);
             */
            EventSniffer.removeEventListenerByEventID = function(eventID) {
                let eventProperties = {}
                for(const key in events) {
                    if(events[key].eventID == eventID) {
                        eventProperties = events[key];
                    }
                }

                if(eventProperties.fn == undefined) {
                    if(opts.logErrors) EventSniffer.logErrorDNE(eventID);
                    return;
                } else {
                    if(opts.logEventDestruction) EventSniffer.logDestroyed(eventID, eventProperties);
                    oldRemoveEventListener.call(w, eventProperties.type, eventProperties.fn);   
                    delete events[eventProperties.fn];
                }   
            }

            /**
             * Checks if an event listener with a specific eventID exists.
             * @param {number} eventID The eventID to check for.
             * @returns {boolean} Returns true if an event listener with the specified eventID exists. 
             * @example
             * console.log(EventSniffer.eventWithIDExists(1));
             */
            EventSniffer.eventWithIDExists = function(eventID) {
                let exists = false;
                for(const key in events) {
                    if(events[key].eventID == eventID) exists = true;
                }
                return exists;
            }

            EventSniffer.getEventByEventID = function(eventID) {
                let eventProperties = {}
                for(const key in events) {
                    if(events[key].eventID == eventID) {
                        eventProperties = events[key];
                    }
                }
                return eventProperties;
            }
            // ========================================================
        }
        run(window);
    }
}
// new AllSniffer();