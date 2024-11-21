class Crypt {
    constructor() {
        return console.error(new Error('Useless to instantiate this class, all methods are static'));
    }
    static key = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz_';

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
        let arr = str.split('');
        let fromCharCodeVar = ['a', 'b', 'c', 'd', 'q', 'u', 'y', 'E', 'F', 'G', 'H', 'Q', "X"].sort(() => Math.random() - 0.5)[0];
        let roundVar = ['e', 'f', 'g', 'h', 'r', 'v', 'z', 'I', 'J', 'K', 'L', "V", "Y"].sort(() => Math.random() - 0.5)[0]
        let expVar = ['i', 'j', 'k', 'l', 's', 'w', 'A', 'B', 'C', 'D', 'R', "U", "W", "Z"].sort(() => Math.random() - 0.5)[0]
        let charCodeAtVar = ['m', 'n', 'o', 'p', 't', 'x', 'M', 'N', "O", 'P', "T", "S"].sort(() => Math.random() - 0.5)[0]
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
        let arr = str.split('');
        arr.forEach((char, index) => {
            let typeNumber = Math.floor(Math.random() * 3) + 1;
            let type = '';

            if(typeNumber == 1) type = `Math['round'](Math['exp'](${Math.log(char.charCodeAt(0))},2))`
            if(typeNumber == 2) type = `Crypt['from']("${Crypt.to(char.charCodeAt(0))}")`;
            if(typeNumber == 3){
                let random = Math.floor(Math.random() * 150) + 150;
                type = `'${String.fromCharCode(random)}'['charCodeAt'](0)-'${String.fromCharCode(random - char.charCodeAt(0))}'['charCodeAt'](0)`;

            }
            arr[index] = `String['fromCharCode'](${type})`;
        });
        return arr.join('+');
    }

    static reverseMe(str){
        let arr = [...str];
        let leftArr = [];
        let rightArr = [];

        arr.forEach((char, i) => {
            arr[i] = char.charCodeAt(0) + 100;
        });

        for(let i = 0; i < arr.length; i++){
            let right = arr[i] % 25;
            let left = (arr[i] - right) / 25

            leftArr.push(left);
            rightArr.push(right);
        }

        rightArr = rightArr.map(right => right.toString().padStart(2, '0'));

        let left = leftArr.join('');
        let right = rightArr.join('');
        
        let result = left + ":" + right;

        return result;
    }
}