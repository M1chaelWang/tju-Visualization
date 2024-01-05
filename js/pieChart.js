const initialData = [
    { name: "秀英区", value: 0.1198 },
    { name: "龙华区", value: 0.4087 },
    { name: "琼山区", value: 0.1809 },
    { name: "美兰区", value: 0.2905 },
];

let pie = d3
    .pie()
    .value((d) => d.value)
    .padAngle(0.025)(initialData);
let arcMkr = d3.arc().innerRadius(45).outerRadius(140).cornerRadius(10);

let scC = d3.scaleOrdinal(d3.schemePastel2).domain(pie.map((d) => d.index));

let pieGraph = d3
    .select("#pie")
    .append("g")
    .attr("transform", "translate(200, 140)");
const formatAsPercentage = (value) => {
    return (value * 1).toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

pieGraph
    .selectAll("path")
    .data(pie)
    .enter()
    .append("path")
    .attr("d", arcMkr)
    .attr("fill", (d) => scC(d.index))
    .attr("stroke", "grey");

pieGraph
    .selectAll("text")
    .data(pie)
    .enter()
    .append("text")
    .text((d) => d.data.name + formatAsPercentage(d.data.value))
    .attr("x", (d) => arcMkr.innerRadius(50).centroid(d)[0])
    .attr("y", (d) => arcMkr.innerRadius(50).centroid(d)[1])
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
    .attr("text-anchor", "middle");

document.addEventListener("updatePieChart", function (event) {
    const data = event.detail;

    // 将四个部分的占比作为数组传入
    const pieData = [
        { name: "秀英区", value: data.County1 },
        { name: "龙华区", value: data.County2 },
        { name: "琼山区", value: data.County3 },
        { name: "美兰区", value: data.County4 },
    ];

    d3.select("#pie").selectAll("*").remove();

    let pie = d3
        .pie()
        .value((d) => d.value)
        .padAngle(0.025)(pieData);
    let arcMkr = d3.arc().innerRadius(45).outerRadius(140).cornerRadius(10);

    let scC = d3.scaleOrdinal(d3.schemePastel2).domain(pie.map((d) => d.index));

    let pieGraph = d3
        .select("#pie")
        .append("g")
        .attr("transform", "translate(200, 140)");

    pieGraph
        .selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .attr("d", arcMkr)
        .attr("fill", (d) => scC(d.index))
        .attr("stroke", "grey");

    pieGraph
        .selectAll("text")
        .data(pie)
        .enter()
        .append("text")
        .text((d) => d.data.name + formatAsPercentage(d.data.value))
        .attr("x", (d) => arcMkr.innerRadius(50).centroid(d)[0])
        .attr("y", (d) => arcMkr.innerRadius(50).centroid(d)[1])
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("text-anchor", "middle");
});

document.addEventListener("resetPieChart", function () {
    // 将四个部分的占比作为数组传入
    const pieData = [
        { name: "秀英区", value: 0.1198 },
        { name: "龙华区", value: 0.4087 },
        { name: "琼山区", value: 0.1809 },
        { name: "美兰区", value: 0.2905 },
    ];

    d3.select("#pie").selectAll("*").remove();

    let pie = d3
        .pie()
        .value((d) => d.value)
        .padAngle(0.025)(pieData);
    let arcMkr = d3.arc().innerRadius(45).outerRadius(140).cornerRadius(10);

    let scC = d3.scaleOrdinal(d3.schemePastel2).domain(pie.map((d) => d.index));

    let pieGraph = d3
        .select("#pie")
        .append("g")
        .attr("transform", "translate(200, 140)");

    pieGraph
        .selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .attr("d", arcMkr)
        .attr("fill", (d) => scC(d.index))
        .attr("stroke", "grey");

    pieGraph
        .selectAll("text")
        .data(pie)
        .enter()
        .append("text")
        .text((d) => d.data.name + formatAsPercentage(d.data.value))
        .attr("x", (d) => arcMkr.innerRadius(50).centroid(d)[0])
        .attr("y", (d) => arcMkr.innerRadius(50).centroid(d)[1])
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("text-anchor", "middle");
});
