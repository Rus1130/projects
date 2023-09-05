import { SVG, extend as SVGextend, Element as SVGElement, Timeline, Runner } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @class Malleable
 * @param {Object} options Options object
 * @description Creates a new Malleable object. NOTE: highly recommend using the {@link https://svgjs.dev/docs/3.0/ SVG.js Documentation}, as you can use the methods defined in it to change properties.
 */
export class Malleable {
    static width = 500
    static height = 500
    static draw = null

    /**
     * @constructor
     * @memberof Malleable
     * @param   {Object}   options                    Options object
     * @param   {number}   [options.width=500]        Width of the container
     * @param   {number}   [options.height=500]       Height of the container
     * @param   {boolean}  [options.fullscreen=false] Whether to make the container fullscreen (overrides width and height)
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
     * @param {HTMLElement} element What to add the SVG container to
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
     * @param {number} x      x position of the rectangle
     * @param {number} y      y position of the rectangle
     * @param {number} width  width of the rectangle
     * @param {number} height height of the rectangle
     * @description Creates a rectangle.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(0, 0, 100, 100)
     */
    rect(x, y, width, height){
        let rect = Malleable.draw.rect(width, height).move(x, y)
        return rect
    }

    /**
     * @method circle
     * @memberof Malleable
     * @param {number} x      x position of the circle
     * @param {number} y      y position of the circle
     * @param {number} radius radius of the circle
     * @description Creates a circle.
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let circle = ml.circle(0, 0, 100)
     */
    circle(x, y, radius){
        let circle = Malleable.draw.circle(radius).move(x, y)

        return circle
    }

    /**
     * @method text
     * @memberof Malleable
     * @param {Object} textObject the text settings
     * @param {number} x          x position of the text
     * @param {number} y          y position of the text
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

        text.build(false)
        text.move(x, y)

        return text
    }

    /**
     * @method line
     * @memberof Malleable
     * @param {number[]} points array of points
     * @description creates a line
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let line = ml.line([0, 0, 100, 100])
     */
    line(points){
        let line = Malleable.draw.line(points[0][0], points[0][1], points[1][0], points[1][1])

        return line
    }

    /**
     * @method polyline
     * @memberof Malleable
     * @param {number[]} points array of points
     * @description creates a polyline
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let polyline = ml.polyline([[0, 0], [100, 100], [200, 0]])
     * // to change the points
     * polyline.points[point].x(100)
     */
    polyline(points){
        let polyline = Malleable.draw.polyline(points)

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
                return polyline
            }

            polyline.points[i].y = (val) => {
                if(val === undefined) return y
                y = val
                polyline.points[i][1] = val
                polyline.plot(polyline.points)
                return polyline
            }
        }

        polyline.stroke('black');
        return polyline
    }

    /**
     * @method polygon
     * @memberof Malleable
     * @param {number[]} points array of points
     * @description creates a polygon
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let polygon = ml.polygon([[0, 0], [100, 100], [200, 0]])
     * // to change the points
     * polygon.points[point].x(100)
     */
    polygon(points){
        let polygon = Malleable.draw.polygon(points)

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

        polygon.stroke('black');
        return polygon
    }

    /**
     * @method animate
     * @memberof Malleable
     * @param {Object} target the target element
     * @param {Object[]} keyframes the keyframes
     * @description animates an element
     * @example
     * let ml = new Malleable().appendTo(document.body)
     * let rect = ml.rect(10, 10, 100, 100)
     * ml.animate(rect, [
     *  {x: 100, y: 100, duration: 1000},
     *  {x: 200, y: 200, duration: 1000, delay: 500}
     * ])
     */
    animate(target, keyframes){
        let timeline = new Timeline();

        for(let i = 0; i < keyframes.length; i++){
            let frame = keyframes[i]
            frame.duration = frame.duration || 400
            frame.delay = frame.delay || 0

            let duration = JSON.parse(JSON.stringify(frame)).duration
            let delay = JSON.parse(JSON.stringify(frame)).delay

            delete frame.duration
            delete frame.delay

            let runner = new Runner(duration)
            
            for(let key in frame){
                runner[key](frame[key])
            }

            runner.element(target)

            timeline.schedule(runner)

            runner.delay(delay)
        }

        timeline.play()
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

let line = ml.line([[10, 300], [100, 400]]).stroke({ width: 4, color: '#f06', linecap: 'round' })

let polyline = ml.polyline([[60, 430], [70, 470], [110, 480], [70, 490], [60, 530], [50, 490], [10, 480], [50, 470]])
.fill('none').stroke({ width: 4, color: '#f06', linecap: 'round', linejoin: 'round' })

let polygon = ml.polygon([[10, 550], [100, 600], [50, 650]]).points[0].x(50).fill('#f06').stroke('none')


ml.animate(rect, [
    {fill: '#ff0000', duration: 1000},
    {fill: '#00ff00', duration: 2000, rotate: 360},
])


// https://svgjs.dev/docs/3.0/manipulating/#resizing

