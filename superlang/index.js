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

        for (let i = 0; i < args.length; i++) {
            const spec = this.argSpecs[i];
            let actualType = getType(args[i]);

            const allowed =
                spec.types.includes("any") || spec.types.includes(actualType);
            
            if (!allowed) {
                throw new Error(`Argument ${i + 1} of ${this.fullName()} must be one of [${spec.types.join(", ")}], got ${actualType}`);
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

MethodRegistry.register(new Method(null, "print", [{
    types: ["string", "number"]
}], (parent, args) => {
    outputToTerminal(args[0]);
}));

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
    })
);

function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
        ['AT', /^@/],
        ['NUMBER', /^-?\d+(.\d+)?/],
        ['STRING', /^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/],
        ['LBRACKET', /^\[/],
        ['RBRACKET', /^\]/],
        ['LBRACE', /^\{/],
        ['RBRACE', /^\}/],
        ['IDENTIFIER', /^[a-zA-Z_]\w*/],
        ['ARROW', /^>/],
        ['EQUAL', /^=/],
        ['PLUS', /^\+/],
        ['MINUS', /^-/],
        ['STAR', /^\*/],
        ['SLASH', /^\//],
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
            node = { type: "BinaryExpression", operator: op, left: node, right: parseTerm() };
        }
        return node;
    }

    function parseTerm() {
        let node = parseFactor();
        while (peek() && (peek().type === 'STAR' || peek().type === 'SLASH')) {
            const op = tokens[current++].value;
            node = { type: "BinaryExpression", operator: op, left: node, right: parseFactor(), line: node.line, col: node.col};
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
        }  else if (token.type === 'AT') {
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

    // :{1<2}

    function parseStatement() {
        // --- Function Declaration Lookahead ---
        if (peek()?.type === 'IDENTIFIER' && peek().value === 'def' && tokens[current + 1]?.type === 'IDENTIFIER') {
            consume('IDENTIFIER'); // consume 'def'
            return parseFunctionDeclaration();
        }

        if(peek()?.type === 'IDENTIFIER' && peek().value === 'loop') {
            consume('IDENTIFIER');
            if(peek()?.type === 'NUMBER') {
                const count = parseExpression();
                consume('LBRACE');
                const body = [];
                while (peek() && peek().type !== 'RBRACE') {
                    body.push(parseStatement());
                    if (peek()?.type === 'SEMICOLON') consume('SEMICOLON');
                }
                consume('RBRACE');
                return { type: "LoopStatement", count, body };
            }
        }

        if (peek()?.type === 'IDENTIFIER' && peek().value === 'return') {
            consume('IDENTIFIER');
            const value = parseExpression();
            return { type: "ReturnStatement", value };
        }

        // --- Assignment: identifier = expression
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'EQUAL') {
            const id = consume('IDENTIFIER').value;
            consume('EQUAL');
            const value = parseExpression();
            return { type: "Assignment", identifier: id, value };
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
                    args.push(parseExpression());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseExpression());
                    }
                }
                consume('RPAREN');
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
                // single arg without parentheses
                args.push(parseExpression());
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
                    args.push(parseExpression());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseExpression());
                    }
                }
                consume('RPAREN');
            } else if (peek() && peek().type !== 'SEMICOLON' && peek().type !== 'NEWLINE') {
                args.push(parseExpression());
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
                    args.push(parseExpression());
                    while (peek()?.type === 'COMMA') {
                        consume('COMMA');
                        args.push(parseExpression());
                    }
                }
                consume('RPAREN');
            }
            return { type: "FunctionCall", name, args };
        }

        // --- Return statement: return expr
        if (peek()?.type === 'IDENTIFIER' && peek().value === 'return') {
            consume('IDENTIFIER');
            const value = parseExpression();
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
    for (const node of ast.body) {
        evaluate(node, env);
    }
}

function evaluate(node, env = {}) {
    switch (node.type) {
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
                default: runtimeError(node, `Unknown operator: ${node.operator}`);
            }

        case "MethodCall": {
            // Evaluate parentValue correctly whether node.parent is:
            // - an AST node (ArrayLiteral, MethodCall, Identifier, etc.)
            // - OR a plain string (older parseStatement style)
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

            return method.execute(parentValue, evaluatedArgs);
        }

        case "FunctionCall": {
            const func = env[node.name];
            if (!func || func.type !== "Function") {
                runtimeError(node, `Undefined function: @${node.name}`);
            }

            // Evaluate args
            const argValues = node.args.map(a => evaluate(a, env));

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

        case "LoopStatement": 
            const loopCount = evaluate(node.count, env);
            if (typeof loopCount !== "number" || loopCount < 0 || !Number.isInteger(loopCount)) {
                runtimeError(node, `Loop count must be a non-negative integer, got: ${loopCount}`);
            }
            for (let i = 0; i < loopCount; i++) {
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