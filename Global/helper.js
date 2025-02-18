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
     * @param {(Array|Object)} input The object to copy.
     * @returns {(Array|Object)} A copy of the object.
     */
    static copy(input) {
        if(typeof input === 'object'){
            if(Array.isArray(obinj)) return input.map(e => (e));
            else return Object.assign({}, input);
        } else return new Error('Argument is not an object');
    }

    static timeFormat(formatString, time) {
        const now = time == undefined ? new Date() : new Date(time), dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ord = n => (n % 100 >= 11 && n % 100 <= 13) ? "th" : ["st", "nd", "rd"][n % 10 - 1] || "th";

        const pad = n => String(n).padStart(2, '0'), day = now.getDate(), hr = now.getHours(), min = now.getMinutes(), sec = now.getSeconds();
        const map = {
            w: dows[now.getDay()], W: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
            y: now.getFullYear(), mn: pad(now.getMonth() + 1), mnu: now.getMonth() + 1, ms: months[now.getMonth()], M: monthsLong[now.getMonth()],
            d: pad(day), du: day, D: day + ord(day), h: pad(hr), hu: hr, H: pad((hr + 11) % 12 + 1), Hu: (hr + 11) % 12 + 1,
            m: pad(min), mu: min, s: pad(sec), su: sec, a: hr >= 12 ? 'PM' : 'AM', z: new Date().toLocaleString("en-US", { timeZoneName: "short" }).split(" ").pop()
        };
        
        return formatString.replace(/!([a-zA-Z]+)/g, "!$1").replace(/\b([a-zA-Z]+)\b/g, (m) => map[m] ?? m);
    }
}