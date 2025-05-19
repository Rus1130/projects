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

    centroid(start, end, circle_r) {
        let midAngle = (start + end) / 2;
        let averageRadius = (circle_r + this.chart.donutRadius) / 2;
        let radians = (midAngle - 90) * Math.PI / 180;

        let sliceCenter = {
            x: this.centerX + averageRadius * Math.cos(radians),
            y: this.centerY + averageRadius * Math.sin(radians)
        };

        return sliceCenter;
    }

    lightenColor = (hex, p = 10) => '#' + hex.replace(/^#/, '').match(/.{2}/g)
        .map(c => ((1 - p / 100) * parseInt(c, 16) + 255 * (p / 100)) | 0)
        .map(c => c.toString(16).padStart(2, '0')).join('');

    /**
     * Creates and renders a pie chart using the provided options.
     *
     * @param {Object} options - Configuration options for rendering the chart.
     * @param {boolean} [options.useDegrees=false] - If true, `data[].arc` values are treated as degrees (0–360).
     *                                               If false, they are treated as percentages (0–100) and converted to degrees.
     * @param {string} [options.title="Pie Chart"] - The title of the chart.
     * @param {boolean} [options.showPercentages=false] - Whether to show percentage values on the chart.
     * @param {boolean} [options.donut=false] - Whether to render the chart as a donut instead of a full pie.
     * @param {boolean} [options.donutRadius=this.chartHeight/4] - The radius of the donut hole. (default is a quarter of the chart height)
     * @param {number} [options.borderWidth=0] - The width of the border around each pie slice.
     * @param {Array<{arc: number, color: string, label: string, borderWidth: number, type: string, amount: number}>} [options.data={}] - The data used to generate the pie chart.
     *      Each data item should include:
     *        - `arc`: The portion of the circle (as a percentage or degrees, depending on `useDegrees`)
     *        - `color`: The fill color for the chart slice.
     *        - `label`: The label for the slice.
     *       - `borderColor`: The color of the stroke of the outer edge of the slice (optional, default 'transparent').
     *       - `type`: The type of action to perform on hover (optional, default 'pop'). Valid options are 'static', 'pop', and 'grow'.
     *       - `amount`: The amount of pixels to pop out from the center when hovered (optional, default 10).
     * @param {number} [options.size=this.chartHeight/2] - The radius of the pie chart. (default is half the height of the chart container)
     */
    create(options = {}){
        if(this.draw == null) throw new Error('No SVG element found. Please create a new PieChart instance with a valid element.');
        this.draw.clear();

        const {useDegrees = false, title = "Pie Chart", borderWidth = 1, showPercentages = false, donut = false, data = {}, size = this.chartHeight/2, donutRadius = size/4 } = options;

        this.chart.title = title
        this.chart.showPercentages = showPercentages
        this.chart.useDegrees = useDegrees
        this.chart.donut = useDegrees
        this.chart.data = data
        this.chart.size = size
        this.chart.borderWidth = borderWidth
        this.chart.donutRadius = donut ? donutRadius : 0
        this.options = options

        this.chart.measures = {
            centerCircle: this.draw.circle(size).fill('transparent').stroke({ width: 0, color: 'black' }).center(this.centerX, this.centerY)
        }

        const lists = {
            arcs: [],
            colors: [],
            labels: [],
            hoverTypes: [],
            hoverNumbers: [],
            borderColors: [],
            arcElements: [],
            borderArcElements: [],
            textGroups: [],
        }

        this.lists = lists;

        data.forEach((item) => {
            lists.arcs.push(item.arc * (useDegrees ? 1 : 3.6));
            lists.colors.push(item.color);
            lists.labels.push(item.label);
            let validHoverActions = ["static", "pop", "grow"]
            if(!validHoverActions.includes((item.type || "static"))) throw new Error(`Invalid hoverAction: ${item.hoverAction}. Valid options are: ${validHoverActions.join(", ")}`);
            lists.hoverTypes.push(item.type || "pop");
            lists.hoverNumbers.push(item.amount || 10);
            lists.borderColors.push(item.borderColor || 'transparent');
        })

        function getD(outerRadius, startAngle, endAngle, innerRadius = 0) {
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

            // Outer arc points
            const x1 = Math.cos(startRad) * outerRadius;
            const y1 = Math.sin(startRad) * outerRadius;
            const x2 = Math.cos(endRad) * outerRadius;
            const y2 = Math.sin(endRad) * outerRadius;

            if (innerRadius === 0) {
                // Standard pie slice — from center
                return [
                    `M 0 0`,
                    `L ${x1} ${y1}`,
                    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
                    `Z`
                ].join(' ');
            }

            // Inner arc points (reversed direction)
            const x3 = Math.cos(endRad) * innerRadius;
            const y3 = Math.sin(endRad) * innerRadius;
            const x4 = Math.cos(startRad) * innerRadius;
            const y4 = Math.sin(startRad) * innerRadius;

            // Donut slice (annular sector)
            return [
                `M ${x1} ${y1}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
                `Z`
            ].join(' ');
        }

        function polarToCartesian(radius, angleInDegrees) {
            var radians = (angleInDegrees - 90) * Math.PI / 180;
            return {
                x: radius + (radius * Math.cos(radians)),
                y: radius + (radius * Math.sin(radians))
            };
        }

        let totalArc = 0;

        let centerCircleR = this.chart.measures.centerCircle.attr('r');

        for(let i = 0; i < lists.arcs.length; i++){
            let startAngle = structuredClone(totalArc);
            totalArc += lists.arcs[i];

            let endAngle = structuredClone(totalArc);

            let arc = this.draw.path(getD(centerCircleR, startAngle, endAngle, this.chart.donutRadius))
                .fill(lists.colors[i])
                .dx(this.chartWidth/2)
                .dy(this.chartHeight/2)
                .stroke({ width: 0, color: 'transparent'});
            arc.remember('midAngle', (startAngle + endAngle) / 2);
            arc.remember('startAngle', startAngle);
            arc.remember('endAngle', endAngle);
            arc.remember('originalD', arc.attr('d'));
            lists.arcElements.push(arc);

            let borderArc = arc.clone()
                .attr({ d: getD(centerCircleR, startAngle, endAngle, this.chart.size/2 + this.chart.borderWidth) })
                .dx(this.chartWidth/2)
                .dy(this.chartHeight/2)
                .fill(lists.borderColors[i])

            this.draw.add(borderArc);

            borderArc.remember('originalX', borderArc.x());
            borderArc.remember('originalY', borderArc.y());
            borderArc.remember('originalD', borderArc.attr('d'));

            borderArc.back()
            lists.borderArcElements.push(borderArc);

            let innerPoint = this.centroid(startAngle, endAngle, centerCircleR);

            let midAngle = (startAngle + endAngle) / 2;
            let radians = (midAngle - 90) * Math.PI / 180;
            let extendedRadius = centerCircleR + 15;

            let outerPoint = {
                x: this.centerX + extendedRadius * Math.cos(radians),
                y: this.centerY + extendedRadius * Math.sin(radians)
            };

            let textGroup = this.draw.group();
            

            let line = this.draw.line(innerPoint.x, innerPoint.y, outerPoint.x, outerPoint.y)
                .stroke({ width: 1, color: 'black' })
                .attr("pointer-events", "none");

            let text = this.draw.text(lists.labels[i])
                .font({ size: 12, anchor: 'middle', fill: 'black' })
                .dx(outerPoint.x)
                .dy(outerPoint.y - 1)
                .attr('text-decoration', 'underline')

            if(this.chart.showPercentages){
                function roundToPlace(num, place) {
                    const factor = Math.pow(10, place);
                    return Math.round(num * factor) / factor;
                }

                let percentage = roundToPlace(lists.arcs[i] / 360 * 100, 2);
                text.text(text.text() + ` (${percentage}%)`);
            }

            let textBBox = text.bbox();
        
            text.dx(textBBox.w/2)

            // get the angle between outerPoint and centerPoint
            let angle = Math.atan2(outerPoint.y - this.centerY, outerPoint.x - this.centerX) * 180 / Math.PI;

            if(angle < 0) angle += 360;

            if(angle > 90 && angle < 270){
                text.dx(-textBBox.w)
            }

            if(angle == 90) {
                text.dx(2)
            }

            textGroup.add(line);
            textGroup.add(text);


            textGroup.remember('originalX', textGroup.x());
            textGroup.remember('originalY', textGroup.y());

            textGroup.attr('pointer-events', 'none');

            this.lists.textGroups.push(textGroup);
        }


        const hoverLength = 150;

        for (let i = 0; i < lists.arcElements.length; i++) {
            const arc = lists.arcElements[i];

            let type = lists.hoverTypes[i];

            if(type == "pop"){
                const popAmount = lists.hoverNumbers[i];

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

                    lists.borderArcElements[i].animate(hoverLength)
                        .dx(-dx)
                        .dy(-dy);

                    lists.textGroups[i].animate(hoverLength)
                        .dx(-dx)
                        .dy(-dy);

                    
                }.bind(this));

                arc.on('mouseleave', function () {
                    arc.animate(hoverLength)
                        .x(arc.remember('originalX'))
                        .y(arc.remember('originalY'));

                    lists.borderArcElements[i].animate(hoverLength)
                        .x(lists.borderArcElements[i].remember('originalX'))
                        .y(lists.borderArcElements[i].remember('originalY'));

                    lists.textGroups[i].animate(hoverLength)
                        .x(lists.textGroups[i].remember('originalX'))
                        .y(lists.textGroups[i].remember('originalY'));
                }.bind(this));

            } else if(type == "grow"){
                let growArc = this.draw.path(getD(centerCircleR + lists.hoverNumbers[i], arc.remember('startAngle'), arc.remember('endAngle'), this.chart.donutRadius))
                    .dx(this.centerX)
                    .dy(this.centerY)
                
                growArc.remove();

                arc.on('mouseenter', function () {
                    arc.animate(hoverLength)
                        .attr({ d: growArc.attr('d') })

                    const angle = arc.remember('midAngle');

                    const angleRad = (angle + 90) * Math.PI / 180;
                    const dx = Math.cos(angleRad) * lists.hoverNumbers[i];
                    const dy = Math.sin(angleRad) * lists.hoverNumbers[i];

                    lists.textGroups[i].animate(hoverLength)
                        .dx(-dx)
                        .dy(-dy);
                }.bind(this));

                arc.on('mouseleave', function () {
                    arc.animate(hoverLength)
                        .attr({ d: arc.remember('originalD') })

                    lists.textGroups[i].animate(hoverLength)
                        .x(lists.textGroups[i].remember('originalX'))
                        .y(lists.textGroups[i].remember('originalY'));
                }.bind(this));
            }
        }
    }
}