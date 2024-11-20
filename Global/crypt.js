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

    static stringToBase60(str) {
        let t=(n)=>{let b='0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz_',d=0;for(let i=0;i<n.length;i++)d=d*60+b.indexOf(n[i]);return d;}
        let arr = t(+str.split('').map(x=>x.charCodeAt(0)+100).join(''));
        return arr;
    }

    static base60ToString(str) {
        let f=(n)=>{let b='0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz_',d='';for(let i=0;n>0;i++)d=b[n%60]+d,n=(n-n%60)/60;return d;}
        let result = String(f(str)).match(/.{1,3}/g).map(x=>String.fromCharCode(x-100)).join("");
        return result;
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