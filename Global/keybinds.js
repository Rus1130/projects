class Keybinds {
    createSingle(key, eventType, callback) {
        if(!["down", "up", "press"].includes(eventType)) {
            console.warn("Invalid event type; must be down, up, or press");
            return;
        }
        document.addEventListener("key"+eventType, function(e) {
            if(e.key === key) {
                callback();
            }
        });
    }

    createCombo(key, fullRelease, callback) {
        let keys = key.split("+");
        let keyDown = [];
        document.addEventListener("keydown", function(e){
            if(keys.includes(e.key)){
                keyDown.push(e.key);
                if(keyDown.length == keys.length){
                    callback();
                }
            }
        });
        document.addEventListener("keyup", function(e){
            if(fullRelease){
                keyDown = [];
            } else if(keys.includes(e.key)){
                keyDown = keyDown.filter(function(value, index, arr){
                    return value != e.key;
                });
            }
        });
    }

    createDouble(key, time, callback){
        let lastPress = 0;
        let timesPressed = 0;
        document.addEventListener("keydown", function(e){
            if(e.key === key){
                if(Date.now() - lastPress <= time){
                    callback();
                }
                lastPress = Date.now();
                timesPressed++;
                if(timesPressed == 2){
                    timesPressed = 0;
                    lastPress = 0;
                }
            }
        });
    }
}