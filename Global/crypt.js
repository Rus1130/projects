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
        const r = (a, b) => Math.random() * (b - a + 1) | 0 + a;
        let o = [], d = s.split('').map(c => c.charCodeAt(0));
        d.forEach((v, i) => {
            let n = v + r(200, 240), t = n % 32, u = n >> 5, x = r(200, 240) ^ 0xAB, y = 0;
            while (x >= 50) x -= 50, y++;
            let g = [t, x, y, u];
            o.push(...(i % 2 ? [g[1], g[0], g[3], g[2]] : g));
        });
        let p = o.length / 2;
        return o.slice(0, p).map(z => String.fromCharCode(z + 600)).join("") + o.slice(p).map(z => String.fromCharCode(z + 950)).join("");
    }
    
    static decrypt(input) {
        let [x,y]=[input.slice(0,Math.ceil(input.length/2)).split(""),input.slice(Math.ceil(input.length / 2)).split("")];
        let a=x.concat(y),b=[[],[],[],[]],c=[];
        for(i=0;i<a.length;i++)b[i % 4].push(a[i]);
        b[0].forEach((x,j)=>{
            if (j%2)[b[0][j],b[1][j]]=[b[1][j],b[0][j]];
            else[b[2][j],b[3][j]]=[b[3][j],b[2][j]];
        });
        b.forEach((r,i)=>r.forEach((v, j)=>{
            let c=v.charCodeAt(0)-(j>=r.length/2?950:600);b[i][j]=c>50?c-350:c;
        }));b[2].forEach((d,i)=>c.push(((d<<5)+b[0][i])-((b[1][i]+50*b[3][i])^0xAB)));
        return c.map(x=>String.fromCharCode(x)).join('');
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