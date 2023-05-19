import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @class Malleable
 * @param {Object} options - Options object
 */
export class Malleable {
    static width = 500
    static height = 500
    static draw = null

    /**
     * @constructor
     * @memberof Malleable
     * @param {Object}  options                    Options object
     * @param {number}  [options.width=500]        Width of the container
     * @param {number}  [options.height=500]       Height of the container
     * @param {boolean} [options.fullscreen=false] Whether to make the container fullscreen (overrides width and height)
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
}

let ml = new Malleable({fullscreen: true}).appendTo(document.body)




// https://svgjs.dev/docs/3.0/manipulating/#resizing

