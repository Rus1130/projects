
// jsdoc it

/**
    * @class Graphics
    * @classdesc A class for creating graphics
    * @param {object} options - Options for the graphics
    * @example
    * let graphics = new Graphics({
    *    width: 500,
    *    height: 500,
    *    fullscreen: false,
    *    border: false
    * });
    */
class Graphics {
    static HTMLElement = null;
    static objects = {};
    constructor(options) {
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;
        options.fullscreen = options.fullscreen || false;
        options.border = options.border || false;

        Graphics.width = options.width;
        Graphics.height = options.height;
        Graphics.fullscreen = options.fullscreen;
        Graphics.border = options.border;
    }

    /**
     * @function appendTo
     * @memberof Graphics
     * @description Appends the graphics to an element
     * @param {HTMLElement} element - The element to append the graphics to
     * @returns {Graphics} - The graphics object
     * @example
     * let graphics = new Graphics({
     *   fullscreen: true
     * }).appendTo(document.body);
     */
    appendTo(element){
        let elem = document.createElement("graphics");
        elem.style.display = 'inline-block'

        elem.style.width = Graphics.width + "px";
        elem.style.height = Graphics.height + "px";

        if(Graphics.fullscreen){
            elem.style.height = "100%";
            elem.style.width = "100%";
            element.style.margin = "0";
        }

        if(Graphics.border){
            elem.style.border = "1px solid black";
            elem.style.boxSizing = "border-box";
        }

        Graphics.HTMLElement = elem;

        element.appendChild(elem);
        return this;
    }

    /**
     * @function makeRect
     * @memberof Graphics
     * @description Creates a rectangle
     * @param {number} x - The x position of the rectangle
     * @param {number} y - The y position of the rectangle
     * @param {number} w - The width of the rectangle
     * @param {number} h - The height of the rectangle
     * @returns {object} - The rectangle object
     * @example
     * let rect = graphics.makeRect(10, 10, 100, 100);
     */
    makeRect(x, y, w, h){
        let element = document.createElement("rect");
        element.style.position = "absolute";
        element.style.left = x + "px";
        element.style.top = y + "px";

        element.style.width = w + "px";
        element.style.height = h + "px";
        element.style.backgroundColor = "black";
        element.style.border = "1px solid black";

        let object = {
            HTMLElement: element,
            type: "rect",
            x: x,
            y: y,
            w: w,
            h: h,
            /**
             * @function center
             * @description Centers the rectangle
             * @returns {object} - The rectangle object
             * @example
             * let rect = graphics.makeRect(10, 10, 100, 100).center();
             */
            center(){
                element.style.left = (x - w / 2) + "px";
                element.style.top = (y - h / 2) + "px";
                this.x = x - w / 2;
                this.y = y - h / 2;

                return this;
            }
        }

        Graphics.HTMLElement.appendChild(element);
        return object;
    }

    /**
     * @function makeCircle
     * @memberof Graphics
     * @description Creates a circle
     * @param {number} x - The x position of the circle
     * @param {number} y - The y position of the circle
     * @param {number} r - The radius of the circle
     * @returns {object} - The circle object
     * @example
     * let circle = graphics.makeCircle(10, 10, 100);
     */
    makeCircle(x, y, r){
        let element = document.createElement("circle");
        element.style.position = "absolute";
        element.style.left = x + "px";
        element.style.top = y + "px";

        element.style.width = r + "px";
        element.style.height = r + "px";

        element.style.borderRadius = "50%";
        element.style.backgroundColor = "black";
        element.style.border = "1px solid black";



        let object = {
            HTMLElement: element,
            type: "circ",
            x: x,
            y: y,
            r: r,
            /**
             * @function center
             * @description Centers the circle
             * @returns {object} - The circle object
             * @example
             * let circle = graphics.makeCircle(10, 10, 100).center();
             */
            center(){
                element.style.left = (x - r / 2) + "px";
                element.style.top = (y - r / 2) + "px";
                this.x = x - r / 2;
                this.y = y - r / 2;

                return this;
            },
            props: element.style
        }

        Graphics.HTMLElement.appendChild(element);
        return object;
    }

}