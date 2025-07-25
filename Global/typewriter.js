class Typewriter {
   /**
    * @param {String} inputID ID of the element whose textContent will be typed
    * @param {String} outputID ID of the element where the text will be typed in innerHTML
    * 
    * @param {Object} [options] options object
    * @param {String} [options.newlineDelimiter="|"] inserts newline (default |)
    * @param {String} [options.breakDelimiter="~"] inserts linebreak (default ~)
    * 
    * @param {String} [options.styleItalics="/"] surround text with character to italicize (/text/)
    * @param {String} [options.styleBold="*"] surround text with character to bold (*text*)
    * @param {String} [options.styleUnderline="_"] envelop text by a pair to apply underline format (_text_)
    * @param {String} [options.styleStrikethrough="-"] envelop text by a pair to apply strikethrough format (-text-)
    * @param {String} [options.styleEscape="\\"] prefix character you want to escape (\text) Note: cannot escape the line break character
    * 
    * @param {String} [options.increaseDelayChar="«"] increases the delay (default «)
    * @param {String} [options.decreaseDelayChar="»"] decreases the delay (default »)
    * 
    * @param {String} [options.endChar="¶"] ends the text (default ¶)
    * 
    * @param {Number} [options.newlineDelay=0] delay after newline (ms) (default 0)
    * @param {Number} [options.breakDelay=0] delay after line break (ms) (default 0)
    * @param {Number} [options.charDelay=100] delay after character (ms) (default 100)
    * @param {Object<string, number>} [options.customDelays] custom delays for specific characters
    * 
    * @param {Boolean} [options.stringInput=false] if true, the inputID will be treated as the string to display rather than an element (default false)
    * 
    * @param {Function} [options.onFinish] fires after finishing typing
    * 
    * @description Creates a typewriter effect for text
    */
    constructor(inputID, outputID, options){
        if(options == undefined) options = {};
        this.options = {};
        this.control = {};
        this.format = {};

        options.stringInput == undefined ? this.options.stringInput = false : this.options.stringInput = options.stringInput;

        // control
        options.endChar == undefined ? this.options.endChar = "¶" : this.options.endChar = options.endChar;
        options.increaseDelayChar == undefined ? this.options.increaseDelayChar = "«" : this.options.increaseDelayChar = options.increaseDelayChar;

        // formatting
        options.newlineDelimiter == undefined ? this.options.newlineDelimiter = "|" : this.options.newlineDelimiter = options.newlineDelimiter;
        options.breakDelimiter == undefined ? this.options.breakDelimiter = "~" : this.options.breakDelimiter = options.breakDelimiter;
        
        // style
        options.styleItalics == undefined ? this.options.styleItalics = "/" : this.options.styleItalics = options.styleItalics;
        options.styleBold == undefined ? this.options.styleBold = "*" : this.options.styleBold = options.styleBold;
        options.styleUnderline == undefined ? this.options.styleUnderline = "_" : this.options.styleUnderline = options.styleUnderline;
        options.styleStrikethrough == undefined ? this.options.styleStrikethrough = "-" : this.options.styleStrikethrough = options.styleStrikethrough;
        options.styleEscape == undefined ? this.options.styleEscape = "\\" : this.options.styleEscape = options.styleEscape;

        // delays
        options.newlineDelay == undefined ? this.options.newlineDelay = 0 : this.options.newlineDelay = options.newlineDelay;
        options.breakDelay == undefined ? this.options.breakDelay = 0 : this.options.breakDelay = options.breakDelay;
        options.charDelay == undefined ? this.options.charDelay = 100 : this.options.charDelay = options.charDelay;
        options.customDelays == undefined ? this.options.customDelays = {} : this.options.customDelays = options.customDelays;

        // functions
        options.onFinish == undefined ? this.onFinish = function(){} : this.onFinish = options.onFinish;

        this.inputEl = document.getElementById(inputID);
        this.outputEl = document.getElementById(outputID);

        this.plaintext = this.options.stringInput ? inputID : this.inputEl.textContent;
        this.text = this.plaintext.split(this.options.breakDelimiter);

        if(!this.options.stringInput) this.inputEl.style.display = "none";

        // control
        this.control.index = 0;
        this.control.line = 0;
        this.control.isPaused = false;
        this.control.isFinished = false;

        // formatting
        this.format.isItalic = false;
        this.format.isBold = false;
        this.format.isUnderline = false;
        this.format.isStrikethrough = false;

        this.format.isEscaped = false;
        this.format.escapedIndex = 0;
        this.format.escapedLine = 0;
    }

    /**
     * @description Starts the typewriter
     * @returns {void}
     */
    start() {
        // if last character isnt ¶, return error
        if(this.text[this.text.length - 1].slice(-1) != this.options.endChar) {
            console.error(`no end char`);
            return;
        }

        if (this.control.index < this.text[this.control.line].length) {
            let char = this.text[this.control.line][this.control.index];

            if(this.format.escapedIndex == this.control.index && this.format.escapedLine == this.control.line && this.format.isEscaped) {
                this.outputEl.innerHTML += char;
                this.control.index++;
                this.format.isEscaped = false;
                if(!this.control.isPaused) setTimeout(() => { 
                    this.start()
                    window.scrollTo(window.scrollX, document.body.scrollHeight);
                }, this.options.customDelays[char] || this.options.charDelay);

            } else {
                if(char == this.options.styleEscape) {
                    char = "";
                    this.format.isEscaped = true;
                    this.format.escapedIndex = this.control.index + 1;
                    this.format.escapedLine = this.control.line;
                }

                if(char == this.options.styleItalics) {
                    char = "";
                    this.format.isItalic = !this.format.isItalic;
                }

                if(char == this.options.styleBold) {
                    char = "";
                    this.format.isBold = !this.format.isBold;
                }

                if(char == this.options.styleUnderline) {
                    char = "";
                    this.format.isUnderline = !this.format.isUnderline;
                }

                if(char == this.options.styleStrikethrough) {
                    char = "";
                    this.format.isStrikethrough = !this.format.isStrikethrough;
                }

                if(char == this.options.increaseDelayChar) {
                    char = "";
                    this.options.charDelay = 110;
                    this.options.customDelays[","] = 750;
                }

                if(char == this.options.endChar) {
                    this.control.isFinished = true;
                    this.onFinish();
                    return;
                }

                if(char == " ") char = "&nbsp;";
                if(char == this.options.newlineDelimiter) {
                    this.outputEl.innerHTML += '<br>';
                    this.control.index++;
                    if(!this.isPaused) setTimeout(() => {
                        this.start()
                        window.scrollTo(window.scrollX, document.body.scrollHeight);
                    } , this.options.newlineDelay);
                } else {
                    let delay = this.options.customDelays[char] || this.options.charDelay;

                    // style
                    if(this.format.isItalic) char = "<i>" + char + "</i>";
                    if(this.format.isBold) char = "<b>" + char + "</b>";
                    if(this.format.isUnderline) char = "<u>" + char + "</u>";
                    if(this.format.isStrikethrough) char = "<s>" + char + "</s>";

                    this.outputEl.innerHTML += char;
                    this.control.index++;
                    if(!this.control.isPaused) setTimeout(() => { 
                        this.start()
                        window.scrollTo(window.scrollX, document.body.scrollHeight);
                    }, delay);
                }
            }
        } else {
            this.control.index = 0;
            this.control.line++;
            if (this.control.line < this.text.length) {
                setTimeout(() => {
                    this.outputEl.innerHTML += '<br><br>';
                    setTimeout(() => {
                        if(!this.control.isPaused) {
                            this.start();
                            window.scrollTo(window.scrollX, document.body.scrollHeight);
                        }
                    }, this.options.newlineDelay);
                }, this.options.breakDelay);
            }
        }
    }

    /**
     * @description Returns the total estimating time for the text to complete typing
     * @param {Boolean} [format=false] whether to format the time
     * @returns {Number} estimated time in ms to finish typing
     */
    // TODO: fix, isnt accurate totally ========================================================================================================
    getEstimatedTime(format){
        if(format == undefined) format = false;
        let time = 0;
        for(let i = 0; i < this.plaintext.length; i++){
            let char = this.plaintext[i];
            if(char == this.options.newlineDelimiter) time += this.options.newlineDelay;
            else if(char == this.options.breakDelimiter) time += this.options.breakDelay;
            else time += this.options.customDelays[char] || this.options.charDelay;
        }

        if(format){
            let hours = Math.floor(time / 3600000);
            let minutes = Math.floor((time % 3600000) / 60000);
            let seconds = Math.floor((time % 60000) / 1000);
            let milliseconds = time % 1000;
            return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
        } else {
            return time;
        }
    }

    /**
     * @description Sets the speed of the typewriter
     * @param {Number} delay delay in ms
     * @param {Boolean} [overrideCustomDelay=false] whether to override custom delays
     */
    setSpeed(delay, overrideCustomDelay) {
        this.options.charDelay = delay;
        if(overrideCustomDelay) for(let key in this.options.customDelays) {
            this.options.customDelays[key] = delay;
        }
    }

    /**
     * @description Pauses the typer
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * @description Resumes the typer
     */
    resume() {
        this.isPaused = false;
        this.start();
    }

    // TODO: add end function ========================================================================================================

    /**
     * @description Adds a custom delay for a specific character
     * @param {String} char character
     * @param {Number} delay delay in ms
     */
    addCustomDelay(char, delay) {
        this.options.customDelays[char] = delay;
    }
}
class Typewriter2 {
    /*
    bold: *text*
    italic: /text/
    underline: _text_
    strikethrough: -text-
    escape: \text

    new line: |
    line break: ~

    increase delay: «

    !: outputs previous character index to console

    */

    /**
     * the names "line break" and "new line" are swapped, oopsies. cant change it now.
     * @param {String} inputID ID of the element whose textContent will be typed
     * @param {String} outputID ID of the element where the text will be typed in innerHTML
     * @param {Object} options options object
     * @param {Number} [options.charDelay=100] delay after character (ms) (default 100)
     * @param {Number} [options.newlineDelay=0] delay after newline (ms) (default 0)
     * @param {Number} [options.breakDelay=0] delay after line break (ms) (default 0)
     * @param {Object<string, number>} [options.customDelays] custom delays for specific characters
     * @param {String} [options.newlineDelimiter="|"] inserts newline (default |)
     * @param {String} [options.breakDelimiter="~"] inserts linebreak (default ~)
     * @param {Boolean} [options.stringInput=false] if true, the inputID will be treated as the string to display rather than an element (default false)
     * @param {Boolean} [options.hideInput=true] hides the input element (default true)
     * @param {Function} [options.onFinish] fires after finishing typing
     * @param {Function} [options.onCharacterDisplayed] fires after each character is displayed, has one parameter token, which is the token of the char being displayed
     */
    constructor(inputID, outputID, options){
        if(options == undefined) options = {};

        options.charDelay == undefined ? options.charDelay = 100 : options.charDelay = options.charDelay;
        options.newlineDelay == undefined ? options.newlineDelay = 0 : options.newlineDelay = options.newlineDelay;
        options.breakDelay == undefined ? options.breakDelay = 0 : options.breakDelay = options.breakDelay;
        options.customDelays == undefined ? options.customDelays = {} : options.customDelays = options.customDelays;
        options.newlineDelimiter == undefined ? options.newlineDelimiter = "|" : options.newlineDelimiter = options.newlineDelimiter;
        options.breakDelimiter == undefined ? options.breakDelimiter = "~" : options.breakDelimiter = options.breakDelimiter;
        options.hideInput == undefined ? options.hideInput = true : options.hideInput = options.hideInput;
        options.stringInput == undefined ? options.stringInput = false : options.stringInput = options.stringInput;
        options.onFinish == undefined ? options.onFinish = function(){} : options.onFinish = options.onFinish;
        options.onCharacterDisplayed == undefined ? options.onCharacterDisplayed = function(token){} : options.onCharacterDisplayed = options.onCharacterDisplayed;

        let tokenObject = {
            [options.newlineDelimiter]: "newline",
            [options.breakDelimiter]: "break",
            "/": "styleItalics",
            "*": "styleBold",
            "_": "styleUnderline",
            "-": "styleStrikethrough",
            "\\": "escape",
            "«": "increaseDelay",
            "!": "outputIndex"
        };
        this.options = options;
        this.control = {
            index: 0,
            isPaused: false,
            isFinished: false,
            globalDelayChange: {},
            tokens: []
        };
        this.format = {
            isItalic: false,
            isBold: false,
            isUnderline: false,
            isStrikethrough: false,
        };


        this.inputEl = document.getElementById(inputID);
        this.outputEl = document.getElementById(outputID);

        if(this.options.hideInput) this.inputEl.style.display = "none";

        this.plaintext = this.options.stringInput ? inputID : this.inputEl.textContent;

        let charArray = this.plaintext.split("");

        charArray.forEach((char, i) => {
            let token = {
                content: char,
                type: tokenObject[char] || "displayCharacter",
                index: i,
                styles: [],
                delay: this.options.charDelay,
                color: "#000000"
            }

            if(token.type == "newline") token.delay = this.options.newlineDelay;
            if(token.type == "break") token.delay = this.options.breakDelay;
            if(this.options.customDelays[char]) token.delay = this.options.customDelays[char];

            this.control.tokens.push(token);
        });

        this.control.tokens.forEach(token => {
            if(token.type == "escape"){
                if(this.control.tokens[token.index + 1] != undefined) this.control.tokens[token.index + 1].type = "displayCharacter";
            }
        });

        this.control.tokens.forEach(token => {
            if(token.type == "escape"){
                this.control.tokens[token.index] = {
                    content: "",
                    type: "noDisplay",
                    index: token.index,
                    delay: 0,
                    styles: [],
                }
            }

            if(token.type == "increaseDelay") {
                this.control.tokens[token.index] = {
                    content: "",
                    type: "increaseDelay",
                    index: token.index,
                    styles: []
                }
                this.control.globalDelayChange = {
                    index: token.index,
                    delays: {
                        charDelay: 110,
                        customDelays: {",": 750}
                    }
                };
            }

            if(token.type == "outputIndex") {
                this.control.tokens[token.index] = {
                    content: "",
                    type: "outputIndex",
                    index: token.index,
                    styles: []
                }
            }
        });

        this.control.tokens.forEach(token => {
            if(token.type == "styleItalics") this.format.isItalic = !this.format.isItalic;
            if(token.type == "styleBold") this.format.isBold = !this.format.isBold;
            if(token.type == "styleUnderline") this.format.isUnderline = !this.format.isUnderline;
            if(token.type == "styleStrikethrough") this.format.isStrikethrough = !this.format.isStrikethrough;

            if(this.format.isItalic) this.control.tokens[token.index].styles.push("italic");
            if(this.format.isBold) this.control.tokens[token.index].styles.push("bold");
            if(this.format.isUnderline) this.control.tokens[token.index].styles.push("underline");
            if(this.format.isStrikethrough) this.control.tokens[token.index].styles.push("strikethrough");
        });

        this.control.tokens.forEach(token => {
            if(["styleItalics", "styleBold", "styleUnderline", "styleStrikethrough"].includes(token.type)) this.control.tokens[token.index] = {
                content: "",
                type: "noDisplay",
                index: token.index,
                delay: 0,
                styles: []
            }
        });

        this.control.tokens.push({
            content: "",
            type: "end",
            index: this.control.tokens.length,
            styles: [],
            delay: 0
        });

        for(let i = this.control.globalDelayChange.index; i < this.control.tokens.length; i++){
            this.control.tokens[i].delay = this.control.globalDelayChange.delays.charDelay;
            if(this.control.globalDelayChange.delays.customDelays[this.control.tokens[i].content]) this.control.tokens[i].delay = this.control.globalDelayChange.delays.customDelays[this.control.tokens[i].content];
        }
    }

    /**
     * @description adds color to a range of characters
     * @param {Number} startIndex start index
     * @param {Number} endIndex end index
     * @param {String} color color
     */
    addColor(startIndex, endIndex, color){
        this.control.tokens.forEach(token => {
            if(token.index >= startIndex && token.index <= endIndex) token.color = color;
        });
    }

    /**
     * @description sets delay after character, overwriting custom delays
     * @param {Number} speed delay (ms)
     */
    setSpeed(speed){
        this.options.charDelay = speed;
        this.options.customDelays = {};
        this.control.tokens.forEach(token => {
            this.control.tokens[token.index].delay = speed;
        });
    }

    /**
     * @description starts the typewriter
     */
    start(){
        if(this.control.index < this.control.tokens.length && !this.control.isPaused){
            let token = this.control.tokens[this.control.index];
            this.options.onCharacterDisplayed(token);
            if(token.type == "noDisplay"){
                this.control.index++;
                this.start();
            } else if(token.type == "outputIndex"){
                this.control.index++;
                this.start();
            } else {
                window.scrollTo(window.scrollX, document.body.scrollHeight);
                let char = token.content;
                if(token.color != "#000000") char = `<span style="color: ${token.color};">${token.content}</span>`;
                if(token.type == "newline") char = "<br>";
                if(token.type == "break") char = "<br><br>";
                if(token.type == "end") {
                    this.control.isFinished = true;
                    this.options.onFinish();
                    return;
                }

                if(token.styles.includes("italic")) char = `<i>${char}</i>`;
                if(token.styles.includes("bold")) char = `<b>${char}</b>`;
                if(token.styles.includes("underline")) char = `<u>${char}</u>`;
                if(token.styles.includes("strikethrough")) char = `<s>${char}</s>`;

                this.outputEl.innerHTML += char;
                this.control.index++;
                setTimeout(() => {
                    this.start();
                }, token.delay);
            }
        }
    }

    /**
     * @description pauses the typewriter
     */
    pause(){
        this.control.isPaused = true;
    }

    /**
     * @description resumes the typewriter
     */
    resume(){
        this.control.isPaused = false;
        this.start();
    }

    reset(){
        this.control.isPaused = true;
        this.control.isFinished = false;
        this.control.index = 0;
        this.outputEl.innerHTML = "";
    }
}

class Typewriter3 {
    /**
     * @param {String} text - The text to be typed.
     * @param {HTMLElement} outputElement - The HTML element where the text will be displayed.
     * @param {Object} options - Options for the typewriter effect.
     * @param {Number} [options.charDelay=100] - Delay between typing each character in milliseconds.
     * @param {Number} [options.newlineDelay=0] - Delay after typing a newline character in milliseconds.
     * @param {Object} [options.styles] - Object defining style characters.
     * @param {String} [options.styles.italic="/"] - Character to italicize text.
     * @param {String} [options.styles.bold="*"] - Character to bold text
     * @param {String} [options.styles.underline="_"] - Character to underline text.
     * @param {String} [options.styles.strikethrough="-"] - Character to strikethrough text.
     * @param {String} [options.styles.escape="\\"] - Character to escape special characters.
     * @param {Object<string, number>} [options.customDelays] - Custom delays for specific characters.
     * @param {Function} [options.onCharacterDisplayed] - Callback function that is called after each character is displayed.
     * @param {Function} [options.onFinish] - Callback function that is called after the typing is finished.
     */
    constructor(text, outputElement, options = {}) {
        const defaultOptions = {
            charDelay: 100,
            newlineDelay: 200,
            styles: {
                italic: "/",
                bold: "*",
                underline: "_",
                strikethrough: "-",
                escape: "\\",
            },
            accuracy: 1,
            customDelays: {},
            onCharacterDisplayed: function() {}, // Callback function for when a character is displayed
            onFinish: function() {}, // Callback function for when typing is finished
        };

        options = {
            charDelay: options?.charDelay || defaultOptions.charDelay,
            newlineDelay: options?.newlineDelay || defaultOptions.newlineDelay,
            styles: {
                italic: options?.styles?.italic || defaultOptions.styles.italic,
                bold: options?.styles?.bold || defaultOptions.styles.bold,
                underline: options?.styles?.underline || defaultOptions.styles.underline,
                strikethrough: options?.styles?.strikethrough || defaultOptions.styles.strikethrough,
                escape: options?.styles?.escape || defaultOptions.styles.escape,
            },
            accuracy: options?.accuracy || defaultOptions.accuracy,
            customDelays: options?.customDelays || defaultOptions.customDelays,
            onCharacterDisplayed: options?.onCharacterDisplayed || defaultOptions.onCharacterDisplayed,
            onFinish: options?.onFinish || defaultOptions.onFinish,
        };

        this.text = text;
        this.elem = outputElement;
        this.options = options;
        this.playing = false;
        this.index = 0;
        this.timeoutID = null;


        class Token {
            constructor(content, type, delay, styles) {
                this.content = content;
                this.type = type;
                this.delay = delay;
                this.styles = styles;
                this.color = "#000000";
            }
        }

        let preQueue = [...this.text].map((char, index) => new Token(char, "undecided", options.charDelay, []));

        let currentStyles = {
            italic: false,
            bold: false,
            underline: false,
            strikethrough: false,
        };

        let controlCharacters = Object.values(options.styles).filter(x => x !== options.styles.escape);

        let escaping = false;

        preQueue.forEach((token, i) => {
            if (escaping) {
                token.type = "display"; // force next character to display
                escaping = false;
                return;
            }

            if (token.content === options.styles.escape) {
                token.type = "delete"; // this will be removed later
                escaping = true;
            } else if (controlCharacters.includes(token.content)) {
                token.type = "control";
            } else {
                token.type = "display";
            }
        });

        preQueue = preQueue.filter(token => token.type !== "delete");

        preQueue.forEach((token, i) => {
            if(token.type === "control") {
                if(token.content === options.styles.italic) {
                    currentStyles.italic = !currentStyles.italic;
                    token.type = "delete";
                } else if(token.content === options.styles.bold) {
                    currentStyles.bold = !currentStyles.bold;
                    token.type = "delete";
                } else if(token.content === options.styles.underline) {
                    currentStyles.underline = !currentStyles.underline;
                    token.type = "delete";
                } else if(token.content === options.styles.strikethrough) {
                    currentStyles.strikethrough = !currentStyles.strikethrough;
                    token.type = "delete";
                }
            }

            token.styles = Object.keys(currentStyles).filter(key => currentStyles[key]);
        });

        preQueue = preQueue.filter(token => token.type !== "delete");

        this.queue = structuredClone(preQueue);

        this.queue.forEach((token, i) => {
            if(token.content === "\n") token.delay = options.newlineDelay;

            if(options.customDelays[token.content]) {
                token.delay = options.customDelays[token.content];
            }
        });
    }

    setColor(start, end, color){
        for(let i = start; i <= end; i++) {
            if(this.queue[i]) {
                this.queue[i].color = color;
            }
        }
    }

    start() {
        this.playing = true;
        if(this.index == 0) this.elem.innerHTML = "";

        if(this.timeoutID) clearTimeout(this.timeoutID);

        let typeNext = () => {
            if (this.index >= this.queue.length || !this.playing) {
                this.playing = false;
                this.options.onFinish?.();
                return;
            }

            let token = this.queue[this.index];
            let content = token.content;

            let accurate = Math.random() < this.options.accuracy;

            if(!accurate){
                let lowerEnd = -(100 - this.options.accuracy * 100)
                let higherEnd = 100 - this.options.accuracy * 100;
                
                // get a random number between lowerEnd and higherEnd, inclusive
                let random = Math.floor(Math.random() * (higherEnd - lowerEnd + 1)) + lowerEnd;

                content = String.fromCharCode(content.charCodeAt(0) + random)

            }

            if (token.styles.includes("italic")) content = `<i>${content}</i>`;
            if (token.styles.includes("bold")) content = `<b>${content}</b>`;
            if (token.styles.includes("underline")) content = `<u>${content}</u>`;
            if (token.styles.includes("strikethrough")) content = `<s>${content}</s>`;

            if (token.type === "display") {
                this.elem.innerHTML += `<span style="color: ${token.color};">${content}</span>`;
                this.options.onCharacterDisplayed?.(token);
            }

            this.index++;
            this.timeoutID = setTimeout(typeNext, token.delay);
        }

        typeNext();
    }

    pause(){
        this.playing = false;
    }

    resume(){
        if (this.index < this.queue.length) {
            this.playing = true;
            this.start();
        }
    }

    restart() {
        this.playing = false;
        this.index = 0;
        this.start();
    }
}

class ScrambleTextEffect {
    /**
     * Creates an instance of ScrambleTextEffect.
     * @param {string} inputText - The text to apply the scramble effect to.
     * @param {HTMLElement} outputElement - The HTML element where the scrambled text will be displayed.
     * @param {number} speed - The speed of the scramble effect in milliseconds.
     * @param {number} iterations - The number of iterations for scrambling each character.
     */
    constructor(inputText, outputElement, speed, iterations){
        this.inputText = inputText;
        this.outputElement = outputElement;
        this.speed = speed;
        this.iterations = iterations;
    }

    start(){
        Helper.timedLoop(this.speed * this.iterations, this.inputText.length, (i) => {
            Helper.timedLoop(this.speed, this.iterations, (j) => {
                if(j < 9) {
                    let newString = this.inputText.substring(0, i) + Helper.randomString(1);
                    this.outputElement.innerHTML = newString;
                } else {
                    let newString = this.inputText.substring(0, i + 1);
                    this.outputElement.innerHTML = newString;
                }
            });
        });
    }
}