import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';
/**
 * @typedef  {Object}   Rect   - An SVG rectangle. All properties can act as a getter and setter unless otherwise specified. To act as a getter, pass undefined.
 * @property {number}   x      - sets the X position of the rectangle.
 * @property {number}   y      - sets the Y position of the rectangle.
 * @property {number}   width  - sets the width of the rectangle.
 * @property {number}   height - sets the height of the rectangle.
 * @property {string}   fill   - sets the fill color of the rectangle.
 * @property {string}   stroke - sets the stroke color of the rectangle.
 * @property {number}   radius - sets the radius of the rectangle.
 * @property {function} move   - moves the rectangle to a new position. Note: This is not a getter.
 *                             - cannot act as a getter.
 * @property {number}   dx     - sets the X offset of the rectangle relative to its current position.
 *                             - cannot act as a getter.
 * @property {number}   dy     - sets the Y offset of the rectangle relative to its current position.
 *                             - cannot act as a getter.
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let rect = ml.rect(0, 0, 100, 100)
 */

/**
 * @typedef  {Object}   Circle - An SVG circle
 * @property {number}   x      - x position of the circle.
 * @property {number}   y      - y position of the circle.
 * @property {number}   dx     - sets the X offset of the circle relative to its current position.
 *                             - cannot act as a getter.
 * @property {number}   dy     - sets the Y offset of the circle relative to its current position.
 *                             - cannot act as a getter.
 * @property {number}   radius - radius of the circle.
 * @property {string}   fill   - fill color of the circle.
 * @property {string}   stroke - stroke color of the circle.
 * @property {function} move   - move the circle to a new position.
 *                             - cannot act as a getter.
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let circle = ml.circle(0, 0, 50)
 */

/**
 * @typedef  {Object}   Text - a Text Object.
 * @property {number}   x    - x position of the text.
 * @property {number}   y    - y position of the text.
 * @property {function} move - move the text to a new position.
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
 * @typedef  {Object}   Line - A Line Object
 * @property {Number[]} points - Array of points
 * @property {number}   dx            - x offset of the line.
 *                                    - cannot act as a getter.
 * @property {number}   dy            - y offset of the line.
 *                                    - cannot act as a getter.
 * @property {string}   stroke        - stroke color of the line.
 * @property {number}   strokeWidth   - stroke width of the line.
 * @property {string}   strokeLinecap - stroke linecap of the line.
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let line = ml.line([[0, 0], [100, 100], [200, 0]])
 */
 
/**
 * @typedef {Object} Polyline - a Polyline Object
 * @property {Number[]} points - array of points 
 * - to move a specific point, call polyline.points[index].x/y(val)
 * @property {number} dx - x offset of the polyline.
 * - cannot act as a getter.
 * @property {number} dy - y offset of the polyline.
 * - cannot act as a getter.
 * @property {string} fill - fill color of the polyline.
 * @property {string} stroke - stroke color of the polyline.
 * @property {number} strokeWidth - stroke width of the polyline.
 * @property {string} strokeLinecap - stroke linecap of the polyline.
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let polyline = ml.polyline([[0, 0], [100, 100], [200, 0], [300, 100], [400, 0]])
 */

/**
 * @typedef  {Object}   Polygon - a Polygon Object.
 * @property {Number[]} points  - array of points.
 * @property {number}   x       - x position of the polygon.
 * @property {number}   y       - y position of the polygon.
 * @property {number}   dx      - x offset of the polygon.
 *                              - Cannot act as a getter.
 * @property {number}   dy      - x offset of the polygon.
 *                              - Cannot act as a getter.
 * @property {string}   fill    - fill color of the polygon.
 * @property {string}   stroke  - stroke color of the polygon.
 * @property {function} move    - move a specific point with polygon.points[index].move(x, y)
 *                              - can also move the entire polygon with polygon.move(x, y)
 *                              - Cannot act as a getter.
 * @example
 * let ml = new Malleable().appendTo(document.body)
 * let polygon = ml.polygon([[10, 550], [100, 600], [50, 650]])
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
     * @description Defines properties for an SVG element. To add make the method to change the property different from the SVG attribute, use an array instead of a string in the array. Have the first index be the SVG attribute name and the second be the method name. This is shown in the example. If the property requires extra work, such as the polyline.plot() method, use Malleable.specialDefineProperty().
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(0, 0, 50, 100)
     * Malleable.quickDefineProperties(rect, ['x', 'y', 'width', 'height', ['rx', 'radius']])
     * rect.x = 100
     * console.log(rect.x) // 100
     */
    static quickDefineProperties(object, properties){
        for(let i = 0; i < properties.length; i++){
            let property = properties[i]

            if(typeof property !== 'object') property = [property]

            let internalName = property[0]
            let methodName = property[1] || internalName

            object[methodName] = function(val){
                if(val === undefined) return object.attr(internalName)
                object.attr({[internalName]: val})
                return object
            }
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
     * @return {Rect} Returns the SVG rectangle element
     */
    rect(x, y, width, height){
        let rect = Malleable.draw.rect(width, height).move(x, y)

        Malleable.quickDefineProperties(rect, ['x', 'y', 'width', 'height', ['rx', 'radius'], 'fill', 'stroke'])

        rect.move = (x, y) => {
            rect.attr({x: x, y: y})
            return rect
        }

        rect.dx = (val) => {
            if(val === undefined) return rect.x()
            rect.move(rect.x()+val, rect.y())
            return rect
        }

        rect.dy = (val) => {
            if(val === undefined) return rect.y()
            rect.move(rect.x(), rect.y()+val)
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

        Malleable.quickDefineProperties(circle, [['cx', 'x'], ["cy", 'y'], 'fill', 'stroke', 'radius'])

        circle.move = (x, y) => {
            circle.attr({cx: x-radius/2, cy: y-radius/2})
            return circle
        }
        return circle
    }

    /**
     * @method text
     * @memberof Malleable
     * @param {Object} textObject - the text settings
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

        text.build(false)
        text.move(x, y)

        Malleable.quickDefineProperties(text, ['x', 'y'])

        text.move = (x, y) => {
            text.attr({x: x, y: y})
        }

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
        Malleable.quickDefineProperties(line, ['x1', 'y1', 'x2', 'y2', 'stroke', ['stroke-width', 'strokeWidth'], ['stroke-linecap', 'strokeLinecap']])

        line.stroke('black');

        line.dx = (val) => {
            line.attr({x1: line.x1()+val, x2: line.x2()+val})
        }

        line.dy = (val) => {
            line.attr({y1: line.y1()+val, y2: line.y2()+val})
        }
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
        Malleable.quickDefineProperties(polyline, ['stroke', ['stroke-width', 'strokeWidth'], ['stroke-linecap', 'strokeLinecap'], 'fill'])

        polyline.points = points

        for(let i = 0; i < points.length; i++){
            // get the x and y
            let x = points[i][0]
            let y = points[i][1]


            polyline.points[i].x = (val) => {
                if(val === undefined) return x
                x = val
                polyline.points[i][0] = val
                polyline.plot(polyline.points)
            }

            polyline.points[i].y = (val) => {
                if(val === undefined) return y
                y = val
                polyline.points[i][1] = val
                polyline.plot(polyline.points)
            }
        }
        
        polyline.dx = (val) => {
            for(let i = 0; i < polyline.points.length; i++){
                polyline.points[i].x(polyline.points[i].x()+val)
            }
        }

        polyline.dy = (val) => {
            for(let i = 0; i < polyline.points.length; i++){
                polyline.points[i].y(polyline.points[i].y()+val)
            }
        }

        polyline.stroke('black');
        return polyline
    }

    /**
     * @method polygon
     * @memberof Malleable
     * @param {number[]} points - Array of points
     * @description Creates a polygon. To change specific properties, use the the setter of the same name.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let polygon = ml.polygon([[0, 0], [100, 100], [200, 0]])
     * @returns {Polygon} Returns the SVG polygon element
     */
    polygon(points){
        let polygon = Malleable.draw.polygon(points)
        Malleable.quickDefineProperties(polygon, ['stroke', ['stroke-width', 'strokeWidth'], ['stroke-linecap', 'strokeLinecap'], 'fill'])

        polygon.points = points

        for(let i = 0; i < points.length; i++){
            let x = points[i][0]
            let y = points[i][1]

            polygon.points[i].x = (val) => {
                if(val === undefined) return x
                x = val
                polygon.points[i][0] = val
                polygon.plot(polygon.points)
                return polygon
            }

            polygon.points[i].y = (val) => {
                if(val === undefined) return y
                y = val
                polygon.points[i][1] = val
                polygon.plot(polygon.points)
                return polygon
            }

            polygon.points[i].move = (x, y) => {
                polygon.points[i].x(x)
                polygon.points[i].y(y)
                polygon.plot(polygon.points)
                return polygon
            }
        }

        polygon.dx = (val) => {
            for(let i = 0; i < polygon.points.length; i++){
                polygon.points[i].x(polygon.points[i].x()+val)
            }
        }

        polygon.dy = (val) => {
            for(let i = 0; i < polygon.points.length; i++){
                polygon.points[i].y(polygon.points[i].y()+val)
            }
        }

        polygon.stroke('black');
        return polygon
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

let line = ml.line([[10, 300], [100, 400]]).strokeWidth(5).strokeLinecap('round').stroke('red')

let polyline = ml.polyline([[60, 430], [70, 470], [110, 480], [70, 490], [60, 530], [50, 490], [10, 480], [50, 470]])
.fill('none').stroke('#f06').strokeWidth(4).strokeLinecap('round').points[0].x(10)

let polygon = ml.polygon([[10, 550], [100, 600], [50, 650]]).move(10, 10).fill('#f06').stroke('none')



// https://svgjs.dev/docs/3.0/manipulating/#resizing

