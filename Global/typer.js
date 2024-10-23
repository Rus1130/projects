class Typer {
    /*
    options.newlineDelimiter (default: '_')
    options.breakDelimiter (default: '~')
    options.customDelays = {char: delay}
    options.onFinish = function(){}


    prefix ^ to italicize word
    » to speed up

    end with ¶
    */
    constructor(inputID, outputID, options){
        this.inputEl = document.getElementById(inputID);
        this.outputEl = document.getElementById(outputID);
        this.text = this.inputEl.innerText.split(options.breakDelimiter || '~');
        this.index = 0;
        this.line = 0;
        this.speed = options.speed || 100;
        this.newlineDelimiter = options.newlineDelimiter || '_';
        this.breakDelimiter = options.breakDelimiter || '~';
        this.newlineDelay = options.newlineDelay || 0;
        this.breakDelay = options.breakDelay || 0;
        this.customDelays = options.customDelays;
        this.onFinish = options.onFinish;

        this.italic = false;
    }

    typeNextChar() {
        window.scrollTo(0, document.body.scrollHeight);
        if (this.index < this.text[this.line].length) {
            let char = this.text[this.line][this.index];

            if(char == "^") {
                char = "";
                this.italic = true;
            }

            if(char == "»") {
                char = "";
                this.speed = 110;
                this.customDelays[","] = 750;
            }

            if(char == "¶") {
                this.finished = true;
                this.onFinish();
                return;
            }

            if(this.italic && [" ", "."].includes(char)) this.italic = false;

            if(char == " ") char = "&nbsp;";
            if(char == this.newlineDelimiter){
                this.outputEl.innerHTML += '<br>';
                this.index++;
                setTimeout(() => this.typeNextChar(), this.newlineDelay);
            } else {
                let delay = this.customDelays[char] || this.speed;
                if(this.italic) char = "<i>" + char + "</i>";
                this.outputEl.innerHTML += char;
                this.index++;
                setTimeout(() => this.typeNextChar(), delay);
            }
        } else {
            this.index = 0;
            this.line++;
            if (this.line < this.text.length) {
                setTimeout(() => {
                    this.outputEl.innerHTML += '<br><br>';
                    setTimeout(() => {
                        this.typeNextChar();
                    }, this.newlineDelay);
                }, this.breakDelay);
            }
        }
    }

    start() {
        this.typeNextChar();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

}