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

        console.log(compacted)
    }

    // its like SUUUPER fucked
    compact(line) {
        // parseExpression(tokens, start, inArgs)
        // returns [nodesArray, nextIndex, error]
        function parseExpression(tokens, start = 0, inArgs = false) {
            const expr = [];
            let i = start;

            while (i < tokens.length) {
                const token = tokens[i];
                if (!token) break;

                if (token.type === "method_indicator") {
                    const target = expr.pop();
                    const methodNameIndex = i + 1;
                    const methodName = tokens[methodNameIndex];

                    if (!target || !methodName) {
                        return [null, null, new FS3Error(
                            "ParseError",
                            'Missing target or method name after ">"',
                            token.line || 0,
                            token.col || 0
                        )];
                    }

                    // parseArgs consumes the method name and any "(...)" and returns [args, nextIndex, err]
                    const [args, newPos, parseErr] = parseArgs(tokens, methodNameIndex);
                    if (parseErr) return [null, null, parseErr];

                    // if we're inside an argument list and the nested method has args -> error
                    if (inArgs && args.length > 0) {
                        return [null, null, new FS3Error(
                            "InvalidNestedMethod",
                            `Nested method '${methodName.value}' with arguments is not allowed inside arguments`,
                            token.line || 0,
                            token.col || 0
                        )];
                    }

                    expr.push({
                        type: "methodCall",
                        target,
                        name: methodName.value,
                        args
                    });

                    i = newPos; // position after method name and its args (if any)
                    continue;
                }

                // end of grouped expression
                if (token.type === "paren_end" || token.type === "bracket_end") {
                    break;
                }

                expr.push(token);
                i++;
            }

            return [expr, i, null];
        }

        // parseArgs(tokens, methodNameIndex)
        // methodNameIndex points at the method-name token
        // returns [ argsArray, nextIndex, error ]
        function parseArgs(tokens, methodNameIndex) {
            const args = [];
            const afterMethod = methodNameIndex + 1;

            // no "(" -> no args; consume method name only
            if (!tokens[afterMethod] || tokens[afterMethod].type !== "paren_start") {
                return [[], afterMethod, null];
            }

            // there is a "(" -> parse until matching ')'
            let i = afterMethod + 1; // inside parens
            let current = [];

            while (i < tokens.length) {
                const token = tokens[i];
                if (!token) break;

                // closing paren -> finalize the final current chunk
                if (token.type === "paren_end") {
                    if (current.length > 0) {
                        const [parsedNodes, , err] = parseExpression(current, 0, true);
                        if (err) return [null, null, err];
                        if (parsedNodes.length === 1) args.push(parsedNodes[0]);
                        else args.push(...parsedNodes);
                    }
                    i++; // consume ')'
                    break;
                }

                // comma -> end current arg
                if (token.type === "comma") {
                    if (current.length > 0) {
                        const [parsedNodes, , err] = parseExpression(current, 0, true);
                        if (err) return [null, null, err];
                        if (parsedNodes.length === 1) args.push(parsedNodes[0]);
                        else args.push(...parsedNodes);
                        current = [];
                    } else {
                        // empty argument between commas — ignore or push placeholder if you want
                    }
                    i++; // consume ','
                    continue;
                }

                current.push(token);
                i++;
            }

            // i is now index after ')'
            return [args, i, null];
        }

        const [parsed, , err] = parseExpression(line, 0, false);
        if (err) return err;   // return the FS3Error instead of throwing
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
                                // start: pos,
                                // end: pos + value.length,
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