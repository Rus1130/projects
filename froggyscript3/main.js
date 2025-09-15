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
                    let warn = new FS3Warn("TokenizationError", `Unrecognized token ->${line[pos]}<-. Token will be ignored.`, lineNo, pos);
                    tokens.push(warn);
                    break;
                }
            }

            tokens.push(lineTokens);
        });

        tokens.forEach((_tokens, lineNo) => {
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

            for(let i = 0; i < _tokens.length; i++){
                let token = _tokens[i];
                if(token.type == "method_indicator"){

                    let target = _tokens[i-1];
                    let methodName = _tokens[i+1];
                    let hasArguments = _tokens[i+2] ? _tokens[i+2].type == "paren_start" ? true : false : false

                    if(hasArguments == false){
                        // tokens[lineNo][i-1].methods.push({name: methodName.value, arguments: "none"})
                        // remove this and next index
                        // tokens[lineNo]
                    }
                }
            }
        })

        console.log(tokens)

        return tokens;
    }
}