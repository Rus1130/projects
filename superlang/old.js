function parseTimeFormat(text, timestamp){
    const now = timestamp != null ? new Date(Number(timestamp)) : new Date();

    let dowListShort = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let dowListLong = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let monthListShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let monthListLong = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    const dayOfWeekShort = dowListShort[now.getDay()];
    const dayOfWeekLong = dowListLong[now.getDay()];

    const year = now.getFullYear();
    const yearShort = String(now.getFullYear()).slice(-2);

    const monthNumber = String(now.getMonth() + 1).padStart(2, '0');
    const monthNumberUnpadded = String(now.getMonth() + 1);
    const monthShort = monthListShort[now.getMonth()];
    const monthLong = monthListLong[now.getMonth()]; 

    const day = String(now.getDate()).padStart(2, '0');
    const dayUnpadded = String(now.getDate());
    const ordinalDay = String(now.getDate()) + getOrdinalSuffix(+day);

    const hour24 = String(now.getHours()).padStart(2, '0');
    const hour12 = String((now.getHours() + 11) % 12 + 1).padStart(2, '0');
    const hour24Unpadded = String(now.getHours());
    const hour12Unpadded = String((now.getHours() + 11) % 12 + 1);

    const minute = String(now.getMinutes()).padStart(2, '0');
    const minuteUnpadded = String(now.getMinutes());

    const second = String(now.getSeconds()).padStart(2, '0');
    const secondUnpadded = String(now.getSeconds());

    const millisecond = String(now.getMilliseconds()).padStart(3, '0');
    const millisecondUnpadded = String(now.getMilliseconds());

    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    const timezone = new Date().toLocaleString(["en-US"], {timeZoneName: "short"}).split(" ").pop();

    function getOrdinalSuffix(num) {
        if (typeof num !== "number" || isNaN(num)) return "";
    
        let lastDigit = num % 10;
        let lastTwoDigits = num % 100;
    
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    
        switch (lastDigit) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    // totally not ai
    const replacements = [
        { char: 'w', value: dayOfWeekShort },
        { char: 'W', value: dayOfWeekLong },

        { char: 'Y', value: year },
        { char: 'y', value: yearShort },

        { char: 'mn', value: monthNumber },
        { char: 'mnu', value: monthNumberUnpadded },
        { char: "ms", value: monthShort },
        { char: "M", value: monthLong },

        { char: 'd', value: day },
        { char: 'du', value: dayUnpadded },
        { char: "D", value: ordinalDay },

        { char: 'h', value: hour24 },
        { char: 'hu', value: hour24Unpadded },
        { char: 'H', value: hour12 },
        { char: 'Hu', value: hour12Unpadded },

        { char: 'm', value: minute },
        { char: 'mu', value: minuteUnpadded },

        { char: 's', value: second },
        { char: 'su', value: secondUnpadded },

        { char: 'l', value: millisecond },
        { char: 'lu', value: millisecondUnpadded },

        { char: 'a', value: ampm },

        { char: 'z', value: timezone },
    ];

    let replacementMap = Object.fromEntries(replacements.map(({ char, value }) => [char, value]));

    let dateString = text.replace(/!([a-zA-Z]+)/g, "!$1") // Preserve escaped characters
        .replace(/\b([a-zA-Z]+)\b/g, (match) => replacementMap[match] ?? match); // Replace only whole words

    return dateString;
}

class SuperLangError extends Error {
    constructor(message, node) {
        super(message);
        this.name = "SuperLangError";
        if (node && node.line !== undefined) {
            this.line = node.value.line;
            this.col = node.value.col;
        }
    }

    toString() {
        if (this.line !== undefined) {
            return `${this.message}\n    at line   ${this.line}\n    at column ${this.col}`;
        }
        return `${this.message}`;
    }
}
class Method {
    /**
     * @param {string|null} parentType - e.g. "frog" or null for global
     * @param {string} name - method name
     * @param {Array<{types: string[], optional?: boolean}>} argSpecs
     * @param {Function()} fn - implementation
     */
    constructor(parentType, name, argSpecs, fn) {
        this.parentType = parentType;
        this.name = name;
        this.argSpecs = argSpecs;
        this.fn = fn;
    }

    fullName() {
        return this.parentType ? `${this.parentType}>${this.name}` : this.name;
    }

    validateArgs(args, callNode) {
        const minArgs = this.argSpecs.filter(a => !a.optional).length;
        const maxArgs = this.argSpecs.length;

        for (let i = 0; i < args.length; i++) {
            const spec = this.argSpecs[i];
            if (!spec) break;
            const actualType = getType(args[i].value);
            console.log(args)
            const allowed =
                spec.types.includes("any") || spec.types.includes(actualType);
            if (!allowed) {
                runtimeError(args[i],
                    `Argument ${i + 1} of ${this.fullName()} must be one of [${spec.types.join(", ")}], got ${actualType}\n(arg "${spec.name}")`);
            }
        }

        if (args.length < minArgs || args.length > maxArgs) {
            runtimeError(callNode,
                `${this.fullName()} expected ${minArgs}-${maxArgs} arguments, got ${args.length}\n(arg "${this.argSpecs[0].name}")`);
        }
    }

    execute(parentValue, args, callNode = null, env = {}) {
        this.validateArgs(args, callNode);
        return this.fn(parentValue, args, env);
    }

    register() {
        MethodRegistry.register(this);
    }
}

function getType(value) {
    if(value.type !== undefined) return value.type;
    else return Array.isArray(value) ? "array" : typeof value;
}

class MethodRegistry {
    static methods = {};

    static register(...method) {
        for (const m of method) {
            const parent = m.parentType || "global";
            if (!this.methods[parent]) this.methods[parent] = {};
            this.methods[parent][m.name] = m;
        }
    }

    static get(parentType, methodName) {
        const parent = parentType || "global";

        // 1. Try exact match
        let method = this.methods[parent]?.[methodName];
        if (method) return method;

        // 2. Try "any" fallback
        method = this.methods["any"]?.[methodName];
        if (method) return method;

        // 3. If nothing found, null
        return null;
    }
}

function registerMethods(){
    new Method("debug", "env", [] , (parent, args, env) => {
        console.log(env);
    }).register()

    new Method("debug", "ast", [] , (parent, args, env) => { 
        console.log(AST.ast);
    }).register()

    new Method(null, "print", [
        {
            types: ["string", "number", "boolean", "array"],
            name: "value"

        }
    ], (parent, args) => {
        outputToTerminal(args[0].value);
    }).register()

    new Method(null, "debugprint", [
        {
            types: ["any"],
            name: "value"
        }
    ], (parent, args) => {
        console.log(args);
    }).register()


    new Method("math", "random", [
        {
            types: ["number"],
            optional: false,
            name: "max 1 arg / min 0 arg"
        },
        {
            types: ["number"],
            optional: true,
            name: "max"
        }
    ], (parent, args) => {
        if(args.length === 2) {
            const min = args[0].value;
            const max = args[1].value;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            const n = args[0].value;
            return Math.floor(Math.random() * (n + 1));
        }
    }).register()

    new Method("math", "pi", [] , (parent, args) => {
        return Math.PI;
    }).register()

    new Method("date", "now", [] , (parent, args) => {
        return Date.now();
    }).register()

    new Method("date", "format", [
        {
            types: ["string"],
            name: "date format string"
        }
    ], (parent, args) => {
        const date = new Date();
        const formatStr = args[0].value;
        return parseTimeFormat(formatStr, date.getTime());
    }).register()

    new Method("any", "type", [] , function(parent, args) {
        return getType(parent);
    }).register()

    new Method("array", "length", [] , function(parent, args) {
        return parent.length;
    }).register()

    new Method("array", "join", [
        { 
            types: ["string"], 
            optional: true, 
            name: "separator"
        }
    ], function(parent, args) {
        const separator = args[0] !== undefined ? args[0].value : ",";
        if(parent.some(x => getType(x) === "array")) runtimeError(args[0], `Cannot join array with nested arrays`);
        return (parent.join(separator));
    }).register()

    new Method("array", "index", [
        { 
            types: ["number"],
            name: "index"
        }
    ], function(parent, args) {

        const index = args[0].value >= 0 ? args[0].value : parent.length + args[0].value;

        if (index < 0 || index >= parent.length) {
            runtimeError(args[0], `Index ${args[0].value} out of range for array of length ${parent.length}`);
        }
        return parent[index];
    }).register()

    new Method("string", "length", [] , function(parent, args) {
        return parent.length;
    }).register()

    new Method("string", "wrap", [
        { 
            types: ["string"], 
            name: "left and right 1 arg / left 2 arg" 
        },
        { 
            types: ["string"],
            optional: true,
            name: "right"
        }
    ] , function(parent, args) {
        const left = args[0];
        const right = args[1] !== undefined ? args[1].value : left;
        return left + parent + right;
    }).register()

    new Method("number", "toString", [] , function(parent, args) {
        return parent.toString();
    }).register()

    new Method("boolean", "toString", [] , function(parent, args) {
        return parent.toString();
    }).register()

    new Method("array", "concat", [
        { 
            types: ["array"], 
            name: "array to concatenate" 
        }
    ] , function(parent, args) {
        return parent.concat(args[0].value);
    }).register()

    new Method("array", "map", [
        { 
            types: ["Function"], 
            name: "function to map over array" 
        }
    ] , function(parent, args, env) {
        const func = args[0].value;
        const arr = parent;

        if(func.name.startsWith("<anonymous>")) {
            const result = [];

            const params = func.params;
            const body = func.body;

            for (let i = 0; i < arr.length; i++) {
                // create a fresh local environment for this iteration
                const localEnv = Object.create(env);
                localEnv["__iter__"] = {
                    type: "number",
                    value: i
                }

                // bind first parameter (or more, if multiple)
                if (params.length > 0) localEnv[params[0]] = arr[i];

                // execute the function body
                let returnValue = null;
                for (const stmt of body) {
                    const val = evaluate(stmt, localEnv).value;
                    if (val && val.__return !== undefined) {
                        returnValue = val.__return;
                        break;
                    }
                }

                if(returnValue == null) runtimeError(args[0], `Anonymous Function did not return a value`);

                result.push(returnValue);
            }

            return result;

        } else {
            if(env[func.name].type !== "Function") runtimeError(args[0], `${func.name} is not a function`);

            const result = [];

            for (let i = 0; i < arr.length; i++) {
                // Create a temporary local environment
                const localEnv = Object.create(func.body);

                localEnv["__iter__"] = {
                    type: "number",
                    value: i
                }


                // Bind first parameter
                if (func.params.length > 0) {
                    localEnv[func.params[0]] = arr[i];
                }

                // Execute the function body
                let returnValue = null;
                for (const stmt of func.body) {
                    const val = evaluate(stmt, localEnv).value;
                    if (val && val.__return !== undefined) {
                        returnValue = val.__return;
                        break;
                    }
                }

                if(returnValue == null) runtimeError(args[0], `Function "${func.name}" did not return a value`);

                result.push(returnValue);
            }

            return result;
        }
    }).register()
}

registerMethods();

function runtimeError(node, message) {
    const loc = node && node.line ? `\n    at  line  ${node.line}\n    at column ${node.col}\n` : "";
    if(node == null) throw new SuperLangError(message);
    else throw new SuperLangError(`${message}${loc}`);
}

function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
        ['COMMENT', /^\/\/.*/],
        ['COMMENT', /^\/\/\*[\s\S]\*\/\//],
        ['AT', /^@/],
        ["BANG", /^!/],
        ["HASH", /^#/],
        ['NUMBER', /^-?\d+(\.\d+)?/],
        ['STRING', /^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/],
        ['LBRACKET', /^\[/],
        ['RBRACKET', /^\]/],
        ['LBRACE', /^\{/],
        ['RBRACE', /^\}/],
        ["INDEX", /^:/],
        ['IDENTIFIER', /^[a-zA-Z_]\w*/],
        ["PLUS_EQ", /^\+=/],
        ["MINUS_EQ", /^-=/],
        ["DIV_EQ", /^\/=/],
        ["MULT_EQ", /^\*=/],
        ['METHOD_CALL', /^>/],
        ['ARROW', /^->/],
        ["EQ", /^==/],
        ['EQUAL', /^=/],
        ['PLUS', /^\+/],
        ['MINUS', /^-/],
        ['MULT', /^\*/],
        ['DIV', /^\//],
        ["GT", /^ > /],
        ["LT", /^ < /],
        ["NEQ", /^!=/],
        ["GTE", /^>=/],
        ["LTE", /^<=/],
        ['LPAREN', /^\(/],
        ['RPAREN', /^\)/],
        ['SEMICOLON', /^;/],
        ['NEWLINE', /^\n/],
        ['WHITESPACE', /^[ \t\r]+/],
        ['COMMA', /^,/],
    ];

    let line = 1;
    let col = 1;

    while (input.length > 0) {
        let matched = false;
        for (const [type, regex] of tokenSpec) {
            const match = input.match(regex);
            if (match) {
                matched = true;
                const value = match[0];
                input = input.slice(value.length);

                if (type === "NEWLINE") {
                    line++;
                    col = 1;
                } else {
                    if (type !== 'WHITESPACE' && type !== 'NEWLINE' && type !== 'COMMENT') {
                        tokens.push({ type, value, line, col });
                    }
                    col += value.length;
                }
                break;
            }
        }
        if (!matched) runtimeError({line: line, col: col}, `Unexpected token: ${input[0]}`);
    }

    return tokens;
}

function parse(tokens) {
    let current = 0;

    const constants = [];

    function peek() { return tokens[current]; }
    function consume(type) {
        const token = peek();
        if(typeof type === 'string'){
            if (token && token.type === type) {
                current++;
                return token;
            }
        } else if (Array.isArray(type)) {
            if (token && type.includes(token.type)) {
                current++;
                return token;
            }
        }
        if (token) runtimeError(token, `Expected token "${type}", but got "${token.type}"`);
        else runtimeError(null, `Expected token "${type}", but got end of input`);
    }

    function parseFunctionDeclaration() {
        const nameToken = consume('IDENTIFIER');
        const name = nameToken.value;
        let params = [];


        // Optional parameters
        if (peek()?.type === 'LPAREN') {
            params = collectParameters();
        }

        const body = collectMultiline('LBRACE', 'RBRACE');

        return { type: "FunctionDeclaration", name, params, body, line: nameToken.line, col: nameToken.col };
    }

    function parseExpression() {
        let node = parseTerm();
        while (peek() && (peek().type === 'PLUS' || peek().type === 'MINUS')) {
            const op = tokens[current++].value;
            node = { type: "BinaryExpression", operator: op, left: node, right: parseTerm(), line: node.line, col: node.col};
        }
        return node;
    }

    function parseTerm() {
        let node = parseFactor();
        while (peek() && (peek().type === 'MULT' || peek().type === 'DIV')) {
            const op = tokens[current++].value;
            node = { type: "BinaryExpression", operator: op, left: node, right: parseFactor(), line: node.line, col: node.col};
        }
        return node;
    }

    function parseComparison() {
        let node = parseExpression();
        while (peek() && ['LT', 'GT', 'LTE', 'GTE', 'EQ', 'NEQ'].includes(peek().type)) {
            const opToken = tokens[current++];
            const opMap = {
                LT: ' < ', GT: ' > ', LTE: '<=', GTE: '>=', EQ: '==', NEQ: '!='
            };
            node = { 
                type: "BinaryExpression",
                operator: opMap[opToken.type],
                left: node,
                right: parseExpression(), // right-hand side is another +/-
                line: node.line,
                col: node.col
            };
        }
        return node;
    }

    function parseMethodChain(base) {
        let parent = base;
        while (peek()?.type === 'METHOD_CALL') {
            consume('METHOD_CALL');
            const methodName = consume('IDENTIFIER').value;
            let args = [];
            if (peek()?.type === 'LPAREN') {
                args = collectArguments();
            }
            parent = { type: "MethodCall", parent, name: methodName, args, line: parent.line, col: parent.col };
        }
        return parent;
    }

    function parseFactor() {
        let node;
        const token = peek();
        if (!token) runtimeError(null, "Unexpected end of input");

        if (peek()?.type === "HASH" && tokens[current + 1]?.type === "LBRACE") {
            consume("HASH");
            consume("LBRACE");
            const fields = {};

            while (peek() && peek().type !== "RBRACE") {

                if (peek()?.type === "RBRACE") break;

                const keyToken = consume(["IDENTIFIER", "STRING"]);
                consume("EQUAL");

                let valueNode = parseComparison();

                const keyName =
                    keyToken.type === "STRING"
                        ? keyToken.value.slice(1, -1)
                        : keyToken.value;

                fields[keyName] = valueNode;
            }

            consume("RBRACE");

            node = {
                type: "ObjectLiteral",
                fields,
                line: token.line,
                col: token.col
            };
        } else if (token.type === 'NUMBER') {
            current++;
            node = { type: "NumberLiteral", value: Number(token.value), line: token.line, col: token.col };
        } else if (token.type === 'STRING') {
            const raw = tokens[current++].value;
            const val = raw.slice(1, -1).replace(/\\(["'\\nrt])/g, (_, c) => {
                switch (c) {
                    case "n": return "\n";
                    case "r": return "\r";
                    case "t": return "\t";
                    default: return c;
                }
            });
            node = { type: "StringLiteral", value: val, line: token.line, col: token.col };
        } else if (token.type === 'IDENTIFIER') {
            node = { type: "Identifier", value: consume('IDENTIFIER').value, line: token.line, col: token.col };
        } else if (token.type === 'LPAREN') {
            consume('LPAREN');
            node = parseComparison();  // parse the inner expression fully
            consume('RPAREN');

            // Keep the line/col from the '(' for better errors
            node.line = token.line;
            node.col = token.col;
        } else if (token.type === 'AT') {
            consume('AT');

            if(peek()?.type === 'IDENTIFIER') {
                const name = consume('IDENTIFIER').value;
                let args = [];
                if (peek()?.type === 'LPAREN') {
                    args = collectArguments();
                }
                node = { type: "FunctionCall", name, args, line: token.line, col: token.col };
            } else if (peek()?.type === 'LPAREN') {
                let params = [];
                params = collectParameters();
                const body = collectMultiline('LBRACE', 'RBRACE');
                node = { type: "AnonymousFunction", params, body, line: token.line, col: token.col };
            } else if (peek()?.type === 'LBRACE') {
                const body = collectMultiline('LBRACE', 'RBRACE');
                node = { type: "AnonymousFunction", params: [], body, line: token.line, col: token.col };
            }
        }   else if (token.type === 'LBRACKET') {
            consume('LBRACKET');
            const elements = [];
            if (peek()?.type !== 'RBRACKET') {
                elements.push(parseExpression());
                while (peek()?.type === 'COMMA') {
                    consume('COMMA');
                    elements.push(parseExpression());
                }
            }
            consume('RBRACKET');
            node = { type: "ArrayLiteral", elements, line: token.line, col: token.col };
        } else {
            runtimeError(token, `Unexpected token: ${token.type}`);
        }

        // 👇 Handle chained method calls
        return parseMethodChain(node);
    }

    /**
     * 
     * @param {String} leftPeek - the type of the left delimiter
     * @param {String} rightPeek - the type of the right delimiter
     */
    function collectMultiline(leftPeek, rightPeek){
        const body = [];
        consume(leftPeek);
        while(peek() && peek().type !== rightPeek) {
            body.push(parseStatement());
            if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
        }
        consume(rightPeek);
        return body;
    }

    function collectArguments() {
        const args = [];
        consume('LPAREN');
        if (peek()?.type !== 'RPAREN') {
            args.push(parseComparison());
            while (peek()?.type === 'COMMA') {
                consume('COMMA');
                args.push(parseComparison());
            }
        }
        consume('RPAREN');
        return args;
    }

    function collectParameters() {
        const params = [];
        consume('LPAREN');
        if (peek()?.type !== 'RPAREN') {
            params.push(consume('IDENTIFIER').value);
            while (peek()?.type === 'COMMA') {
                consume('COMMA');
                params.push(consume('IDENTIFIER').value);
            }
        }
        consume('RPAREN');
        return params;
    }

    function parseStatement() {
        // --- Function Declaration Lookahead ---
        if (peek()?.type === 'IDENTIFIER' && peek().value === 'func' && tokens[current + 1]?.type === 'IDENTIFIER') {
            consume('IDENTIFIER');
            return parseFunctionDeclaration();
        }

        if(peek()?.type === 'IDENTIFIER' && peek().value === 'watch') {
            consume('IDENTIFIER');
            const variable = consume('IDENTIFIER');
            const body = collectMultiline('LBRACE', 'RBRACE');
            return { type: "WatchDeclaration", variable: variable.value, body };
        }

        if(peek()?.type === 'IDENTIFIER' && peek().value === 'if') {
            consume('IDENTIFIER');
            const condition = parseComparison();
            const body = collectMultiline('LBRACE', 'RBRACE');
            if(peek()?.type === 'IDENTIFIER' && peek().value === 'else') {
                consume('IDENTIFIER');
                const elseBody = collectMultiline('LBRACE', 'RBRACE');
                return { type: "IfElseStatement", condition, body, elseBody };
            }
            return { type: "IfStatement", condition, body };
        }

        if(peek()?.type === 'IDENTIFIER' && peek().value === 'loop') {
            consume('IDENTIFIER');
            const next = peek();
            if(next?.type === 'LPAREN') {
                const condition = parseComparison();
                const body = collectMultiline('LBRACE', 'RBRACE');
                return { type: "ConditionalLoopStatement", condition, body };

            } else if (next?.type === 'NUMBER' || next?.type === 'IDENTIFIER') {
                let count = consume(['NUMBER', 'IDENTIFIER']);
                const body = collectMultiline('LBRACE', 'RBRACE');
                return { 
                    type: "CountLoopStatement", 
                    count: {
                        type: count.type === 'NUMBER' ? "NumberLiteral" : "Identifier",
                        value: count.type === 'NUMBER' ? Number(count.value) : count.value,
                        line: next.line,
                        col: next.col 
                    }, 
                    body 
                };

            } else {
                runtimeError(next, `Expected loop count or condition, got: ${next?.type}`);
            }
        }

        if(peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'INDEX') {
            const arrayName = consume('IDENTIFIER').value;
            const indexes = [];

            // collect one or more indexes
            while (peek()?.type === 'INDEX') {
                consume('INDEX');
                indexes.push(parseComparison());
            }

            if(["EQUAL", "PLUS_EQ", "MINUS_EQ", "DIV_EQ", "MULT_EQ"].includes(peek()?.type)) {
                const op = tokens[current++].type;
                const value = parseComparison();

                return { type: "ArrayAssignment", arrayName, indexes, operator: op, value };
            }
        }


        if (peek()?.type === 'IDENTIFIER' && peek().value === 'return') {
            consume('IDENTIFIER');
            const value = parseComparison();
            return { type: "ReturnStatement", value };
        }

        if(peek()?.type === 'BANG') {
            consume('BANG');
            const id = consume('IDENTIFIER').value;
            const op = consume('EQUAL');
            const value = parseComparison();
            constants.push(id);
            return { type: "Assignment", operator: op.type, identifier: id, value };
        }

        // --- Assignment: identifier = expression
        if (peek()?.type === 'IDENTIFIER' && ['EQUAL', 'PLUS_EQ', 'MINUS_EQ', 'DIV_EQ', "MULT_EQ"].includes(tokens[current + 1]?.type)) {
            const id = consume('IDENTIFIER').value;
            if(constants.includes(id)) runtimeError(peek(), `Cannot reassign constant "${id}"`);
            const op = tokens[current++].type;
            const value = parseComparison();
            return { type: "Assignment", operator: op, identifier: id, value };
        }

        // --- Method call: parent > method (parent is an identifier, older style)
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'METHOD_CALL') {
            const parent = consume('IDENTIFIER').value;
            consume('METHOD_CALL');
            const method = consume('IDENTIFIER');

            let args = [];
            if (peek()?.type === 'LPAREN') {
                args = collectArguments();
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
                // single arg without parentheses
                args.push(parseComparison());
            }

            return { type: "MethodCall", parent, name: method.value, args, line: method.line, col: method.col };
        }

        // --- Global call: foo(...)  OR foo single-arg-without-parens
        if (peek()?.type === 'IDENTIFIER') {
            const global = consume('IDENTIFIER');
            let args = [];
            if (peek()?.type === 'LPAREN') {
                args = collectArguments();
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
                args.push(parseComparison());
            }

            return { type: "MethodCall", parent: null, name: global.value, args, line: global.line, col: global.col };
        }

        // --- Function call with @ : @name(...)  (calls, not declarations)
        if (peek()?.type === 'AT') {
            consume('AT');
            const func = consume('IDENTIFIER');
            let args = [];
            if (peek()?.type === 'LPAREN') {
                args = collectArguments();
            }

            return { type: "FunctionCall", name: func.value, args, line: func.line, col: func.col };
        }

        // --- Return statement: return expr
        if (peek()?.type === 'IDENTIFIER' && peek().value === 'return') {
            consume('IDENTIFIER');
            const value = parseComparison();
            return { type: "ReturnStatement", value };
        }

        // --- Fallback: expression
        return parseExpression();
    }

    function parseProgram() {
        const body = [];
        while (current < tokens.length) {
            const stmt = parseStatement();
            body.push(stmt);
            if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
        }
        return { type: "Program", body };
    }

    return parseProgram();
}

// Interpreter
function evaluateProgram(input) {
    const env = { 
        math: { 
            type: "math", 
            value: "{}"
        },
        date: { 
            type: "date",
            value: "{}"
        },
        debug: {
            type: "debug",
            value: "{}"
        },
        true: {
            type: "boolean",
            value: true
        },
        false: {
            type: "boolean",
            value: false
        }
    };

    watchedVariables = {};

    try {
        // Tokenize
        const tokens = tokenize(input);

        // Parse
        const ast = parse(tokens);

        new AST(ast);

        // Evaluate
        for (const node of ast.body) {
            evaluate(node, env);
        }

    } catch (e) {
        handleError(e);
    }
}

class AST {
    constructor(ast){AST.ast = ast;}
}

/**
 * 
 * @param {*} body 
 * @param {*} env 
 * @param {Array<{ name: string, type: string, value: any }>} vars 
 * @returns 
 */
function runBody(body, env, vars){
    for(const v of vars){
        env[v.name] = {
            type: v.type,
            value: v.value
        };
    }
    for (const stmt of body) {
        const value = evaluate(stmt, env);
        if (value && value.__return !== undefined) {
            return value.__return;
        }
    }
    for(const v of vars){
        delete env[v.name];
    }
}

function handleError(e) {
    if (e instanceof SuperLangError) {
        outputToTerminal({ type: 'error', value: "Error: " + e.toString() });
    } else if (e instanceof Error) {
        console.error("[INTERNAL JS ERROR]", e);
        outputToTerminal("Internal interpreter error — see console.");
    } else {
        // Non-standard thrown objects
        console.error("[UNKNOWN ERROR]", e);
        outputToTerminal("Unknown error — see console.");
    }
}

let watchedVariables = {};

function evaluate(node, env = {}) {
    function runWatch(oldValue, newValue) {
        try {
            if(node.identifier in watchedVariables) {
                if(!env[node.identifier]){
                    runtimeError(node.value, `Cannot assign to watched variable "${node.identifier}" before it has been initialized.`);
                }
                const watchBody = watchedVariables[node.identifier];

                // run watch body if value changed
                runBody(watchBody, env, [
                    {
                        name: "__old__",
                        type: getType(oldValue),
                        value: oldValue
                    },
                    {
                        name: "__new__",
                        type: getType(newValue),
                        value: newValue
                    }
                ]);
            }
        } catch (e) {
            runtimeError(node.value, `Variable "${node.identifier}" cannot be modified by its own watch handler.`);
        }
    }
    switch (node.type) {
        case "ArrayAssignment": {
            let array = env[node.arrayName];
            if(array.type != "array") {
                runtimeError(node, `Variable ${node.arrayName} is not an array`);
            }

            // evaluate all indexes
            const idxValues = node.indexes.map(idx => evaluate(idx, env));

            let lastIndex = idxValues.pop(); // the last index is where we assign
            let target = array;

            // navigate through nested arrays
            for (const idx of idxValues) {
                if (typeof idx !== "number" || !Number.isInteger(idx)) {
                    runtimeError(node, `Array index must be an integer, got: ${idx}`);
                }
                const realIdx = idx >= 0 ? idx : target.length + idx;
                if (realIdx < 0 || realIdx >= target.length) {
                    runtimeError(node, `Index ${idx} out of range for array of length ${target.length}`);
                }
                target = target[realIdx];
                if (!Array.isArray(target)) {
                    runtimeError(node, `Expected array at index ${idx}, got ${getType(target)}`);
                }
            }

            // assign to last index
            if (typeof lastIndex !== "number" || !Number.isInteger(lastIndex)) {
                runtimeError(node, `Array index must be an integer, got: ${lastIndex}`);
            }
            const realLast = lastIndex >= 0 ? lastIndex : target.length + lastIndex;
            if (realLast < 0 || realLast >= target.length) {
                runtimeError(node, `Index ${lastIndex} out of range for array of length ${target.length}`);
            }

            const val = evaluate(node.value, env);

            switch(node.operator) {
                case "EQUAL": target[realLast] = val; break;
                case "PLUS_EQ": target[realLast] += val; break;
                case "MINUS_EQ": target[realLast] -= val; break;
                case "MULT_EQ": target[realLast] *= val; break;
                case "DIV_EQ": target[realLast] /= val; break;
                default: runtimeError(node.value, `Unknown assignment operator: ${node.operator}`);
            }

            return target[realLast];
        }

        case "Assignment": {
            const oldValue = env[node.identifier] ? env[node.identifier].value : undefined;
            const right = evaluate(node.value, env);
            runWatch(oldValue, right);
            switch(node.operator) {
                case "EQUAL":
                    env[node.identifier] = {
                        type: getType(right),
                        value: right
                    }
                    break;
                case "PLUS_EQ":
                    env[node.identifier] = {
                        type: getType(env[node.identifier].value),
                        value: env[node.identifier].value + right
                    }
                    break;
                case "MINUS_EQ":
                    env[node.identifier] = {
                        type: getType(env[node.identifier].value),
                        value: env[node.identifier].value - right
                    }
                    break;
                case "MULT_EQ":
                    env[node.identifier] = {
                        type: getType(env[node.identifier].value),
                        value: env[node.identifier].value * right
                    }
                    break;
                case "DIV_EQ":
                    env[node.identifier] = {
                        type: getType(env[node.identifier].value),
                        value: env[node.identifier].value / right
                    }
                    break;
                default:
                    runtimeError(node, `Unknown assignment operator: ${node.operator}`);
            }
            return env[node.identifier];
        }

        case "Program":
            return evaluateProgram(node, env);

        case "NumberLiteral":
            return node.value;

        case "StringLiteral":
            return node.value;

        case "ArrayLiteral":
            return node.elements.map(e => evaluate(e, env));

        case "ObjectLiteral": {
            const result = {};
            for (const key in node.fields) {
                result[key] = evaluate(node.fields[key], env);
            }

            return result;
        }

        case "Identifier":
            if (node.value in env) {
                return env[node.value];
            }
            runtimeError(node.value, `Undefined variable: ${node.value}`);

        case "FunctionDeclaration":

            if(env[node.name] !== undefined) {
                runtimeError(node, `Identifier "${node.name}" is already defined in the current scope.`);
            }

            env[node.name] = {
                type: "Function",
                value: {
                    type: "Function",
                    name: node.name,
                    params: node.params,
                    body: node.body,
                }

            };
            return null;

        case "BinaryExpression":
            const left = evaluate(node.left, env);
            const right = evaluate(node.right, env);

            function wrap(val){
                return {
                    type: getType(val),
                    value: val
                }
            }


            function guard(){
                if (getType(left) !== getType(right)) {
                    runtimeError(node, `Type mismatch in binary expression: ${getType(left)} ${node.operator} ${getType(right)}`);
                }
            }

            switch (node.operator) {
                case "+": {
                    if(getType(left) === "string" && getType(right) === "string") return left + right;
                    else if(getType(left) === "string" && getType(right) === "number") return left + right.toString();
                    else guard()
                }
                case "-": {
                    guard()
                    return left - right;
                }
                case "*": {
                    if(getType(left) === "string" && getType(right) === "number") return left.repeat(right);
                    else if(getType(left) === "number" && getType(right) === "number") return left * right;
                    else guard()
                }
                case "/": {
                    guard()
                    return left / right;
                }
                case " > ": {
                    guard()
                    return left > right;
                }
                case " < ": {
                    guard()
                    return left < right;
                }
                case ">=": {
                    guard()
                    return left >= right;
                }
                case "<=": {
                    guard()
                    return left <= right;
                }
                case "==": {
                    guard()
                    return left == right;
                }
                case "!=": {
                    guard()
                    return left != right;
                }
                default: runtimeError(node, `Unknown operator: ${node.operator}`);
            }

        case "MethodCall": {
            let parentValue = null;
            let parentType = "global";

            // If node.parent is an identifier (old-style `name > method`), look up the env entry
            if (node.parent && typeof node.parent === "string") {
                const envEntry = env[node.parent];
                if (envEntry && typeof envEntry === "object" && envEntry.type !== undefined) {
                    parentType = envEntry.type;        // preserve the declared runtime type
                    parentValue = envEntry.value;     // unwrap value for method execution
                } else {
                    // not a typed env entry — evaluate to get the runtime value & type
                    parentValue = evaluate({ type: "Identifier", value: node.parent }, env).value;
                    parentType = getType(parentValue);
                }
            } else if (node.parent) {
                // parent is an expression/AST node — evaluate it normally
                parentValue = evaluate(node.parent, env).value;
                parentType = getType(parentValue);
            }

            // lookup method by runtime parent type, then fallback to "any"
            let method = MethodRegistry.get(parentType, node.name);
            if (!method) method = MethodRegistry.get("any", node.name);

            if (!method) runtimeError(node, `Unknown method: ${parentType}>${node.name}`);


            if(node.args[0] == undefined){
                runtimeError(node, `Method ${parentType}>${node.name} has improper syntax inside.`);
            }

            const evaluatedArgs = node.args.map(arg => evaluate(arg, env));

            let args = [];

            console.log(node.args, evaluatedArgs)

            node.args.forEach((argNode, index) => {
                args.push({
                    value: evaluatedArgs[index],
                    line: argNode.line,
                    col: argNode.col
                })
            });

            return method.execute(parentValue, args, node, env);
        }

        case "FunctionCall": {
            const func = env[node.name].value;
            if (!func || func.type !== "Function") {
                runtimeError(node, `Undefined function: @${node.name}`);
            }

            const argValues = node.args.map(a => evaluate(a, env));

            // Create new scope
            const localEnv = Object.create(env);

            for (let i = 0; i < func.params.length; i++) {
                if (argValues[i] === undefined) {
                    runtimeError(node, `Missing argument for parameter "${func.params[i]}" in function @${node.name}`);
                }
                localEnv[func.params[i]] = {
                    type: getType(argValues[i]),
                    value: argValues[i]
                }
            }

            // Execute body
            return runBody(func.body, localEnv, []);
        }

        case "ReturnStatement":
            return { __return: evaluate(node.value, env) };

        case "CountLoopStatement": 
            let loopCount = evaluate(node.count, env);

            if (typeof loopCount !== "number" || !Number.isInteger(loopCount) || loopCount < 0) {
                runtimeError(node, `Loop count must be a non-negative integer, got: ${loopCount}`);
            }
            for (let i = 0; i < loopCount; i++) {
                runBody(node.body, env, [
                    { name: "__iter__",
                      type: "number",
                      value: i
                    }
                ]);
            }
            return null;

        case "ConditionalLoopStatement":
            let i = 0;
            while (true) {
                const cond = evaluate(node.condition, env);
                if (typeof cond !== "boolean") {
                    runtimeError(node, `Loop condition must evaluate to a boolean, got: ${cond}`);
                }
                if (!cond) break;

                runBody(node.body, env, [
                    { 
                        name: "__iter__",
                        type: "number",
                        value: i
                    }
                ]);
                i++;
            }
            return null;

        case "IfStatement":
            let condition = evaluate(node.condition, env);
            if(condition === 0) condition = false;
            if(condition === 1) condition = true;
            if (typeof condition !== "boolean") {
                runtimeError(node, `If condition must evaluate to a boolean, got: ${condition}`);
            }
            if (condition) {
                runBody(node.body, env, []);
            }
            return null;

        case "IfElseStatement":
            let cond = evaluate(node.condition, env);
            if(cond === 0) cond = false;
            if(cond === 1) cond = true;
            if (typeof cond !== "boolean") {
                runtimeError(node, `If condition must evaluate to a boolean, got: ${cond}`);
            }
            if (cond) {
                runBody(node.body, env, []);
            } else {
                runBody(node.elseBody, env, []);
            }
            return null;

        case "AnonymousFunction":
            return {
                type: "Function",
                name: "<anonymous>" + Math.random().toString(36).substring(2),
                params: node.params,
                body: node.body,
            };

        case "WatchDeclaration":
            watchedVariables[node.variable] = node.body;
            return null;

        default:
            runtimeError(node, `Unknown node type: ${node.type}`);
        }
}