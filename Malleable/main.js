import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';
/**
 * @typedef {Object} Rect - An SVG rectangle
 * @property {number} x - X position of the rectangle
 * @property {number} y - Y position of the rectangle
 * @property {number} width - Width of the rectangle
 * @property {number} height - Height of the rectangle
 * @property {string} fill - Fill color of the rectangle
 * @property {string} stroke - Stroke color of the rectangle
 * @property {number} strokeWidth - Stroke width of the rectangle
 * @property {string} strokeLinecap - Stroke linecap of the rectangle
 * @property {number} radius - Radius of the rectangle
 * @property {function} move - Moves the rectangle to a new position
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let rect = ml.rect(0, 0, 100, 100)
 */

/**
 * @typedef {Object} Circle - An SVG circle
 * @property {number} x - X position of the circle
 * @property {number} y - Y position of the circle
 * @property {number} radius - Radius of the circle
 * @property {string} fill - Fill color of the circle
 * @property {string} stroke - Stroke color of the circle
 * @property {function} move - Moves the circle to a new position
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let circle = ml.circle(0, 0, 50)
 */

/**
 * @typedef {Object} Text - A Text Object
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let textSettings = [
 *  {text: 'This is just the '},
 *  {text: 'start', 'font-weight': 'bold'},
 *  {text: ','},
 *  {text: 'something ', newLine: true},
 *  {text: 'pink ', fill: '#f06', 'font-style': 'italic'},
 *  {text: 'in the middle,'},
 *  {text: 'and again boring at the end.', newLine: true}
 * ]
 * let text = ml.text(0, 0, textSettings)
*/

/** 
 * @typedef {Object} Line - A Line Object
 * @property {Number[]} points - Array of points
 * @property {string} stroke - Stroke color of the line
 * @property {number} strokeWidth - Stroke width of the line
 * @property {string} strokeLinecap - Stroke linecap of the line
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let line = ml.line([[0, 0], [100, 100], [200, 0]])
 */
 
/**
 * @typedef {Object} Polyline - A Polyline Object
 * @property {Number[]} points - Array of points 
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let polyline = ml.polyline([[0, 0], [100, 100], [200, 0], [300, 100], [400, 0]])
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
     * @static
     * @inner
     * @param {SVGElement} object - SVG element to define properties for
     * @param {string[]} properties - Array of properties to define
     * @description Defines properties for an SVG element. To add make the method to change the property different from the SVG attribute, use an array instead of a string in the array. Have the first index be the SVG attribute name and the second be the method name. This is shown in the example.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(0, 0, 50, 100)
     * Malleable.quickDefineProperties(rect, ['x', 'y', 'width', 'height', ['rx', 'radius']])
     * rect.x = 100
     * console.log(rect.x) // 100
     */
    static QuickDefineProperties(object, properties){
        for(let i = 0; i < properties.length; i++){

            let property = properties[i]

            if(typeof property !== 'object') property = [property]

            let internalName = property[0]
            let methodName = property[1] || internalName

            Object.defineProperty(object, methodName, {
                set: function(value){
                    object.attr({[internalName]: value})
                },
                get: function(){
                    return object.attr(internalName)
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
     * @description Creates the SVG rendering area
     * @example
     *  let ml = new Malleable().appendTo(document.body)
     * @returns {Malleable} Returns the graphics object
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
     * @description Creates a rectangle.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(0, 0, 100, 100)
     * @returns {Rect} Returns the SVG rectangle element
     */
    rect(x, y, width, height){
        let rect = Malleable.draw.rect(width, height).move(x, y)
        Malleable.QuickDefineProperties(rect, ['x', "y", "width", "height", 'fill', 'stroke', ['rx', 'radius']])

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
     * @description Creates a circle.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let circle = ml.circle(0, 0, 100)
     * @returns {Circle} Returns the SVG circle element
     */
    circle(x, y, radius){
        let circle = Malleable.draw.circle(radius).move(x, y)

        Malleable.QuickDefineProperties(circle, [['cx', 'x'], ["cy", 'y'], 'fill', 'stroke', 'radius'])

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
     * @returns {Text} Returns the SVG text element
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
     * @param {number[]} points - Array of points
     * @description Creates a line. To change specific properties, use the the setter of the same name.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let line = ml.line([0, 0, 100, 100])
     * @returns {Line} Returns the SVG line element
     */
    line(points){
        let line = Malleable.draw.line(points[0][0], points[0][1], points[1][0], points[1][1])
        Malleable.QuickDefineProperties(line, ['x1', 'y1', 'x2', 'y2', 'stroke', ['stroke-width', 'strokeWidth'], ['stroke-linecap', 'strokeLinecap']])
        line.stroke = 'black';
        return line
    }

    /**
     * @method polyline
     * @memberof Malleable
     * @param {number[]} points - Array of points
     * @description Creates a polyline. To change specific properties, use the the setter of the same name.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let polyline = ml.polyline([[0, 0], [100, 100], [200, 0]])
     * @returns {Polyline} Returns the SVG polyline element
     */
    polyline(points){
        let polyline = Malleable.draw.polyline(points)
        Malleable.QuickDefineProperties(polyline, ['stroke', ['stroke-width', 'strokeWidth'], ['stroke-linecap', 'strokeLinecap'], 'fill'])

        polyline.points = points

        for(let i = 0; i < points.length; i++){
            // get the x and y
            let x = points[i][0]
            let y = points[i][1]

            Object.defineProperty(polyline.points[i], 'x', {
                get: () => {
                    return x
                },
                set: (value) => {
                    x = value
                    polyline.points[i][0] = value
                    polyline.plot(polyline.points)
                }
            })

            Object.defineProperty(polyline.points[i], 'y', {
                get: () => {
                    return y
                },
                set: (value) => {
                    y = value
                    polyline.points[i][1] = value
                    polyline.plot(polyline.points)
                }
            })
        }

       

        polyline.stroke = 'black';
        return polyline
    }
}

let ml = new Malleable({fullscreen: true}).appendTo(document.body)

let rect = ml.rect(10, 10, 100, 100)
let circle = ml.circle(10, 120, 100)

let textObject = [
    {text: 'Pink... ', fill: '#f06', 'font-style': 'italic'},
    {text: 'is ', newLine: true},
    {text: 'cool.', fill: '#606', 'font-weight': 'bold'},
]

let text = ml.text(textObject, 10, 230)

let line = ml.line([[10, 300], [100, 400]])
line.strokeWidth = 10
line.strokeLinecap = 'round'
line.stroke = 'red'

// + 420
let polyline = ml.polyline([[60, 430], [70, 470], [110, 480], [70, 490], [60, 530], [50, 490], [10, 480], [50, 470]])
polyline.fill = 'none'
polyline.stroke = '#f06'
polyline.strokeWidth = 4
polyline.strokeLinecap = 'round'
polyline.points[0].x = 10




// https://svgjs.dev/docs/3.0/manipulating/#resizing

