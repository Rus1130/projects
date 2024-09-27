class Keybinds {
    /**
     * @param {string} key what single key to listen for
     * @param {string} eventType string that can be "down", "up", or "press"
     * @param {function} callback the callback function
     * @description creates a single key event listener
     */
    createSingle(key, eventType, callback) {
        if(!["down", "up", "press"].includes(eventType)) return console.warn("Invalid event type; must be down, up, or press");
        
        document.addEventListener("key"+eventType, function(e) {
            if(e.key === key) {
                callback();
            }
        });
    }

    /**
     * @param {string[]} key array of keys to listen for
     * @param {Boolean} fullRelease if true, all keys must be released before the combo can be triggered again
     * @param {function} callback the callback function
     * @description creates a key combo event listener
     */
    createCombo(keys, fullRelease, callback) {
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

    /**
     * @method createDouble
     * @param {string} key the key to listen for
     * @param {number} time ms between presses
     * @param {function} callback the callback function
     * @description creates a double click key event listener
     */
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
    
    /**
     * @method createMouse
     * @param {string} type the type of mouse event to listen for
     * @param {function} callback the callback function
     * @description creates a mouse click event listener
     */
    createMouse(button, type, callback){
        if(!["click", "down", "up"].includes(type)) return console.warn("Invalid mouse event type; must be click, down, or up");
        document.addEventListener("mouse"+type, function(e){
            callback();
        });
    }

    /**
     * @method createDoubleMouse
     * @param {number} time ms between presses
     * @param {function} callback the callback function
     * @description creates a double mouse click event listener
     */
    createDoubleMouse(time, callback){
        let lastPress = 0;
        let timesPressed = 0;
        document.addEventListener("mousedown", function(e){
            if(e.button === 0){
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


let k = new Keybinds();