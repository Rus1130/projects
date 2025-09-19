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

        let compacted = [];

        for(let i = 0; i < tokens.length; i++){
            compacted.push(this.compact(tokens[i]))
        }

        // if any of the compacted lines is an FS3Error, return it
        for(let i = 0; i < compacted.length; i++){
            if(compacted[i] instanceof FS3Error){
                return this.errout(compacted[i]);
            }
        }

        console.log(compacted)
    }
//i mean, detect if >methodname(
    // its like SUUUPER fucked
compact(line) {
    function parseExpression(tokens, i, inArgMethod = false) {
        let expr = [];

        while (i < tokens.length) {
            let token = tokens[i];
            if (!token) break;

            if (token.type === "method_indicator") {
                let target = expr.pop();
                let methodName = tokens[i + 1];
                if (!target || !methodName) break;

                let [args, newI, err] = parseArgs(tokens, i + 2);
                if (err) return [null, null, err];

                // Rule: if we are inside a method with arguments, and this method has arguments, it's invalid
                if (args.length > 0) {
                    return [null, null, new FS3Error(
                        "InvalidNestedMethod",
                        `Method '${methodName.value}' with arguments cannot be inside another method with arguments`,
                        methodName.line,
                        methodName.col
                    )];
                }

                if (!target.methods) target.methods = [];
                target.methods.push({
                    name: methodName.value,
                    args
                });

                expr.push(target);
                i = newI;
                continue;
            }

            if (token.type === "paren_end" || token.type === "bracket_end") {
                break;
            }

            expr.push(token);
            i++;
        }

        return [expr, i, null];
    }

    function parseArgs(tokens, i) {
        let args = [];

        if (!tokens[i] || tokens[i].type !== "paren_start") {
            return [[], i, null]; // no arguments
        }
        i++; // skip "("

        let current = [];
        let hasComma = false;

        while (i < tokens.length) {
            let token = tokens[i];
            if (!token) break;

            if (token.type === "paren_end") {
                if (current.length > 0) {
                    let [parsed, , err] = parseExpression(current, 0, true); // mark inArgMethod = true
                    if (err) return [null, null, err];
                    args.push(...parsed);
                }
                i++;
                break;
            }

            if (token.type === "comma") {
                hasComma = true;
                if (current.length > 0) {
                    let [parsed, , err] = parseExpression(current, 0, true); // mark inArgMethod = true
                    if (err) return [null, null, err];
                    args.push(...parsed);
                    current = [];
                }
                i++;
                continue;
            }

            current.push(token);
            i++;
        }

        return [args, i, null];
    }

    const [parsed, , err] = parseExpression(line, 0, false);
    if (err) return err;
    return parsed;
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
                                col: pos,
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