class Typewriter {
    /*
    options.newlineDelimiter (default: '_')
    options.breakDelimiter (default: '~')
    options.customDelays = {char: delay}
    options.onFinish = function(){}


    prefix ^ to italicize word
    « to slow down

    end with ¶
    */
   /**
    * 
    * @param {String} inputID ID of the element whose textContent will be typed
    * @param {String} outputID ID of the element where the text will be typed in innerHTML
    * 
    * @param {Object} [options] options object
    * @param {String} [options.newlineDelimiter="_"] delegates where to put a newline (default _)
    * @param {String} [options.breakDelimiter="~"] delegates where to put a break (default ~)
    * @param {String} [options.italicizeChar="^"] italicizes the next word (default ^)
    * @param {String} [options.increaseDelayChar="«"] increases the delay (default «)
    * @param {String} [options.decreaseDelayChar="»"] decreases the delay (default »)
    * @param {String} [options.endChar="¶"] ends the text (default ¶)
    * @param {Number} [options.newlineDelay=0] delay in ms to wait before resuming typing after a newline (default 0)
    * @param {Number} [options.breakDelay=0] delay in ms to wait before resuming typing after a line break (default 0)
    * @param {Number} [options.charDelay=100] delay in ms to wait before typing next character (default 100)
    * @param {Object<string, number>} options.customDelays custom delays for specific characters
    * @param {Function} options.onFinish fires after finishing typing
    */
    constructor(inputID, outputID, options){
        this.options = {};
        this.options.newlineDelimiter = options.newlineDelimiter || '_';
        this.options.breakDelimiter = options.breakDelimiter || '~';
        this.options.italicizeChar = options.italicizeChar || '^';
        this.options.increaseDelayChar = options.increaseDelayChar || '«';
        this.options.endChar = options.endChar || '¶';
        this.options.newlineDelay = options.newlineDelay || 0;
        this.options.breakDelay = options.breakDelay || 0;
        this.options.charDelay = options.charDelay || 100;
        this.options.customDelays = options.customDelays || {};
        this.onFinish = options.onFinish || function(){};

        this.inputEl = document.getElementById(inputID);
        this.outputEl = document.getElementById(outputID);
        this.text = this.inputEl.textContent.split(this.options.breakDelimiter);
        this.plaintext = this.inputEl.textContent;

        this.inputEl.style.display = "none";

        this.index = 0;
        this.line = 0;
        this.isItalic = false;
        this.isPaused = false;
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

        if (this.index < this.text[this.line].length) {
            let char = this.text[this.line][this.index];

            if(char == this.options.italicizeChar) {
                char = "";
                this.isItalic = true;
            }

            if(char == this.options.increaseDelayChar) {
                char = "";
                this.options.charDelay = 110;
                this.options.customDelays[","] = 750;
            }

            if(char == this.options.endChar) {
                this.finished = true;
                this.onFinish();
                return;
            }
            
            if(this.isItalic && [" ", ".", "?", "!", ":", ";", "(", "[", "{", ")", "]", "}", "'", '"'].includes(char)) this.isItalic = false;

            if(char == " ") char = "&nbsp;";
            if(char == this.options.newlineDelimiter){
                this.outputEl.innerHTML += '<br>';
                this.index++;
                if(!this.isPaused) setTimeout(() => {
                    this.start()
                    window.scrollTo(window.scrollX, document.body.scrollHeight);
                } , this.options.newlineDelay);
            } else {
                let delay = this.options.customDelays[char] || this.options.charDelay;
                if(this.isItalic) char = "<i>" + char + "</i>";
                this.outputEl.innerHTML += char;
                this.index++;
                if(!this.isPaused) setTimeout(() => { 
                    this.start()
                    window.scrollTo(window.scrollX, document.body.scrollHeight);
                }, delay);
            }
        } else {
            this.index = 0;
            this.line++;
            if (this.line < this.text.length) {
                setTimeout(() => {
                    this.outputEl.innerHTML += '<br><br>';
                    setTimeout(() => {
                        if(!this.isPaused) {
                            this.start();
                            window.scrollTo(window.scrollX, document.body.scrollHeight);
                        }
                    }, this.options.newlineDelay);
                }, this.options.breakDelay);
            }
        }
    }

    /**
     * @description Returns the estimated time to finish typing
     * @returns {Number} estimated time in ms to finish typing
     */
    getEstimatedTime(){
        let time = 0;
        for(let i = 0; i < this.plaintext.length; i++){
            let char = this.plaintext[i];
            if(char == this.options.newlineDelimiter) time += this.options.newlineDelay;
            else if(char == this.options.breakDelimiter) time += this.options.breakDelay;
            else time += this.options.customDelays[char] || this.options.charDelay;
        }
        return time;
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

    /**
     * @description Adds a custom delay for a specific character
     * @param {String} char character
     * @param {Number} delay delay in ms
     */
    addCustomDelay(char, delay) {
        this.options.customDelays[char] = delay;
    }
}