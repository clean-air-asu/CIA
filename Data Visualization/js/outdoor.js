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
        .domain([new Date('2022-11-25'), new Date('2023-06-08')]);


const yScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([0,550]);

const fontSize = '18px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const axisFont = '17px times';
const circleRadius = 3;

const out = '#07C5FF';
const forty = '#B039FF';
const forty_7 = '#FF0707';
const forty_8 = '#66FF07';
// const out = '#E2C7F4';
const formatMonth = d3.timeFormat("%B");

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
    .attr('y', 40)
    .style('font', fontSize)
    .style('font-family', fontFamily)
    .attr('fill', fontColor)
    .text('Time');

xAxis.call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(d3.timeFormat("%B")))
.style(`font`, axisFont).attr('class','xAxisFont')
.call(g => g.selectAll(`.tick line`)
        .attr(`stroke-opacity`, 0.1)
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
    .text('PM 10 (ug/m3)');

    yAxis.call(d3.axisRight(yScale)
        .tickSize(innerWidth)
        ).style(`font`, axisFont).attr('class','yAxisFont')
.call(g => g.selectAll(`.tick:not(:first-of-type) line`)
        .attr(`stroke-opacity`, 0.1)
        .attr(`stroke-dasharray`, `3,3`)
        .attr('x1','0'))
.call(g => g.selectAll(`.tick text`)
        .attr(`x`, -30)
        .attr(`dy`, 4));

d3.csv(`data/PM10.csv`)
    .then(data => {
        
        data.forEach(element => {

            element.PM10 = +element.PM10;
            element['Daily Mean PM10 Concentration'] = +element['Daily Mean PM10 Concentration'];
            element['DAILY_AQI_VALUE'] = +element['DAILY_AQI_VALUE'];
            element['40'] = +element['40'];
            element['47'] = +element['47'];
            element['48'] = +element['48'];
            element.Date = new Date(element.Date);
        });
        drawLineGraph(data);
});


});


const size = 150;
const legendSize = 300;
let stroke_width = 2;
const drawLineGraph = (data) => {

const cross = g.selectAll('cross').data(data);

cross.join('g')
    .attr('class', 'cross-airGradient')
    .attr('id','cross')
    .attr('transform', d => `translate(${xScale(d.Date)}, ${yScale(d['40'])})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolDiamond).size(size))
                .attr('stroke',d => {
                    if(d['40'] <= 0){
                        return 'none'
                    }
                    return 'black';
                } )
                .attr('fill',d => {
                    if(d['40'] <= 0){
                        return 'none'
                    }
                    return forty;
                } )
                .attr('stroke-width', 1)
                // .attr('transform', 'rotate(45)');
        });
    });


    const square = g.selectAll('square').data(data);

square.join('g')
    .attr('class', 'square-airGradient')
    .attr('id','square')
    .attr('transform', d => `translate(${xScale(d.Date)}, ${yScale(d['47'])})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolSquare ).size(size))
                .attr('stroke',d => {
                    if(d['47'] <= 0){
                        return 'none'
                    }
                    return forty_7;
                } )
                .attr('stroke-width', stroke_width)
                .attr('fill', 'none')
                // .attr('transform', 'rotate(45)');
        });
    });

    const triangle = g.selectAll('triangle').data(data);

    triangle.join('g')
    .attr('class', 'triangle-airGradient')
    .attr('id','triangle')
    .attr('transform', d => `translate(${xScale(d.Date)}, ${yScale(d['48'])})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolTriangle ).size(size))
                .attr('stroke',d => {
                    if(d['48'] <= 0){
                        return 'none'
                    }
                    return forty_8;
                } )
                .attr('stroke-width', stroke_width)
                .attr('fill', 'none')
                // .attr('transform', 'rotate(45)');
        });
    });


const circle = g.selectAll('circle').data(data);

circle.join('g')
    .attr('class', 'circle-airGradient')
    .attr('id','circle')
    .attr('transform', d => `translate(${xScale(d.Date)}, ${yScale(d['Daily Mean PM10 Concentration'])})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolCircle).size(size))
                .attr('stroke',d => {
                    if(d['Daily Mean PM10 Concentration'] <= 0){
                        return 'none'
                    }
                    return 'black';
                } )
                .attr('stroke-width', 1)
                .attr('fill',d => {
                    if(d['Daily Mean PM10 Concentration'] <= 0){
                        return 'none'
                    }

                    if(d.Date > new Date('2023-03-31')){
                        return 'yellow';
                    }
                    return out;
                } );
        });
    });

// g.selectAll("dot")
// .data(data)
// .join("circle")
//     .attr("cx", (d) => xScale(d.Date) )
//     .attr("cy", (d) => yScale(d['Daily Mean PM10 Concentration']) )
//     .attr("r", 2.5)
//     .style("fill", 'none')
//     .attr('stroke', out);
stroke_width = 3;
y = 100;

const legend = g.selectAll('legend')
.data(data);

legend.join('g')
.attr('class', 'legend')
.attr('id','cross')
.attr('transform', d => `translate(1205, ${y})`)
.call(g => {
    g.each(function (d) {
        d3.select(this).append('path')
            .attr('d', d3.symbol().type(d3.symbolDiamond).size(legendSize))
            .attr('stroke', 'black')
            .attr('fill', forty)
            .attr('stroke-width', 1)
            // .attr('transform', 'rotate(45)');
    });
});

g.append('text')
    .attr('id', 'legend-text')
    .attr(`x`, 1240)
    .attr(`y`, y + 5)
    .text('Classroom 40'); 
    
y = 20; 
const circleLegend = g.selectAll('circleLegend').data(data);

circleLegend.join('g')
    .attr('class', 'circleLegend')
    .attr('id','circleLegend')
    .attr('transform', d => `translate(1205, ${y})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolCircle).size(legendSize))
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('fill',out);
        });
    });

g.append('text')
    .attr('id', 'legend-text')
    .attr(`x`, 1240)
    .attr(`y`, y + 5)
    .text('Outdoor PM 10 AQS'); 
y = 60
    const circleLegend2 = g.selectAll('circleLegend2').data(data);

    circleLegend.join('g')
        .attr('class', 'circleLegend2')
        .attr('id','circleLegend2')
        .attr('transform', d => `translate(1205, ${y})`)
        .call(g => {
            g.each(function (d) {
                d3.select(this).append('path')
                    .attr('d', d3.symbol().type(d3.symbolCircle).size(legendSize))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('fill','yellow');
            });
        });
    
    g.append('text')
        .attr('id', 'legend-text')
        .attr(`x`, 1240)
        .attr(`y`, y + 5)
        .text('Outdoor PM 10 AirNow'); 

y = 180;

const Dlegend = g.selectAll('Dlegend')
.data(data);

Dlegend.join('g')
.attr('class', 'Dlegend')
.attr('id','cross')
.attr('transform', d => `translate(1205, ${y})`)
.call(g => {
    g.each(function (d) {
        d3.select(this).append('path')
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(legendSize))
            .attr('stroke', forty_8)
            .attr('stroke-width', stroke_width)
            .attr('fill', 'none');
    });
});

g.append('text')
    .attr('id', 'legend-text')
    .attr(`x`, 1240)
    .attr(`y`, y + 5)
    .text('Classroom 48'); 

    y = 140;

    const legendry = g.selectAll('legendry')
    .data(data);
    
    legendry.join('g')
    .attr('class', 'legendry')
    .attr('id','cross')
    .attr('transform', d => `translate(1205, ${y})`)
    .call(g => {
        g.each(function (d) {
            d3.select(this).append('path')
                .attr('d', d3.symbol().type(d3.symbolSquare).size(legendSize))
                .attr('stroke', forty_7)
                .attr('stroke-width', stroke_width)
                .attr('fill', 'none');
        });
    });
    
    g.append('text')
        .attr('id', 'legend-text')
        .attr(`x`, 1240)
        .attr(`y`, y + 5)
        .text('Classroom 47'); 
} 
