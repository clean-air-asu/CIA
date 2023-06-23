// Variable
var svg;
var g;
var xAxis;
var yAxis;

// Constant
const margin = {top: 50, right: 30, bottom: 70, left: 60};
const width = 1200;
const height = 700;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleBand()
            .range([0, innerWidth])
            .padding(0.5);

const yScale = d3.scaleLinear()
            .range([innerHeight, 0])
            .domain([0,30]);  

const fontSize = '20px times';
const fontFamily = 'Arial';
const fontColor = 'black';
const axisFont = '15px times';
const weekColor =  '#00A3E0';
const baselineColor = '#FF7F32';
const boxWidth = 15;
document.addEventListener('DOMContentLoaded', function () {
    svg = d3.select('#my_dataviz')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
    svg.style('background-image',`linear-gradient(rgb(255, 188, 188) 12.7%, rgb(255, 188, 188) 0%, rgb(241, 241, 194) 0%, rgb(241, 241, 194) 56.9%, rgb(206, 244, 192) 0%, rgb(206, 244, 192) 90%, white 0%, white 10%)`);          
    
    svg.append('rect')
            .attr('x',0)
            .attr('y',0)
            .attr("width", 1200)
            .attr("height", 50)
            .attr('fill', 'white');
    
    svg.append('rect')
            .attr('x',0)
            .attr('y',0)
            .attr("width", 58.5)
            .attr("height", 1000)
            .attr('fill', 'white');

    svg.append('rect')
            .attr('x',1170)
            .attr('y',0)
            .attr("width", 58.5)
            .attr("height", 1000)
            .attr('fill', 'white');

    g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('text')
    .attr(`x`, innerWidth/2-170)
    .attr(`y`, -10)
    .attr(`class`,`xLabel`)
    .style(`font`, fontSize)
    .style(`font-family`, fontFamily)
    .attr(`fill`, fontColor)
    .text(`PM 2.5 (\u03BCg/\u33A5) distribution in April`);

    xAxis = g.append('g').attr('transform', `translate(0, ${innerHeight})`);

    xAxis.append('text')
            .attr('x', innerWidth/2)
            .attr('y', 35)
            .style('font', fontSize)
            .style('font-family', fontFamily)
            .attr('fill', fontColor)
            .text('Classrooms');

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
            .text('PM 2.5 (\u03BCg/\u33A5)');

    Promise.all([d3.csv('data/box-plot-data.csv'),d3.csv('data/box-plot-data-2.csv')])
    .then( (values) => {
            baseline = values[0];
            week = values[1];

            baseline.forEach(element => {
                    element.PM25 = +element.PM25;
                    element.classroom = +element.classroom;
                    element.Id = +element.Id;
            });

            week.forEach(element => {
                    element.PM25 = +element.PM25;
                    element.classroom = +element.classroom;
                    element.Id = +element.classroom;
            });

            data = [week];
            drawBoxPlot(data);
    });
});

const drawBoxPlot = (data) => {
    xScale.domain(data[0].map(d => d.Id));  
    
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

    let offset = 23;
    boxPlot(data[0],offset,baselineColor,0,0);
}

const boxPlot = (data, offset, color,dashSolid, dashgap) => {
    const classroomsGroup = d3.group(data, d => d.Id);
    const visMap = new Map();

    classroomsGroup.forEach(element => {
            const key = element[0].Id;
            let pm25List = [];
            let min = 999999;
            let max = 0;

            element.forEach(obj => {
                    pm25List.push(obj.PM25);
            });

            let q1 = d3.quantile(pm25List.sort(d3.ascending),.25);
            let median = d3.quantile(pm25List.sort(d3.ascending),.5);
            let q3 = d3.quantile(pm25List.sort(d3.ascending),.75);
            let interQuantileRange = q3 - q1;
            let quantileMin = q1 - interQuantileRange*1.5;
            let quantileMax = q3 + interQuantileRange*1.5;
            
            
            pm25List.forEach(pm25 => {
                    if(max < pm25 && pm25 <quantileMax){
                            max = pm25;
                    }
                    if(min > pm25 && pm25 >quantileMin){
                            min = pm25;
                    }
            });

            visMap.set(key,{q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max });
    });

    console.log(visMap);
    g.selectAll("vertLines")
            .data(visMap)
            .enter()
            .append("line")
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
            .attr("x", (d) => xScale(d[0])-boxWidth/2 +13 )
            .attr("y", (d) => yScale(d[1].q3) )
            .attr("height", (d) => yScale(d[1].q1)-yScale(d[1].q3))
            .attr("width", boxWidth + 20 )
            .attr("stroke", "black")
            .style("fill", "rgb(98 252 255)");
    let width = 9;
    g.selectAll("medianLines")
            .data(visMap)
            .enter()
            .append("line")
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
            .attr("x1", (d) => xScale(d[0])-boxWidth/2 + offset - width)
            .attr("x2", (d) => xScale(d[0])+boxWidth/2 + offset + width)
            .attr("y1", (d) => yScale(d[1].min) )
            .attr("y2", (d) => yScale(d[1].min) )
            .attr("stroke", "black")
            .style("width", 80);
}

const drawBoxPlot2 = (data) => {
    xScale.domain(data.map(d => d.Id));
    
    const classroomsGroup = d3.group(data, d => d.Id);
    const visMap = new Map();
    let domainMax = 0;
    console.log(classroomsGroup);
    classroomsGroup.forEach(element => {
            const key = element[0].Id;
            let pm25List = [];
            let min = 999999;
            let max = 0;

            element.forEach(obj => {
                    pm25List.push(obj.PM25);
            });

            let q1 = d3.quantile(pm25List.sort(d3.ascending),.25);
            let median = d3.quantile(pm25List.sort(d3.ascending),.5);
            let q3 = d3.quantile(pm25List.sort(d3.ascending),.75);
            let interQuantileRange = q3 - q1;
            let quantileMin = q1 - interQuantileRange*1.5;
            let quantileMax = q3 + interQuantileRange*1.5;
            
            
            pm25List.forEach(pm25 => {
                    if(max < pm25 && pm25 <quantileMax){
                            max = pm25;
                    }
                    if(min > pm25 && pm25 >quantileMin){
                            min = pm25;
                    }
            });
            
            if(domainMax < max){
                    domainMax = max;
            }
            console.log(domainMax);
            visMap.set(key,{q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max });
    });
    
    xAxis.call(d3.axisBottom(xScale)).style('font', axisFont)
    .call(g => g.selectAll(".domain, .tick line")
            .remove());

    g
    .append("line")
            .attr("x1", 10)
            .attr("x2", 1000)
            .attr("y1", -34)
            .attr("y2", -34)
            .attr("stroke", "black")
            .style("width", 40);
        

    g
    .append("rect")
            .attr('class','paddingRect')
            .attr("x", -5 )
            .attr("y", -50 )
            .attr("height", 650)
            .attr("width", 23)
            .attr("stroke", "black")
            .style("fill", "white");
    
    g
    .append("rect")
            .attr('class','paddingRect')
            .attr("x", 985 )
            .attr("y", -50 )
            .attr("height", 650)
            .attr("width", 20)
            .attr("stroke", "black")
            .style("fill", "white");
    
    yAxis = g.append('g')
            .attr('class', 'yAxis');
    yAxis.call(d3.axisRight(yScale)
            .tickSize(width-15)
            ).style('font', axisFont)
    .call(g => g.select(".domain")
            .remove())
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "2,2")
            .attr('x1','20'))
    .call(g => g.selectAll(".tick text")
            .attr("x", 1)
            .attr("dy", -2));

    console.log(visMap);

    g
    .selectAll("vertLines")
    .data(visMap)
    .enter()
    .append("line")
        .attr("x1", d => xScale(d[0]))
        .attr("x2", d => xScale(d[0]))
        .attr("y1", d => yScale(d[1].min))
        .attr("y2", d => yScale(d[1].max))
        .attr("stroke", "black")
        .style("width", 40);
        
    
    g
    .selectAll("boxes")
    .data(visMap)
    .enter()
    .append("rect")
        .attr("x", (d) => xScale(d[0])-boxWidth/2 )
        .attr("y", (d) => yScale(d[1].q3) )
        .attr("height", (d) => yScale(d[1].q1)-yScale(d[1].q3))
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "rgb(98 252 255)");


    g
    .selectAll("medianLines")
    .data(visMap)
    .enter()
    .append("line")
        .attr("x1", (d) => xScale(d[0])-boxWidth/2 )
        .attr("x2", (d) => xScale(d[0])+boxWidth/2 )
        .attr("y1", (d) => yScale(d[1].median) )
        .attr("y2", (d) => yScale(d[1].median) )
        .attr("stroke", "black")
        .style("width", 80);

    
    g
    .selectAll("uperHorizonatlLine")
    .data(visMap)
    .enter()
    .append("line")
            .attr("x1", (d) => xScale(d[0])-boxWidth/2 )
            .attr("x2", (d) => xScale(d[0])+boxWidth/2 )
            .attr("y1", (d) => yScale(d[1].max) )
            .attr("y2", (d) => yScale(d[1].max) )
            .attr("stroke", "black")
            .style("width", 80);


    g
    .selectAll("lowerHorizonatlLine")
    .data(visMap)
    .enter()
    .append("line")
            .attr("x1", (d) => xScale(d[0])-boxWidth/2 )
            .attr("x2", (d) => xScale(d[0])+boxWidth/2 )
            .attr("y1", (d) => yScale(d[1].min) )
            .attr("y2", (d) => yScale(d[1].min) )
            .attr("stroke", "black")
            .style("width", 80);
}