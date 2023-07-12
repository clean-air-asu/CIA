var svg;
var g;
var xAxis;
var yAxis;


const margin = {top: 50, right: 10, bottom: 70, left: 60};
const width = 1500;
const height = 700;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleTime()
        .range([0, innerWidth])
        .domain([new Date('2023-06-29T10:44:30'), new Date('2023-06-29T14:20:30')]);

const yScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([0,1000]);

const fontSize = '17px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const axisFont = '13px times';
const circleRadius = 3;
const air_gradient = '#007f7f';
const US_AQI = '#9d00ff';
const mod_pm = '#004eff';
const radius = 2.5;


document.addEventListener('DOMContentLoaded', function () {

svg = d3.select('#my_dataviz')
    .append('svg')
        .attr('width', width)
        .attr('height', height);

g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

xAxis = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);

xAxis.append('text')
    .attr('x', innerWidth/2)
    .attr('y', 30)
    .style('font', fontSize)
    .style('font-family', fontFamily)
    .attr('fill', fontColor)
    .text('Time');

xAxis.call(d3.axisBottom(xScale).tickSize(-innerHeight))
.style(`font`, axisFont)
.call(g => g.selectAll(`.tick line`)
        .attr(`stroke-opacity`, 0.3)
        .attr(`stroke-dasharray`, `3,3`))
.call(g => g.selectAll(`.tick text`)
        .attr(`y`, 10)
        .attr(`dy`, 4));

yAxis = g.append('g')
        .attr('class', 'yAxis');

yAxis.append('text')
    .attr('x', -innerHeight/2 + 65)
    .attr('y', -40)
    .attr('id', 'yAxis-text')
    .style('font', fontSize)
    .style('font-family', fontFamily)
    .attr('fill', fontColor)
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .text('PM 2.5 (ug/m3)');

    yAxis.call(d3.axisRight(yScale)
        .tickSize(innerWidth)
        ).style(`font`, axisFont).attr('class','yAxisFont')
.call(g => g.selectAll(`.tick:not(:first-of-type) line`)
        .attr(`stroke-opacity`, 0.3)
        .attr(`stroke-dasharray`, `3,3`)
        .attr('x1','0'))
.call(g => g.selectAll(`.tick text`)
        .attr(`x`, -30)
        .attr(`dy`, 4));

Promise.all([d3.csv('data/Airgradient-06-29-2023.csv'),d3.csv('data/Mod-PM-06-29-2023.csv')])
.then( (values) => {
    airgradient = values[0];
    modPM = values[1];

    airgradient.forEach(element => {
        element.PM25 = +element['PM2.5 avg'];
        element.US_AQI = +element['PM2.5 avg (US AQI)'];
        element.Date = new Date(element['Local Date/Time']);
    });

    modPM.forEach(element => {
        element.PM25 = +element.pm25;
        element.Date = new Date(element['timestamp']);
    });

    drawLineGraph(airgradient,modPM);
})


});



const drawLineGraph = (airgradient,modPM) => {

g.append("path")
    .datum(airgradient)
    .attr("fill", "none")
    .attr("stroke", air_gradient)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.PM25))
    );

g.append("path")
    .datum(airgradient)
    .attr("fill", "none")
    .attr("stroke", US_AQI)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.US_AQI))
    );

// g.append("path")
//     .datum(modPM)
//     .attr("fill", "none")
//     .attr("stroke", mod_pm)
//     .attr("stroke-width", 1.5)
//     .attr("d", d3.line()
//       .x((d) => xScale(d.Date))
//       .y((d) => yScale(d.PM25))
//     );

g.selectAll("dot")
.data(airgradient)
.join("circle")
    .attr("cx", (d) => xScale(d.Date) )
    .attr("cy", (d) => yScale(d.PM25) )
    .attr("r", radius)
    .style("fill", air_gradient);

g.selectAll("dot")
    .data(airgradient)
    .join("circle")
        .attr("cx", (d) => xScale(d.Date) )
        .attr("cy", (d) => yScale(d.US_AQI) )
        .attr("r", radius)
        .style("fill", US_AQI);

g.selectAll("dot")
.data(modPM)
.join("circle")
    .attr("cx", (d) => xScale(d.Date) )
    .attr("cy", (d) => yScale(d.PM25) )
    .attr("r", d => {
        if (d.PM25 == 0){
            return 0;
        }
        return radius;
    })
    .style("fill", mod_pm);

y = 10;   
g.append('line')
    .attr('id', 'legend-lines')
    .attr(`x1`, 1100)
    .attr(`x2`, 1250)
    .attr(`y1`, y)
    .attr(`y2`, y)
    .attr(`stroke`, air_gradient)
    .attr(`stroke-width`, `2px`)
    .style("stroke-dasharray", ("0, 0"));

g.append('text')
    .attr('id', 'legene-text')
    .attr(`x`, 1270)
    .attr(`y`, y + 5)
    .text('Air Gradient PM 2.5'); 
    
y = 30;   
g.append('line')
        .attr('id', 'legend-lines')
        .attr(`x1`, 1100)
    .attr(`x2`, 1250)
        .attr(`y1`, y)
        .attr(`y2`, y)
        .attr(`stroke`, US_AQI)
        .attr(`stroke-width`, `2px`)
        .style("stroke-dasharray", ("0, 0"));

g.append('text')
        .attr('id', 'legene-text')
        .attr(`x`, 1270)
        .attr(`y`, y + 5)
        .text('US AQI PM 2.5'); 

y = 50;   
g.append('line')
    .attr('id', 'legend-lines')
    .attr(`x1`, 1100)
    .attr(`x2`, 1250)
    .attr(`y1`, y)
    .attr(`y2`, y)
    .attr(`stroke`, mod_pm)
    .attr(`stroke-width`, `2px`)
    .style("stroke-dasharray", ("0, 0"));

g.append('text')
    .attr('id', 'legene-text')
    .attr(`x`, 1270)
    .attr(`y`, y + 5)
    .text('Modulair PM 2.5'); 
} 
