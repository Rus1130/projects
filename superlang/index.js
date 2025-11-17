// ========== AST NODES WITH LINE/COL ==========
function pos(token) {
    return { line: token.line, col: token.col };
}

class Program {
    constructor(body, start) {
        this.type = "Program";
        this.body = body;
        this.start = start;
    }
}

class ExpressionStatement {
    constructor(expression, start) {
        this.type = "ExpressionStatement";
        this.expression = expression;
        this.start = start;
    }
}

class BinaryExpression {
    constructor(operator, left, right, start) {
        this.type = "BinaryExpression";
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.start = start;
    }
}

class Identifier {
    constructor(name, start) {
        this.type = "Identifier";
        this.name = name;
        this.start = start;
    }
}

class Literal {
    constructor(value, start) {
        this.type = "Literal";
        this.value = value;
        this.start = start;
    }
}

class AssignmentExpression {
    constructor(operator, left, right, start) {
        this.type = "AssignmentExpression";
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.start = start;
    }
}

class VariableDeclaration {
    constructor(identifier, init, start) {
        this.type = "VariableDeclaration";
        this.identifier = identifier;
        this.init = init;
        this.start = start;
    }
}

// ========== TOKEN OBJECT ==========
class Token {
    constructor(type, value, line, col) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.col = col;
    }
}

// ========== TOKENIZER ==========
function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
        ['COMMENT', /^\/\/.*/],
        ['COMMENT', /^\/\/\*[\s\S]*?\*\/\//],
        ['AT', /^@/],
        ["BANG", /^!/],
        ["HASH", /^#/],
        ['VAR', /^var\b/],                           // <--- added
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

        for (let [type, regex] of tokenSpec) {
            const match = regex.exec(input);
            if (match) {
                matched = true;

                const text = match[0];

                if (type === "NEWLINE") {
                    tokens.push(new Token("NEWLINE", "\n", line, col));
                    line++;
                    col = 1;
                } else if (type !== "WHITESPACE" && type !== "COMMENT") {
                    tokens.push(new Token(type, text, line, col));
                    col += text.length;
                }

                input = input.slice(text.length);
                break;
            }
        }

        if (!matched) {
            throw new Error(`Unexpected token at ${line}:${col} -- "${input[0]}"`);
        }
    }

    tokens.push(new Token("EOF", null, line, col));
    return tokens;
}


// ========== PARSER (semicolons optional, line/col added) ==========
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    peek() {
        return this.tokens[this.current];
    }

    peekNext() {
        return this.tokens[this.current + 1];
    }

    consume(type) {
        const token = this.peek();
        if (token.type !== type) {
            throw new Error(
                `Parse error at ${token.line}:${token.col}: Expected ${type}, got ${token.type}`
            );
        }
        this.current++;
        return token;
    }

    skipNewlines() {
        while (this.peek().type === "NEWLINE") {
            this.current++;
        }
    }

    parse() {
        const body = [];
        const start = { line: 1, col: 1 };

        this.skipNewlines();

        while (this.peek().type !== "EOF") {
            body.push(this.parseStatement());
            this.skipNewlines();
        }

        return new Program(body, start);
    }

    parseStatement() {
        this.skipNewlines();
        const tok = this.peek();

        // var declaration:
        if (tok.type === "VAR") {
            return this.parseVarDeclaration();
        }

        // expression statement
        const expr = this.parseExpression();
        const start = pos(tok);

        // optional semicolon
        if (this.peek().type === "SEMICOLON") {
            this.consume("SEMICOLON");
        }

        return new ExpressionStatement(expr, start);
    }

    // ----- var x = expr -----
    parseVarDeclaration() {
        const start = pos(this.peek());
        this.consume("VAR");

        const idTok = this.consume("IDENTIFIER");
        const idNode = new Identifier(idTok.value, pos(idTok));

        let init = null;

        if (this.peek().type === "EQUAL") {
            this.consume("EQUAL");
            init = this.parseExpression();
        }

        if (this.peek().type === "SEMICOLON") {
            this.consume("SEMICOLON");
        }

        return new VariableDeclaration(idNode, init, start);
    }


    // ---------------- Expression Parsing ----------------
    parseExpression() {
        return this.parseAssignment();
    }

    parseAssignment() {
        let left = this.parseBinary();

        const tok = this.peek();

        if (["EQUAL", "PLUS_EQ", "MINUS_EQ", "MULT_EQ", "DIV_EQ"].includes(tok.type)) {
            this.consume(tok.type);
            const right = this.parseAssignment();
            return new AssignmentExpression(tok.type, left, right, pos(tok));
        }

        return left;
    }

    parseBinary() {
        let left = this.parsePrimary();

        while (["PLUS", "MINUS", "MULT", "DIV"].includes(this.peek().type)) {
            const opTok = this.consume(this.peek().type);
            const right = this.parsePrimary();
            left = new BinaryExpression(opTok.type, left, right, pos(opTok));
        }

        return left;
    }

    parsePrimary() {
        const tok = this.peek();

        if (tok.type === "NUMBER") {
            this.consume("NUMBER");
            return new Literal(tok.value, pos(tok));
        }

        if (tok.type === "STRING") {
            this.consume("STRING");
            return new Literal(tok.value, pos(tok));
        }

        if (tok.type === "IDENTIFIER") {
            this.consume("IDENTIFIER");
            return new Identifier(tok.value, pos(tok));
        }

        if (tok.type === "LPAREN") {
            this.consume("LPAREN");
            const expr = this.parseExpression();
            this.consume("RPAREN");
            return expr;
        }

        throw new Error(
            `Unexpected token ${tok.type} at ${tok.line}:${tok.col}`
        );
    }
}


// ========== INTERPRETER (env stores {type, value}) ==========
class Interpreter {
    constructor(code) {
        this.tokens = tokenize(code);
        const parser = new Parser(this.tokens);
        this.ast = parser.parse();
        this.env = {}; // { varName: { type: string, value: any } }
    }
}