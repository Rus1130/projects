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
    * @param {Function} [options.onFinish] fires after finishing typing
    * 
    * @description Creates a typewriter effect for text
    */
    constructor(inputID, outputID, options){
        if(options == undefined) options = {};
        this.options = {};
        this.control = {};
        this.format = {};

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

        this.plaintext = this.inputEl.textContent;
        this.text = this.plaintext.split(this.options.breakDelimiter);

        this.inputEl.style.display = "none";

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
            console.error(`Last character of text must be ${this.options.endChar} (yes i could append it myself im just doing this to troll you)`);
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
     * 
     * @param {String} inputID ID of the element whose textContent will be typed
     * @param {String} outputID ID of the element where the text will be typed in innerHTML
     * @param {Object} options options object
     * @param {Number} [options.charDelay=100] delay after character (ms) (default 100)
     * @param {Number} [options.newlineDelay=0] delay after newline (ms) (default 0)
     * @param {Number} [options.breakDelay=0] delay after line break (ms) (default 0)
     * @param {Object<string, number>} [options.customDelays] custom delays for specific characters
     * @param {String} [options.newlineDelimiter="|"] inserts newline (default |)
     * @param {String} [options.breakDelimiter="~"] inserts linebreak (default ~)
     * @param {Boolean} [options.hideInput=true] hides the input element (default true)
     * @param {Function} [options.onFinish] fires after finishing typing
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
        options.onFinish == undefined ? options.onFinish = function(){} : options.onFinish = options.onFinish;

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
            globalDelayChange: {}
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

        this.plaintext = this.inputEl.textContent;

        let charArray = this.plaintext.split("");

        this.tokens = [];
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

            this.tokens.push(token);
        });

        this.tokens.forEach(token => {
            if(token.type == "escape"){
                if(this.tokens[token.index + 1] != undefined) this.tokens[token.index + 1].type = "displayCharacter";
            }
        });

        this.tokens.forEach(token => {
            if(token.type == "escape"){
                this.tokens[token.index] = {
                    content: "",
                    type: "noDisplay",
                    index: token.index,
                    delay: 0,
                    styles: [],
                }
            }

            if(token.type == "increaseDelay") {
                this.tokens[token.index] = {
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
                this.tokens[token.index] = {
                    content: "",
                    type: "outputIndex",
                    index: token.index,
                    styles: []
                }
            }
        });

        this.tokens.forEach(token => {
            if(token.type == "styleItalics") this.format.isItalic = !this.format.isItalic;
            if(token.type == "styleBold") this.format.isBold = !this.format.isBold;
            if(token.type == "styleUnderline") this.format.isUnderline = !this.format.isUnderline;
            if(token.type == "styleStrikethrough") this.format.isStrikethrough = !this.format.isStrikethrough;

            if(this.format.isItalic) this.tokens[token.index].styles.push("italic");
            if(this.format.isBold) this.tokens[token.index].styles.push("bold");
            if(this.format.isUnderline) this.tokens[token.index].styles.push("underline");
            if(this.format.isStrikethrough) this.tokens[token.index].styles.push("strikethrough");
        });

        this.tokens.forEach(token => {
            if(["styleItalics", "styleBold", "styleUnderline", "styleStrikethrough"].includes(token.type)) this.tokens[token.index] = {
                content: "",
                type: "noDisplay",
                index: token.index,
                delay: 0,
                styles: []
            }
        });

        this.tokens.push({
            content: "",
            type: "end",
            index: this.tokens.length,
            styles: [],
            delay: 0
        });

        for(let i = this.control.globalDelayChange.index; i < this.tokens.length; i++){
            this.tokens[i].delay = this.control.globalDelayChange.delays.charDelay;
            if(this.control.globalDelayChange.delays.customDelays[this.tokens[i].content]) this.tokens[i].delay = this.control.globalDelayChange.delays.customDelays[this.tokens[i].content];
        }
    }

    addColor(startIndex, endIndex, color){
        this.tokens.forEach(token => {
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
        this.tokens.forEach(token => {
            this.tokens[token.index].delay = speed;
        });
    }

    /**
     * @description starts the typewriter
     */
    start(){
        if(this.control.index < this.tokens.length && !this.control.isPaused){
            let token = this.tokens[this.control.index];
            if(token.type == "noDisplay"){
                this.control.index++;
                this.start();
            } else if(token.type == "outputIndex"){
                console.log(this.control.index - 1);
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
}