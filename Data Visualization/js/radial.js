var svg;
var g;

const margin = {top: 50, right: 10, bottom: 50, left: 10};
const width = 650;
const height = 800;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const innerRadius = 70;
const outerRadius = Math.min(innerWidth, innerHeight) / 2; 

const xScale = d3.scaleBand()
    .range([0, 2 * Math.PI])    
    .align(0); 

const yScale = d3.scaleRadial()
    .range([innerRadius, outerRadius])   
    .domain([0, 7]);

const weekColor = '#00A3E0'; 
const baselineColor = '#FF7F32'; 

const squareDimension = 20;

document.addEventListener(`DOMContentLoaded`, function () {
    svg = d3.select(`#my_dataviz`)
            .append(`svg`)
                .attr(`width`, width)
                .attr(`height`, height);
                  
    g = svg.append(`g`)
                .attr(`transform`, `translate(${innerWidth/2},${innerHeight/2 })`);
  
    d3.csv(`data/ach-school-2.csv`)
        .then(data => {
        
        data.forEach(element => {
            element.Baseline = +element.Baseline;
            element.ACH8CR = +element.ACH8CR;
        });
        console.log(data)
        drawBarGraph(data);
    });
});

const drawBarGraph = (data) => {

    xScale.domain( data.map(d => d.ID));
    
    const outer = g.selectAll(".outer")
    .data(data)

    outer.join("path")
      .attr("fill", weekColor)
      .attr('class', 'outer')
      .attr("d", d3.arc()     
          .innerRadius(innerRadius)
          .outerRadius(d => yScale(d['ACH8CR']))
          .startAngle(d => xScale(d.ID))
          .endAngle(d => xScale(d.ID) + xScale.bandwidth())
          .padAngle(0.05)
          .padRadius(innerRadius)
        )

    const inner = g.selectAll(".inner")
    .data(data)
    
    inner.join("path")
        .attr("fill", baselineColor)
        .attr('class','inner')
        .attr("d", d3.arc()    
            // .innerRadius( d => ybis(0))
            .innerRadius(innerRadius)
            .outerRadius( d => yScale(d['Baseline']))
            .startAngle(d => xScale(d.ID))
            .endAngle(d => xScale(d.ID) + xScale.bandwidth())
            .padAngle(0.05)
            .padRadius(innerRadius));

    //labels

    

    g
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("text-anchor", function(d) { return (xScale(d.ID) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((xScale(d.ID) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yScale(d['ACH8CR'])+10) + ",0)"; })
    .append("text")
      .text(d => `Room ${d.ID}`)
      .attr("transform", function(d) { return (xScale(d.ID) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

    g.append("text")
      .attr("x", -20)
      .attr("y", 5)
      .text('= 1.9');

    g.append("rect")
      .attr("x", -45)
      .attr("y", -10)
      .attr("width", squareDimension)
      .attr("height", squareDimension)
      .attr("fill", weekColor);

    g.append("rect")
      .attr("x", 30)
      .attr("y", -10)
      .attr("width", squareDimension)
      .attr("height", squareDimension)
      .attr("fill", baselineColor);
    


    svg.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", squareDimension)
        .attr("height", squareDimension)
        .attr("fill", baselineColor);

    svg.append("text")
        .attr("x", 35)
        .attr("y", 37)
        .text('C-R Box Off');


    svg.append("rect")
        .attr("x", 10)
        .attr("y", 50)
        .attr("width", squareDimension)
        .attr("height", squareDimension)
        .attr("fill", weekColor);

    svg.append("text")
        .attr("x", 35)
        .attr("y", 67)
        .text('C-R Box On');

    // svg.append("text")
    //     .attr("x", 155)
    //     .attr("y", 710)
    //     .text('Equivalent Air Changes per Hour Before and After Installation of C-R Box');

    // svg.append('g')
    // .call(xAxis);

    
    yAxis = g => g
    .attr('text-anchor', 'middle')
    // .call(g => g.append('text')
    //     .attr('text-anchor', 'end')
    //     .attr('x', '130')
    //     .attr('y', d => -yScale(yScale.ticks(5).pop())-5)
    //     .attr('dy', '-1em')
    //     .style('fill', '#1a1a1a')
    //     .text('Air Exchange Rate Per Hour (ACH)')
    // )
    .call(g => g.selectAll('g')
      .data(yScale.ticks(5))
      .join('g')
        .attr('fill', 'none')
        .call(g => g.append('circle')
            .style('stroke', '#808080')
            .style('stroke-opacity', 1)
            .attr('r', yScale))
        .call(g => g.append('text')
            .attr('y', d => -yScale(d))
            .attr('dy', '0.35em')
            .style('stroke', '#fff')
            .style('stroke-width', 5)
            .style("fill",'#1a1a1a')
            .text(yScale.tickFormat(6, 's'))
         .clone(true)
            .style('stroke', 'none')));


    g.append('g')
    .call(yAxis);
    
   
}

