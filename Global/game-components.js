/**
 * @typedef {Object} HTMLElement
*/
/**
 * @typedef {Object} GameObject_
 * @property {HTMLElement} element the element of the game object
 * @property {number} x the x position of the game object
 * @property {number} y the y position of the game object
 */

/**
 * @description a class to create a player object
 */
class Player {
    static keys = [];

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     * @description macro to help with the creation of a player element
     * @returns {HTMLElement}
     */
    static CreatePlayerElement(x, y, width, height, color) {
        let element = document.createElement("div");
        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.width = width + "px";
        element.style.height = height + "px";
        element.style.backgroundColor = color;
        element.style.position = "absolute";
        document.body.appendChild(element);
        return element;
    }

    /**
     * @param {number} width
     * @param {number} height
     * @param {string} color
     * @description macro to help with the creation of a player element
     * @returns {HTMLElement}
     */
    static CreateComponentElement(width, height, color) {
        let element = document.createElement("div");
        element.style.width = width + "px";
        element.style.height = height + "px";
        element.style.backgroundColor = color;
        element.style.position = "absolute";
        return element;
    }

    /**
     * @constructor 
     * @param {HTMLElement} element the element the player will control
     * @param {number} x the x position of the player
     * @param {number} y the y position of the player
     * @param {String} [overflowType="restrict"] restrict will keep the player within the window, wrap will wrap the player around the window; 'restrict' or 'wrap'
     * @description creates a player object
     */
    constructor(element, x, y, overflowType) {
        this.element = element;
        this.x = x || 0;
        this.y = y || 0;
        this.vx = 0;
        this.vy = 0;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.overflowType = overflowType || 'restrict';
        this.components = [];
        this.lowestComponentXOffset = 0;
        this.lowestComponentYOffset = 0;

        this.components.push(this.element);
        document.addEventListener('keydown', function(event) { Player.keys[event.key] = true; });
        document.addEventListener('keyup', function(event) { Player.keys[event.key] = false; });
    }

    /**
     * @description checks if the player collides with an element
     * @param {HTMLElement} element the element to check for collision
     * @param {number} [offset=0] the number of pixels to restrict the hitbox by
     * @returns {boolean} true if the player collides with the element
     */
    collidesWith(element, offset) {
        let collides = false;
        // restricts the hitbox by pixels
        offset = offset || 0;

        Player.components.forEach((component) => {
            let compRect = component.getBoundingClientRect();
            let objectRect = element.getBoundingClientRect();
            collides = collides || !(
                compRect.top + offset > objectRect.bottom ||
                compRect.right - offset < objectRect.left ||
                compRect.bottom - offset < objectRect.top ||
                compRect.left + offset > objectRect.right
            );
        });

        return collides;
    }

    /**
     * @param {GameObject_} component the component to add to the player
     */
    addComponent(component) {
        component.element.style.left = component.x + 'px';
        component.element.style.top = component.y + 'px';

        if(component.x < this.lowestComponentXOffset) this.lowestComponentXOffset = component.x;
        if(component.y < this.lowestComponentYOffset) this.lowestComponentYOffset = component.y;

        this.components.push(component.element);
        this.element.appendChild(component.element);
    }

    /**
     * @param {GameObject_} component the component to remove from the player
     */
    removeComponent(component) {
        let index = this.components.indexOf(component.element);
        if(index > -1) this.components.splice(index, 1);
        component.element.remove();
    }

    /**
     * @returns {Object} the center of the player
     */
    getPlayerCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    /**
     * @description updates the position of the player based on key presses
     */
    updatePosition() {
        if(Player.keys["w"]) this.vy -= 1;
        if(Player.keys["s"]) this.vy += 1;
        if(Player.keys["a"]) this.vx -= 1;
        if(Player.keys["d"]) this.vx += 1;


        this.vx = math.round(this.vx * 0.9, 4);
        this.vy = math.round(this.vy * 0.9, 4);

        this.x += this.vx;
        this.y += this.vy;

        this.x = math.round(this.x);
        this.y = math.round(this.y);

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        
        let playerWidth = 50;
        let playerHeight = 50;

        for(let i = 0; i < this.components.length; i++){
            if(this.components[i].offsetWidth > playerWidth) playerWidth = this.components[i].offsetWidth;
            if(this.components[i].offsetHeight > playerHeight) playerHeight = this.components[i].offsetHeight;
        }

        if(this.overflowType == 'restrict'){
            if(this.x < -this.lowestComponentXOffset) this.x = -this.lowestComponentXOffset;
            if(this.y < -this.lowestComponentYOffset) this.y = -this.lowestComponentYOffset;
            if(this.x > window.innerWidth - playerWidth - this.lowestComponentXOffset) this.x = window.innerWidth - playerWidth - this.lowestComponentXOffset;
            if(this.y > window.innerHeight - playerHeight - this.lowestComponentYOffset) this.y = window.innerHeight - playerHeight - this.lowestComponentYOffset;
        } else if(this.overflowType == 'wrap'){
            // ISSUE: not accounting for the additional height and/or width of the components
            if(this.x < -playerWidth) this.x = window.innerWidth + playerWidth;
            if(this.y < -playerHeight) this.y = window.innerHeight + playerHeight;
            if(this.x > window.innerWidth + playerWidth) this.x = -playerWidth;
            if(this.y > window.innerHeight + playerHeight) this.y = -playerHeight;
        }
    }
}

/**
 * @description a class to create a game object
 */
class GameObject {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     * @return {HTMLElement}
     */
    static CreateGameObjectElement(width, height, color) {
        let element = document.createElement("div");
        element.style.width = width + "px";
        element.style.height = height + "px";
        element.style.backgroundColor = color;
        element.style.position = "absolute";
        element.style.zIndex = "-1";

        return element;
    }
    /**
     * @constructor
     * @param {HTMLElement} element the element of the game object
     * @param {number} x the x position of the game object
     * @param {number} y the y position of the game object
     */
    constructor(element, x, y) {
        this.element = element;
        this.x = x || 0;
        this.y = y || 0;
        this.vx = 0;
        this.vy = 0;
        this._rotation = 0;
        this.element.style.position = 'absolute';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        document.body.appendChild(this.element);
    }

    /**
     * @param {number} x amount of pixels to move on the x axis
     * @param {number} y amount of pixels to move on the y axis
     */
    move(x, y) {
        this.x += x;
        this.y += y;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    /**
     * @param {number} degree the degree to set the velocity to
     * @param {number} speed the speed to set the velocity to
     */
    setVelocity(degree, speed){
        // convert radian to degrees
        this.vx = Math.cos(degree * (180 / Math.PI)) * speed;
        this.vy = Math.sin(degree * (180 / Math.PI)) * speed;
    }

    /**
     * @description updates the position in relation to the velocity of the game object
     */
    updatePosition() {
        this.x += this.vx / Game.updateInterval;
        this.y += this.vy / Game.updateInterval;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    /**
     * @param {number} deg the number of degrees to rotate the element
     * @param {String} [origin="center"] the origin of the rotation - default 'center'; use CSS transform origin syntax
     * @param {{x: number, y: number}} [offset={x: 0, y: 0}] the  x or y offset to apply to the element after rotation
     */
    rotate(deg, origin, offset) {
        let org = typeof origin == "string" ? (origin || 'center center') : 'center center';
        let offsetObject = {x: 0, y: 0}

        if(offset != undefined){
            if(offset.x != undefined) offsetObject.x = offset.x;
            if(offset.y != undefined) offsetObject.y = offset.y;
        }

        this._rotation = deg;
        this.element.style.transformOrigin = org
        this.element.style.transform = `rotate(${deg}deg) translateX(${offsetObject.x}px) translateY(${offsetObject.y}px)`;
    }

    /**
     * @returns {number} the rotation of the game object
     */
    get rotation(){
        return this._rotation;
    }

    /**
     * @param {{x: number, y: number}} position the position to move the game object to
     */
        set velocity(position){
            this.vx = position.x;
            this.vy = position.y
        }

    /**
     * @description removes the element from the DOM
     */
    destroy() {
        this.element.remove();
    }

    /**
     * @description hides the element
     */
    hide() {
        this.element.style.display = 'none';
    }

    /**
     * @description shows the element
     */
    show() {
        this.element.style.display = 'block';
    }
}

/**
 * @description a class to create a game
 */
class Game {
    static boundFunctions = {};
    static updateInterval;

    /**
     * @param {number} updateInterval the interval in <code>ms</code> to update the game
     */
    constructor(updateInterval){
        this.updateInterval = updateInterval || 1000/60;
        setInterval(() => {
            if(this.paused) return;
            for(let key in Game.boundFunctions){
                Game.boundFunctions[key]();
            }
        }, this.updateInterval);
        this.paused = false;
        Game.updateInterval = this.updateInterval;
    }

    /**
     * @param {string} identifier the identifier of the function to bind
     * @param {function} func the function to bind
     */
    bind(identifier, func) {
        Game.boundFunctions[identifier] = func;
    }

    /**
     * @param {string} identifier the identifier of the function to unbind
     */
    unbind(identifier) {
        delete Game.boundFunctions[identifier];
    }

    /**
     * @description pauses the game
     */
    pause() {
        this.paused = true;
    }

    /**
     * @description unpauses the game
     */
    unpause() {
        this.paused = false;
    }
}