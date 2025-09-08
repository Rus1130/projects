// async function runLoop() {
//     for (let i = 0; i < 5; i++) {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec
//         console.log("Step", i);
//     }
//     console.log("Done!");
// }

class FroggyScript3 {
    static matches = [
        ["str_concat", / \. /],
        ["digit", /[0-9]/],
        ["string1", /"/],
        ["string2", /'/],
        ["mathStart", /\{/],
        ["mathEnd", /\}/],
        ["parenStart", /\(/],
        ["parenEnd", /\)/],
        ["bracketStart", /\[/],
        ["bracketEnd", /\]/],
        ["comment", /#/],
        ["assignment", / = /],
        ["character", /[A-Za-z_]/],
        ["comma", /,/],
        ["method", / > /],
        ["whitespace", /[ \t]/],
        ["other", /.{1}/]
    ]
    
    constructor(options) {
        options = options || {};
        this.setOutputFunction(options.out);
        this.setErrorOutputFunction(options.errout);
    }

    setOutputFunction(fn) {
        this.out = fn || console.log;
    }

    setErrorOutputFunction(fn) {
        this.errout = fn || console.error;
    }

    tokenize(lines){
        const tokens = [];

        lines.forEach(line => {
            let pos = 0;
            let iterations = 0;
            let matched = false;
            let lineTokens = [];

            while(pos < line.length){
                for (const [type, base] of FroggyScript3.matches){
                    const regex = new RegExp(base.source, 'y');
                    regex.lastIndex = pos;
                    const match = regex.exec(line);

                    if(match){
                        pos += match[0].length;
                        lineTokens.push({type, value: match[0], position: pos});
                        matched = true;
                        break;
                    }

                    if(iterations++ > 100_000){
                        this.errout("Infinite loop detected during tokenization at position " + pos);
                        return null;
                    }
                }
            }

            for(let i = 0; i < lineTokens.length; i++){
                let current = lineTokens[i];
                let previous = lineTokens[i-1];

                if(!previous) continue;

                // if the previous type is string1Word_inprogress and the current type is anything, append the current value to the previous value
                if(previous.type == "string1Word_inprogress" && current.type != "string1"){
                    previous.value += current.value;
                    lineTokens.splice(i, 1);
                    i--;
                }

                if(previous.type == "string1" && current.type == "character"){
                    previous.value += current.value;
                    previous.type = "string1Word_inprogress";
                    lineTokens.splice(i, 1);
                    i--;
                }


                if(previous.type == "string1Word_inprogress" && current.type == "string1"){
                    previous.type = "string1Word";
                    lineTokens.splice(i, 1);
                    i--;
                }

                // if((previous.type === "character" || previous.type === "identifier") && current.type === "character"){
                //     previous.value += current.value;
                //     previous.type = "identifier";
                //     lineTokens.splice(i, 1);
                //     i--;
                // }

                if((previous.type === "digit" || previous.type === "number") && current.type === "digit"){
                    previous.value += current.value;
                    previous.type = "number";
                    lineTokens.splice(i, 1);
                    i--;
                }
            }

            tokens.push(lineTokens);
        })

        return tokens;
    }
}

// runLoop();