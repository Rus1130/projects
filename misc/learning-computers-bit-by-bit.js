function hexToAscii(hex){
    var hexArr = hex.split(" ");
    var str = "";
    for(i = 0; i < hexArr.length; i++){
        str += String.fromCharCode(parseInt(hexArr[i], 16));
    }
    return str;
}

console.log(hexToAscii("4c 65 61 72 6e 69 6e 67 20 63 6f 6d 70 75 74 65 72 73 20 22 62 69 74 20 62 79 20 62 69 74 22"));