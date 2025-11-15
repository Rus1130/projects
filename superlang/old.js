// enhanced-superlang.js
// Based on the code you provided — adds let/const, lexical scoping (closures), and const enforcement.

// ------------------------- Time formatting helper (unchanged) -------------------------
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

// ------------------------- Error class (unchanged) -------------------------
class SuperLangError extends Error {
    constructor(message, node) {
        super(message);
        this.name = "SuperLangError";
        if (node && node.line !== undefined) {
            this.line = node.line;
            this.col = node.col;
        }
    }

    toString() {
        if (this.line !== undefined) {
            return `${this.message}\n    at line   ${this.line}\n    at column ${this.col}`;
        }
        return `${this.message}`;
    }
}

// ------------------------- Method / MethodRegistry (unchanged) -------------------------
class Method {
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
            const allowed =
                spec.types.includes("any") || spec.types.includes(actualType);
            if (!allowed) {
                runtimeError(args[i],
                    `Argument ${i + 1} of ${this.fullName()} must be one of [${spec.types.join(", ")}], got ${actualType}\n(arg "${spec.name}")`);
            }
        }

        if (args.length < minArgs || args.length > maxArgs) {
            runtimeError(callNode,
                `${this.fullName()} expected ${minArgs}-${maxArgs} arguments, got ${args.length}\n(arg "${this.argSpecs[0]?.name}")`);
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

// ------------------------- Type helper (unchanged) -------------------------
function getType(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "object" && value.type !== undefined) return value.type;
    if (Array.isArray(value)) return "array";
    return typeof value;
}

// ------------------------- Builtin methods (unchanged) -------------------------
new Method(null, "print", [{ types: ["string", "number", "boolean", "array"], name: "value" }], (parent, args) => {
    outputToTerminal(args[0].value);
}).register();

new Method(null, "debugprint", [{ types: ["any"], name: "value" }], (parent, args) => {
    console.log(args);
}).register();

new Method("math", "random", [
    { types: ["number"], optional: false, name: "max 1 arg / min 0 arg" },
    { types: ["number"], optional: true, name: "max" }
], (parent, args) => {
    if (args.length === 2) {
        const min = args[0].value;
        const max = args[1].value;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        const n = args[0].value;
        return Math.floor(Math.random() * (n + 1));
    }
}).register();

new Method("date", "now", [], (parent, args) => {
    return Date.now();
}).register();

new Method("date", "format", [{ types: ["string"], name: "date format string" }], (parent, args) => {
    const date = new Date();
    const formatStr = args[0].value;
    return parseTimeFormat(formatStr, date.getTime());
}).register();

new Method("any", "type", [], function (parent, args) {
    return getType(parent);
}).register();

new Method("array", "length", [], function (parent, args) {
    return parent.length;
}).register();

new Method("array", "join", [{ types: ["string"], optional: true, name: "separator" }], function (parent, args) {
    const separator = args[0] !== undefined ? args[0].value : ",";
    if (parent.some(x => getType(x) === "array")) runtimeError(args[0], `Cannot join array with nested arrays`);
    return (parent.join(separator));
}).register();

new Method("Function", "call", [], function (parent, args, env) {
    return callFunction(parent, [], env);
}).register();

new Method("array", "index", [{ types: ["number"], name: "index" }], function (parent, args) {
    const index = args[0].value >= 0 ? args[0].value : parent.length + args[0].value;
    if (index < 0 || index >= parent.length) {
        runtimeError(args[0], `Index ${args[0].value} out of range for array of length ${parent.length}`);
    }
    return parent[index];
}).register();

new Method("string", "length", [], function (parent, args) {
    return parent.length;
}).register();

new Method("string", "wrap", [{ types: ["string"], name: "left and right 1 arg / left 2 arg" }, { types: ["string"], optional: true, name: "right" }], function (parent, args) {
    const left = args[0];
    const right = args[1] !== undefined ? args[1].value : left;
    return left + parent + right;
}).register();

new Method("number", "toString", [], function (parent, args) {
    return parent.toString();
}).register();

new Method("boolean", "toString", [], function (parent, args) {
    return parent.toString();
}).register();

new Method("array", "concat", [{ types: ["array"], name: "array to concatenate" }], function (parent, args) {
    return parent.concat(args[0].value);
}).register();

new Method("array", "map", [{ types: ["Function"], name: "function to map over array" }], (parent, args, env) => {
    const func = args[0].value;
    const arr = parent;
    return arr.map((elem, i) => {
        const localArgs = [];
        if (func.params.length > 0) localArgs.push(elem);
        env["__iter__"] = { type: "number", value: i };
        return callFunction(func, localArgs, env);
    });
}).register();

// ------------------------- Tokenizer (added LET/CONST tokens early) -------------------------
function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
        ['COMMENT', /^\/\/.*/],
        ['COMMENT', /^\/\*[\s\S]*?\*\//],
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
        // keywords before identifier so they get tokenized as keyword types
        ['LET', /^\blet\b/],
        ['CONST', /^\bconst\b/],
        ['FUNC', /^\bfunc\b/],
        ['WATCH', /^\bwatch\b/],
        ['IF', /^\bif\b/],
        ['ELSE', /^\belse\b/],
        ['LOOP', /^\bloop\b/],
        ['RETURN', /^\breturn\b/],
        ['TRUE', /^\btrue\b/],
        ['FALSE', /^\bfalse\b/],
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
        ["GT", /^>/],
        ["LT", /^</],
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
        if (!matched) runtimeError({ line, col }, `Unexpected token: ${input[0]}`);
    }

    return tokens;
}

// ------------------------- Runtime helpers for const/lookup -------------------------
function findVarEnv(env, name) {
    // Walk prototype chain to find the environment object that actually has the variable as an own property
    let cur = env;
    while (cur) {
        if (Object.prototype.hasOwnProperty.call(cur, name)) return cur;
        cur = Object.getPrototypeOf(cur);
    }
    return null;
}

function isConstInEnv(env, name) {
    let cur = env;
    while (cur) {
        if (cur.__consts__ && cur.__consts__.has(name)) return true;
        cur = Object.getPrototypeOf(cur);
    }
    return false;
}

function declareVar(env, name, value, isConst = false) {
    env[name] = value;
    if (isConst) {
        env.__consts__ = env.__consts__ || new Set();
        env.__consts__.add(name);
    }
}

// ------------------------- runtimeError & handleError (unchanged) -------------------------
function runtimeError(node, message) {
    const loc = node && node.line ? `\n    at  line  ${node.line}\n    at column ${node.col}\n` : "";
    if (node == null) throw new SuperLangError(message);
    else throw new SuperLangError(`${message}${loc}`, node);
}

function handleError(e) {
    if (e instanceof SuperLangError) {
        outputToTerminal({ type: 'error', value: "Error: " + e.toString() });
    } else if (e instanceof Error) {
        console.error("[INTERNAL JS ERROR]", e);
        outputToTerminal("Internal interpreter error — see console.");
    } else {
        console.error("[UNKNOWN ERROR]", e);
        outputToTerminal("Unknown error — see console.");
    }
}

// Placeholder for UI integration (user must implement for runtime output)
function outputToTerminal(v) {
    // in node: console.log
    console.log("OUTPUT:", v);
}

// ------------------------- Parser (mostly unchanged; recognizes LET/CONST/FUNC tokens) -------------------------
function parse(tokens) {
    let current = 0;

    const constants = [];

    function peek() { return tokens[current]; }
    function consume(type) {
        const token = peek();
        if (typeof type === 'string') {
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
        const name = consume('IDENTIFIER').value;
        let params = [];

        if (peek()?.type === 'LPAREN') {
            params = collectParameters();
        }

        const body = collectMultiline('LBRACE', 'RBRACE');

        return { type: "FunctionDeclaration", name, params, body, line: tokens[current - 1].line, col: tokens[current - 1].col };
    }

    function parseExpression() {
        let node = parseTerm();
        while (peek() && (peek().type === 'PLUS' || peek().type === 'MINUS')) {
            const op = tokens[current++].value;
            node = { type: "BinaryExpression", operator: op, left: node, right: parseTerm(), line: node.line, col: node.col };
        }
        return node;
    }

    function parseTerm() {
        let node = parseFactor();
        while (peek() && (peek().type === 'MULT' || peek().type === 'DIV')) {
            const op = tokens[current++].value;
            node = { type: "BinaryExpression", operator: op, left: node, right: parseFactor(), line: node.line, col: node.col };
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
                right: parseExpression(),
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

                if (keyName == 'type') {
                    runtimeError(keyToken, `Field name "type" is reserved and cannot be used in object literals.`);
                }

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
            node.line = token.line;
            node.col = token.col;
        } else if (token.type === 'AT') {
            consume('AT');

            if (peek()?.type === 'IDENTIFIER') {
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
        } else if (token.type === 'LBRACKET') {
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

        return parseMethodChain(node);
    }

    function collectMultiline(leftPeek, rightPeek) {
        const body = [];
        consume(leftPeek);
        while (peek() && peek().type !== rightPeek) {
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
        // Function declaration using `func NAME (...) { ... }`
        if (peek()?.type === 'FUNC' && tokens[current + 1]?.type === 'IDENTIFIER') {
            consume('FUNC');
            return parseFunctionDeclaration();
        }

        // watch
        if (peek()?.type === 'WATCH') {
            consume('WATCH');
            const variable = consume('IDENTIFIER');
            const body = collectMultiline('LBRACE', 'RBRACE');
            return { type: "WatchDeclaration", variable: variable.value, body };
        }

        // if / else
        if (peek()?.type === 'IF') {
            consume('IF');
            const condition = parseComparison();
            const body = collectMultiline('LBRACE', 'RBRACE');
            if (peek()?.type === 'ELSE') {
                consume('ELSE');
                const elseBody = collectMultiline('LBRACE', 'RBRACE');
                return { type: "IfElseStatement", condition, body, elseBody };
            }
            return { type: "IfStatement", condition, body };
        }

        // loop
        if (peek()?.type === 'LOOP') {
            consume('LOOP');
            const next = peek();
            if (next?.type === 'LPAREN') {
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

        // return
        if (peek()?.type === 'RETURN') {
            consume('RETURN');
            const value = parseComparison();
            return { type: "ReturnStatement", value };
        }

        // bang constant declaration: !foo = value  (legacy from your base)
        if (peek()?.type === 'BANG') {
            consume('BANG');
            const idTok = consume('IDENTIFIER');
            const id = idTok.value;
            consume('EQUAL');
            const value = parseComparison();
            constants.push(id);
            return { type: "Assignment", operator: "EQUAL", identifier: id, value, line: idTok.line, col: idTok.col, __isConstant: true };
        }

        // --- LET / CONST declarations
        if (peek()?.type === 'LET' || peek()?.type === 'CONST') {
            const kw = consume(peek().type);
            const idTok = consume('IDENTIFIER');
            let init = null;
            if (peek()?.type === 'EQUAL') {
                consume('EQUAL');
                init = parseComparison();
            }
            return { type: "VarDeclaration", kind: kw.type /* LET / CONST */, identifier: idTok.value, init, line: idTok.line, col: idTok.col };
        }

        // --- Assignment: identifier EQUAL / += etc
        if (peek()?.type === 'IDENTIFIER' && ['EQUAL', 'PLUS_EQ', 'MINUS_EQ', 'DIV_EQ', "MULT_EQ"].includes(tokens[current + 1]?.type)) {
            const idTok = consume('IDENTIFIER');
            const op = tokens[current++].type;
            const value = parseComparison();
            return { type: "Assignment", operator: op, identifier: idTok.value, value, line: idTok.line, col: idTok.col };
        }

        // --- Method call: parent > method
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'METHOD_CALL') {
            const parent = consume('IDENTIFIER').value;
            consume('METHOD_CALL');
            const method = consume('IDENTIFIER');

            let args = [];
            if (peek()?.type === 'LPAREN') {
                args = collectArguments();
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
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

        // --- Function call with @
        if (peek()?.type === 'AT') {
            consume('AT');
            const func = consume('IDENTIFIER');
            let args = [];
            if (peek()?.type === 'LPAREN') {
                args = collectArguments();
            }
            return { type: "FunctionCall", name: func.value, args, line: func.line, col: func.col };
        }

        // fallback
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

// ------------------------- Interpreter runtime and evaluator -------------------------

let watchedVariables = {};

function evaluateProgram(input) {
    const env = {
        Math: { type: "math" },
        Date: { type: "date" },
        true: { type: "boolean", value: true },
        false: { type: "boolean", value: false }
    };

    watchedVariables = {};

    try {
        const tokens = tokenize(input);
        const ast = parse(tokens);
        for (const node of ast.body) {
            evaluate(node, env);
        }
    } catch (e) {
        handleError(e);
    }
}

function runBody(body, env, vars) {
    for (const v of vars) {
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
    for (const v of vars) {
        delete env[v.name];
    }
}

function callFunction(func, args, callerEnv, callerNode = null) {
    // func must be an object created by FunctionDeclaration or AnonymousFunction
    if (func.type !== "Function") {
        runtimeError(callerNode, `Expected a Function, got ${getType(func)}`);
    }

    // The function should carry a captured environment _env (lexical scope). If not present, use callerEnv as fallback.
    const parentEnv = func._env ? func._env : callerEnv || {};

    // Create a new local environment whose prototype is the function's captured env.
    const localEnv = Object.create(parentEnv);

    for (let i = 0; i < func.params.length; i++) {
        if (args[i] === undefined) runtimeError(callerNode, `Missing argument for parameter "${func.params[i]}"`);
        // store uniform objects like your interpreter expects elsewhere (type/value)
        localEnv[func.params[i]] = args[i];
    }

    // run the function body using runBody (which expects array 'vars' signature)
    const res = runBody(func.body, localEnv, []);
    return res;
}

// ------------------------- Main evaluator -------------------------
function evaluate(node, env = {}) {
    function runWatch(oldValue, newValue) {
        try {
            if (node.identifier in watchedVariables) {
                if (!env[node.identifier]) {
                    runtimeError(node.value, `Cannot assign to watched variable "${node.identifier}" before it has been initialized.`);
                }
                const watchBody = watchedVariables[node.identifier];

                runBody(watchBody, env, [
                    { name: "__old__", type: getType(oldValue), value: oldValue },
                    { name: "__new__", type: getType(newValue), value: newValue }
                ]);
            }
        } catch (e) {
            runtimeError(node.value, `Variable "${node.identifier}" cannot be modified by its own watch handler.`);
        }
    }

    switch (node.type) {
        case "ArrayAssignment": {
            let array = env[node.arrayName];
            if (getType(array) !== "array") {
                runtimeError(node, `Variable ${node.arrayName} is not an array`);
            }

            const idxValues = node.indexes.map(idx => evaluate(idx, env));

            let lastIndex = idxValues.pop();
            let target = array;

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

            if (typeof lastIndex !== "number" || !Number.isInteger(lastIndex)) {
                runtimeError(node, `Array index must be an integer, got: ${lastIndex}`);
            }
            const realLast = lastIndex >= 0 ? lastIndex : target.length + lastIndex;
            if (realLast < 0 || realLast >= target.length) {
                runtimeError(node, `Index ${lastIndex} out of range for array of length ${target.length}`);
            }

            const val = evaluate(node.value, env);

            switch (node.operator) {
                case "EQUAL": target[realLast] = val; break;
                case "PLUS_EQ": target[realLast] += val; break;
                case "MINUS_EQ": target[realLast] -= val; break;
                case "MULT_EQ": target[realLast] *= val; break;
                case "DIV_EQ": target[realLast] /= val; break;
                default: runtimeError(node.value, `Unknown assignment operator: ${node.operator}`);
            }

            return target[realLast];
        }

        case "VarDeclaration": {
            // kind === 'LET' or 'CONST'
            const isConst = node.kind === 'CONST';
            if (Object.prototype.hasOwnProperty.call(env, node.identifier)) {
                runtimeError(node, `Variable "${node.identifier}" already declared in this scope`);
            }
            const initVal = node.init ? evaluate(node.init, env) : undefined;
            // store consistent object format with type & value? Many parts expect primitives, but other parts expect {type,value}
            // Your existing environment often stores primitives directly; we will store the raw native values to minimize change.
            // We'll record const metadata in __consts__ on this env object.
            declareVar(env, node.identifier, initVal, isConst);
            return null;
        }

        case "Assignment": {
            const oldValue = env[node.identifier] ? env[node.identifier] : undefined;
            const right = evaluate(node.value, env);

            // const check: is the variable declared as const in any enclosing env?
            if (isConstInEnv(env, node.identifier)) {
                runtimeError(node, `Cannot assign to constant "${node.identifier}"`);
            }

            runWatch(oldValue, right);

            const targetEnv = findVarEnv(env, node.identifier) || env; // assign in existing defining env if found, otherwise assign in current env
            switch (node.operator) {
                case "EQUAL":
                    declareVar(targetEnv, node.identifier, right, false);
                    break;
                case "PLUS_EQ":
                    if (targetEnv[node.identifier] === undefined) runtimeError(node, `Variable "${node.identifier}" is not defined`);
                    declareVar(targetEnv, node.identifier, targetEnv[node.identifier] + right, false);
                    break;
                case "MINUS_EQ":
                    if (targetEnv[node.identifier] === undefined) runtimeError(node, `Variable "${node.identifier}" is not defined`);
                    declareVar(targetEnv, node.identifier, targetEnv[node.identifier] - right, false);
                    break;
                case "MULT_EQ":
                    if (targetEnv[node.identifier] === undefined) runtimeError(node, `Variable "${node.identifier}" is not defined`);
                    declareVar(targetEnv, node.identifier, targetEnv[node.identifier] * right, false);
                    break;
                case "DIV_EQ":
                    if (targetEnv[node.identifier] === undefined) runtimeError(node, `Variable "${node.identifier}" is not defined`);
                    declareVar(targetEnv, node.identifier, targetEnv[node.identifier] / right, false);
                    break;
                default:
                    runtimeError(node, `Unknown assignment operator: ${node.operator}`);
            }
            return targetEnv[node.identifier];
        }

        case "Program":
            // Not used same as earlier; if needed, you can implement evaluateProgram
            return null;

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
            // Walk prototypes to find variable (lexical lookup)
            const foundEnv = findVarEnv(env, node.value);
            if (foundEnv) return foundEnv[node.value];
            runtimeError(node, `Undefined variable: ${node.value}`);

        case "FunctionDeclaration":
            // When declaring a function, capture the current env for closures
            // store object with type "Function" and _env reference
            const funcObj = {
                type: "Function",
                name: node.name,
                params: node.params,
                body: node.body,
                _env: env // capture lexical environment
            };
            declareVar(env, node.name, funcObj, false);
            return null;

        case "BinaryExpression":
            const left = evaluate(node.left, env);
            const right = evaluate(node.right, env);

            function guard() {
                if (getType(left) !== getType(right)) {
                    runtimeError(node, `Type mismatch in binary expression: ${getType(left)} ${node.operator} ${getType(right)}`);
                }
            }

            switch (node.operator) {
                case "+": {
                    if (getType(left) === "string" && getType(right) === "number") return left + right.toString();
                    guard();
                    return left + right;
                }
                case "-": {
                    if (getType(left) === "string" && getType(right) === "string") return left.replace(right, '');
                    guard();
                    return left - right;
                }
                case "*": {
                    if (getType(left) === "string" && getType(right) === "number") return left.repeat(right);
                    guard();
                    return left * right;
                }
                case "/": {
                    if (getType(left) === "string" && getType(right) === "string") return left.replaceAll(right, '');
                    if (getType(left) === "string" && getType(right) === "number") return left.match(new RegExp(`.{1,${right}}`, 'g'));
                    guard();
                    return left / right;
                }
                case " > ": {
                    guard();
                    return left > right;
                }
                case " < ": {
                    guard();
                    return left < right;
                }
                case ">=": {
                    guard();
                    return left >= right;
                }
                case "<=": {
                    guard();
                    return left <= right;
                }
                case "==": {
                    guard();
                    return left == right;
                }
                case "!=": {
                    guard();
                    return left != right;
                }
                default: runtimeError(node, `Unknown operator: ${node.operator}`);
            }

        case "MethodCall": {
            let parentValue = null;
            if (node.parent) {
                // if parent is an identifier string (older style) evaluate as Identifier or literal
                if (node.parent.type === 'Identifier') {
                    parentValue = evaluate(node.parent, env);
                } else {
                    parentValue = evaluate(node.parent, env);
                }
            }

            let parentType = "global";
            if (parentValue !== null && parentValue !== undefined) {
                parentType = getType(parentValue);
            }

            let method = MethodRegistry.get(parentType, node.name);
            if (!method) method = MethodRegistry.get("any", node.name);

            if (!method) runtimeError(node, `Unknown method: ${parentType}>${node.name}`);

            const evaluatedArgs = node.args.map(arg => evaluate(arg, env));

            let args = [];

            node.args.forEach((argNode, index) => {
                args.push({
                    value: evaluatedArgs[index],
                    line: argNode.line,
                    col: argNode.col
                });
            });

            return method.execute(parentValue, args, node, env);
        }

        case "FunctionCall": {
            const func = evaluate({ type: "Identifier", value: node.name }, env);
            const argValues = node.args.map(a => evaluate(a, env));
            return callFunction(func, argValues, env, node);
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
                    { name: "__iter__", type: "number", value: i }
                ]);
            }
            return null;

        case "ConditionalLoopStatement":
            let ii = 0;
            while (true) {
                const cond = evaluate(node.condition, env);
                if (typeof cond !== "boolean") {
                    runtimeError(node, `Loop condition must evaluate to a boolean, got: ${cond}`);
                }
                if (!cond) break;
                runBody(node.body, env, [{ name: "__iter__", type: "number", value: ii }]);
                ii++;
            }
            return null;

        case "IfStatement": {
            let condition = evaluate(node.condition, env);
            if (condition === 0) condition = false;
            if (condition === 1) condition = true;
            if (typeof condition !== "boolean") {
                runtimeError(node, `If condition must evaluate to a boolean, got: ${condition}`);
            }
            if (condition) runBody(node.body, env, []);
            return null;
        }

        case "IfElseStatement": {
            let cond = evaluate(node.condition, env);
            if (cond === 0) cond = false;
            if (cond === 1) cond = true;
            if (typeof cond !== "boolean") {
                runtimeError(node, `If condition must evaluate to a boolean, got: ${cond}`);
            }
            if (cond) runBody(node.body, env, []); else runBody(node.elseBody, env, []);
            return null;
        }

        case "AnonymousFunction":
            return {
                type: "Function",
                name: "<anonymous>" + (Math.random().toString(36).substring(2)) + (Math.random().toString(36).substring(2)),
                params: node.params,
                body: node.body,
                _env: env
            };

        case "WatchDeclaration":
            watchedVariables[node.variable] = node.body;
            return null;

        default:
            runtimeError(node, `Unknown node type: ${node.type}`);
    }
}