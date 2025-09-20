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

class Method {
    static table = {};
    constructor(name, parentTypes, args, fn){
        this.parentTypes = parentTypes;
        this.args = args;
        this.fn = fn;

        Method.table[name] = this;
    }

    static get(name){
        return Method.table[name] || null;
    }
}

class Keyword {
    static table = {};
    constructor(name, argTypes, fn){
        this.argTypes = argTypes;
        this.fn = fn;
        Keyword.table[name] = this;
    }

    static get(name){
        return Keyword.table[name] || null;
    }
}

// {type: ['number'], optional: false}

new Method('concat', ['string'], [{type: ['string'], optional: false}], (parent, args, interpreter) => {
    parent.value = parent.value + args[0].value;
    return parent;
});

new Method("type", ["any"], [], (parent, args, interpreter) => {
    let type = structuredClone(parent.type);
    
    parent.value = type;
    parent.type = "string";

    return parent;
});

new Keyword("out", [{type: ['any'], optional: false}], (args, interpreter) => {
    interpreter.out(args[0].value);
});

class FroggyScript3 {
    static matches = [
        ["comment", /#.*/],
        ["number", /[0-9]+(?:\.[0-9]+)?/],
        ["variable", /[A-Za-z_][A-Za-z0-9_]*/],
        ["string", /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/],
        ["math_equation", /\{(?:[^{}\\]|\\.)*\}/],
        ["paren_start", /\(/],
        ["paren_end", /\)/],
        ["assignment", / = /],
        ["comma", /,/],
        ["method_indicator", />/],
        ["whitespace", /\s+/],
        ["array_start", /\[/],
        ["array_end", /\]/],
        ["func_return_value", /!return/]
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

    walkMethods(node, callback) {
        // If this node is a list of arguments (array), walk each element.
        if (Array.isArray(node)) {
            for (const arg of node) {
                const err = this.walkMethods(arg, callback);
                if (err instanceof FS3Error) return err;
            }
            return null;
        }

        // Visit this node’s methods if it has any.
        if (node && node.methods && node.methods.length) {
            for (const m of node.methods) {
                // Run the callback for this method.
                const result = callback(m, node);
                if (result instanceof FS3Error) return result;

                // Walk each argument of the method recursively.
                for (const arg of m.args) {
                    const err = this.walkMethods(arg, callback);
                    if (err instanceof FS3Error) return err;
                }
            }
        }

        return null;
    }

    interpret(code) {
        const lines = code.split('\n');
        let tokens = null;
        try {
            tokens = this.tokenize(lines);
        } catch (err) {
            if(err instanceof FS3Error){
                return this.errout(err);
            }
        }

        if(tokens instanceof FS3Error) return this.errout(tokens);

        let compacted = [];

        for(let i = 0; i < tokens.length; i++){
            try {
                compacted.push(this.compact(tokens[i]))
            } catch (err) {
                if(err instanceof FS3Error){
                    return this.errout(err);
                }
                break;
            }
            
        }



        let parsedTokens = this.methodCoalescer(compacted);

        if(parsedTokens == undefined) return;

        this.keywordExecutor(parsedTokens);
    }


    keywordExecutor(parsedTokens){
        for(let lineNo = 0; lineNo < parsedTokens.length; lineNo++){
            let line = parsedTokens[lineNo];

            let keyword = null;
            if(line[0].type == "keyword") keyword = line[0].value;

            if(!keyword) continue;

            let lineArgs = line.slice(1);

            let keywordDef = Keyword.get(keyword);
            if(!keywordDef){
                return this.errout(new FS3Error("RuntimeError", `Unknown keyword [${keyword}]`, line[0].line, line[0].col));
            }
            // Validate arguments
            if(keywordDef.argTypes){
                for(let i = 0; i < keywordDef.argTypes.length; i++){
                    const expected = keywordDef.argTypes[i];
                    const actual = lineArgs[i];
                    if(!actual){
                        if(!expected.optional){
                            return this.errout(new FS3Error("ArgumentError", `Missing argument ${i+1} for keyword [${keyword}]`, line[0].line, line[0].col));
                        }
                        continue; // skip further checks for this arg
                    }
                    if(expected.type && !expected.type.includes(actual.type) && !(expected.type.includes("any"))){
                        return this.errout(new FS3Error("ArgumentTypeError", `Invalid type for argument ${i+1} of keyword [${keyword}]: expected [${expected.type.join(" or ")}], got [${actual.type}]`, actual.line, actual.col));
                    }
                }
            }
            try {
                keywordDef.fn(lineArgs, this);
            } catch (e) {
                return this.errout(new FS3Error("JavaScriptError", `Error executing keyword [${keyword}]: ${e.message}`, line[0].line, line[0].col));
            }
        }
    }

  

    methodCoalescer(compacted){
            const err = this.walkMethods(compacted, (method, parent) => {
            // Validate method exists
            if(Method.get(method.name) === null){
                return new FS3Error("ReferenceError",
                    `Unknown method [${method.name}]`,
                    parent.line, parent.col);
            }

            let methodDef = Method.get(method.name);
            
            // Validate method arguments
            if (methodDef.args) {
                for (let i = 0; i < methodDef.args.length; i++) {
                    const expected = methodDef.args[i];
                    const actual = method.args[i];

                    if (!actual) {
                        if (!expected.optional) {
                            return new FS3Error("ArgumentError",
                                `Expected argument [${i+1}] for method [${method.name}] to be of type [${expected.type.join(" or ")}], but found none`,
                                method.line, method.col);
                        }
                        continue; // skip further checks for this arg
                    }
                    if (expected.type && !expected.type.includes(actual.type) && !(expected.type.includes("any"))) {
                        return new FS3Error("TypeError",
                            `Invalid type for argument [${i+1}] for method [${method.name}]: expected [${expected.type.join(" or ")}], got [${actual.type}]`,
                            actual.line, actual.col);
                    }
                }
            }

            // Validate parent type
            if (methodDef.parentType && !methodDef.parentType.includes(parent.type)) {
                return new FS3Error("TypeError",
                    `Invalid parent type for method [${method.name}]: expected [${methodDef.parentType.join(" or ")}], got [${parent.type}]`,
                    parent.line, parent.col);
            }

            // Call the method
            try {
                let returnValue = methodDef.fn(parent, method.args, this);
                if(returnValue instanceof FS3Error) {
                    returnValue.message = `In method [${method.name}]: ${returnValue.message}`;
                    return returnValue;
                }
                if (returnValue) {
                    // Replace parent with returnValue in place
                    parent.type = returnValue.type;
                    parent.value = returnValue.value;
                }
            } catch (e) {
                return new FS3Error("JavaScriptError",
                    `Error executing method [${method.name}]: ${e.message}`,
                    method.line, method.col);
            }
        });
        if (err instanceof FS3Error) return this.errout(err);

        return compacted;
    }

    compact(lineTokens) {
        // Helper to parse arguments inside parentheses
        const parseArgs = (tokens, startIndex) => {
            let args = [];
            let currentArg = [];
            let depth = 0;
            let i = startIndex;

            for (; i < tokens.length; i++) {
                const t = tokens[i];
                if (t.type === "paren_start") {
                    depth++;
                    if (depth > 1) currentArg.push(t);
                } else if (t.type === "paren_end") {
                    if (depth === 0) {
                        return [args, i]; // unmatched )
                    }
                    depth--;
                    if (depth === 0) {
                        if (currentArg.length) {
                            const parsed = this.compact(currentArg);
                            args.push(parsed);
                            currentArg = [];
                        }
                        return [args, i];
                    } else {
                        currentArg.push(t);
                    }
                } else if (t.type === "comma" && depth === 1) {
                    if (!currentArg.length) {
                        return new FS3Error("SyntaxError", "Empty argument in method call", t.line, t.col);
                    }
                    const parsed = this.compact(currentArg);
                    args.push(parsed);
                    currentArg = [];
                } else {
                    currentArg.push(t);
                }
            }

            return new FS3Error("SyntaxError", "Unclosed parenthesis in method call", tokens[startIndex - 1].line, tokens[startIndex - 1].col);
        };

        const attachMethod = (parent, methodToken, args = []) => {
            parent.methods.push({
                name: methodToken.value,
                args: args,
                line: methodToken.line,
                col: methodToken.col
            });
        };

        let result = [];
        let i = 0;

        while (i < lineTokens.length) {
            const token = lineTokens[i];

            if (!token) { i++; continue; }

            // Detect parent: first non-method token in chain
            if (!["method_indicator", "method", "paren_start", "paren_end", "comma"].includes(token.type)) {
                // Copy line and col
                result.push({
                    ...token,
                    methods: [],
                    line: token.line,
                    col: token.col
                });
                i++;

                while (i < lineTokens.length) {
                    const t = lineTokens[i];

                    if (t.type === "method_indicator") {
                        const next = lineTokens[i + 1];
                        if (!next || next.type !== "method") {
                            return new FS3Error("SyntaxError", "method_indicator has no following method", t.line, t.col);
                        }
                        const methodTok = next;
                        i += 2;

                        let args = [];
                        if (i < lineTokens.length && lineTokens[i].type === "paren_start") {
                            const [parsedArgs, endIndex] = parseArgs(lineTokens, i);
                            if (parsedArgs instanceof FS3Error) return parsedArgs;
                            args = parsedArgs;
                            i = endIndex + 1;
                        }

                        attachMethod(result[result.length - 1], methodTok, args);
                    } else if (t.type === "comma" || t.type === "paren_end") {
                        break;
                    } else {
                        break;
                    }
                }
            } else {
                return new FS3Error("SyntaxError", `Unexpected token [${token.value}]`, token.line, token.col);
            }
        }

        return result.length === 1 ? result[0] : result;
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
                    throw new FS3Error("TokenizationError", `Unrecognized token [${line[pos]}]`, lineNo, pos);
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


        // strip quotes, and turn number strings into actual numbers

        for(let i = 0; i < tokens.length; i++){
            for(let j = 0; j < tokens[i].length; j++){
                let token = tokens[i][j];
                if(token.type === "string"){
                    // strip quotes and unescape
                    const quoteType = token.value[0];
                    token.value = token.value.slice(1, -1).replace(/\\(.)/g, "$1");
                    tokens[i][j] = token;
                }
                else if(token.type === "number"){
                    token.value = parseFloat(token.value);
                    tokens[i][j] = token;
                }
            }
        }

        for(let i = 0; i < tokens.length; i++){
            for(let j = 0; j < tokens[i].length; j++){
                let token = tokens[i][j];

                if(token.type === "math_equation"){
                    let eq = token.value.slice(1, -1);
                    try {
                        let result = math.evaluate(eq);

                        token.type = "number";
                        token.value = result;

                        if(result === true) token.value = 1;
                        if(result === false) token.value = 0;
                    } catch (e) {
                        return new FS3Error("MathError", `Error evaluating math equation: ${e.message}`, token.line, token.col);
                    }
                }
            }
        }
        

        return tokens;
    }
}