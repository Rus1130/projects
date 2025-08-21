// async function runLoop() {
//     for (let i = 0; i < 5; i++) {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec
//         console.log("Step", i);
//     }
//     console.log("Done!");
// }

class FroggyScript3 {
    static matches = {
        "/[0-9]/": "digit",
        "/[ \t]/": "whitespace",
        "/\"/": "string1",
        "/\'/": "string2",
        "/\\{/": "mathStart",
        "/\\}/": "mathEnd",
        "/\\(/": "parenStart",
        "/\\)/": "parenEnd",
        "/\\[/": "bracketStart",
        "/\\]/": "bracketEnd",
        "/#/": "comment",
        "/=/": "assignment",
        "/[A-Za-z_]/": "character",
        "/[!@$%^&*\\-+|;:,.<>/?]/": "symbol",
    }

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

    tokenize(input){
        const textLines = input.split('\n');

        const lines = [];

        textLines.forEach((line, index) => {
            const trimmedLine = line.trim();
            lines.push([]);
            trimmedLine.split('').forEach((char, charIndex) => {
                for (const [pattern, type] of Object.entries(FroggyScript3.matches)) {
                    const regex = new RegExp(pattern.slice(1, -1)); // Remove slashes
                    if (regex.test(char)) {
                        lines[lines.length - 1].push({
                            type: type,
                            value: char,
                            line: index ,
                            stringIndex: charIndex,
                            lineIndex: index + charIndex,
                        });
                        return; // Stop after the first match
                    }
                }
            })
        })

        console.log(lines)
    }
}

// runLoop();