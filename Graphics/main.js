import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @class Graphics
 * @param {Object} options - Options object
 */
export class Graphics {
    static width = 500
    static height = 500
    /**
     * @constructor
     * @param {Object} options - Options object
     * @param {number} options.width - Width of the graphics
     * @param {number} options.height - Height of the graphics
     * @param {boolean} [options.fullscreen=false] - Whether to make the graphics fullscreen (overrides width and height)
     * @memberof Graphics
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
}

let graphics = new Graphics({
    width: 500,
})