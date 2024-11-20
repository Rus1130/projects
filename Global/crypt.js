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

    static encrypt(string){
        function random(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        let decimalValues = string.split('').map(char => char.charCodeAt(0))

        let encryptedMessageArray = []
        let keysArray = []
        let keyModifiersArray = []
        let keyModifierOverflowCount = [];

        

        for(let i = 0; i < decimalValues.length; i++){
            let originalValue = decimalValues[i]
            let randomValue = random(200, 240)
            let newValue = originalValue + randomValue

            let key = newValue - (newValue >> 5 << 5)
            let message = newValue >> 5
            let keyModifier = randomValue ^ 0xAB

            keyModifierOverflowCount.push(0)

            while(keyModifier >= 50){
                keyModifier -= 50
                keyModifierOverflowCount[i]++
            }

            // keyModifierOverflowCount[i] = "KMO" + keyModifierOverflowCount[i]
            // encryptedMessageArray.push("MSG" + message)
            // keysArray.push("KEY" + key)
            // keyModifiersArray.push("KMF" + keyModifier)

            

            keyModifierOverflowCount[i] = keyModifierOverflowCount[i]
            encryptedMessageArray.push(message)
            keysArray.push(key)
            keyModifiersArray.push(keyModifier)
        }


        let reorderingArray = []


        for(let i = 0; i < decimalValues.length; i++){
            if(i % 2 == 0){
                reorderingArray.push(keysArray[i])
                reorderingArray.push(keyModifiersArray[i])
                reorderingArray.push(keyModifierOverflowCount[i])
                reorderingArray.push(encryptedMessageArray[i])
            } else {
                reorderingArray.push(keyModifiersArray[i])
                reorderingArray.push(keysArray[i])
                reorderingArray.push(encryptedMessageArray[i])
                reorderingArray.push(keyModifierOverflowCount[i])
            }
        }

        let finalEncryptedMessage = reorderingArray.slice(0, reorderingArray.length / 2).map(x => String.fromCharCode(x + 600)).join("")
        let finalKey = reorderingArray.slice(reorderingArray.length / 2).map(x => String.fromCharCode(x + 950)).join("")

        return finalEncryptedMessage + finalKey;
    }

    /*
    static decrypt(input){
        let half = input.length / 2;
        let reorderArray = input.slice(0, half).split("").concat(input.slice(half).split(""));

        let resizedReorderArray = [];


        for(let i = 0; i < 4; i++){
            resizedReorderArray.push([])
            for(let j = 0; j < reorderArray.length / 4; j++){
                resizedReorderArray[i].push(reorderArray[i + j * 4])
            }
        }

        for(let j = 0; j < resizedReorderArray[0].length; j++){
            if(j % 2 == 1){
                let temp = resizedReorderArray[0][j]
                resizedReorderArray[0][j] = resizedReorderArray[1][j]
                resizedReorderArray[1][j] = temp
            } else {
                let temp = resizedReorderArray[2][j]
                resizedReorderArray[2][j] = resizedReorderArray[3][j]
                resizedReorderArray[3][j] = temp
            }
        }


        try {
            for(let i = 0; i < resizedReorderArray.length; i++){
                for(let j = 0; j < resizedReorderArray[i].length; j++){
                    if(i == 0 || i == 1){
                        if(j >= resizedReorderArray[i].length / 2){
                            resizedReorderArray[i][j] = resizedReorderArray[i][j].charCodeAt(0) - 950
                        } else {
                            resizedReorderArray[i][j] = resizedReorderArray[i][j].charCodeAt(0) - 600
                        }
                    } else if(i == 2 || i == 3){
                        if(j >= resizedReorderArray[i].length / 2){
                            resizedReorderArray[i][j] = resizedReorderArray[i][j].charCodeAt(0) - 950
                        } else {
                            resizedReorderArray[i][j] = resizedReorderArray[i][j].charCodeAt(0) - 600
                        }
                    }
                    if(resizedReorderArray[i][j] > 50){
                        resizedReorderArray[i][j] = resizedReorderArray[i][j] - (950 - 600)
                    }
                }
            }
        } catch(e){}

        let messages = resizedReorderArray[2]
        let keys = resizedReorderArray[0]
        let keyModifiers = resizedReorderArray[1]
        let keyModifierOverflowCount = resizedReorderArray[3]


        let decryptedMessage = []

        for(let i = 0; i < messages.length; i++){
            decryptedMessage.push(((messages[i] << 5) + keys[i]) - ((keyModifiers[i] + 50 * keyModifierOverflowCount[i]) ^ 0xAB))
        }
        
        let result = decryptedMessage.map(x => String.fromCharCode(x)).join('')
        return result
    }
    */
    static decrypt(input) {
        let a = input.slice(0, input.length / 2).split("").concat(input.slice(input.length / 2,).split(""))
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