class FroggyScript3 {
    static matches = [
        ["comment", /#.*/],                                    // rest of line
        ["number", /[0-9]+(?:\.[0-9]+)?/],                     // ints and floats
        ["variable", /[A-Za-z_][A-Za-z0-9_]*/],              // names
        ["string", /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/],     // "..." or '...' with escapes
        ["str_concat", / \. /],
        ["mathStart", /\{/],
        ["mathEnd", /\}/],
        ["parenStart", /\(/],
        ["parenEnd", /\)/],
        ["bracketStart", /\[/],
        ["bracketEnd", /\]/],
        ["assignment", / = /],
        ["comma", /,/],
        ["method", />/],
        ["whitespace", /\s+/],
    ]
    
    constructor(options) {
        options = options || {};
        this.setOutputFunction(options.out);
        this.setErrorOutputFunction(options.errout);
        this.setWarnOutputFunction(options.warnout);

        /*
            scope: {
                name: {
                    value: ...,
                    type: "num" | "str" | "arr",
                    mutable: true | false
                }
            } 
        */
        this.variables = {};
    }

    setOutputFunction(fn) {
        this.out = fn || console.log;
    }

    setErrorOutputFunction(fn) {
        this.errout = fn || console.error;
    }

    setWarnOutputFunction(fn) {
        this.warnout = fn || console.warn;
    }

    tokenize(lines) {
        const tokens = [];

        lines.forEach((line, lineNo) => {
            let pos = 0;
            const lineTokens = [];

            while (pos < line.length) {
                let matched = false;

                for (const [type, base] of FroggyScript3.matches) {
                    const regex = new RegExp(base.source, 'y'); // sticky
                    regex.lastIndex = pos;
                    const m = regex.exec(line);

                    if (m) {
                        matched = true;
                        const value = m[0];
                        // skip whitespace tokens by default
                        if (type !== "whitespace") {
                            lineTokens.push({
                                type,
                                value,
                                line: lineNo,
                                start: pos,
                                end: pos + value.length
                            });
                        }
                        pos += value.length;
                        break;
                    }
                }

                if (!matched) {
                    this.warnout(`Unrecognized token at line ${lineNo+1} pos ${pos}: "${line.slice(pos)}". Token will be ignored.`);
                    // break the line's scanning to avoid infinite loop
                    break;
                }
            }

            tokens.push(lineTokens);
        });

        tokens.forEach((tokens, lineNo) => {
            // if the first token is a type variable, change it to type keyword
            if(tokens[0] && tokens[0].type === "variable"){
                tokens[0].type = "keyword"; 
            }
        })

        return tokens;
    }
}