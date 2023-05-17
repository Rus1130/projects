import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @class Graphics
 * @param {Object} options - Options object
 */
export class Graphics {
    static width = 500
    static height = 500
    static draw = null

    /**
     * @method quickDefineProperties
     * @memberof Graphics
     * @param {SVGElement} object - SVG element to define properties for
     * @param {string[]} properties - Array of properties to define
     * @description Defines properties for an SVG element
     * @example
     * let graphics = new Graphics().appendTo(document.body)
     * let rect = graphics.rect(0, 0, 50, 100)
     * Graphics.quickDefineProperties(rect, ['x', 'y', 'width', 'height'])
     * rect.x = 100
     * console.log(rect.x) // 100
     */
    static QuickDefineProperties(object, properties){
        for(let i = 0; i < properties.length; i++){
            let property = properties[i]
            Object.defineProperty(object, property, {
                /**
                 * @method set
                 * @memberof Graphics
                 * @param {any} value - Value to set the property to
                 * @description Sets the property to the value
                 */
                set: function(value){
                    this.attr({[property]: value})
                },
                /**
                 * @method get
                 * @memberof Graphics
                 * @returns {any} - Returns the value of the property
                 * @description Gets the value of the property
                 */
                get: function(){
                    return this.attr(property)
                }
            })
        }
    }

    /**
     * @constructor
     * @memberof Graphics
     * @param {Object} options - Options object
     * @param {number} [options.width=500] - Width of the graphics
     * @param {number} [options.height=500] - Height of the graphics
     * @param {boolean} [options.fullscreen=false] - Whether to make the graphics fullscreen (overrides width and height)
     * 
     */
    constructor(options){
        options = options || {}
        options.width = options.width || 500
        options.height = options.height || 500

        if(options.fullscreen){
            options.width = '100%'
            options.height = '100%'
        }

        Graphics.width = options.width
        Graphics.height = options.height
    }

    /**
     * @method appendTo
     * @memberof Graphics
     * @param {HTMLElement} element - Element to append the graphics to
     * @returns {Graphics} - Returns the graphics object
     * @description Creates the SVG rendering area
     * @example
     *  let graphics = new Graphics().appendTo(document.body)
     */
    appendTo(element){
        Graphics.draw = SVG().addTo(element).size(Graphics.width, Graphics.height)
        return this
    }

    /**
     * @method rect
     * @memberof Graphics
     * @param {number} x - X position of the rectangle
     * @param {number} y - Y position of the rectangle
     * @param {number} width - Width of the rectangle
     * @param {number} height - Height of the rectangle
     * @returns {SVGElement} - Returns the SVG rectangle element
     * @description Creates a rectangle. To change specific properties, use the the setter of the same name.
     * @example
     * let graphics = new Graphics().appendTo(document.body)
     * let rect = graphics.rect(0, 0, 100, 100)
     */
    rect(x, y, width, height){
        let rect = Graphics.draw.rect(width, height).move(x, y)

        Graphics.QuickDefineProperties(rect, ['x', "y", "cx", "cy", "width", "height", 'fill', 'stroke'])

        rect.move = (x, y) => {
            rect.attr({x: x, y: y})
            return rect
        }

        return rect
    }

    /**
     * @method circle
     * @memberof Graphics
     * @param {number} x - X position of the circle
     * @param {number} y - Y position of the circle
     * @param {number} radius - Radius of the circle
     * @returns {SVGElement} - Returns the SVG circle element
     * @description Creates a circle. To change specific properties, use the the setter of the same name.
     * @example
     * let graphics = new Graphics().appendTo(document.body)
     * let circle = graphics.circle(0, 0, 100)
     */
    circle(x, y, radius){
        let circle = Graphics.draw.circle(radius).move(x, y)
        return circle
    }
}

let graphics = new Graphics().appendTo(document.body)

let rect = graphics.rect(10, 10, 100, 100)
let circle = graphics.circle(10, 120, 100)

// https://svgjs.dev/docs/3.0/manipulating/#resizing

