var svg;
var g;
var xAxis;
var yAxis;

// Constant
const margin = {top: 80, right: 30, bottom: 50, left: 100};
const width = 1380;
const height = 650;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleBand()
                .range([0, innerWidth])
                .padding(.6);
const yScale = d3.scaleLinear()
                .range([innerHeight, 0])
                .domain([0,18]);  

const fontSize = `20px times`;
const fontFamily = `Arial, Helvetica, sans-serif`;
const fontColor = `black`;
const squareDimension = 20;
const axisFont = `15px times`;

const offsetbaseline = 16;
const offsetweek1 = 31;

const weekColor = '#00A3E0'; //'#800000' ;

const baselineColor = '#FF7F32'; //#FFD700'; 
const strokeWidth = '3px';
var textOffset = 510;

document.addEventListener(`DOMContentLoaded`, function () {
    svg = d3.select(`#my_dataviz`)
            .append(`svg`)
                .attr(`width`, width)
                .attr(`height`, height);
                  
    g = svg.append(`g`)
                .attr(`transform`, `translate(${margin.left},${margin.top})`);

    g.append('text')
        .attr(`x`, innerWidth/2-450)
        .attr(`y`, -25)
        .attr(`class`,`xLabel`)
        .style(`font`, fontSize)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .text(`Mean Weekly PM 2.5 Concentration (\u03BCg/\u33A5) at Baseline (No C-R Box) vs Week 1 (C-R Box)`);
    
    xAxis = g.append(`g`)
                .attr(`transform`, `translate(0, ${innerHeight})`);

    xAxis.append(`text`)
            .attr(`x`, innerWidth/2-10)
            .attr(`y`, 45)
            .attr(`class`,`xLabel`)
            .style(`font`, fontSize)
            .style(`font-family`, fontFamily)
            .attr(`fill`, fontColor)
            .text(`Classroom`);

    yAxis = g.append(`g`)
                .attr(`class`, `yAxis`);

    yAxis.append('text')
        .attr('x', -innerHeight/2 + 80)
        .attr('y', -45)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('PM 2.5 (\u03BCg/\u33A5)'); 
   
    
    d3.csv(`data/baseline-vs-week.csv`)
    .then(data => {
        
        data.forEach(element => {
            element.baseline = +element.baseline;
            element.week1 = +element.week1;
        });
        console.log(data)
        drawBarGraph(data);
    });

});

const drawBarGraph = (data) => {
    xScale.domain(data.map(d => d.ID));

    xAxis.call(d3.axisBottom(xScale).tickSize(-innerHeight)).style(`font`, axisFont)
    .call(g => g.selectAll(`.tick line`)
            .attr(`stroke-opacity`, 0.3)
            .attr(`stroke-dasharray`, `3,3`))
    .call(g => g.selectAll(`.tick text`)
            .attr(`y`, 10)
            .attr(`dy`, 4));
    
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

        const baseline = g.selectAll('.baseline')
        .data(data);

        baseline
        .enter()
        .append('line')
        .attr('class','baseline')
        .merge(baseline)
        .attr('x1', d => xScale(d.ID) + offsetbaseline )
        .attr('x2', d => xScale(d.ID) + offsetbaseline )
        .attr('y1', yScale(0))
        .attr('y2', d => yScale(d.baseline))
        .attr('stroke', baselineColor)
        .style("stroke-dasharray", ("10,7"))
        .attr(`stroke-width`,strokeWidth);
    

        const week = g.selectAll('.week')
        .data(data);

        week
        .enter()
        .append('line')
        .attr('class','week')
        .merge(week)
        .attr('x1', d => xScale(d.ID) + offsetweek1 )
        .attr('x2', d => xScale(d.ID) + offsetweek1 )
        .attr('y1', yScale(0))
        .attr('y2', d => yScale(d.week1))
        .attr('stroke', weekColor)
        .attr(`stroke-width`,strokeWidth);

    
        const baselineCircle = g.selectAll('.baselineCircle')
        .data(data);

        baselineCircle
        .enter()
        .append('circle')
        .attr('class','baselineCircle')
        .merge(baselineCircle)
            .attr('cx', d => xScale(d.ID) + offsetbaseline )
            .attr('cy', d => yScale(d.baseline) )
            .attr('r', 4)
            .style('fill', baselineColor);
    

        const weekCircle = g.selectAll('.weekCircle')
            .data(data);
    
            weekCircle
            .enter()
            .append('circle')
            .attr('class','weekCircle')
            .merge(weekCircle)
                .attr('cx', d => xScale(d.ID) + offsetweek1 )
                .attr('cy', d => yScale(d.week1) )
                .attr('r', 4)
                .style('fill', weekColor);
    
    g.append('line')
    .attr('x1',textOffset-220)
    .attr('x2',textOffset-20)
    .attr('y1',20)
    .attr('y2',20)
    .attr(`stroke`, baselineColor)
    .attr(`stroke-width`,strokeWidth)
    .style("stroke-dasharray", ("10,7"));
    // g.append('rect')
    //     .attr('x',textOffset-30)
    //     .attr('y',-62)
    //     .attr('width',20)
    //     .attr('height',20)
    //     .attr(`fill`, baselineColor);         

    g.append(`text`)
        .attr(`x`, textOffset)
        .attr(`y`, 25)
        .style(`font`, fontSize)
        .style(`font-family`, fontFamily)
        .text(`C-R Box Off`);

    textOffset = 970;
    g.append('line')
    .attr('x1',textOffset-220)
    .attr('x2',textOffset-20)
    .attr('y1',20)
    .attr('y2',20)
    .attr(`stroke`, weekColor)
    .attr(`stroke-width`,strokeWidth);
    
    // g.append('rect')
    //     .attr('x',textOffset-30)
    //     .attr('y',-27)
    //     .attr('width',20)
    //     .attr('height',20)
    //     .attr(`fill`, weekColor);

    g.append(`text`)
            .attr(`x`, textOffset)
            .attr(`y`, 25)
            .style(`font`, fontSize)
            .style(`font-family`, fontFamily)
            .text(`C-R Box On`);

    // document.getElementById("header-text").innerHTML = "Mean Weekly PM2.5 Concentration (\u03BCg/\u33A5) at Baseline (No C-R Box) vs Week 1 (C-R Box)";
   
}
