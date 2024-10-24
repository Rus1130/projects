class Typer {
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
    * @param {String} inputID 
    * @param {String} outputID 
    * 
    * @param {Object} [options] options object
    * @param {String} options.newlineDelimiter delegates where to put a newline (default _)
    * @param {String} options.breakDelimiter delegates where to put a break (default ~)
    * @param {String} options.italicize italicizes the next word (default ^)
    * @param {String} options.increaseDelayChar increases the delay (default «)
    * @param {String} options.endChar ends the text (default ¶)
    * @param {Number} options.newlineDelay delay in ms to wait before resuming typing (default 0)
    * @param {Number} options.breakDelay delay in ms to wait before resuming typing (default 0)
    * @param {Number} options.charDelay delay in ms to wait before typing next character (default 100)
    * @param {Object<string, number>} options.customDelays custom delays for specific characters
    * @param {Function} options.onFinish fires after finishing typing
    */
    constructor(inputID, outputID, options){
        this.newlineDelimiter = options.newlineDelimiter || '_';
        this.breakDelimiter = options.breakDelimiter || '~';
        this.italicize = options.italicize || '^';
        this.increaseDelayChar = options.increaseDelayChar || '«';
        this.endChar = options.endChar || '¶';
        this.newlineDelay = options.newlineDelay || 0;
        this.breakDelay = options.breakDelay || 0;
        this.charDelay = options.charDelay || 100;
        this.customDelays = options.customDelays || {};
        this.onFinish = options.onFinish || function(){};

        this.inputEl = document.getElementById(inputID);
        this.outputEl = document.getElementById(outputID);
        this.text = this.inputEl.innerText.split(this.breakDelimiter);
        this.plaintext = this.inputEl.innerText;

        this.index = 0;
        this.line = 0;
        this.italic = false;
        this.paused = false;
    }

    start() {
        // if last character isnt ¶, return error
        if(this.text[this.text.length - 1].slice(-1) != this.endChar) {
            console.error(`Last character of text must be ${this.endChar} (yes i could append it myself im just doing this to troll you)`);
            return;
        }

        if (this.index < this.text[this.line].length) {
            let char = this.text[this.line][this.index];

            if(char == this.italicize) {
                char = "";
                this.italic = true;
            }

            if(char == this.increaseDelayChar) {
                char = "";
                this.charDelay = 110;
                this.customDelays[","] = 750;
            }

            if(char == this.endChar) {
                this.finished = true;
                this.onFinish();
                return;
            }
            
            if(this.italic && [" ", "."].includes(char)) this.italic = false;

            if(char == " ") char = "&nbsp;";
            if(char == this.newlineDelimiter){
                this.outputEl.innerHTML += '<br>';
                this.index++;
                if(!this.paused) setTimeout(() => {
                    this.start()
                    window.scrollTo(window.scrollX, document.body.scrollHeight);
                } , this.newlineDelay);
            } else {
                let delay = this.customDelays[char] || this.charDelay;
                if(this.italic) char = "<i>" + char + "</i>";
                this.outputEl.innerHTML += char;
                this.index++;
                if(!this.paused) setTimeout(() => { 
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
                        if(!this.paused) {
                            this.start();
                            window.scrollTo(window.scrollX, document.body.scrollHeight);
                        }
                    }, this.newlineDelay);
                }, this.breakDelay);
            }
        }
    }

    /**
     * 
     * @returns {Number} estimated time in ms to finish typing
     */
    getEstimatedTime(){
        let time = 0;
        for(let i = 0; i < this.plaintext.length; i++){
            let char = this.plaintext[i];
            if(char == this.newlineDelimiter) time += this.newlineDelay;
            else if(char == this.breakDelimiter) time += this.breakDelay;
            else time += this.customDelays[char] || this.charDelay;
        }
        return time;
    }
    setSpeed(delay) {
        this.charDelay = delay;
    }

    /**
     * @description Pauses the typer
     */
    pause() {
        this.paused = true;
    }

    /**
     * @description Resumes the typer
     */
    resume() {
        this.paused = false;
        this.start();
    }
}