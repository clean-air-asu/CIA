var svg;
var g;
var xAxis;
var yAxis;


const margin = {top: 50, right: 10, bottom: 70, left: 60};
const width = 1500;
const height = 600;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleTime()
            .range([0, innerWidth])
            .domain([new Date('2023-04-03T07:30:30'), new Date('2023-04-03T15:30:30')]);

            const xScale2 = d3.scaleTime()
            .range([0, innerWidth])
            .domain([new Date('2023-04-04T07:30:30'), new Date('2023-04-04T15:30:30')]);

            const xScale3 = d3.scaleTime()
            .range([0, innerWidth])
            .domain([new Date('2023-04-05T07:30:30'), new Date('2023-04-05T15:30:30')]);

            const xScale4 = d3.scaleTime()
            .range([0, innerWidth])
            .domain([new Date('2023-04-06T07:30:30'), new Date('2023-04-06T15:30:30')]);

            const xScale5 = d3.scaleTime()
            .range([0, innerWidth])
            .domain([new Date('2023-04-07T07:30:30'), new Date('2023-04-07T15:30:30')]);

const yScale = d3.scaleLinear()
            .range([innerHeight, 0]);

const fontSize = '17px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const axisFont = '13px times';
const circleRadius = 3;


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



    xAxis.call(d3.axisBottom(xScale).tickSize(-innerHeight)).style(`font`, axisFont)
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
        .text('PM 10 (ug/m3)');

    
    d3.csv(`data/Claasroom-ID-40.csv`).then(data => {
            data.forEach(element => {
                    element.Timestamp = new Date(element.Timestamp);
                    element.PM10 = +element.PM10;
            });
            // console.log(data);
            drawLineGraph(data);
    });

    yScale.domain([0,1300]);

    yAxis.call(d3.axisRight(yScale)
            .tickSize(innerWidth)
            ).style(`font`, axisFont).attr('class','yAxisFont')
    // .call(g => g.select(`.domain`)
    //         .remove())
    .call(g => g.selectAll(`.tick:not(:first-of-type) line`)
            .attr(`stroke-opacity`, 0.3)
            .attr(`stroke-dasharray`, `3,3`)
            .attr('x1','0'))
    .call(g => g.selectAll(`.tick text`)
            .attr(`x`, -30)
            .attr(`dy`, 4));
});



const drawLineGraph = (data) => {

    const sumstat = d3.group(data, d => d.classroom); 
    // console.log(sumstat)
    // console.log(sumstat.get('214')) 

    // let map = new Map()

    // sumstat.forEach((e,k) => {
    //         console.log(k);
    //         console.log(e);
    // })

    
    const color = d3.scaleOrdinal()
    .range(['red','blue','yellow','green','black','#ffff33','#a65628','#f781bf','#999999','black'])

    const colorMap = {
            '410' : '#8C1D40',
            // '419' : '#00A3E0',
            // '403' : '#FF7F32',
            // '413' : ' #FFC627',
    }
    
//       Draw the line
    g.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ 
            return '#8C1D40' })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
            .x(function(d) { return xScale(d.Timestamp); })
            .y(function(d) { return yScale(d.PM10); })
            .curve(d3.curveBasis)
            (d[1])
    });


    g.selectAll(".line2")
    .data(sumstat)
    .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ 
            return '#8C1D40' })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
        return d3.line()
            .x(function(d) { return xScale2(d.Timestamp); })
            .y(function(d) { return yScale(d.PM10); })
            .curve(d3.curveBasis)
            (d[1])
    });

    g.selectAll(".line3")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function(d){ 
        return '#8C1D40' })
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
        return d3.line()
        .x(function(d) { return xScale3(d.Timestamp); })
        .y(function(d) { return yScale(d.PM10); })
        .curve(d3.curveBasis)
        (d[1])
});

g.selectAll(".line4")
.data(sumstat)
.join("path")
    .attr("fill", "none")
    .attr("stroke", function(d){ 
        return '#8C1D40' })
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
    return d3.line()
        .x(function(d) { return xScale4(d.Timestamp); })
        .y(function(d) { return yScale(d.PM10); })
        .curve(d3.curveBasis)
        (d[1])
});

g.selectAll(".line5")
.data(sumstat)
.join("path")
.attr("fill", "none")
.attr("stroke", function(d){ 
    return 'blue' })
.attr("stroke-width", 1.5)
.attr("d", function(d){
    return d3.line()
    .x(function(d) { return xScale5(d.Timestamp); })
    .y(function(d) { return yScale(d.PM10); })
    // .curve(d3.curveBasis)
    (d[1])
});

    // g.append("path")
    // .datum(data)
    // .attr('class', 'line')
    // .attr('id','lines')
    // .attr("fill", "none")
    // .attr("stroke", 'black')
    // .attr("stroke-width", 1.5)
    // .attr("d", d3.line()
    //     .x(d => xScale(d.Timestamp) )
    //     .y(d => yScale(d.PM10))
        
    // )
    // .style("stroke-dasharray", ("0, 0"))
    // .attr('stroke-opacity', 1);


    // const baselineCircle =g.selectAll(months[i])
    // .data(school);

    // baselineCircle
    // .join('circle')
    // .attr('class', 'circle'+i)
    // .attr('id','circles')
    // .attr('cx', d => xScale(d.ID))
    // .attr('cy', d => yScale(d[months[i]]))
    // .attr('r' , d =>{
    //     if (d[months[i]] <= 0) {
    //         return 0;
    //     }
    //     return circleRadius;
    // } )
    // .attr('fill', colorMap[key]);
    // y = 10
    // for (const property in colorMap) {
    //         g.append('line')
    //         .attr('id','legend-lines')
    //         .attr(`x1`, 650)
    //         .attr(`x2`, 800)
    //         .attr(`y1`, y)
    //         .attr(`y2`, y)
    //         .attr(`stroke`, colorMap[property])
    //         .attr(`stroke-width`,`2px`)
    //         .style("stroke-dasharray", ("0, 0"));
    
    //         g.append('text')
    //         .attr('id','legene-text')
    //         .attr(`x`, 810)
    //         .attr(`y`, y+5)
    //         .text(`Classroom ${property}`);

    //         y+=20;
    // }

//         y +=20
//     }
} 
