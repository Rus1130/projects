class Crypt {
    constructor() {
        return console.error(new Error('Useless to instantiate this class, all methods are static'));
    }
    static key = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz_';

    static stringTo(plainText) {
        let mapper = [...plainText].map(x=>String(x.charCodeAt(0)+100).padStart(3, '0')).join('').match(/.{1,15}/g).map(x=>Crypt.to(parseInt(x)));
        return mapper.join(":");
    }

    static stringFrom(cipherText) {
        let mapper = cipherText.split(":").map(x=>Crypt.from(x)).join('').match(/.{1,3}/g).map(x=>String.fromCharCode(parseInt(x)-100)).join('');
        return mapper;
    }

    static to(num) {
        let base60 = Crypt.key;
        let encoded = '';
        while (num) {
            encoded = base60[num % 60] + encoded;
            num = Math.floor(num / 60);
        }
        return encoded;
    }

    static from(str) {
        let base60 = Crypt.key;
        let decoded = 0;
        while (str) {
            decoded = decoded * 60 + base60.indexOf(str[0]);
            str = str.slice(1);
        }
        return decoded;
    }
    static encrypt(s) {
        const a = (b, c) => Math.floor(Math.random() * (c - b + 1)) + b;
        let d = s.split('').map(e => e.charCodeAt(0)), f = [], g = [], h = [], i = [];
        d.forEach(j => {
            let k = a(200, 240), l = j + k, m = l % 32, n = l >> 5, o = k ^ 0xAB;
            let p = 0, q = o; 
            while (q >= 50) q -= 50, p++;
            f.push(n), g.push(m), h.push(q), i.push(p);
        });
        let r = [];
        d.forEach((_, s) => r.push(...(s % 2 ? [h[s], g[s], f[s], i[s]] : [g[s], h[s], i[s], f[s]])));
        return r.slice(0, r.length / 2).map(t => String.fromCharCode(t + 600)).join("") +
               r.slice(r.length / 2).map(u => String.fromCharCode(u + 950)).join("");
    }
    
    static decrypt(s) {
        let a = s.slice(0, s.length / 2).split("").concat(s.slice(s.length / 2,).split(""))
        let b = Array.from({ length: 4 }, (_, i) => Array.from({ length: a.length / 4 }, (_, j) => a[i + j * 4]));
    
        b[0].forEach((_, j) => {if (j % 2) [b[0][j], b[1][j]] = [b[1][j], b[0][j]]; else [b[2][j], b[3][j]] = [b[3][j], b[2][j]];});
    
        b.forEach((row, i) => row.forEach((v, j) => { let c = v.charCodeAt(0) - (j >= row.length / 2 ? 950 : 600); row[j] = c > 50 ? c - 350 : c; }));
    
        return b[2].map((m, i) => String.fromCharCode(((m << 5) + b[0][i]) - ((b[1][i] + 50 * b[3][i]) ^ 0xAB))).join('');
    }

    static obfuscateTextNoCrypt(str) {
        function p(inputArray) {
            const randomIndex = Math.floor(Math.random() * inputArray.length);
            return inputArray.splice(randomIndex, 1)[0];
        }
        let array = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
          
        let arr = str.split('');
        let fromCharCodeVar = p(array);
        let roundVar = p(array);    
        let expVar = p(array);
        let charCodeAtVar = p(array);
        let varDefs = `let ${fromCharCodeVar}='fromCharCode',${roundVar}='round',${expVar}='exp',${charCodeAtVar}='charCodeAt'`
        
        arr.forEach((char, index) => {
            let typeNumber = Math.floor(Math.random() * 2) + 1;
            let type = '';

            if(typeNumber == 1) type = `String[${fromCharCodeVar}](Math[${roundVar}](Math[${expVar}](${Math.log(char.charCodeAt(0))},2)))`
            if(typeNumber == 2){
                let random = Math.floor(Math.random() * 150) + 150;
                type = `String[${fromCharCodeVar}]('${String.fromCharCode(random)}'[${charCodeAtVar}](0)-'${String.fromCharCode(random - char.charCodeAt(0))}'[${charCodeAtVar}](0))`;
            }
            
            arr[index] = type;
        });

        let returnVal = arr.join('+');
        let result = `(()=>{${varDefs};return ${returnVal}})()`;
        return result;
    }

    static obfuscateText(str) {
        function p(inputArray) {
            const randomIndex = Math.floor(Math.random() * inputArray.length);
            return inputArray.splice(randomIndex, 1)[0];
        }
        let array = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        
        let arr = str.split('');
        let varDefs = [];

        let fromCharCodeVar = p(array);
        let roundVar = p(array);
        let expVar = p(array);
        let charCodeAtVar = p(array);
        let fromVar = p(array);
        let StringVar = p(array);
        let MathVar = p(array);
        let CryptVar = p(array);
        
        let declarations = {
            [fromCharCodeVar]: `Crypt['stringFrom']('${Crypt.stringTo('fromCharCode')}')`, // fromCharCode
            [roundVar]: `Crypt['stringFrom']('${Crypt.stringTo('round')}')`, // round
            [expVar]: `Crypt['stringFrom']('${Crypt.stringTo('exp')}')`, // exp
            [charCodeAtVar]: `Crypt['stringFrom']('${Crypt.stringTo('charCodeAt')}')`, // charCodeAt
            [fromVar]: `Crypt['stringFrom']('${Crypt.stringTo('from')}')`, // from
            [StringVar]: `Crypt['stringFrom']('${Crypt.stringTo('String')}')`, // String
            [MathVar]: `Crypt['stringFrom']('${Crypt.stringTo('Math')}')`, // Math
            [CryptVar]: `Crypt['stringFrom']('${Crypt.stringTo('Crypt')}')` // Crypt
        }
        for(let i = 0; i < Object.keys(declarations).length; i++){
            let key = Object.keys(declarations)[i];
            let value = Object.values(declarations)[i];
            varDefs.push(`${key}=${value}`);
        }
        let setup = `let ${varDefs.join(",")}`
        
        arr.forEach((char, index) => {
            let typeNumber = Math.floor(Math.random() * 3) + 1;
            let type = '';

            if(typeNumber == 1) type = `eval(${StringVar})[${fromCharCodeVar}](eval(${MathVar})[${roundVar}](eval(${MathVar})[${expVar}](${Math.log(char.charCodeAt(0))},2)))`
            if(typeNumber == 2){
                let random = Math.floor(Math.random() * 150) + 150;
                type = `eval(${StringVar})[${fromCharCodeVar}]('${String.fromCharCode(random)}'[${charCodeAtVar}](0)-'${String.fromCharCode(random - char.charCodeAt(0))}'[${charCodeAtVar}](0))`;
            }
            if(typeNumber == 3) type = `eval(${StringVar})[${fromCharCodeVar}](eval(${CryptVar})[${fromVar}]('${Crypt.to(char.charCodeAt(0))}'))`;
            
            arr[index] = type;
        });

        let returnVal = arr.join('+');
        let result = `(()=>{${setup};return ${returnVal}})()`;
        return result;
    }
}