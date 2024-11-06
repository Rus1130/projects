class Crypt {
    constructor() {
        console.warn("Crypt is a static class");
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

    static obfuscateText(str) {
        let arr = str.split('');
        arr.forEach((char, index) => {
            // rand num from 1 to 3
            let typeNumber = Math.floor(Math.random() * 2) + 1;
            let type = '';

            if(typeNumber == 1) type = `Math.round(Math.exp(${Math.log(char.charCodeAt(0))},2))`
            if(typeNumber == 2) type = `Crypt.from("${Crypt.to(char.charCodeAt(0))}")`;
            arr[index] = `String.fromCharCode(${type})`;
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