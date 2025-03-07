import { Chart } from '../main.js';
import { PathArray } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @class LineChart
 * @memberof Chart
 * @param {string}            chartTitle title of the chart
 * @param {string}            xAxisLabel label for the x axis
 * @param {string}            yAxisLabel label for the y axis
 * @param {number}            xStep      step value for the x axis
 * @param {number}            yStep      step value for the y axis
 * @param {object[]}          data       the data for the line chart
 * @param {string}            data[].color color of the line
 * @param {string}            data[].label label for the line
 * @param {number}            data[].pointRadius radius of the points
 * @param {number}            data[].lineWidth width of the line
 * @param {number}            data[].hoverPointRadius radius of the hover points
 * @param {boolean}           data[].pointLabels whether or not to show the point labels
 * @description Has trouble with extremely small numbers (<0)
 * @example
let line = new Chart('line')
    .appendTo('#line-chart')
    .setData("Average Stock Prices (2000 - 2022)", 'Year', 'Price', 1, 10, [
        {
            color: 'red',
            label: 'Apple',
            pointRadius: 1,
            lineWidth: 2,
            hoverPointRadius: 4,
            pointLabels: true,
            points: [
                [2000, 0.6937],
                [2001, 0.3068],
                [2002, 0.2905],
                [2003, 0.2814],
                [2004, 0.5391],
                [2005, 1.4167],
                [2006, 2.1492],
                [2007, 3.8933],
                [2008, 4.3092],
                [2009, 4.4560],
                [2010, 7.8866],
                [2011, 11.0480],
                [2012, 17.5266],
                [2013, 14.6700],
                [2014, 20.5310],
                [2015, 27.1667],
                [2016, 24.1638],
                [2017, 35.4349],
                [2018, 45.1771],
                [2019, 50.5541],
                [2020, 93.6424],
                [2021, 139.3947],
                [2022, 153.9328],
            ],
        }, {
            color: 'blue',
            label: 'Microsoft',
            pointRadius: 2,
            lineWidth: 1,
            hoverPointRadius: 4,
            pointLabels: false,
            points: [
                [2000, 23.8554],
                [2001, 19.5747],
                [2002, 17.0729],
                [2003, 16.4050],
                [2004, 17.3987],
                [2005, 18.3417],
                [2006, 18.8863],
                [2007, 22.1793],
                [2008, 19.6798],
                [2009, 17.3973],
                [2010, 20.8738],
                [2011, 20.5793],
                [2012, 24.2010],
                [2013, 27.1941],
                [2014, 36.5584],
                [2015, 41.2965],
                [2016, 50.1958],
                [2017, 67.0252],
                [2018, 95.8759],
                [2019, 125.5735],
                [2020, 187.8096],
                [2021, 271.0883],
                [2022, 266.2800],
            ],
        }
    ])
 */
    export class Line2Chart_ {
        constructor(chartTitle, yAxisLabel, xAxisLabel, xStep, yStep, data){
            if(yStep <= 0) return console.error(new Error('yStep must be greater than 0'))
            if(xStep <= 0) return console.error(new Error('xStep must be greater than 0'))
            let draw = Chart.options.draw
            this.data = data;
    
            let xLine = Chart.measureLines.xAxisLine;
            let yLine = Chart.measureLines.yAxisLine;
    
            let xCenter = Chart.measureLines.xCenterLine;
            let yCenter = Chart.measureLines.yCenterLine;
            
            // X Axis Label
            let xLabel = draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
            .cx(xLine.attr('x1') + (xLine.attr('x2') - xLine.attr('x1')) / 2)
            .cy(Chart.options.height - (Chart.options.height - xLine.attr('y1')) / 2)
    
            // Y Axis Label
            let yLabel = draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
            .cx(yLine.attr('x2') / 2 - yLine.attr('x1') / 4)
            .cy(yLine.attr('y1') - (yLine.attr('y1') - yLine.attr('y2')) / 2)

            yLabel.x(yLabel.x() + 3)
            .rotate(-90)
    
            let yData = []
            let xData = []
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].points.length; j++){
                    yData.push(Math.round(data[i].points[j][1] * 100) / 100)
                    xData.push(data[i].points[j][0])
                }
            }
            
            let yMax = Math.max(...[0].concat(yData)) + yStep
            let yMin = Math.floor(Math.min(...new Array(1).fill(0).concat(yData)) - (yStep - (Math.min(...new Array(1).fill(0).concat(yData)) % yStep)) + yStep)
            let yMeasureStep = (yLine.attr('y1') - yLine.attr('y2')) / (yMax - yMin)
            let yMeasureCount = 0;

            let xMax = Math.max(...xData) + 1
            let xMin = Math.floor(Math.min(...xData) - (xStep - (Math.min(...xData) % xStep)) + xStep)
            let xMeasureStep = (xLine.attr('x2') - xLine.attr('x1')) / (xMax - xMin)
            let xMeasureCount = 0;

            let xLabelText = [];
            let yLabelText = [];

            for(let i = xMin; i < xMax; i += 1){
                xLabelText.push(i)
            }

            for(let i = yMin; i < yMax; i += 1){
                yLabelText.push(i)
            }

            let xMeasureLines = [];
            let yMeasureLines = [];
            
            for(let i = 0; i < xLabelText.length; i++){
                if(i % xStep !== 0) continue;
                let x = (xLine.attr('x1') + xMeasureStep * (xLabelText[i] - xMin)) + xMeasureStep/2
                let y = xLine.attr('y1')
                let line = draw.line(x, y, x, y + 5).stroke({ width: 1, color: '#8e8e8e' })

                let text = draw.text(xLabelText[i]).font({ family: 'Helvetica', size: 10, color: "black" });

                text.x(x - text.bbox().width / 2)
                .y(y + 10)
                .rotate(-45)

                xMeasureLines.push(line)
            }

            for(let i = 0; i < yLabelText.length; i++){
                if(i % yStep !== 0) continue;
                let x = yLine.attr('x1')
                let y = yLine.attr('y2') + yMeasureStep * i

                let measureLine = draw.line(x, y, xLine.attr('x2'), y).stroke({ width: 1, color: '#dcdcdc' })
                let line = draw.line(x + 5, y, x - 5, y).stroke({ width: 1, color: '#000' })
                let text = draw.text(yLabelText[i]).font({ family: 'Helvetica', size: 10, color: "black" });

                text.x(x - text.bbox().width - 10)
                .y(y - text.bbox().height / 2)

                yMeasureLines.push(line)
            }

            // points
            let points = []
            for(let i = 0; i < data.length; i++){
                points.push([])
                for(let j = 0; j < data[i].points.length; j++){
                    if(xMeasureLines[0] == undefined) console.error(new Error('x value out of bounds; lower xStep'));
                    if(yMeasureLines[0] == undefined) console.error(new Error('y value out of bounds; lower yStep'));

                    let x = xMeasureLines[0].attr('x1') + xMeasureStep * (data[i].points[j][0] - xMin)
                    let y = yMeasureLines[0].attr('y1') + yMeasureStep * (data[i].points[j][1] - yMin)

                    let point = draw.circle(data[i].pointRadius).fill(data[i].color)
                    .cx(x)
                    .cy(y)

                    points[points.length - 1].push(point)
                }
            }

            for(let i = 0; i < data.length; i++){
                let path = draw.path().fill('none').stroke({ width: data[i].lineWidth, color: data[i].color })
                let pathString = `M ${points[i][0].attr('cx')} ${points[i][0].attr('cy')} `

                for(let j = 1; j < points[i].length; j++){
                    pathString += `L ${points[i][j].attr('cx')} ${points[i][j].attr('cy')} `
                }

                path.plot(pathString)
            }

            for(let i = 0; i < points.length; i++){
                for(let j = 0; j < points[i].length; j++){
                    points[i][j].front()
                }
            }



            for(let i = 0; i < data.length; i++){
                let colorDisplay = draw.rect(20, 20).fill(data[i].color)
                .x(xLine.attr('x2') + 10)
                .y(yLine.attr('y1') + 30 * i)
                .radius(2)

                draw.text(data[i].label).font({ family: 'Helvetica', size: 12 })
                .x(xLine.attr('x2') + 10 + colorDisplay.bbox().width + 5)
                .y(yLine.attr('y1') + 30 * i + colorDisplay.bbox().height / 2 - 6)
            }


            // title
            draw.text().tspan(chartTitle).fill('#8e8e8e')
            .y(10)
            .x(10)
            .font({ family: 'Helvetica', size: Chart.options.height / 30  })
        }
    }