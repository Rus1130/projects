import { SVG } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

export class PieChart {
    draw = null;

    /**
     * 
     * @param {HTMLElement} element The element to draw the chart on
     * @param {string} x The x position of the chart
     * @param {string} y The y position of the chart
     */
    constructor(element) {
        let width = element.offsetWidth;
        let height = element.offsetHeight;
        this.draw = SVG().addTo(element).size(width, height);
        this.chartWidth = width;
        this.chartHeight = height;
        this.centerX = width / 2;
        this.centerY = height / 2;
        this.element = element;
        this.chart = {};
    }

    /**
     * Creates and renders a pie chart using the provided options.
     *
     * @param {Object} options - Configuration options for rendering the chart.
     * @param {boolean} [options.useDegrees=false] - If true, `data[].arc` values are treated as degrees (0–360).
     *                                               If false, they are treated as percentages (0–100) and converted to degrees.
     * @param {string} [options.title="Pie Chart"] - The title of the chart.
     * @param {number} [options.popAmount=5] - The amount of pixels a slice pops out from the center when hovered.
     * @param {boolean} [options.showPercentages=false] - Whether to show percentage values on the chart.
     * @param {boolean} [options.donut=false] - Whether to render the chart as a donut instead of a full pie.
     * @param {Array<{arc: number, color: string, label: string}>} [options.data={}] - The data used to generate the pie chart.
     *      Each data item should include:
     *        - `arc`: The portion of the circle (as a percentage or degrees, depending on `useDegrees`)
     *        - `color`: The fill color for the chart slice.
     *        - `label`: The label for the slice.
     *       - `edgeColor`: The color of the stroke outlining the slice (optional, default 'transparent').
     *       - `type`: The type of action to perform on hover (optional, default 'pop'). Valid options are 'static', 'pop', and 'grow'.
     *       - `amount`: The amount of pixels to pop out from the center when hovered (optional, default 10).
     * @param {number} [options.sliceOutlineWidth=1] - The width of the stroke outlining each pie slice.
     * @param {number} [options.size=this.chartHeight/2] - The radius of the pie chart.
     */
    create(options = {}){
        if(this.draw == null) throw new Error('No SVG element found. Please create a new PieChart instance with a valid element.');
        this.draw.clear();

        const {useDegrees = false, title = "Pie Chart", showPercentages = false, donut = false, data = {}, sliceOutlineWidth = 1, size = this.chartHeight/2 } = options;

        this.chart.title = title
        this.chart.showPercentages = showPercentages
        this.chart.usePercent = useDegrees
        this.chart.donut = useDegrees
        this.chart.data = data

        this.chart.circle = this.draw.circle(size).fill('transparent').stroke({ width: 0, color: 'black' }).center(this.centerX, this.centerY)

        let arcs = [];
        let colors = [];
        let labels = [];
        let edgeColors = [];
        let hoverActions = [];
        let actionNumbers = [];

        data.forEach((item) => {
            arcs.push(item.arc * (useDegrees ? 1 : 3.6));
            colors.push(item.color);
            labels.push(item.label);
            edgeColors.push(item.edgeColor || "transparent"); 
            let validHoverActions = ["static", "pop", "grow"]
            if(!validHoverActions.includes((item.type || "static"))) throw new Error(`Invalid hoverAction: ${item.hoverAction}. Valid options are: ${validHoverActions.join(", ")}`);
            hoverActions.push(item.type || "pop");
            actionNumbers.push(item.amount || 10);
        })

        function getD(radius, startAngle, endAngle) {
            const isCircle = endAngle - startAngle === 360;
            if (isCircle) {
                endAngle--;
            }
            const start = polarToCartesian(radius, startAngle);
            const end = polarToCartesian(radius, endAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
            const d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
            ];

            if (isCircle) {
                d.push("Z");
            } else {
                d.push("L", radius, radius, "L", start.x, start.y, "Z");
            }
            return d.join(" ");
        }

        function polarToCartesian(radius, angleInDegrees) {
            var radians = (angleInDegrees - 90) * Math.PI / 180;
            return {
                x: radius + (radius * Math.cos(radians)),
                y: radius + (radius * Math.sin(radians))
            };
        }

        let totalArc = 0;

        let arcList = [];

        for(let i = 0; i < arcs.length; i++){
            let startAngle = structuredClone(totalArc);
            totalArc += arcs[i];
            let endAngle = structuredClone(totalArc);

            let arc = this.draw.path(getD(this.chart.circle.attr('r'), startAngle, endAngle))
                .fill(colors[i])
                .dx(this.centerX/2)
                .dy(this.centerY/2)
                .stroke({ width: sliceOutlineWidth, color: edgeColors[i] });
            arc.remember('midAngle', (startAngle + endAngle) / 2);
            arc.remember('startAngle', startAngle);
            arc.remember('endAngle', endAngle);
            arc.scale(0.98, 0.98)
            arcList.push(arc);
        }


        const hoverLength = 800;

        for (let i = 0; i < arcList.length; i++) {
            const arc = arcList[i];

            let type = hoverActions[i];

            if(type == "pop"){
                const popAmount = actionNumbers[i];

                arc.remember('originalX', arc.x());
                arc.remember('originalY', arc.y());

                const angle = arc.remember('midAngle');

                const angleRad = (angle + 90) * Math.PI / 180;
                const dx = Math.cos(angleRad) * popAmount;
                const dy = Math.sin(angleRad) * popAmount;

                arc.on('mouseenter', function () {
                    arc.animate(hoverLength)
                        .dx(-dx)
                        .dy(-dy);
                });

                arc.on('mouseleave', function () {
                    arc.animate(hoverLength)
                        .x(arc.remember('originalX'))
                        .y(arc.remember('originalY'));
                });
            } else if(type == "grow"){

            }
        }
    }

    /*
    data = [
        {
            arc: Number,
            color: String,
            label: String,
        }
    ]
    */
    /**
     * @param {Array<{arc: number, color: string, label: string}>} data The data to render the chart
     * Each object should have the following properties:
     *   - `arc` {number} - The arc size or angle for the chart segment.
     *   - `color` {string} - The color of the chart segment.
     *   - `label` {string} - The label associated with the segment.
     */
    render(data = []) {
    }
}