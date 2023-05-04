class Genogram {
    static genogramTree = {};
    static nodes = [];
    
    constructor(container, options){
        this.HTMLElement = container;
        this.HTMLElement.style.display = "inline-block";

        options = options || {};
        options.height = options.height || 500;
        options.width = options.width || 500;
        options.fullscreen = options.fullscreen || false;

        document.body.style.margin = "0";

        if(options.fullscreen){
            this.HTMLElement.style.width = document.body.clientWidth + "px";
            this.HTMLElement.style.height = document.body.clientHeight + "px";

            options.height = this.HTMLElement.clientHeight;
            options.width = this.HTMLElement.clientWidth;
        }



        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("height", options.height);
        svg.setAttribute("width", options.width);
        svg.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`); 

        this.HTMLElement.appendChild(svg);

    }
    get container() {
        return this.HTMLElement;
    }
}
