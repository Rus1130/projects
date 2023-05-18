import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';
/**
 * @todo
 * - [ ] do the line type
 */

/**
 * @typedef {Object} Rect - An SVG rectangle
 * @property {number} x - X position of the rectangle
 * @property {number} y - Y position of the rectangle
 * @property {number} width - Width of the rectangle
 * @property {number} height - Height of the rectangle
 * @property {string} fill - Fill color of the rectangle
 * @property {string} stroke - Stroke color of the rectangle
 * @property {function} move - Moves the rectangle to a new position
 * 
 * @typedef {Object} Circle - An SVG circle
 * @property {number} cx - X position of the circle
 * @property {number} cy - Y position of the circle
 * @property {number} radius - Radius of the circle
 * @property {string} fill - Fill color of the circle
 * @property {string} stroke - Stroke color of the circle
 * @property {function} move - Moves the circle to a new position
 * 
 * @typedef {Object} Text - A Text Object
 */


/**
 * @class Malleable
 * @param {Object} options - Options object
 */
export class Malleable {
    static width = 500
    static height = 500
    static draw = null

    /**
     * @method quickDefineProperties
     * @memberof Malleable
     * @param {SVGElement} object - SVG element to define properties for
     * @param {string[]} properties - Array of properties to define
     * @description Defines properties for an SVG element
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(0, 0, 50, 100)
     * Malleable.quickDefineProperties(rect, ['x', 'y', 'width', 'height'])
     * rect.x = 100
     * console.log(rect.x) // 100
     */
    static QuickDefineProperties(object, properties){
        for(let i = 0; i < properties.length; i++){
            let property = properties[i]
            let dashedProperty = property.split(/(?=[A-Z])/).join('-').toLowerCase()

            Object.defineProperty(object, property, {
                set: function(value){
                    this.attr({[dashedProperty]: value})
                },
                get: function(){
                    return this.attr(dashedProperty)
                }
            })
        }
    }

    /**
     * @constructor
     * @memberof Malleable
     * @param {Object} options - Options object
     * @param {number} [options.width=500] - Width of the container
     * @param {number} [options.height=500] - Height of the container
     * @param {boolean} [options.fullscreen=false] - Whether to make the container fullscreen (overrides width and height)
     * @returns {Malleable} Returns the Malleable object
     * @description Creates a new Malleable object
     */
    constructor(options){
        options = options || {}
        options.width = options.width || 500
        options.height = options.height || 500

        if(options.fullscreen){
            options.width = '100%'
            options.height = '100%'
        }

        Malleable.width = options.width
        Malleable.height = options.height
    }

    /**
     * @method appendTo
     * @memberof Malleable
     * @param {HTMLElement} element - What to add the SVG container to
     * @returns {Malleable} Returns the graphics object
     * @description Creates the SVG rendering area
     * @example
     *  let ml = new Malleable().appendTo(document.body)
     */
    appendTo(element){
        Malleable.draw = SVG().addTo(element).size(Malleable.width, Malleable.height)
        return this
    }

    /**
     * @method rect
     * @memberof Malleable
     * @param {number} x - X position of the rectangle
     * @param {number} y - Y position of the rectangle
     * @param {number} width - Width of the rectangle
     * @param {number} height - Height of the rectangle
     * @returns {Rect} Returns the SVG rectangle element
     * @description Creates a rectangle.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(0, 0, 100, 100)
     */
    rect(x, y, width, height){
        let rect = Malleable.draw.rect(width, height).move(x, y)
        Malleable.QuickDefineProperties(rect, ['x', "y", "width", "height", 'fill', 'stroke'])

        rect.move = (x, y) => {
            rect.attr({x: x, y: y})
            return rect
        }

        return rect
    }

    /**
     * @method circle
     * @memberof Malleable
     * @param {number} x - X position of the circle
     * @param {number} y - Y position of the circle
     * @param {number} radius - Radius of the circle
     * @returns {Circle} Returns the SVG circle element
     * @description Creates a circle.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let circle = ml.circle(0, 0, 100)
     */
    circle(x, y, radius){
        let circle = Malleable.draw.circle(radius).move(x, y)

        Malleable.QuickDefineProperties(circle, ['cx', "cy", 'fill', 'stroke', 'radius'])

        circle.move = (x, y) => {
            circle.attr({cx: x-radius/2, cy: y-radius/2})
            return circle
        }
        return circle
    }

    /**
     * @method text
     * @memberof Malleable
     * @param {Object} textObject - the text object
     * @param {number} x - X position of the text
     * @param {number} y - Y position of the text
     * @returns {Text} Returns the SVG text element
     * @description Creates a text element.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let textObject = [
     *  {text: 'This is just the '},
     *  {text: 'start', 'font-weight': 'bold'},
     *  {text: ','},
     *  {text: 'something ', newLine: true},
     *  {text: 'pink ', fill: '#f06', 'font-style': 'italic'},
     *  {text: 'in the middle,'},
     *  {text: 'and again boring at the end.', newLine: true}
     * ]
     * let text = ml.text(textObject, 100, 100)
     */
    text(textObject, x, y){
        let text = null;
        
        for(let i = 0; i < textObject.length; i++){
            let index = textObject[i]

            if(i == 0){
                text = Malleable.draw.text(index.text)
                text.build(true)
            }

            let tspan = text.tspan(index.text)
            if(index.newLine) tspan.newLine()

            for(let property in index){
                if(property == 'text' || property == 'newLine') continue
                tspan.attr(property, index[property])
            }
        }

        // remove the first element of text
        text.node.firstChild.remove()
        text.move(x, y)
        return text
    }

    /**
     * @method line
     * @memberof Malleable
     * @param {number} x1 - X position of the first point
     * @param {number} y1 - Y position of the first point
     * @param {number} x2 - X position of the second point
     * @param {number} y2 - Y position of the second point
     * @returns {SVGElement} Returns the SVG line element
     * @description Creates a line. To change specific properties, use the the setter of the same name.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let line = ml.line(0, 0, 100, 100)
     */
    line(x1, y1, x2, y2){
        let line = Malleable.draw.line(x1, y1, x2, y2)
        Malleable.QuickDefineProperties(line, ['x1', 'y1', 'x2', 'y2', 'stroke', 'strokeWidth', 'strokeLinecap'])

        line.stroke = 'black';
        return line
    }
}

let ml = new Malleable().appendTo(document.body)

let rect = ml.rect(10, 10, 100, 100)
let circle = ml.circle(10, 120, 100)

let textObject = [
    {text: 'Pink... ', fill: '#f06', 'font-style': 'italic'},
    {text: 'is ', newLine: true},
    {text: 'cool.', fill: '#606', 'font-weight': 'bold'},
]

let text = ml.text(textObject, 10, 230)

let line = ml.line(10, 300, 100, 400)
line.strokeWidth = 10
line.strokeLinecap = 'round'
line.stroke = 'red'

// https://svgjs.dev/docs/3.0/manipulating/#resizing

