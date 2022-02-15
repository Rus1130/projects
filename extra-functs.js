function basicMath(operation, num1, num2){
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