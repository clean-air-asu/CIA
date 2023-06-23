var svg;
var g;
var xAxis;
var yAxis;


const margin = {top: 50, right: 60, bottom: 70, left: 60};
const width = 1300;
const height = 700;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleTime()
                .range([0, innerWidth])
                .domain([new Date('12/06/2022'), new Date('2/28/2023')]);

const yScale = d3.scaleLinear()
                .range([innerHeight, 0])
                .domain([0,12])
                .nice();

const fontSize = '17px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const axisFont = '13px times';
const PM10 = '#007f7f';
const PM25 = '#9d00ff';
const PM1 = '#004eff';
document.addEventListener('DOMContentLoaded', function () {
   
    svg = d3.select('#my_dataviz')
            .append('svg')
                .attr('width', width)
                .attr('height', height);
    
    
    g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

    // svg.style('background-image',`linear-gradient(rgb(255 188 188) 11%, rgb(241 241 194) 0%, rgb(241 241 194) 72%, rgb(206 244 192) 0%, rgb(206 244 192)88.5%, white 0%, white 10%)`);          

    xAxis = g.append('g')
                .attr('transform', `translate(0, ${innerHeight})`);

    

    yAxis = g.append('g')
                .attr('class', 'yAxis');
     
   d3.csv('data/class.csv')
        .then((data) => {
                data.forEach(element => {
                    element.PM1 = +element.PM1;
                    element.PM25 = +element.PM25;
                    element.PM10 = +element.PM10;
                    element.date = new Date(element.date);
                });
                
                drawLineGraph(data);
        });

});

const drawLineGraph = (data) => {

    xAxis.call(d3.axisBottom(xScale).ticks(20));
    yAxis.call(d3.axisLeft(yScale));

    last = data[data.length -1];
    // console.log(last);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", 
        (d) => { return PM1;})
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.PM1))
          .curve(d3.curveBasis)
          
        );
    
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", PM25)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.PM25))
          .curve(d3.curveBasis)
        );
  
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", PM10)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.PM10))
          .curve(d3.curveBasis)
        );
        
   
    const pm1 = g.append('circle')
        .attr('cx', xScale(last.date))
        .attr('cy', yScale(last.PM1))
        .attr('fill', PM1)
        .attr('r', 4);
    
    const pm25 = g.append('circle')
        .attr('cx', xScale(last.date))
        .attr('cy', yScale(last.PM25))
        .attr('fill', PM25)
        .attr('r', 4);

    const pm10 = g.append('circle')
        .attr('cx', xScale(last.date))
        .attr('cy', yScale(last.PM10))
        .attr('fill', PM10)
        .attr('r', 4);
    
    g.append(`text`)
    .attr(`x`, xScale(last.date) + 5)
    .attr(`y`, yScale(last.PM10) + 5)
    .text(`PM 10`);

    g.append(`text`)
    .attr(`x`, xScale(last.date) + 5)
    .attr(`y`, yScale(last.PM1) + 5)
    .text(`PM 1`);

    g.append(`text`)
    .attr(`x`, xScale(last.date) + 5)
    .attr(`y`, yScale(last.PM25) + 5)
    .text(`PM 2.5`);
} 