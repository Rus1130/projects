class Keybinds {
    constructor() {
        document.addEventListener('mousemove', function(event){
            Keybinds.mouseX = event.clientX;
            Keybinds.mouseY = event.clientY;
        });
    }
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
     * @returns {Object.<string, number>} the current mouse position
     */
    get mousePos() {
        return {x: Keybinds.mouseX, y: Keybinds.mouseY};
    }

    /**
     * @param {string[]} key array of keys to listen for
     * @param {Boolean} fullRelease if true, all keys must be released before the combo can be triggered again
     * @param {function} callback the callback function
     * @description creates a key combo event listener
     */
    createCombo(keys, fullRelease, callback) {
        keys = keys.split("+")
        let keysDown = {};
        document.addEventListener("keydown", function(e){
            if(!keysDown[e.key]) keysDown[e.key] = true;
            if(keys.every(key => keysDown[key])){
                callback();
                if(fullRelease){
                    keysDown = {};
                }
            }
        });
        document.addEventListener("keyup", function(e){
            if(keysDown[e.key]) keysDown[e.key] = false;
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

const _Keybinds = Keybinds;

export { _Keybinds as Keybinds };