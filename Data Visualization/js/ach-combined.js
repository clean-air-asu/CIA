var svg;
var g;
var xAxis;
var yAxis;
var data;

// Constant
const margin = {top: 30, right: 30, bottom: 50, left: 70};
const width = 2500;
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
const strokeWidth = '5px';

const CR = ['Baseline','ACH2CR','ACH4CR','ACH6CR','ACH8CR','ACH10CR','ACH12CR','ACH14CR','ACH16CR','ACH18CR', 'ACH20CR', 'ACH21CR'];
const NoCR = ['Baseline','ACH2','ACH4','ACH6','ACH8','ACH10','ACH12','ACH14','ACH16','ACH18', 'ACH20', 'ACH21'];

const colorMap = {
    "Baseline" : `black`,

    "ACH2CR" : `#6a00fc`,
    
    "ACH4CR" : `#0088ff`,
    
    "ACH6CR" : `#94fff0`,

    "ACH8CR" : `#d8da3c`,

    "ACH10CR" : `#fa81ad`,

    "ACH12CR" : `#be00ff`,

    "ACH14CR" : `#00ff08`,

    'ACH16CR' : '#FF7F32',

    'ACH18CR' : 'red',

    'ACH20CR' : 'red',

    'ACH21CR' : 'red',

    "ACH2" : `#6a00fc`,
    
    "ACH4" : `#0088ff`,
    
    "ACH6" : `#94fff0`,

    "ACH8" : `#d8da3c`,

    "ACH10" : `#fa81ad`,

    "ACH12" : `#be00ff`,

    "ACH14" : `#00ff08`,
    
    'ACH16' : 'black',

    'ACH18' : 'red',

    'ACH20' : 'red',

    'ACH21' : 'red',
}

const errorMap = {
    "Baseline" : `Error`,

    "ACH2CR" : `Error2CR`,
    
    "ACH4CR" : `Error4CR`,
    
    "ACH6CR" : `Error6CR`,
    
    "ACH8CR" : `Error8CR`,

    "ACH10CR" : `Error10CR`,

    "ACH12CR" : `Error12CR`,

    "ACH14CR" : `Error14CR`,

    "ACH16CR" : `Error16CR`,

    "ACH18CR" : `Error18CR`,

    "ACH20CR" : `Error20CR`,

    "ACH21CR" : `Error21CR`,

    "ACH2" : `Error2`,
    
    "ACH4" : `Error4`,
    
    "ACH6" : `Error6`,
    
    "ACH8" : `Error8`,

    "ACH10" : `Error10`,

    "ACH12" : `Error12`,

    "ACH14" : `Error14`,

    "ACH16" : `Error16`,

    "ACH18" : `Error18`,

    "ACH20" : `Error20`,

    "ACH21" : `Error21`,
}

const labelMap = {
    "Baseline" : `C-R Box off`,

    "ACH2CR" : `Week 2`,

    "ACH4CR" : `Week 4`,

    "ACH6CR" : `Week 6`,

    "ACH8CR" : `Week 8`,

    "ACH10CR" : `Week 10`,

    "ACH12CR" : `Week 12`,

    "ACH14CR" : `Week 14`,

    "ACH16CR" : `Week 16`,

    "ACH18CR" : `Week 18`,

    "ACH20CR" : `Week 20`,

    "ACH21CR" : `Week 21`,

    "ACH2" : `Week 2`,

    "ACH4" : `Week 4`,

    "ACH6" : `Week 6`,

    "ACH8" : `Week 8`,

    "ACH10" : `Week 10`,

    "ACH12" : `Week 12`,

    "ACH14" : `Week 14`,

    "ACH16" : `Week 16`,

    "ACH18" : `Week 18`,

    "ACH20" : `Week 20`,

    "ACH21" : `Week 21`,
}

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
            .text(`Classroom ID`);

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
   
    d3.csv(`data/ach-combined.csv`)
    .then(d => {
        data = d; 
        data.forEach(element => {
            CR.forEach( e => {
                element[e] = +element[e];
                element[errorMap[e]] = +element[errorMap[e]];
            });

            NoCR.forEach( e => {
                element[e] = +element[e];
                element[errorMap[e]] = +element[errorMap[e]];
            });
        });
        console.log(data)
        drawBarGraph(document.getElementById('CR-Box').value);
    });

});


const drawBarGraph = (option) => {
    console.log(option);

    xScale.domain(data.map(d => d.ID));

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

    if(option == 'CR'){
        // document.getElementById('header').innerText = 'CR-Box On';
        bars(CR,20,2,'CR');
    }else{
        // document.getElementById('header').innerText = 'CR-Box Off';
        bars(NoCR,0,0,'NO');
    }
}


const bars = (array,dash1,dash2,option) =>{

    d3.selectAll('.errorBars, .ach, .lebal').remove();

    let offset = -15;
    let y = -5;
    let horizontalLineOffset = 2.5;
    
    array.forEach(e => {
        const em = g.selectAll(e)
        .data(data);
        
        if(e != 'Baseline'){
            em.join(`line`)
            .attr(`class`, 'ach')
            .attr(`x1`, d => xScale(d.ID)+offset)
            .attr(`x2`, d => xScale(d.ID)+offset)
            .attr(`y1`, d => yScale(d[e]))
            .attr(`y2`, yScale(0))
            .attr(`stroke`, `${colorMap[e]}`)
            .attr(`stroke-width`,strokeWidth)
            .style("stroke-dasharray", (`${dash1},${dash2}`));

            g.append('line')
                .attr('x1',2000)
                .attr('x2',2200)
                .attr('y1',y+7)
                .attr('y2',y+7)
                .attr(`stroke`, `${colorMap[e]}`)
                .attr(`stroke-width`,2)
                .style("stroke-dasharray", (`${dash1},${dash2}`));  
            
        }else{
            em.join(`line`)
            .attr(`class`, 'ach')
            .attr(`x1`, d => xScale(d.ID)+offset)
            .attr(`x2`, d => xScale(d.ID)+offset)
            .attr(`y1`, d => yScale(d[e]))
            .attr(`y2`, yScale(0))
            .attr(`stroke`, `${colorMap[e]}`)
            .attr(`stroke-width`,strokeWidth);

            g.append('line')
            .attr('x1',2000)
            .attr('x2',2200)
            .attr('y1',y+7)
            .attr('y2',y+7)
            .attr(`stroke`, `${colorMap[e]}`)
            .attr(`stroke-width`,2)
            // .style("stroke-dasharray", (`${dash1},${dash2}`));  
        }
        
        g.append(`text`)
        .attr(`x`, 2230)
        .attr(`y`, y+13)
        .style(`font`, fontSize)
        .attr('class','lebal')
        .style(`font-family`, fontFamily)
        .text(`${labelMap[e]}`);

        y += 30;

        
        g
        .selectAll("uperHorizonatlLine")
        .data(data)
        .enter()
        .append("line")
            .attr('class','errorBars')
            .attr("x1", (d) => xScale(d.ID)+offset+horizontalLineOffset )
            .attr("x2", (d) => xScale(d.ID)+offset-horizontalLineOffset )
            .attr("y1", (d) => yScale(d[e] + d[errorMap[e]]) )
            .attr("y2", (d) => yScale(d[e] + d[errorMap[e]]) )
            .attr("stroke", "Black")
            .attr('opacity','1');
    
        g
        .selectAll("lowerHorizonatlLine")
        .data(data)
        .enter()
        .append("line")
            .attr('class','errorBars')
            .attr("x1", (d) => xScale(d.ID)+offset+horizontalLineOffset )
            .attr("x2", (d) => xScale(d.ID)+offset-horizontalLineOffset )
            .attr("y1", (d) => {
                let yScaleInput = 0
                if(d[e] - d[errorMap[e]] > 0){
                    yScaleInput = d[e] - d[errorMap[e]];
                }
                return yScale(yScaleInput)
            })
            .attr("y2", (d) => {
                let yScaleInput = 0
                if(d[e] - d[errorMap[e]] > 0){
                    yScaleInput = d[e] - d[errorMap[e]];
                }
                return yScale(yScaleInput)
            })
            .attr("stroke", "Black")
            .attr('opacity','1');

        g
        .selectAll("middleHorizonatlLine")
        .data(data)
        .enter()
        .append("line")
            .attr('class','errorBars')
            .attr("x1", (d) => xScale(d.ID)+offset+horizontalLineOffset )
            .attr("x2", (d) => xScale(d.ID)+offset-horizontalLineOffset )
            .attr("y1", (d) => yScale(d[e]) )
            .attr("y2", (d) => yScale(d[e]) )
            .attr("stroke", "black")
            .attr('opacity','1');
        
        g
        .selectAll("virticalLine")
        .data(data)
        .enter()
        .append("line")
            .attr('class','errorBars')
            .attr("x1", (d) => xScale(d.ID)+offset )
            .attr("x2", (d) => xScale(d.ID)+offset )
            .attr("y1", (d) => yScale(d[e] + d[errorMap[e]]) )
            .attr("y2", (d) => {
                let yScaleInput = 0
                if(d[e] - d[errorMap[e]] > 0){
                    yScaleInput = d[e] - d[errorMap[e]];
                }
                return yScale(yScaleInput);
            })
            .attr("stroke", "Black")
            .attr('opacity','1');
            
        offset +=8;
    });
}



var expanded = false;
const showCheckboxes = () => {
    var checkboxes = document.getElementById(`checkboxes`);
    if (!expanded) {
        checkboxes.style.display = `block`;
        expanded = true;
        
    } else {
        checkboxes.style.display = `none`;
        expanded = false;
    }
}