var svg;
var g;
var xAxis;
var yAxis;

// Constant
const margin = {top: 130, right: 30, bottom: 100, left: 70};
const width = 1280;
const height = 750;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const yScale = d3.scaleBand()
                .range([0, innerHeight])
                .padding(0.5);
const xScale = d3.scaleLinear()
                .range([0,innerWidth])
                .domain([0,100]);  

const fontSize = `20px times`;
const fontFamily = `Arial, Helvetica, sans-serif`;
const fontColor = `black`;
const squareDimension = 20;
const axisFont = `15px times`;
const strokeWidth = '5px';


document.addEventListener(`DOMContentLoaded`, function () {
    svg = d3.select(`#my_dataviz`)
            .append(`svg`)
                .attr(`width`, width)
                .attr(`height`, height);
                  
    g = svg.append(`g`)
                .attr(`transform`, `translate(${margin.left},${margin.top})`);

    svg.append('text')
        .attr(`x`, innerWidth/2-340)
        .attr(`y`, 55)
        .attr(`class`,`xLabel`)
        .style(`font`, fontSize)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .text(`Percent of time spent in PM 10 (\u03BCg/\u33A5) concentration durning occupied classroom time in April`);
    
    xAxis = g.append(`g`)
                .attr(`transform`, `translate(0, ${innerHeight})`);

    xAxis.append(`text`)
            .attr(`x`, innerWidth/2-10)
            .attr(`y`, 45)
            .attr(`class`,`xLabel`)
            .style(`font`, fontSize)
            .style(`font-family`, fontFamily)
            .attr(`fill`, fontColor)
            .text(`Percentage`);

    yAxis = g.append(`g`)
                .attr(`class`, `yAxis`);

    yAxis.append('text')
        .attr('x', -innerHeight/2 + 50)
        .attr('y', -40)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('Classroom'); 
   
    
    d3.csv(`data/percentage.csv`)
    .then(data => {
        
        // data.forEach(element => {
        //     element.Good = +element.Good
        //     element.Unhealthy = +element.Unhealthy
        //     element.Moderate = +element.Moderate
        // });
        console.log(data)
        
        drawBarGraph(data);
    });

});

const drawBarGraph = (data) => {
 
    const subgroups = data.columns.slice(1);
    
    const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#FA0000','#2EFA00','#EDFA00']);

    yScale.domain(data.map(d => d.Classroom));

    xAxis.call(d3.axisBottom(xScale)).style(`font`, axisFont);
    
    yAxis.call(d3.axisLeft(yScale)).style(`font`, axisFont)
    .call(g => g.selectAll('.domain').remove());

    const stackedData = d3.stack()
            .keys(subgroups)
            (data);
    
    g.append("g").selectAll("g")
    .data(stackedData)
    .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", d => yScale(d.data.Classroom))
        .attr("x", d => xScale(d[0]))
        .attr("width", d => xScale(d[1]) - xScale(d[0]))
        .attr("height",yScale.bandwidth());


    let y = -40;
    let x = 35;
    let xText = 60;
    let squareDimension = 20;
    let label_offset = 200;
    g.append("rect")
        .attr("x", x + label_offset)
        .attr("y", y)
        .attr("width", squareDimension)
        .attr("height", squareDimension)
        .attr("fill", `#2EFA00`); //#2EFA00

    g.append('text')
        .attr(`x`,xText + label_offset)
        .attr(`y`,y+16 )
        .attr(`class`,`xLabel`)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .text(`0-54 PM 10 (\u03BCg/\u33A5)`);

    label_offset += 250

    g.append("rect")
    .attr("x", x + label_offset)
    .attr("y", y)
    .attr("width", squareDimension)
    .attr("height", squareDimension)
    .attr("fill", `#EDFA00`); //#EDFA00

    g.append('text')
        .attr(`x`,xText + label_offset)
        .attr(`y`,y+16)
        .attr(`class`,`xLabel`)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .text(`55-154 PM 10 (\u03BCg/\u33A5)`);

   
    label_offset += 250

    g.append("rect")
    .attr("x", x + label_offset)
    .attr("y", y)
    .attr("width", squareDimension)
    .attr("height", squareDimension)
    .attr("fill", `#FA0000`);//#FA0000

    g.append('text')
        .attr(`x`,xText + label_offset)
        .attr(`y`,y+16)
        .attr(`class`,`xLabel`)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .text(`155-255 PM 10 (\u03BCg/\u33A5)`);
}
