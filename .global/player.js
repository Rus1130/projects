class Player {
    static keys = [];
    static components = [];
    static lowestComponentXOffset = 0;
    static lowestComponentYOffset = 0;

    constructor(element, x, y, overflowType) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.overflowType = overflowType || 'restrict';
        document.addEventListener('keydown', function(event) { Player.keys[event.key] = true; });
        document.addEventListener('keyup', function(event) { Player.keys[event.key] = false; });
    }

    collidesWith(element, reducer) {
        let collides = false;
        // restricts the hitbox by pixels
        reducer = reducer || 0;

        Player.components.forEach((component) => {
            let compRect = component.getBoundingClientRect();
            let objectRect = element.getBoundingClientRect();
            collides = collides || !(
                compRect.top + reducer > objectRect.bottom ||
                compRect.right - reducer < objectRect.left ||
                compRect.bottom - reducer < objectRect.top ||
                compRect.left + reducer > objectRect.right
            );
        });

        return collides;
    }

    addComponent(id, offsetX, offsetY) {
        let element = document.createElement('div');
        element.id = id;

        element.style.position = 'absolute';
        element.style.left = offsetX + 'px';
        element.style.top = offsetY + 'px';

        if(offsetX < Player.lowestComponentXOffset) Player.lowestComponentXOffset = offsetX;
        if(offsetY < Player.lowestComponentYOffset) Player.lowestComponentYOffset = offsetY;

        Player.components.push(element);
        this.element.appendChild(element);
    }

    move() {
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

        for(let i = 0; i < Player.components.length; i++){
            if(Player.components[i].offsetWidth > playerWidth) playerWidth = Player.components[i].offsetWidth;
            if(Player.components[i].offsetHeight > playerHeight) playerHeight = Player.components[i].offsetHeight;
        }

        if(this.overflowType == 'restrict'){
            if(this.x < -Player.lowestComponentXOffset) this.x = -Player.lowestComponentXOffset;
            if(this.y < -Player.lowestComponentYOffset) this.y = -Player.lowestComponentYOffset;
            if(this.x > window.innerWidth - playerWidth - Player.lowestComponentXOffset) this.x = window.innerWidth - playerWidth - Player.lowestComponentXOffset;
            if(this.y > window.innerHeight - playerHeight - Player.lowestComponentYOffset) this.y = window.innerHeight - playerHeight - Player.lowestComponentYOffset;
        } else if(this.overflowType == 'wrap'){
            if(this.x < -playerWidth) this.x = window.innerWidth + playerWidth;
            if(this.y < -playerHeight) this.y = window.innerHeight + playerHeight;
            if(this.x > window.innerWidth + playerWidth) this.x = -playerWidth;
            if(this.y > window.innerHeight + playerHeight) this.y = -playerHeight;
        }
    }
}