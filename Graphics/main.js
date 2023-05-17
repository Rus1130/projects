import Two from "./two.es.js"
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
              defaults: {
                fill: "black",
                stroke: "black",
              }
          }).appendTo(document.body);
      </script>
    */
export class Graphics {
    static objects = {};
    static two = null;
    static defaultFill = "#000000";
    static defaultStroke = "#000000";
    constructor(options) {
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;
        options.fullscreen = options.fullscreen || false;
        options.border = options.border || false;

        options.defaults = options.defaults || {};
        options.defaults.fill = options.defaults.fill || "#000000";
        options.defaults.stroke = options.defaults.stroke || "#000000";

        Graphics.width = options.width;
        Graphics.height = options.height;
        Graphics.fullscreen = options.fullscreen;
        Graphics.border = options.border;

        Graphics.defaultFill = options.defaults.fill;
        Graphics.defaultStroke = options.defaults.stroke;

        try {
            Graphics.two = new Two({
                width: Graphics.width,
                height: Graphics.height,
                fullscreen: Graphics.fullscreen,
                autostart: true
            })
        } catch (err){
            throw new Error("Two.js is a dependency. Please include the ES6 Module file with the name 'two.es.js' in the same directory as this file.")
        }
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
        Graphics.two.appendTo(element);
        return this;
    }

    /**
     * @function createRect
     * @memberof Graphics
     * @description Creates a rectangle
     * @param {string} id - The id of the rectangle
     * @param {number} x - The x position of the rectangle
     * @param {number} y - The y position of the rectangle
     * @param {number} width - The width of the rectangle
     * @param {number} height - The height of the rectangle
     * @returns {Two.Rectangle} - The rectangle
     * @example
     * let rect = graphics.createRect("rect", 250, 250, 100, 100);
     */
    createRect(id, x, y, width, height) {
        x = x - width / 2;
        y = y - height / 2;

        let rect = Graphics.two.makeRectangle(x, y, width, height);
        rect.id = id;
        rect.fill = Graphics.defaultFill;
        rect.stroke = Graphics.defaultStroke;

        /**
         * @function center
         * @description Centers the rectangle around its x and y position
         * @returns {Two.Rectangle} - The rectangle
         * @example
         * let rect = graphics.createRect("rect", 250, 250, 100, 100).center();
         */
        rect.center = () => {
            rect.translation.set(x + width / 2, y + height / 2);
            return rect;
        }

        rect.animate = (options) => {
            let keyframes = []
            let animOptions = {}

            let objectKeys = Object.keys(options);
        }

        return rect;
    }

    /**
     * @function createCircle
     * @memberof Graphics
     * @description Creates a circle
     * @param {string} id - The id of the circle
     * @param {number} x - The x position of the circle
     * @param {number} y - The y position of the circle
     * @param {number} radius - The radius of the circle
     * @returns {Two.Circle} - The circle
     * @example
     * let circle = graphics.createCircle("circle", 50, 50, 100);
     */
    createCircle(id, x, y, radius) {
        x = x - radius / 2;
        y = y - radius / 2;

        let circle = Graphics.two.makeCircle(x, y, radius);
        circle.id = id;
        circle.fill = Graphics.defaultFill;
        circle.stroke = Graphics.defaultStroke;

        /**
         * @function center
         * @description Centers the circle around its x and y position
         * @returns {Two.Circle} - The circle
         * @example
         * let circle = graphics.createCircle("circle", 50, 50, 100).center();
         */
        circle.center = () => {
            circle.translation.set(x + radius / 2, y + radius / 2);
            return circle;
        }

        return circle;
    }

    /**
     * @function createPolygon
     * @memberof Graphics
     * @description Creates a polygon
     * @param {string} id - The id of the polygon
     * @param {number} x - The x position of the polygon
     * @param {number} y - The y position of the polygon
     * @param {number} radius - The radius of the polygon
     * @param {number} sides - The number of sides of the polygon
     * @returns {Two.Polygon} - The polygon
     * @example
     * let polygon = graphics.createPolygon("polygon", 50, 50, 100, 5);
     */
    createPolygon(id, x, y, radius, sides) {
        x = x - radius / 2;
        y = y - radius / 2;

        let polygon = Graphics.two.makePolygon(x, y, radius, sides);
        polygon.id = id;
        polygon.fill = Graphics.defaultFill;
        polygon.stroke = Graphics.defaultStroke;

        /**
         * @function center
         * @description Centers the polygon around its x and y position
         * @returns {Two.Polygon} - The polygon
         * @example
         * let polygon = graphics.createPolygon("polygon", 50, 50, 100, 5).center();
         */
        polygon.center = () => {
            polygon.translation.set(x + radius / 2, y + radius / 2);
            return polygon;
        }

        return polygon;
    }
}