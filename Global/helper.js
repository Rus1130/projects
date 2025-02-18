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

    static timeFormat(formatString) {
        const now = new Date();

        const dowListShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dowListLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthListShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthListLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dayOfWeekShort = dowListShort[now.getDay()];
        const dayOfWeekLong = dowListLong[now.getDay()];

        const year = now.getFullYear();

        const monthNumber = String(now.getMonth() + 1).padStart(2, '0');
        const monthNumberUnpadded = String(now.getMonth() + 1);
        const monthShort = monthListShort[now.getMonth()];
        const monthLong = monthListLong[now.getMonth()]; 

        const day = String(now.getDate()).padStart(2, '0');
        const dayUnpadded = String(now.getDate());
        const ordinalDay = String(now.getDate()) + getOrdinalSuffix(+day);

        const hour24 = String(now.getHours()).padStart(2, '0');
        const hour12 = String((now.getHours() + 11) % 12 + 1).padStart(2, '0');
        const hour24Unpadded = String(now.getHours());
        const hour12Unpadded = String((now.getHours() + 11) % 12 + 1);

        const minute = String(now.getMinutes()).padStart(2, '0');
        const minuteUnpadded = String(now.getMinutes());

        const second = String(now.getSeconds()).padStart(2, '0');
        const secondUnpadded = String(now.getSeconds());

        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

        const timezone = new Date().toLocaleString(["en-US"], {timeZoneName: "short"}).split(" ").pop();

        function getOrdinalSuffix(num) {
            if (typeof num !== "number" || isNaN(num)) return "";

            let lastDigit = num % 10;
            let lastTwoDigits = num % 100;

            if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
                return "th";
            }

            switch (lastDigit) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        }

        let dateTemplate = formatString;

        // totally not ai
        const replacements = [
            { char: 'w', value: dayOfWeekShort },
            { char: 'W', value: dayOfWeekLong },

            { char: 'y', value: year },

            { char: 'mn', value: monthNumber },
            { char: 'mnu', value: monthNumberUnpadded },
            { char: "m", value: monthShort },
            { char: "M", value: monthLong },

            { char: 'd', value: day },
            { char: 'du', value: dayUnpadded },
            { char: "D", value: ordinalDay },

            { char: 'h', value: hour24 },
            { char: 'hu', value: hour24Unpadded },
            { char: 'H', value: hour12 },
            { char: 'Hu', value: hour12Unpadded },

            { char: 'm', value: minute },
            { char: 'mu', value: minuteUnpadded },

            { char: 's', value: second },
            { char: 'su', value: secondUnpadded },

            { char: 'a', value: ampm },

            { char: 'z', value: timezone },
        ];

        let replacementMap = Object.fromEntries(replacements.map(({ char, value }) => [char, value]));

        let dateString = dateTemplate.replace(/!([a-zA-Z]+)/g, "!$1") // Preserve escaped characters
            .replace(/\b([a-zA-Z]+)\b/g, (match) => replacementMap[match] ?? match); // Replace only whole words

        return dateString;
    }
}