//help function

function ejsHelp(){
    return "ejsBasicMath(operation, num1, num2) \n ejsAdvMath(operation, num1, num2)"
}

function ejsHelp(name){
    switch(name){
        case BasicMath:
            return "operaton: add (a), subtract (s), multiply (m), and divide (d) \n num1: a number \n num2: another number"
            break;
        case AdvMath:
            return "operation: modulus (m) bitand (a), bitor (o), bitxor (x), and exponentiation (e) \n num1: a number \n num2: another number"
            break;
    }
}

//basic math

function ejsBasicMath(operation, num1, num2){
    switch(operation){
        case "a":
            return parseInt(num1) + parseInt(num2);
            break
        case "s":
            return parseInt(num1) - parseInt(num2);
            break;
        case "m":
            return parseInt(num1) * parseInt(num2);
            break;
        case "d":
            return parseInt(num1 / num2);
            break;
    }
}

//advanced math

function ejsAdvMath(operation, num1, num2){
    switch(operation){
        case "m":
            return parseInt(num1) % parseInt(num2)
            break;
        case "a":
            return parseInt(num1) & parseInt(num2)
            break;
        case "o":
            return parseInt(num1) | parseInt(num2)
            break;
        case "x":
            return parseInt(num1) ^ parseInt(num2)
            break;
        case "e":
            return parseInt(num1) ** parseInt(num2)
    }
}