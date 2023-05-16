import anime from "./anime.es.js"
/**
    * @class Graphics
    * @classdesc A class for creating graphics
    * @param {object} options - Options for the graphics
    * @example
    * <head>
        <script src="main.js" type="module"></script>
      </head>
      <body>
      </body>
      <script defer type="module">
          import { Graphics } from "./main.js"
          let gr = new Graphics({
              width: 500,
              height: 500,
              fullscreen: false,
              border: false
          }).appendTo(document.body);
      </script>
    */
export class Graphics {
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
     * @param {number} id - The id of the rectangle
     * @param {number} x - The x position of the rectangle
     * @param {number} y - The y position of the rectangle
     * @param {number} w - The width of the rectangle
     * @param {number} h - The height of the rectangle
     * @param {object} styling - The styling of the rectangle
     * @returns {object} - The rectangle object
     * @example
     * let rect = graphics.makeRect("rect", 10, 10, 100, 100, {
     *  backgroundColor: "red"
     * });
     */
    makeRect(id, x, y, w, h, styling){
        styling = styling || {};
        let element = document.createElement("rect");
        element.style.position = "absolute";
        element.style.left = x + "px";
        element.style.top = y + "px";

        element.style.width = w + "px";
        element.style.height = h + "px";
        element.style.backgroundColor = "black";
        element.style.border = "1px solid black";

        element.id = id;

        for(let prop in styling){
            element.style[prop] = styling[prop];
        }



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
             * let rect = graphics.makeRect("rect", 10, 10, 100, 100).center();
             */
            center(){
                element.style.left = (x - w / 2) + "px";
                element.style.top = (y - h / 2) + "px";
                this.x = x - w / 2;
                this.y = y - h / 2;

                return this;
            },
            /**
             * @function animate
             * @description Animates the rectangle
             * @param {object} options - The options for the animation
             * @returns {object} - The rectangle object
             * @example
             * let rect = graphics.makeRect("rect", 10, 10, 100, 100).animate({
             *  left: 100
             * });
             */
            animate(options){
                if(options.targets != undefined) throw new Error("Do not specify the targets");
                options.targets = element;
                anime(options)
            }
        }

        Graphics.HTMLElement.appendChild(element);
        return object;
    }

    /**
     * @function makeCircle
     * @memberof Graphics
     * @description Creates a circle
     * @param {number} id - The id of the circle
     * @param {number} x - The x position of the circle
     * @param {number} y - The y position of the circle
     * @param {number} r - The radius of the circle
     * @param {object} styling - The styling of the circle
     * @returns {object} - The circle object
     * @example
     * let circle = graphics.makeCircle("circ", 10, 10, 100, {
     *  backgroundColor: "red"
     * });
     */
    makeCircle(id, x, y, r, styling){
        styling = styling || {};
        let element = document.createElement("circle");
        element.style.position = "absolute";
        element.style.left = x + "px";
        element.style.top = y + "px";

        element.style.width = r + "px";
        element.style.height = r + "px";

        element.style.borderRadius = "50%";
        element.style.backgroundColor = "black";
        element.style.border = "1px solid black";

        element.id = id;

        for(let prop in styling){
            element.style[prop] = styling[prop];
        }

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
             * let circle = graphics.makeCircle("circ", 10, 10, 100).center();
             */
            center(){
                element.style.left = (x - r / 2) + "px";
                element.style.top = (y - r / 2) + "px";
                this.x = x - r / 2;
                this.y = y - r / 2;

                return this;
            },
            /**
             * @function animate
             * @description Animates the circle
             * @param {object} options - The options for the animation
             * @returns {object} - The circle object
             * @example
             * let circle = graphics.makeCircle("circ", 10, 10, 100, 100).animate({
             *  left: 100
             * });
             */
            animate(options){
                if(options.targets != undefined) throw new Error("Do not specify the targets");
                options.targets = element;
                anime(options)
            }
        }

        Graphics.HTMLElement.appendChild(element);
        return object;
    }

    /**
     * @function makeText
     * @memberof Graphics
     * @description Creates text
     * @param {number} id - The id of the text
     * @param {string} text - The text to display
     * @param {number} x - The x position of the text
     * @param {number} y - The y position of the text
     * @param {object} styling - The styling of the text
     * @returns {object} - The text object
     * @example
     * let text = graphics.makeText("text", "Hello World", 10, 10, {
     *  color: "red"
     * });
     */
    makeText(id, text, x, y, styling){
        styling = styling || {};
        let element = document.createElement("text");
        element.style.position = "absolute";
        element.style.left = x + "px";
        element.style.top = y + "px";

        element.style.color = "black";
        element.style.fontFamily = "Arial";

        element.textContent = text;

        element.id = id;

        for(let prop in styling){
            element.style[prop] = styling[prop];
        }

        let object = {
            HTMLElement: element,
            type: "text",
            x: x,
            y: y,
            text: text,
            /**
             * @function center
             * @description Centers the text
             * @returns {object} - The text object
             * @example
             * let text = graphics.makeText("text", "Hello World", 10, 10).center();
             */
            center(){
                element.style.left = (x - element.offsetWidth / 2) + "px";
                element.style.top = (y - element.offsetHeight / 2) + "px";
                this.x = x - element.offsetWidth / 2;
                this.y = y - element.offsetHeight / 2;

                return this;
            },
            /**
             * @function animate
             * @description Animates the text
             * @param {object} options - The options for the animation
             * @returns {object} - The text object
             * @example
             * let text = graphics.makeText("text", "Hello World", 10, 10).animate({
             *  left: 100
             * });
             */
            animate(options){
                if(options.targets != undefined) throw new Error("Do not specify the targets");
                options.targets = element;
                anime(options)
                return this;
            }
        }

        Graphics.HTMLElement.appendChild(element);
        return object;
    }
}