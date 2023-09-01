// Variable
var svg;
var g;
var xAxis;
var yAxis;
var data;

// Constant
const margin = {top: 50, right: 30, bottom: 70, left: 60};
const width = 1500;
const height = 700;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleBand()
            .range([0, innerWidth])
            .padding(0.5);

const yScale = d3.scaleLinear()
            .range([innerHeight, 0])
            .domain([0,10]);  

const fontSize = '20px times';
const fontFamily = 'Arial';
const fontColor = 'black';
const axisFont = '15px times';
const weekColor =  '#00A3E0';
const baselineColor = '#FF7F32';
const boxWidth = 0.25;
document.addEventListener('DOMContentLoaded', function () {
    svg = d3.select('#my_dataviz')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

    g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('text')
    .attr(`x`, innerWidth/2-170)
    .attr(`y`, -10)
    .attr(`class`,`xLabel`)
    .style(`font`, fontSize)
    .style(`font-family`, fontFamily)
    .attr(`fill`, fontColor)
    .text(``);

    xAxis = g.append('g').attr('transform', `translate(0, ${innerHeight})`);

    xAxis.append('text')
            .attr('x', innerWidth/2)
            .attr('y', 35)
            .style('font', fontSize)
            .style('font-family', fontFamily)
            .attr('fill', fontColor)
            .text('Classroom');

    yAxis = g.append('g').attr('class', 'yAxis');

    yAxis.append('text')
            .attr('x', -innerHeight/2 + 55)
            .attr('y', -40)
            .attr('id', 'yAxis-text')
            .style('font', fontSize)
            .style('font-family', fontFamily)
            .attr('fill', fontColor)
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .text('ACH (1/\h)');

    val = ['ACH Exponetial Fit','R Sqaure Exponetial Fit','ACH Linear Fit','R Square Linear Fit', 'Index to slice'];
   
    Promise.all([d3.csv('data/ach-cr.csv'),d3.csv('data/ach-no-cr.csv')])
    .then( (values) => {
            cr = values[0];
            nocr = values[1];
        

            cr.forEach(element => {
                val.forEach(value => {
                        element[value] = +element[value];
                })
            });

            nocr.forEach(element => {
                val.forEach(value => {
                        element[value] = +element[value];
                })
            });

        //     console.log(values)
            data = [cr,nocr];
            type = document.getElementById('fit-select').value;
                if (type == 'Exponential'){
                        drawBoxPlot(data,'EX');
                }else {
                        drawBoxPlot(data,'LN');
                }
    });
});

const drawBoxPlot = (data,type) => {
    xScale.domain(data[1].map(d => d.Id));  
    
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
            .call(g => g.selectAll(`.tick:not(:first-of-type) line`)
                    .attr(`stroke-opacity`, 0.3)
                    .attr(`stroke-dasharray`, `3,3`)
                    .attr('x1','0'))
            .call(g => g.selectAll(`.tick text`)
                    .attr(`x`, -30)
                    .attr(`dy`, 4));

    svg.selectAll(`#vertLines,#boxes,#medianLines,#uperHorizonatlLine,#lowerHorizonatlLine`).remove();

    let offset = 30;
    boxPlot(data[0],offset,baselineColor,20,'C-R Box On',type);
    offset =5; 
    boxPlot(data[1],offset,weekColor,60,'C-R Box Off',type);
}

const boxPlot = (data, offset, color,y, text,type) => {
        
    const classroomsGroup = d3.group(data, d => d.Id);
    const visMap = new Map();

    classroomsGroup.forEach(element => {
                const key = element[0].Id;
                let ach = [];
                element.forEach(obj => {
                        if (type == 'EX'){
                                // if (obj['R Sqaure Exponetial Fit'] >= 0.98) {
                                        ach.push(obj['ACH Exponetial Fit']);
                                // }
                                document.getElementById('header').innerText = 'Exponential curve fitting ACH';
                        }else{
                                // if (obj['R Square Linear Fit'] >= 0.9 && (obj['Index to slice'] >= 40 || obj['Index to slice'] == 0)) {
                                        ach.push(obj['ACH Linear Fit']);
                                // }  
                                document.getElementById('header').innerText = 'Linear curve fitting ACH';
                        }

                });
                // console.log(ach);
                const sortedData = ach.sort(d3.ascending);
                const q1 = d3.quantile(sortedData, 0.25);
                const median = d3.median(sortedData);
                const q3 = d3.quantile(sortedData, 0.75);
                const iqr = q3 - q1;
                const min = Math.max(sortedData[0], q1 - 1.5 * iqr);
                const max = Math.min(sortedData[ach.length - 1], q3 + 1.5 * iqr);
            
           

                visMap.set(key,{q1: q1, median: median, q3: q3, interQuantileRange: iqr, min: min, max: max });
    });

//     console.log(visMap);
    g.selectAll("vertLines")
            .data(visMap)
            .enter()
            .append("line")
            .attr('id', 'vertLines')
            .attr("x1", d => xScale(d[0]) + offset)
            .attr("x2", d => xScale(d[0]) + offset)
            .attr("y1", d => yScale(d[1].min))
            .attr("y2", d => yScale(d[1].max))
            .attr("stroke", "black")
            .style("width", 40);
    g
    .selectAll("boxes")
    .data(visMap)
    .enter()
    .append("rect")
    .attr('id', 'boxes')
            .attr("x", (d) => { 
                console.log(d[0])
                return xScale(d[0])-boxWidth/2+offset - 10})
            .attr("y", (d) => yScale(d[1].q3) )
            .attr("height", (d) => yScale(d[1].q1)-yScale(d[1].q3))
            .attr("width", boxWidth + 20 )
            .attr("stroke", "black")
            .style("fill", color);
    let width = 9;

    g.selectAll("medianLines")
            .data(visMap)
            .enter()
            .append("line")
            .attr('id', 'medianLines')
            .attr("x1", (d) => xScale(d[0])-boxWidth/2 + offset - width)
            .attr("x2", (d) => xScale(d[0])+boxWidth/2 + offset + width)
            .attr("y1", (d) => yScale(d[1].median) )
            .attr("y2", (d) => yScale(d[1].median) )
            .attr("stroke", "black")
            .style("width", 80);

    
    g
    .selectAll("uperHorizonatlLine")
    .data(visMap)
    .enter()
    .append("line")
    .attr('id', 'uperHorizonatlLine')
            .attr("x1", (d) => xScale(d[0])-boxWidth/2 + offset - width)
            .attr("x2", (d) => xScale(d[0])+boxWidth/2 + offset + width)
            .attr("y1", (d) => yScale(d[1].max) )
            .attr("y2", (d) => yScale(d[1].max) )
            .attr("stroke", "black")
            .style("width", 80);


    g
    .selectAll("lowerHorizonatlLine")
    .data(visMap)
    .enter()
    .append("line")
    .attr('id', 'lowerHorizonatlLine')
            .attr("x1", (d) => xScale(d[0])-boxWidth/2 + offset - width)
            .attr("x2", (d) => xScale(d[0])+boxWidth/2 + offset + width)
            .attr("y1", (d) => yScale(d[1].min) )
            .attr("y2", (d) => yScale(d[1].min) )
            .attr("stroke", "black")
            .style("width", 80);
    
        g.append('rect')
            .attr('x', 1230)
            .attr('y', y)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('fill', color);
        
        g.append('text')
        .attr(`x`, 1270)
        .attr(`y`, y+17)
        .attr(`class`,`xLabel`)
        .style(`font`, fontSize)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .text(`${text}`);
}



const changeFit = () => {

        type = document.getElementById('fit-select').value;
        if (type == 'Exponential'){
                drawBoxPlot(data,'EX');
        }else {
                drawBoxPlot(data,'LN');
        }
        
}