class Encryption {
    static base60 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x']

    static charPatterns = {
        "A": 7,
        "B": 5,
        "C": 3,
        "D": 1,
        "E": 2,
        "F": 4,
        "G": 6,
    }

    static shiftPatterns = {
        "A": 13,
        "B": 15,
        "C": 14,
        "D": 10,
        "E": 8,
        "F": 9,
        "G": 12,
    }

    static fromBase60(str){
        let result = 0;
        if(str == undefined) return "0";
        for(let i = 0; i < str.length; i++){
            result += Encryption.base60.indexOf(str[i]) * Math.pow(60, str.length - i - 1);
        }
        return result;
    }

    static toBase60(num){
        let result = '';
        while(num > 0){
            result = Encryption.base60[num % 60] + result;
            num = Math.floor(num / 60);
        }
        result = result || "0";
        return result;
    }

    static decryptSingle(bodyVal, keyVal, randVal, firstPattern, secondPattern){
        return ((Encryption.fromBase60(keyVal) ^ Encryption.shiftPatterns[firstPattern]) << 5) + ((Encryption.fromBase60(bodyVal) - Encryption.fromBase60(randVal)) ^ Encryption.charPatterns[secondPattern]) - 300
    }

    encrypt(value){
        let charPattern = Object.keys(Encryption.charPatterns)[Math.floor(Math.random() * Object.keys(Encryption.charPatterns).length)];
        let charVals = value.split('').map(char => char.charCodeAt(0) + 300);


        let shiftPattern = Object.keys(Encryption.shiftPatterns)[Math.floor(Math.random() * Object.keys(Encryption.shiftPatterns).length)];


        let shiftVals = [];

        for(var i = 0; i < charVals.length; i++){
            shiftVals.push((charVals[i] >> 5));
        }

        charVals = charVals.map((char, index) => (char - (shiftVals[index] << 5)));

        let mixedVals = [];

        for(var i = 0; i < shiftVals.length; i++){
            mixedVals.push([Encryption.toBase60(shiftVals[i] ^ Encryption.shiftPatterns[shiftPattern]), Encryption.toBase60(charVals[i] ^ Encryption.charPatterns[charPattern])]);
        }


        let key = `${shiftPattern}${charPattern}`;
        let body = ``;
        
        for(var i = 0; i < mixedVals.length; i++){
            key += mixedVals[i][0];
            body += mixedVals[i][1];
        }

        body = body.split("")
        let randomVals = [];

        for(var j = 0; j < body.length; j++){
            // random from 1 and 20
            let val = Math.floor(Math.random() * 20) + 1;
            body[j] = Encryption.toBase60(Encryption.fromBase60(body[j]) + val)
            key += Encryption.toBase60(val)
        }

        body = body.join("")

        let result = {
            body: body,
            key: key,
        }

        return result;
    }

    decrypt(body, key){

        // split key into two arrays
        let firstPattern = key[0];
        let secondPattern = key[1];

        key = key.slice(2).split("");

        // split key array into two
        let keyArray = key.slice(0, key.length / 2);
        let randArray = key.slice(key.length / 2);
        let bodyArray = body.split("");

        let result = '';

        for(var j = 0; j < bodyArray.length; j++){
            result += String.fromCharCode(Encryption.decryptSingle(bodyArray[j], keyArray[j], randArray[j], firstPattern, secondPattern));
        }

        return result;
    }
}