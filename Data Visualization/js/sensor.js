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
        .domain([new Date('2023-07-12T12:50:00'), new Date('2023-07-12T17:35:00')]);

const yScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([0,145]);

const fontSize = '17px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const axisFont = '13px times';
const circleRadius = 3;
const air_gradient = 'Red';
const US_AQI = '#9d00ff';
const mod_pm = '#004eff';

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

Promise.all([d3.csv('data/Airgradient-7-12-2023.csv'),d3.csv('data/Mod-PM-7-12-2023.csv')])
.then( (values) => {
    airgradient = values[0];
    modPM = values[1];

    airgradient.forEach(element => {
        element.PM25 = +element['PM2.5 avg'];
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

const cross = g.selectAll('cross').data(airgradient);

cross.join('g')
    .attr('class', 'cross-airGradient')
    .attr('id','cross')
    .attr('transform', d => `translate(${xScale(d.Date)}, ${yScale(d.PM25)})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolCross).size(80))
                .attr('stroke', air_gradient)
                .attr('fill', air_gradient)
                .attr('transform', 'rotate(45)');
        });
    });

g.selectAll("dot")
.data(modPM)
.join("circle")
    .attr("cx", (d) => xScale(d.Date) )
    .attr("cy", (d) => yScale(d.PM25) )
    .attr("r", 2.5)
    .style("fill", 'none')
    .attr('stroke', mod_pm);

y = 20;

const legend = g.selectAll('legend')
.data(modPM);

legend.join('g')
.attr('class', 'legend')
.attr('id','cross')
.attr('transform', d => `translate(1235, ${y})`)
.call(g => {
    g.each(function (d) {
        d3.select(this).append('path')
            .attr('d', d3.symbol().type(d3.symbolCross).size(300))
            .attr('stroke', air_gradient)
            .attr('fill', air_gradient)
            .attr('transform', 'rotate(45)');
    });
});

g.append('text')
    .attr('id', 'legend-text')
    .attr(`x`, 1270)
    .attr(`y`, y + 5)
    .text('Air Gradient PM 2.5'); 
    
y = 60; 
g.append('circle')
    .attr("cx", 1235 )
    .attr("cy", y )
    .attr("r", 10)
    .style("fill", 'none')
    .attr('stroke-width', 5)
    .attr('stroke', mod_pm);

g.append('text')
    .attr('id', 'legend-text')
    .attr(`x`, 1270)
    .attr(`y`, y + 5)
    .text('Modulair PM 2.5'); 
} 
