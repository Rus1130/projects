class Player {
    static keys = [];
    static timeMultiplier = 0.9;
    constructor(element, x, y, overflowType) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.inventory = {};
        this.overflowType = overflowType || 'restrict';
        document.addEventListener('keydown', function(event) { Player.keys[event.key] = true; });
        document.addEventListener('keyup', function(event) { Player.keys[event.key] = false; });
    }

    inventoryAdd(item, amount) {
        if(this.inventory[item]) this.inventory[item] += amount;
        else this.inventory[item] = amount;
    }

    inventoryRemove(item, amount) {
        if(this.inventory[item]) this.inventory[item] -= amount;
        else this.inventory[item] = 0;
    }

    initializeInventory(arr){
        for(let i = 0; i < arr.length; i++){
            this.inventoryAdd(arr[i], 0);
        }
    }

    move() {
        if(Player.keys["w"]) this.vy -= 1 * Player.timeMultiplier;
        if(Player.keys["s"]) this.vy += 1 * Player.timeMultiplier;
        if(Player.keys["a"]) this.vx -= 1 * Player.timeMultiplier;
        if(Player.keys["d"]) this.vx += 1 * Player.timeMultiplier;


        this.vx = math.round(this.vx * 0.9, 4);
        this.vy = math.round(this.vy * 0.9, 4);

        this.x += this.vx;
        this.y += this.vy;

        this.x = math.round(this.x);
        this.y = math.round(this.y);

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        if(this.overflowType == 'restrict'){
            if(this.x < 0) this.x = 0;
            if(this.y < 0) this.y = 0;
            if(this.x > window.innerWidth - 50) this.x = window.innerWidth - 50;
            if(this.y > window.innerHeight - 50) this.y = window.innerHeight - 50;
        } else if(this.overflowType == 'wrap'){
            if(this.x < -50) this.x = window.innerWidth + 50;
            if(this.y < -50) this.y = window.innerHeight + 50;
            if(this.x > window.innerWidth + 50) this.x = -50;
            if(this.y > window.innerHeight + 50) this.y = -50;
        }
    }
}