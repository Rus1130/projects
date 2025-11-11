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
            const actualType = typeof args[i];
            const allowed = spec.types.includes("any") || spec.types.includes(actualType);
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

    static register(method) {
        const parent = method.parentType || "global";
        if (!this.methods[parent]) this.methods[parent] = {};
        this.methods[parent][method.name] = method;
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
    print(args[0]);
}));

MethodRegistry.register(new Method("any", "type", [] , function(parent, args) {
    return (typeof parent)
}));

function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
        ['NUMBER', /^\d+/],
        ['STRING', /^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/],
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
        if (!matched) throw new Error(`Unexpected token '${input[0]}' at ${line}:${col}`);
    }

    return tokens;
}

function parse(tokens) {
    let current = 0;

    function peek() { return tokens[current]; }
    function consume(type) {
        const token = peek();
        if (token && token.type === type) {
            current++;
            return token;
        }
        if (token) {
            throw new Error(`Expected ${type}, found ${token.type} at line ${token.line}, column ${token.col}`);
        } else {
            throw new Error(`Expected ${type}, but reached end of input`);
        }
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
            node = { type: "BinaryExpression", operator: op, left: node, right: parseFactor() };
        }
        return node;
    }

    function parseFactor() {
        const token = peek();
        if (!token) throw new Error("Unexpected end of input");

        if (token.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'ARROW') {
            const parent = consume('IDENTIFIER').value;
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

            return { type: "MethodCall", parent, name: methodName, args };
        }
        if (token.type === 'NUMBER') return { type: "NumberLiteral", value: Number(tokens[current++].value) };
        if (token.type === 'STRING') {
            const raw = tokens[current++].value;
            // Remove surrounding quotes and unescape
            const val = raw.slice(1, -1).replace(/\\(["'\\nrt])/g, (_, c) => {
                switch (c) {
                    case "n": return "\n";
                    case "r": return "\r";
                    case "t": return "\t";
                    default: return c;
                }
            });
            return { type: "StringLiteral", value: val };
        }
        if (token.type === 'IDENTIFIER') {
            // Handle function calls like print(expr)
            if (tokens[current + 1] && tokens[current + 1].type === 'LPAREN') {
                const name = tokens[current++].value;
                consume('LPAREN');
                const arg = parseExpression();
                consume('RPAREN');
                return { type: "CallExpression", name, argument: arg };
            }
            return { type: "Identifier", value: tokens[current++].value };
        }
        if (token.type === 'LPAREN') {
            consume('LPAREN');
            const expr = parseExpression();
            consume('RPAREN');
            return expr;
        }

        throw new Error(`Unexpected token: ${token.type}`);
    }

    function parseStatement() {
        // assignment
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'EQUAL') {
            const id = consume('IDENTIFIER').value;
            consume('EQUAL');
            const value = parseExpression();
            return { type: "Assignment", identifier: id, value };
        }

        // method call: parent > method
        if (peek()?.type === 'IDENTIFIER' && tokens[current + 1]?.type === 'ARROW') {
            const parent = consume('IDENTIFIER').value;
            consume('ARROW');
            const methodName = consume('IDENTIFIER').value;

            // optional parentheses or single arg
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

        // global call
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

        // fallback: expression
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

        case "Identifier":
            if (node.value in env) return env[node.value];
            throw new Error(`Undefined variable: ${node.value}`);

        case "Assignment":
            env[node.identifier] = evaluate(node.value, env);
            return env[node.identifier];

    case "BinaryExpression":
        const left = evaluate(node.left, env);
        const right = evaluate(node.right, env);
        switch (node.operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
            default: throw new Error(`Unknown operator: ${node.operator}`);
        }

    case "CallExpression":
        if (node.name === "print") {
            const val = evaluate(node.argument, env);
            print(val)
            return val;
        }
        throw new Error(`Unknown function: ${node.name}`);

    case "MethodCall": {
        const parentValue = node.parent ? evaluate({ type: "Identifier", value: node.parent }, env) : null;

        // Determine the type name for lookup
        let parentType = "global";
        if (parentValue !== null && parentValue !== undefined) {
            parentType = typeof parentValue;
        }

        // Get the most specific method for that type or fallback to "any"
        let method = MethodRegistry.get(parentType, node.name);
        if (!method) method = MethodRegistry.get("any", node.name);

        if (!method)
            throw new Error(`Unknown method: ${parentType}>${node.name}`);

        const evaluatedArgs = node.args.map(arg => evaluate(arg, env));

        return method.fn(parentValue, evaluatedArgs);
    }

    default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
}