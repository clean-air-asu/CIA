var svg;
var g;
var xAxis;
var yAxis;
var data;

// Constant
const margin = {top: 30, right: 30, bottom: 50, left: 70};
const width = 1550;
const height = 600;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleBand()
                .range([0, innerWidth])
                .padding(0.6);
const yScale = d3.scaleLinear()
                .range([innerHeight, 0])
                .domain([0,7]);  

const fontSize = `20px times`;
const fontFamily = `Arial`;
const fontColor = `black`;
const squareDimension = 20;
const axisFont = `15px times`;
const strokeWidth = '5px';

const CR = ['ACH2CR','ACH4CR','ACH6CR','ACH8CR','ACH10CR','ACH12CR','ACH14CR','ACH16CR','ACH18CR', 'ACH20CR', 'ACH21CR','ACH22CR'];

const colorMap = {
    "ACH2CR" : `#FF472A`,

    "ACH4CR" : `#CCCDC2`,
    
    "ACH6CR" : `#FF982A`,
    
    "ACH8CR" : `#FFF82A`,

    "ACH10CR" : `#426A80`,

    "ACH12CR" : `#2AFF4E`,

    "ACH14CR" : `#163C3B`,

    "ACH16CR" : `#2ABFFF`,

    'ACH18CR' : '#2A43FF',

    'ACH20CR' : '#982AFF',

    'ACH21CR' : '#F42AFF',

    'ACH22CR' : '#6D2409'
}



const labelMap = {
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

    "ACH22CR" : `Week 22`
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
        .attr('x', -innerHeight/2 + 165)
        .attr('y', -10)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('Air Exchange Rate Per Hour (ACH)'); 
   
    // d3.csv(`data/ach-difference-school-2.csv`)
    d3.csv(`data/ach-difference.csv`)
    .then(d => {
        data = d; 
        data.forEach(element => {
            CR.forEach( e => {
                element[e] =( +element[e] > 0 ) ? +element[e] : 0 ;
            });
        });
        console.log(data)
        drawBarGraph();
    });

});


const drawBarGraph = () => {
    
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

    
    bars(CR);
}


const bars = (array) =>{

    d3.selectAll('.ach, .lebal').remove();

    let offset = -15;
    let y = -5;
    
    let x = -300
    array.forEach(e => {
        console.log(e);
        const em = g.selectAll('ach')
            .data(data)

            em
            .join(`line`)
            .attr(`class`, 'ach')
            .attr(`x1`, d => xScale(d.ID)+offset)
            .attr(`x2`, d => xScale(d.ID)+offset)
            .attr(`y1`, d => yScale(d[e]))
            .attr(`y2`, yScale(0))
            .attr(`stroke`, `${colorMap[e]}`)
            .attr(`stroke-width`,strokeWidth)

            g.append('line')
                .attr('x1',1100 + x)
                .attr('x2',1200 + x)
                .attr('y1',y+7)
                .attr('y2',y+7)
                .attr(`stroke`, `${colorMap[e]}`)
                .attr(`stroke-width`,2)
                
        g.append(`text`)
        .attr(`x`, 1230 + x)
        .attr(`y`, y+13)
        .style(`font`, fontSize)
        .attr('class','lebal')
        .style(`font-family`, fontFamily)
        .text(`${labelMap[e]}`);

        y += 30;  
        if (y > 170){
            x = 0;
            y = -5;
        }
          
        offset +=8;
    });
}

