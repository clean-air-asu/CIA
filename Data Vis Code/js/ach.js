var svg;
var g;
var xAxis;
var yAxis;
var data;

// Constant
const margin = {top: 30, right: 10, bottom: 50, left: 90};
const width = 1550;
const height = 600;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleBand()
                .range([0, innerWidth])
                .padding(.6);
const yScale = d3.scaleLinear()
                .range([innerHeight, 0])
                .domain([0,10]);  

const fontSize = `20px times`;
const fontFamily = `Arial`;
const fontColor = `black`;
const squareDimension = 20;
const axisFont = `15px times`;
const strokeWidth = '15px';
const horizontalLineOffset = 7.5;
const achCrColor = '#00A3E0';
const achColor = '#FF7F32'; 

document.addEventListener(`DOMContentLoaded`, function () {
    svg = d3.select(`#my_dataviz`)
            .append(`svg`)
                .attr(`width`, width)
                .attr(`height`, height);
                  
    g = svg.append(`g`)
                .attr(`transform`, `translate(${margin.left},${margin.top})`);
    
    xAxis = g.append(`g`)
                .attr(`transform`, `translate(0, ${innerHeight})`);

    xAxis.append(`text`)
            .attr(`x`, innerWidth/2-10)
            .attr(`y`, 45)
            .attr(`class`,`xLabel`)
            .style(`font`, fontSize)
            .style(`font-family`, fontFamily)
            .attr(`fill`, fontColor)
            .text(`Weeks`);

    yAxis = g.append(`g`)
                .attr(`class`, `yAxis`);
         
    yAxis.append('text')
        .attr('x', -innerHeight/2 + 175)
        .attr('y', -20)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('Air Exchange Rate Per Hour (ACH)'); 
   
    d3.csv(`data/ACH.csv`)
    .then(d => {
        data = d;
        data.forEach(element => {
            element['Week'] = element['Week2'];
        })
        drawBarGraph(data, document.getElementById('Change-Classroom').value);
    });

});


const drawBarGraph = (data,option) => {
    
    xScale.domain(data.map(d => d.Week));
    
    xAxis.call(d3.axisBottom(xScale)).style(`font`, axisFont)
        .call(g => g.selectAll(`.tick line`).remove());
    
    yAxis.call(d3.axisRight(yScale)
    .tickSize(width - margin.left - margin.right)
    ).style(`font`, axisFont)
    .call(g => g.select(`.domain`)
        .remove())
    .call(g => g.selectAll(`.tick:not(:first-of-type) line`)
        .attr(`stroke-opacity`, 0.1)
        .attr(`stroke-dasharray`, `2,2`)
        .attr('x1','20'))
    .call(g => g.selectAll(`.tick text`)
        .attr(`x`, 4)
        .attr(`dy`, -4));
        
    bars(data,option);
}

const changeClassroom = () => {
    drawBarGraph(data, document.getElementById('Change-Classroom').value);
}

const bars = (data,option) =>{

    d3.selectAll('.errorBars,.label,.ach').remove();
    // console.log(data)
    let offset = 5;
    let y = 10;
    
    arr = ['ach','achcr'];
    arr.forEach(element => {
        const em = g.selectAll(element)
        .data(data);
        if (element == 'ach'){
            em.join(`line`)
            .attr(`class`, 'ach')
            .attr(`x1`, d => xScale(d.Week)+offset)
            .attr(`x2`, d => xScale(d.Week)+offset)
            .attr(`y1`, d => yScale(+d[option+'-ach']))
            .attr(`y2`, yScale(0))
            .attr(`stroke`, achColor)
            .attr(`stroke-width`,strokeWidth)

        
            g
            .selectAll("uperHorizonatlLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset+horizontalLineOffset )
                .attr("x2", (d) => xScale(d.Week)+offset-horizontalLineOffset )
                .attr("y1", (d) => yScale(+d[option+'-ach'] + +d[option+'-error']) )
                .attr("y2", (d) => yScale(+d[option+'-ach'] + +d[option+'-error']) )
                .attr("stroke", (d) => {
                    if (d[option+'-error'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-error'] >= 0.90 && d[option+'-error'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-error'] >= 0.80 && d[option+'-error'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');
    
            g
            .selectAll("lowerHorizonatlLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset+horizontalLineOffset )
                .attr("x2", (d) => xScale(d.Week)+offset-horizontalLineOffset )
                .attr("y1", (d) => {
                    let yScaleInput = 0
                    if(+d[option+'-ach'] - +d[option+'-error'] > 0){
                        yScaleInput = +d[option+'-ach'] - d[option+'-error'];
                    }
                    return yScale(yScaleInput)
                })
                .attr("y2", (d) => {
                    let yScaleInput = 0
                    if(+d[option+'-ach'] - +d[option+'-error'] > 0){
                        yScaleInput = +d[option+'-ach'] - d[option+'-error'];
                    }
                    return yScale(yScaleInput)
                })
                .attr("stroke", (d) => {
                    if (d[option+'-error'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-error'] >= 0.90 && d[option+'-error'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-error'] >= 0.80 && d[option+'-error'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');

            g
            .selectAll("middleHorizonatlLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset+horizontalLineOffset )
                .attr("x2", (d) => xScale(d.Week)+offset-horizontalLineOffset )
                .attr("y1", (d) => yScale(+d[option+'-ach']) )
                .attr("y2", (d) => yScale(+d[option+'-ach']) )
                .attr("stroke", (d) => {
                    if (d[option+'-error'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-error'] >= 0.90 && d[option+'-error'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-error'] >= 0.80 && d[option+'-error'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');
            
            g
            .selectAll("virticalLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset )
                .attr("x2", (d) => xScale(d.Week)+offset )
                .attr("y1", (d) => yScale(+d[option+'-ach'] + +d[option+'-error']) )
                .attr("y2", (d) => {
                    let yScaleInput = 0
                    if(+d[option+'-ach'] - +d[option+'-error'] > 0){
                        yScaleInput = +d[option+'-ach'] - +d[option+'-error'];
                    }
                    return yScale(yScaleInput);
                })
                .attr("stroke", (d) => {
                    console.log(d[option+'-error']);
                    if (d[option+'-error'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-error'] >= 0.90 && d[option+'-error'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-error'] >= 0.80 && d[option+'-error'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');
        
                g.append(`text`)
                .attr(`x`, 1230)
                .attr(`y`, y+13)
                .style(`font`, fontSize)
                .attr('class','lebal')
                .style(`font-family`, fontFamily)
                .text(`Without C-R Box`);

                g.append('line')
                .attr('x1',1000)
                .attr('x2',1200)
                .attr('y1',y+7)
                .attr('y2',y+7)
                .attr(`stroke`, achColor)
                .attr(`stroke-width`,2)  
        } else{
            em.join(`line`)
            .attr(`class`, 'ach')
            .attr(`x1`, d => xScale(d.Week)+offset)
            .attr(`x2`, d => xScale(d.Week)+offset)
            .attr(`y1`, d => yScale(+d[option+'-achcr']))
            .attr(`y2`, yScale(0))
            .attr(`stroke`, achCrColor)
            .attr(`stroke-width`,strokeWidth)
            .style("stroke-dasharray", (`20,5`)); 
                    
            g
            .selectAll("uperHorizonatlLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset+horizontalLineOffset )
                .attr("x2", (d) => xScale(d.Week)+offset-horizontalLineOffset )
                .attr("y1", (d) => yScale(+d[option+'-achcr'] + +d[option+'-errorcr']) )
                .attr("y2", (d) => yScale(+d[option+'-achcr'] + +d[option+'-errorcr']) )
                .attr("stroke", (d) => {
                    if (d[option+'-errorcr'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-errorcr'] >= 0.90 && d[option+'-errorcr'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-errorcr'] >= 0.80 && d[option+'-errorcr'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');
    
            g
            .selectAll("lowerHorizonatlLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset+horizontalLineOffset )
                .attr("x2", (d) => xScale(d.Week)+offset-horizontalLineOffset )
                .attr("y1", (d) => {
                    let yScaleInput = 0
                    if(+d[option+'-achcr'] - +d[option+'-errorcr'] > 0){
                        yScaleInput = +d[option+'-achcr'] - d[option+'-errorcr'];
                    }
                    return yScale(yScaleInput)
                })
                .attr("y2", (d) => {
                    let yScaleInput = 0
                    if(+d[option+'-achcr'] - +d[option+'-errorcr'] > 0){
                        yScaleInput = +d[option+'-achcr'] - d[option+'-errorcr'];
                    }
                    return yScale(yScaleInput)
                })
                .attr("stroke", (d) => {
                    if (d[option+'-errorcr'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-errorcr'] >= 0.90 && d[option+'-errorcr'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-errorcr'] >= 0.80 && d[option+'-errorcr'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');

            g
            .selectAll("middleHorizonatlLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset+horizontalLineOffset )
                .attr("x2", (d) => xScale(d.Week)+offset-horizontalLineOffset )
                .attr("y1", (d) => yScale(+d[option+'-achcr']) )
                .attr("y2", (d) => yScale(+d[option+'-achcr']) )
                .attr("stroke", (d) => {
                    if (d[option+'-errorcr'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-errorcr'] >= 0.90 && d[option+'-errorcr'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-errorcr'] >= 0.80 && d[option+'-errorcr'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');
            
            g
            .selectAll("virticalLine")
            .data(data)
            .enter()
            .append("line")
                .attr('class','errorBars')
                .attr("x1", (d) => xScale(d.Week)+offset )
                .attr("x2", (d) => xScale(d.Week)+offset )
                .attr("y1", (d) => yScale(+d[option+'-achcr'] + +d[option+'-errorcr']) )
                .attr("y2", (d) => {
                    let yScaleInput = 0
                    if(+d[option+'-achcr'] - +d[option+'-errorcr'] > 0){
                        yScaleInput = +d[option+'-achcr'] - +d[option+'-errorcr'];
                    }
                    return yScale(yScaleInput);
                })
                .attr("stroke", (d) => {
                    console.log(d[option+'-errorcr']);
                    if (d[option+'-errorcr'] >= 0.95){
                        return 'green';
                    } else if (d[option+'-errorcr'] >= 0.90 && d[option+'-errorcr'] < 0.95 ){
                        return 'yellow';
                    } else if (d[option+'-errorcr'] >= 0.80 && d[option+'-errorcr'] < 0.90){
                        return 'orange';
                    }else {
                        return 'red';
                    } })
                .attr('opacity','1');

                g.append(`text`)
                .attr(`x`, 1230)
                .attr(`y`, y+13)
                .style(`font`, fontSize)
                .attr('class','lebal')
                .style(`font-family`, fontFamily)
                .text(`With C-R Box`);

                g.append('line')
                .attr('x1',1000)
                .attr('x2',1200)
                .attr('y1',y+7)
                .attr('y2',y+7)
                .attr(`stroke`, achCrColor)
                .attr(`stroke-width`,2)
                .style("stroke-dasharray", (`${8},${2}`));  
        }
        offset += 35;
        y += 30
        console.log('Change')
    });
      
   g.append(`text`)
    .attr(`x`, 600)
    .attr(`y`, 30)
    .attr(`class`,`label`)
    .style(`font`, fontSize)
    .style(`font-family`, fontFamily)
    .attr(`fill`, fontColor)
    .text(`Classroom ID:-` + option);
    
}

