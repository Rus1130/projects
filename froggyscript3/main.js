class FS3Error {
    constructor(type, message, line, col){
        this.type = type;
        this.message = message;
        this.line = line;
        this.col = col;
    }
}

class FS3Warn {
    constructor(type, message, line, col){
        this.type = type;
        this.message = message;
        this.line = line;
        this.col = col;
    }
}

class FroggyScript3 {
    static matches = [
        ["comment", /#.*/],                                    // rest of line
        ["number", /[0-9]+(?:\.[0-9]+)?/],                     // ints and floats
        ["variable", /[A-Za-z_][A-Za-z0-9_]*/],              // names
        ["string", /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/],     // "..." or '...' with escapes
        ["str_concat", / \. /],
        ["math_equation", /\{(?:[^{}\\]|\\.)*\}/],
        ["paren_start", /\(/],
        ["paren_end", /\)/],
        ["bracket_start", /\[/],
        ["bracket_end", /\]/],
        ["assignment", / = /],
        ["comma", /,/],
        ["method_indicator", />/],
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
        this.variables = {
            0: {}
        };
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

    interpret(code) {
        const lines = code.split('\n');
        const tokens = this.tokenize(lines);

        if(tokens instanceof FS3Error) return this.errout(tokens);

        let compacted = this.compact(tokens);

        console.log(compacted)
    }

    compact(tokens){
        // if tokens includes a token with type method_indicator
        
        for(let lineNo = 0; lineNo < tokens.length; lineNo++){
        }
        return tokens;
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
                                end: pos + value.length,
                                methods: []
                            });
                        }
                        pos += value.length;
                        break;
                    }
                }

                if (!matched) {
                    tokens.push(new FS3Error("TokenizationError", `Unrecognized token ->${line[pos]}<-.`, lineNo, pos));
                    break;
                }
            }

            tokens.push(lineTokens);
        });

        for(let lineNo = 0; lineNo < tokens.length; lineNo++){
            let _tokens = tokens[lineNo];
            if(_tokens instanceof FS3Error) break;

            // if _tokens is the type of FS3Error or FS3Warn
            if(_tokens instanceof FS3Warn) {
                this.warnout(_tokens);
            }

            // if the first token is a type variable, change it to type keyword
            if(_tokens[0] && _tokens[0].type === "variable"){
                _tokens[0].type = "keyword"; 
            }


            _tokens.forEach((token, i) => {
                let prev = _tokens[i-1];
                let current = _tokens[i];
                let next = _tokens[i+1];

                if(prev && prev.type == "method_indicator" && current.type == "variable"){
                    tokens[lineNo][i].type = "method"
                }
            })
        }

        // filter out FS3Warn tokens
        tokens.forEach((t, i) => {
            if(t instanceof FS3Warn){
                tokens.splice(i, 1);
            }
        }); 

        let error = null;

       // if fs3error, return it
        for(let i = 0; i < tokens.length; i++){
            if(tokens[i] instanceof FS3Error){
                error = tokens[i];
                break;
            }
        }
        

        return error == null ? tokens : error;
    }
}