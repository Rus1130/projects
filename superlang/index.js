class Method {
    /**
     * @param {string|null} parentType - e.g. "frog" or null for global
     * @param {string} name - method name
     * @param {Array<{types: string[], optional?: boolean}>} argSpecs
     * @param {Function} fn - implementation
     */
    constructor(parentType, name, argSpecs, fn) {
        if(parentType === null) parentType = "global";
        this.parentType = parentType;
        this.name = name;
        this.argSpecs = argSpecs;
        this.fn = fn;
    }

    validateArgs(args) {
        const minArgs = this.argSpecs.filter(a => !a.optional).length;
        const maxArgs = this.argSpecs.length;

        if (args.length < minArgs || args.length > maxArgs) {
            throw new Error(`${this.fullName()} expected ${minArgs}-${maxArgs} arguments, got ${args.length}`);
        }

        const nodeArgs = structuredClone(args);
        args = args.map(a => a.value);

        for (let i = 0; i < args.length; i++) {
            const spec = this.argSpecs[i];
            let actualType = getType(args[i]);

            const allowed =
                spec.types.includes("any") || spec.types.includes(actualType);
            
            if (!allowed) {
                runtimeError(nodeArgs[i], `Argument ${i + 1} of ${this.fullName()} must be one of [${spec.types.join(", ")}], got ${actualType}`);
            }
        }
    }

    execute(parent, args) {
        this.validateArgs(args);
        return this.fn(parent, args);
    }

    fullName() {
        return this.parentType ? `${this.parentType}>${this.name}` : this.name;
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

MethodRegistry.register(
    new Method(null, "print", [{
        types: ["string", "number"]
    }], (parent, args) => {
        outputToTerminal(args[0]);
    }),

    new Method("math", "random", [
        {
            types: ["number"],
            optional: false
        },
        {
            types: ["number"],
            optional: true
        }
    ], (parent, args) => {
        // 1 argument, 0 to n, inclusive
        // 2 arguments, min to max, inclusive
        if(args.length === 2) {
            const min = args[0];
            const max = args[1];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            const n = args[0];
            return Math.floor(Math.random() * (n + 1));
        }
    }),
);

function getType(value) {
    if(value.type !== undefined) return value.type;
    else return Array.isArray(value) ? "array" : typeof value;
}

MethodRegistry.register(
    new Method("any", "type", [] , function(parent, args) {
        return getType(parent);
    }),
    new Method("array", "length", [] , function(parent, args) {
        return parent.length;
    }),
    new Method("array", "join", [{ types: ["string"], optional: true }], function(parent, args) {
        const sep = args[0] !== undefined ? args[0] : ",";
        return parent.join(sep);
    }),
    new Method("array", "index", [{ types: ["number"] }], function(parent, args) {

        const index = args[0] >= 0 ? args[0] : parent.length + args[0];

        if (index < 0 || index >= parent.length) {
            throw new Error(`Index ${index} out of range for array of length ${parent.length}`);
        }
        return parent[index];
    }),
    new Method("string", "length", [] , function(parent, args) {
        return parent.length;
    }),
    new Method("string", "wrap", [
        { types: ["string"] },
        { types: ["string"], optional: true }
    ] , function(parent, args) {
        const left = args[0];
        const right = args[1] !== undefined ? args[1] : left;
        return left + parent + right;
    }),

    new Method("number", "toString", [] , function(parent, args) {
        return parent.toString();
    }),
    new Method("boolean", "toString", [] , function(parent, args) {
        return parent.toString();
    })
);

function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
        ['AT', /^@/],
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
        ['ARROW', /^>/],
        ['EQUAL', /^=/],
        ['PLUS', /^\+/],
        ['MINUS', /^-/],
        ['MULT', /^\*/],
        ['DIV', /^\//],
        ["GT", /^ > /],
        ["LT", /^ < /],
        ["EQ", /^==/],
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
                    if (type !== 'WHITESPACE' && type !== 'NEWLINE') {
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

function runtimeError(node, message) {
    const loc = node && node.line ? `\n    at  line  ${node.line}\n    at column ${node.col}\n` : "";
    if(node == null) throw new Error(message);
    else throw new Error(`${message}${loc}`);
}

function parse(tokens) {
    let current = 0;

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
        if (token) runtimeError(token, `Expected ${type}, but got ${token.type}`);
        else runtimeError(null, `Expected ${type}, but got end of input`);
    }

    function parseFunctionDeclaration() {
        const name = consume('IDENTIFIER').value;
        let params = [];


        // Optional parameters
        if (peek()?.type === 'LPAREN') {
            consume('LPAREN');
            if (peek()?.type !== 'RPAREN') {
                params.push(consume('IDENTIFIER').value);
                while (peek()?.type === 'COMMA') {
                    consume('COMMA');
                    params.push(consume('IDENTIFIER').value);
                }
            }
            consume('RPAREN');
        }

        consume('LBRACE');

        const body = [];
        while (peek() && peek().type !== 'RBRACE') {
            body.push(parseStatement());
            if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
        }

        consume('RBRACE');
        return { type: "FunctionDeclaration", name, params, body };
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
        while (peek()?.type === 'ARROW') {
            consume('ARROW');
            const methodName = consume('IDENTIFIER').value;
            let args = [];
            if (peek()?.type === 'LPAREN') {
                consume('LPAREN');
                if (peek()?.type !== 'RPAREN') {
                    args.push(parseExpression());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseExpression());
                    }
                }
                consume('RPAREN');
            }
            parent = { type: "MethodCall", parent, name: methodName, args, line: parent.line, col: parent.col };
        }
        return parent;
    }

    function parseFactor() {
        let node;
        const token = peek();
        if (!token) runtimeError(null, "Unexpected end of input");

        if (token.type === 'NUMBER') {
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
            const name = consume('IDENTIFIER').value;
            let args = [];
            if (peek()?.type === 'LPAREN') {
                consume('LPAREN');
                if (peek()?.type !== 'RPAREN') {
                    args.push(parseExpression());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseExpression());
                    }
                }
                consume('RPAREN');
            }
            node = { type: "FunctionCall", name, args, line: token.line, col: token.col };
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

    function parseStatement() {
        // --- Function Declaration Lookahead ---
        if (peek()?.type === 'IDENTIFIER' && peek().value === 'def' && tokens[current + 1]?.type === 'IDENTIFIER') {
            consume('IDENTIFIER'); // consume 'def'
            return parseFunctionDeclaration();
        }

        if(peek()?.type === 'IDENTIFIER' && peek().value === 'if') {
            consume('IDENTIFIER');
            const condition = parseComparison();
            consume('LBRACE');
            const body = [];
            while (peek() && peek().type !== 'RBRACE') {
                body.push(parseStatement());
                if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
            }
            consume('RBRACE');
            return { type: "IfStatement", condition, body };
        }

        if(peek()?.type === 'IDENTIFIER' && peek().value === 'loop') {
            consume('IDENTIFIER');
            const next = peek();
            if(next?.type === 'LPAREN') {
                const condition = parseComparison();
                consume('LBRACE');
                const body = [];
                while (peek() && peek().type !== 'RBRACE') {
                    body.push(parseStatement());
                    if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
                }
                consume('RBRACE');
                return { type: "ConditionalLoopStatement", condition, body };
            } else if (next?.type === 'NUMBER' || next?.type === 'IDENTIFIER') {
                let count = consume(['NUMBER', 'IDENTIFIER']);

                consume('LBRACE');
                const body = [];
                while (peek() && peek().type !== 'RBRACE') {
                    body.push(parseStatement());
                    if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
                }
                consume('RBRACE');
                return { 
                    type: "CountLoopStatement", 
                    count: {
                        type: count.type === 'NUMBER' ? "NumberLiteral" : "Identifier",
                        value: count.value,
                        line: next.line,
                        col: next.col 
                    }, 
                    body 
                };

            } else {
                runtimeError(next, `Expected loop count or condition, got: ${next?.type}`);
            }
        }

        // --- Index assignment: identifier:index = expression
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'INDEX' && tokens[current + 2]?.type === 'EQUAL') {
            const id = consume('IDENTIFIER').value;
            consume('INDEX');
            const indexExpr = parseComparison();
            consume('EQUAL');
            const value = parseComparison();
            return { type: "IndexAssignment", identifier: id, index: indexExpr, value };
        }


        if (peek()?.type === 'IDENTIFIER' && peek().value === 'return') {
            consume('IDENTIFIER');
            const value = parseComparison();
            return { type: "ReturnStatement", value };
        }

        // --- Assignment: identifier = expression
        if (peek()?.type === 'IDENTIFIER' && ['EQUAL', 'PLUS_EQ', 'MINUS_EQ', 'DIV_EQ', "MULT_EQ"].includes(tokens[current + 1]?.type)) {
            const id = consume('IDENTIFIER').value;
            const op = tokens[current++].type; // consume =, +=, or -=
            const value = parseComparison();
            return { type: "Assignment", operator: op, identifier: id, value };
        }

        // --- Method call: parent > method (parent is an identifier, older style)
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'ARROW') {
            const parent = consume('IDENTIFIER').value;
            consume('ARROW');
            const methodName = consume('IDENTIFIER').value;

            // optional parentheses or single arg without parentheses
            let args = [];
            if (peek()?.type === 'LPAREN') {
                consume('LPAREN');
                if (peek()?.type !== 'RPAREN') {
                    args.push(parseComparison());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseComparison());
                    }
                }
                consume('RPAREN');
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
                // single arg without parentheses
                args.push(parseComparison());
            }

            return { type: "MethodCall", parent, name: methodName, args };
        }

        // --- Global call: foo(...)  OR foo single-arg-without-parens
        if (peek()?.type === 'IDENTIFIER') {
            const name = consume('IDENTIFIER').value;
            let args = [];
            if (peek()?.type === 'LPAREN') {
                consume('LPAREN');
                if (peek()?.type !== 'RPAREN') {
                    args.push(parseComparison());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseComparison());
                    }
                }
                consume('RPAREN');
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
                args.push(parseComparison());
            }

            return { type: "MethodCall", parent: null, name, args };
        }

        // --- Function call with @ : @name(...)  (calls, not declarations)
        if (peek()?.type === 'AT') {
            consume('AT');
            const name = consume('IDENTIFIER').value;
            let args = [];
            if (peek()?.type === 'LPAREN') {
                consume('LPAREN');
                if (peek()?.type !== 'RPAREN') {
                    args.push(parseComparison());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseComparison());
                    }
                }
                consume('RPAREN');
            }
            return { type: "FunctionCall", name, args };
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
function evaluateProgram(ast, env = {}) {
    env = {
        Math: {
            type: "math",
        }
    }
    for (const node of ast.body) {
        evaluate(node, env);
    }
}

function evaluate(node, env = {}) {
    switch (node.type) {
        case "Assignment": {
            const right = evaluate(node.value, env);
            switch(node.operator) {
                case "EQUAL":
                    env[node.identifier] = right;
                    break;
                case "PLUS_EQ":
                    env[node.identifier] += right;
                    break;
                case "MINUS_EQ":
                    env[node.identifier] -= right;
                    break;
                case "MULT_EQ":
                    env[node.identifier] *= right;
                    break;
                case "DIV_EQ":
                    env[node.identifier] /= right;
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

        case "Identifier":
            if (node.value in env) return env[node.value];
            runtimeError(node, `Undefined variable: ${node.value}`);

        case "Assignment":
            env[node.identifier] = evaluate(node.value, env);
            return env[node.identifier];

        case "FunctionDeclaration":
            env[node.name] = {
                type: "Function",
                params: node.params,
                body: node.body,
            };
            return null;

        case "BinaryExpression":
            const left = evaluate(node.left, env);
            const right = evaluate(node.right, env);

            if (getType(left) !== getType(right)) {
                runtimeError(node, `Type mismatch in binary expression: ${getType(left)} ${node.operator} ${getType(right)}`);
            }

            switch (node.operator) {
                case "+": return left + right;
                case "-": return left - right;
                case "*": return left * right;
                case "/": return left / right;
                case " > ": return left > right;
                case " < ": return left < right;
                case ">=": return left >= right;
                case "<=": return left <= right;
                case "==": return left == right;
                case "!=": return left != right;
                default: runtimeError(node, `Unknown operator: ${node.operator}`);
            }

        case "MethodCall": {
            // Evaluate parentValue correctly whether node.parent is:
            let parentValue = null;
            if (node.parent) {
                if (getType(node.parent) === "string") {
                    parentValue = evaluate({ type: "Identifier", value: node.parent }, env);
                } else {
                    parentValue = evaluate(node.parent, env);
                }
            }

            // runtime parent type for lookup
            let parentType = "global";
            if (parentValue !== null && parentValue !== undefined) {
                parentType = getType(parentValue);
            }

            // lookup method by runtime parent type, then fallback to "any"
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
                })
            });


            return method.execute(parentValue, args);
        }

        case "FunctionCall": {
            const func = env[node.name];
            if (!func || func.type !== "Function") {
                runtimeError(node, `Undefined function: @${node.name}`);
            }

            // Evaluate args
            const argValues = node.args.map(a => evaluate(a.value, env));

            // Create new scope
            const localEnv = Object.create(env);

            // Bind params
            for (let i = 0; i < func.params.length; i++) {
                if (argValues[i] === undefined) {
                    runtimeError(node, `Missing argument for parameter "${func.params[i]}" in function @${node.name}`);
                }
                localEnv[func.params[i]] = argValues[i];
            }

            // Execute body
            let result = null;
            for (const stmt of func.body) {
                const value = evaluate(stmt, localEnv);
                if (value && value.__return !== undefined) {
                    result = value.__return;
                    break;
                }
            }
            return result;
        }

        case "ReturnStatement":
            return { __return: evaluate(node.value, env) };

        case "CountLoopStatement": 
            let loopCount = evaluate(node.count, env);

            if (typeof loopCount !== "number" || !Number.isInteger(loopCount) || loopCount < 0) {
                runtimeError(node, `Loop count must be a non-negative integer, got: ${loopCount}`);
            }
            for (let i = 0; i < loopCount; i++) {
                env["__iter__"] = i;
                for (const stmt of node.body) {
                    const value = evaluate(stmt, env);
                    if (value && value.__return !== undefined) {
                        return value.__return;
                    }
                }
                delete env["__iter__"];
            }
            return null;

        case "ConditionalLoopStatement":
            while (true) {
                const cond = evaluate(node.condition, env);
                if (typeof cond !== "boolean") {
                    runtimeError(node, `Loop condition must evaluate to a boolean, got: ${cond}`);
                }
                if (!cond) break;

                for (const stmt of node.body) {
                    const value = evaluate(stmt, env);
                    if (value && value.__return !== undefined) {
                        return value.__return;
                    }
                }
            }
            return null;

        case "IfStatement":
            const condition = evaluate(node.condition, env);
            if (typeof condition !== "boolean") {
                runtimeError(node, `If condition must evaluate to a boolean, got: ${condition}`);
            }
            if (condition) {
                for (const stmt of node.body) {
                    const value = evaluate(stmt, env);
                    if (value && value.__return !== undefined) {
                        return value.__return;
                    }
                }
            }
            return null;

        default:
            runtimeError(node, `Unknown node type: ${node.type}`);
        }
}