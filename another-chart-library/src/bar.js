import { Chart } from '../main.js';

/**
 * @class BarChart
 * @memberof Chart
 * @param {string}            chartTitle title of the chart
 * @param {string}            xAxisLabel label for the x axis
 * @param {string}            yAxisLabel label for the y axis
 * @param {number}            step       step value
 * @param {number}            density    how many minor lines to draw
 * @param {string[]|number[]} xAxisData  data for the x axis
 * @param {string[]|number[]} yAxisData  data for the y axis
 * @param {string}            [barColor] color of the bars
 * @example
    let bar = new Chart('bar')
    .appendTo("#bar-chart")
    .setData("Motor Vehicle Deaths by Month (2021)", "Month", "Deaths", 1000, 4, 
        ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        [3099, 2561, 3214, 3557, 3768, 3789, 3879, 4013, 3861, 4101, 3599, 3498]
    )
*/
export class BarChart {
    constructor(chartTitle, xAxisLabel, yAxisLabel, step, density, xAxisData, yAxisData, barColor) {
        let draw = Chart.options.draw

        barColor = barColor || '#4285f4';

        if(xAxisData.length !== yAxisData.length) throw new Error('xAxis and yAxis data must be the same length')

        let xLine = Chart.measureLines.xAxisLine;
        let yLine = Chart.measureLines.yAxisLine;

        let yCenter = Chart.measureLines.yCenterLine;

        // X Axis Label
        draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(xLine.attr('x1') + (xLine.attr('x2') - xLine.attr('x1')) / 2)
        .cy(Chart.options.height - (Chart.options.height - xLine.attr('y1')) / 2)

        // Y Axis Label
        draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(yLine.attr('x2') / 2 - yLine.attr('x1') / 4)
        .cy(yLine.attr('y1') - (yLine.attr('y1') - yLine.attr('y2')) / 2)
        .rotate(-90)

        let heights = []
        for(let i = 0; i < yAxisData.length; i++){
            heights.push(yAxisData[i])
        }

        let max = Math.max(...heights) + (step - (Math.max(...heights) % step))

        let measureStep = (yLine.attr('y1') - yLine.attr('y2')) / max

        function drawBar(height, x, width, barLabel) {
            let rect = draw.rect(width, -measureStep * height)
            .x(yLine.attr('x1') + x)
            .y(xLine.attr('y1') + measureStep * height)

            rect.attr('fill', barColor)

            // Label Text
            draw.text(barLabel).font({ family: 'Helvetica', size: 12 })
            .cx(rect.attr('x') + rect.attr('width') / 2)
            .cy(xLine.attr('y1') + 10)

            // when hovered over for 1 second, show the value

            let text = draw.text().tspan(height).fill('transparent').font({ family: 'Helvetica', size: 12 })
            .cx(rect.attr('x') + rect.attr('width') / 2)
            .cy(rect.attr('y') - 10)

            rect.on('mouseover', function() {
                text.build(true)
                text.fill('#000000')
                text.build(false)
            })

            rect.on('mouseleave', function() {
                setTimeout(() => {
                    text.fill('transparent')
                }, 1000)
            })
        }   

        

        for(let i = 0; i <= max; i += (step / (density + 1))) {
            let measureLine = draw.line(yLine.attr('x1') - 5, xLine.attr('y1') + measureStep * i, yLine.attr('x1') + 5, xLine.attr('y2') + measureStep * i)
            .stroke({ width: 1, color: '#000' })

            if(i % step == 0) {
                measureLine.attr('x1', measureLine.attr('x1') - 1.5)
                measureLine.attr('x2', measureLine.attr('x2') + 1.5)

                let text = draw.text(i).font({ family: 'Helvetica', size: 12 })
                text.x(measureLine.attr('x1') - text.bbox().width - 2)
                .cy(xLine.attr('y1') + measureStep * i)
            } else {
                let text = draw.text().tspan(i).fill('#5C5858').font({ family: 'Helvetica', size: 8 })
                text.x(measureLine.attr('x1') - text.bbox().width - 2)
                .cy(xLine.attr('y1') + measureStep * i)
            }

            // horizontal lines
            draw.line(measureLine.attr('x2'), measureLine.attr('y1'), xLine.attr('x2'), measureLine.attr('y1'))
            .stroke({ width: 1, color: '#DCDCDC' })
        }

        let barPositionStep = ((yCenter.attr('x2') - yCenter.attr('x1')) / xAxisData.length) - 4

        for(let i = 0; i < xAxisData.length; i++){
            drawBar(yAxisData[i], barPositionStep * i + 18, barPositionStep - 18, xAxisData[i])
        }

        // title
        draw.text().tspan(chartTitle).fill('#8e8e8e')
        .y(10)
        .x(10)
        .font({ family: 'Helvetica', size: Chart.options.height / 30  })

    }
}