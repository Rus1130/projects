/**
 * @typedef {Object} HTMLElement
*/
/**
 * @typedef {Object} GameObject
 * @property {HTMLElement} element the element of the game object
 * @property {number} x the x position of the game object
 * @property {number} y the y position of the game object
 */


class Player {
    static keys = [];

    /**
     * @constructor 
     * @param {HTMLElement} element the element the player will control
     * @param {number} x the x position of the player
     * @param {number} y the y position of the player
     * @param {String} [overflowType="restrict"] restrict will keep the player within the window, wrap will wrap the player around the window; 'restrict' or 'wrap'
     */
    constructor(element, x, y, overflowType) {
        this.element = element;
        this.x = x || 0;
        this.y = y || 0;
        this.vx = 0;
        this.vy = 0;
        this.overflowType = overflowType || 'restrict';
        this.components = [];
        this.lowestComponentXOffset = 0;
        this.lowestComponentYOffset = 0;

        this.components.push(this.element);
        document.addEventListener('keydown', function(event) { Player.keys[event.key] = true; });
        document.addEventListener('keyup', function(event) { Player.keys[event.key] = false; });
    }

    /**
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
     * @param {GameObject} component the component to add to the player
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
     * @param {GameObject} component the component to remove from the player
     */
    removeComponent(component) {
        let index = this.components.indexOf(component.element);
        if(index > -1) this.components.splice(index, 1);
        component.element.remove();
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
            if(this.x < -playerWidth) this.x = window.innerWidth + playerWidth;
            if(this.y < -playerHeight) this.y = window.innerHeight + playerHeight;
            if(this.x > window.innerWidth + playerWidth) this.x = -playerWidth;
            if(this.y > window.innerHeight + playerHeight) this.y = -playerHeight;
        }
    }
}

class GameObject {
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
     * @param {number} deg the number of degrees to rotate the element
     * @param {String} [origin="center"] the origin of the rotation - default 'center'; use CSS transform origin syntax
     */
    rotate(deg, origin) {
        this.element.style.transformOrigin = origin || 'center';
        this.element.style.transform = 'rotate(' + deg + 'deg)';
    }

    /**
     * @description removes the element from the DOM
     */
    destroy() {
        this.element.remove();
    }
}