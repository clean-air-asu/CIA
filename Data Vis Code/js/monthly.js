var svg;
var g;
var xAxis;
var yAxis;
var data;


const margin = { top: 50, right: 30, bottom: 70, left: 60 };
const width = 1500;
const height = 600;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleLinear()
    .range([0, innerWidth]);

const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

const fontSize = '17px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const axisFont = '13px times';
const circleRadius = 3;
const colorMap = {
    'Bs': 'black',
    'BS2': '#405b81',
    'Dec': '#9dc209',
    'Jan': '#75ff66',
    'Feb': '#00A3E0',
    'Mar': '#FF7F32',
    'Apr': '#ea60fb',
    'May': 'Red',
    'all': '#0029ff'
}

const textMap = {
    'Bs': 'Baseline',
    'BS2': 'Baseline-2',
    'Dec': 'December',
    'Jan': 'January',
    'Feb': 'Febuary',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'all': 'All Months'
}

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
        .attr('x', innerWidth / 2)
        .attr('y', 30)
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .text('Classroom IDs');

    yAxis = g.append('g')
        .attr('class', 'yAxis');

    yAxis.append('text')
        .attr('x', -innerHeight / 2 + 65)
        .attr('y', -40)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('PM 2.5 (ug/m3)');
  
    Promise.all([d3.csv('data/Monthly-Average-CBHS.csv'), d3.csv('data/Monthly-Average-RDRK.csv')])
        .then((values) => {
            CBHS = values[0];
            RDRK = values[1];

            CBHS.forEach(element => {
                element.ID = +element.ID;
                element['Bs PM-1'] = +element['Bs PM-1'];
                element['Jan PM-1'] = +element['Jan PM-1'];
                element['Dec PM-1'] = +element['Dec PM-1'];
                element['Feb PM-1'] = +element['Feb PM-1'];

                element['Bs PM-25'] = +element['Bs PM-25'];
                element['Jan PM-25'] = +element['Jan PM-25'];
                element['Dec PM-25'] = +element['Dec PM-25'];
                element['Feb PM-25'] = +element['Feb PM-25'];

                element['Bs PM-10'] = +element['Bs PM-10'];
                element['Jan PM-10'] = +element['Jan PM-10'];
                element['Dec PM-10'] = +element['Dec PM-10'];
                element['Feb PM-10'] = +element['Feb PM-10'];

                element['Mar PM-1'] = +element['Mar PM-1'];
                element['Mar PM-25'] = +element['Mar PM-25'];
                element['Mar PM-10'] = +element['Mar PM-10'];

                element['Apr PM-1'] = +element['Apr PM-1'];
                element['Apr PM-25'] = +element['Apr PM-25'];
                element['Apr PM-10'] = +element['Apr PM-10'];

                element['May PM-1'] = +element['May PM-1'];
                element['May PM-25'] = +element['May PM-25'];
                element['May PM-10'] = +element['May PM-10'];

                element['all PM-1'] = +element['all PM-1'];
                element['all PM-25'] = +element['all PM-25'];
                element['all PM-10'] = +element['all PM-10'];
            });

            RDRK.forEach(element => {
                element.ID = +element.ID;
                element['Bs PM-1'] = +element['Bs PM-1'];
                element['Jan PM-1'] = +element['Jan PM-1'];
                element['Dec PM-1'] = +element['Dec PM-1'];
                element['Feb PM-1'] = +element['Feb PM-1'];

                element['Bs PM-25'] = +element['Bs PM-25'];
                element['Jan PM-25'] = +element['Jan PM-25'];
                element['Dec PM-25'] = +element['Dec PM-25'];
                element['Feb PM-25'] = +element['Feb PM-25'];

                element['Bs PM-10'] = +element['Bs PM-10'];
                element['Jan PM-10'] = +element['Jan PM-10'];
                element['Dec PM-10'] = +element['Dec PM-10'];
                element['Feb PM-10'] = +element['Feb PM-10'];

                element['Mar PM-1'] = +element['Mar PM-1'];
                element['Mar PM-25'] = +element['Mar PM-25'];
                element['Mar PM-10'] = +element['Mar PM-10'];

                element['Apr PM-1'] = +element['Apr PM-1'];
                element['Apr PM-25'] = +element['Apr PM-25'];
                element['Apr PM-10'] = +element['Apr PM-10'];

                element['May PM-1'] = +element['May PM-1'];
                element['May PM-25'] = +element['May PM-25'];
                element['May PM-10'] = +element['May PM-10'];

                element['all PM-1'] = +element['all PM-1'];
                element['all PM-25'] = +element['all PM-25'];
                element['all PM-10'] = +element['all PM-10'];

                element['BS2 PM-1'] = +element['BS2 PM-1'];
                element['BS2 PM-25'] = +element['BS2 PM-25'];
                element['BS2 PM-10'] = +element['BS2 PM-10'];
            });

            data = { 'CBHS': CBHS, 'RDRK': RDRK };

            document.getElementById('baseline').checked = true;
            document.getElementById('baseline-2').checked = false;
            document.getElementById('feb').checked = false;
            document.getElementById('jan').checked = false;
            document.getElementById('dec').checked = false;
            document.getElementById('mar').checked = false;
            document.getElementById('apr').checked = false;
            document.getElementById('may').checked = false;
            document.getElementById('all').checked = true;
            console.log(data);
            changeCheckBox();
        });

});

const changePM = (option) => {

    if (option == 'PM1') {
        pm = document.getElementById('yAxis-text');
        pm.textContent = 'PM 1 (ug/m3)'
    } else if (option == 'PM25') {
        pm = document.getElementById('yAxis-text');
        pm.textContent = 'PM 2.5 (ug/m3)'
    } else if (option == 'PM10') {
        pm = document.getElementById('yAxis-text');
        pm.textContent = 'PM 10 (ug/m3)'
    }
    changeCheckBox();
}

const drawLineGraph = (option, months) => {
    pm = document.getElementById('PM-select').value;
    var pm_type;
    if (pm == 'PM1') {

        pm_type = 'PM 1'
    } else if (pm == 'PM25') {

        pm_type = 'PM 2.5'
    } else if (pm == 'PM10') {

        pm_type = 'PM 10'
    }

    document.getElementById('header').innerText = 'Monthly Average ' + document.getElementById('school-select').value + ' ' + pm_type;

    school = data[option];

    max = 0;
    months.forEach(month => {

        school.forEach(e => {
            if (max < e[month]) {
                max = e[month];
            }
            if (max < e[month]) {
                max = e[month];
            }
            if (max < e[month]) {
                max = e[month];
            }
        });
    });

    ticks = 0;
    if (option == 'CBHS') {
        xScale.domain([1, 38]);
        ticks = 38;
    } else {
        xScale.domain([39, 50]);
        ticks = 12;
    }

    xAxis.call(d3.axisBottom(xScale).ticks(ticks).tickSize(-innerHeight)).style(`font`, axisFont)
        .call(g => g.selectAll(`.tick line`)
            .attr(`stroke-opacity`, 0.3)
            .attr(`stroke-dasharray`, `3,3`))
        .call(g => g.selectAll(`.tick text`)
            .attr(`y`, 10)
            .attr(`dy`, 4));

    max = max + 1;
    max = max.toFixed(0);

    yScale.domain([0, max]);

    yAxis.call(d3.axisRight(yScale)
        .tickSize(innerWidth)
    ).style(`font`, axisFont).attr('class', 'yAxisFont')
        .call(g => g.selectAll(`.tick:not(:first-of-type) line`)
            .attr(`stroke-opacity`, 0.3)
            .attr(`stroke-dasharray`, `3,3`)
            .attr('x1', '0'))
        .call(g => g.selectAll(`.tick text`)
            .attr(`x`, -20)
            .attr(`dy`, 4));
    let y = 10;

    for (let i = 0; i < months.length; i++) {

        let key = months[i].split(' ')[0];

        g.append("path")
            .datum(school)
            .attr('class', 'line' + i)
            .attr('id', 'lines')
            .attr("fill", "none")
            .attr("stroke", colorMap[key])
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => xScale(d.ID))
                .y(d => yScale(d[months[i]]))

            )
            .style("stroke-dasharray", ("0, 0"))
            .attr('stroke-opacity', 1);


        const baselineCircle = g.selectAll(months[i])
            .data(school);

        baselineCircle.join('g')
            .attr('class', 'circle' + i)
            .attr('id', 'circles')
            .attr('transform', d => `translate(${xScale(d.ID)}, ${yScale(d[months[i]])})`)
            .call(g => {
                g.each(function (d) {
                    if (d[months[i]] == 0) {
                        d3.select(this).append('path')
                            .attr('d', d3.symbol().type(d3.symbolCross).size(100))
                            .attr('stroke', colorMap[key])
                            .attr('stroke-width', 2)
                            .attr('fill', 'none')
                            .attr('transform', 'rotate(45)');
                    } else {
                        d3.select(this).append('circle')
                            .attr('r', circleRadius)
                            .attr('fill', colorMap[key]);
                    }
                });
            });


        g.append('line')
            .attr('id', 'legend-lines')
            .attr(`x1`, 1150)
            .attr(`x2`, 1300)
            .attr(`y1`, y)
            .attr(`y2`, y)
            .attr(`stroke`, colorMap[key])
            .attr(`stroke-width`, `2px`)
            .style("stroke-dasharray", ("0, 0"));

        g.append('text')
            .attr('id', 'legene-text')
            .attr(`x`, 1310)
            .attr(`y`, y + 5)
            .text(textMap[key]);

        y += 20
    }
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

const changeCheckBox = () => {


    svg.selectAll(`#lines,#circles,#legend-lines,#legene-text`).remove();

    const array = [];
    option = document.getElementById('PM-select').value;

    if (document.getElementById('baseline').checked) {
        if (option == 'PM1') {
            array.push('Bs PM-1');
        } else if (option == 'PM25') {
            array.push('Bs PM-25');
        } else if (option == 'PM10') {
            array.push('Bs PM-10');
        }
    }

    if (document.getElementById('dec').checked) {
        if (option == 'PM1') {
            array.push('Dec PM-1');
        } else if (option == 'PM25') {
            array.push('Dec PM-25');
        } else if (option == 'PM10') {
            array.push('Dec PM-10');
        }
    }
    if (document.getElementById('jan').checked) {
        if (option == 'PM1') {
            array.push('Jan PM-1');
        } else if (option == 'PM25') {
            array.push('Jan PM-25');
        } else if (option == 'PM10') {
            array.push('Jan PM-10');
        }
    }
    if (document.getElementById('feb').checked) {
        if (option == 'PM1') {
            array.push('Feb PM-1');
        } else if (option == 'PM25') {
            array.push('Feb PM-25');
        } else if (option == 'PM10') {
            array.push('Feb PM-10');
        }
    }
    if (document.getElementById('mar').checked) {
        if (option == 'PM1') {
            array.push('Mar PM-1');
        } else if (option == 'PM25') {
            array.push('Mar PM-25');
        } else if (option == 'PM10') {
            array.push('Mar PM-10');
        }
    }

    if (document.getElementById('apr').checked) {
        if (option == 'PM1') {
            array.push('Apr PM-1');
        } else if (option == 'PM25') {
            array.push('Apr PM-25');
        } else if (option == 'PM10') {
            array.push('Apr PM-10');
        }
    }

    if (document.getElementById('may').checked) {
        if (option == 'PM1') {
            array.push('May PM-1');
        } else if (option == 'PM25') {
            array.push('May PM-25');
        } else if (option == 'PM10') {
            array.push('May PM-10');
        }
    }

    if (document.getElementById('all').checked) {
        if (option == 'PM1') {
            array.push('all PM-1');
        } else if (option == 'PM25') {
            array.push('all PM-25');
        } else if (option == 'PM10') {
            array.push('all PM-10');
        }
    }

    if (document.getElementById('baseline-2').checked) {
        if (option == 'PM1') {
            array.push('BS2 PM-1');
        } else if (option == 'PM25') {
            array.push('BS2 PM-25');
        } else if (option == 'PM10') {
            array.push('BS2 PM-10');
        }
    }
    drawLineGraph(document.getElementById('school-select').value, array)
}