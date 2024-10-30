class Typewriter {
    static HTMLEncode(s){
        let el = document.createElement("div");
        el.textContent = s;
        el.innerText = el.textContent;
        s = el.innerHTML;
        return s;
    }
   /**
    * @param {String} inputID ID of the element whose textContent will be typed
    * @param {String} outputID ID of the element where the text will be typed in innerHTML
    * 
    * @param {Object} [options] options object
    * @param {String} [options.newlineDelimiter="|"] inserts newline (default |)
    * @param {String} [options.breakDelimiter="~"] inserts linebreak (default ~)
    * 
    * @param {String} [options.styleItalics="/"] envelop text by a pair to apply italics format (default /)
    * @param {String} [options.styleBold="*"] envelop text by a pair to apply bold format (default *)
    * @param {String} [options.styleUnderline="_"] envelop text by a pair to apply underline format (default _)
    * @param {String} [options.styleStrikethrough="-"] envelop text by a pair to apply strikethrough format (default -)
    * @param {String} [options.styleEscape="\\"] envelop text by a pair to escape formatting (default \\) Note: the line break character and the character chosen for this setting cannot be escaped
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

        // TODO: add character escaping; use HTMLEncode ========================================================================================================

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
    }

    /**
     * @description Starts the typewriter
     * @returns {void}
     */
    start() {
        // if last character isnt ¶, return error
        if(this.text[this.text.length - 1].slice(-1) != this.options.endChar && !this.format.isEscaped) {
            console.error(`Last character of text must be ${this.options.endChar} (yes i could append it myself im just doing this to troll you)`);
            return;
        }

        if (this.control.index < this.text[this.control.line].length) {
            let char = this.text[this.control.line][this.control.index];


            if(char == this.options.styleEscape) {
                char = "";
                this.format.isEscaped = !this.format.isEscaped;
            } 
            if(char == this.options.styleItalics && !this.format.isEscaped) {
                char = "";
                this.format.isItalic = !this.format.isItalic;
            }

            if(char == this.options.styleBold && !this.format.isEscaped) {
                char = "";
                this.format.isBold = !this.format.isBold;
            }

            if(char == this.options.styleUnderline && !this.format.isEscaped) {
                char = "";
                this.format.isUnderline = !this.format.isUnderline;
            }

            if(char == this.options.styleStrikethrough && !this.format.isEscaped) {
                char = "";
                this.format.isStrikethrough = !this.format.isStrikethrough;
            }

            if(char == this.options.increaseDelayChar && !this.format.isEscaped) {
                char = "";
                this.options.charDelay = 110;
                this.options.customDelays[","] = 750;
            }

            if(char == this.options.endChar && !this.format.isEscaped) {
                this.control.isFinished = true;
                this.onFinish();
                return;
            }

            if(char == " ") char = "&nbsp;";
            if(char == this.options.newlineDelimiter && !this.format.isEscaped) {
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
     * @description Sets the speed of the typewriter, overwriting all custom delays
     * @param {Number} delay delay in ms
     */
    setSpeed(delay) {
        this.options.charDelay = delay;
        for(let key in this.options.customDelays) {
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