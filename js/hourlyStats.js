let svg = d3.select("#line");
let width = 350,
    height = 250;
let xScale = d3.scaleLinear().range([0, width]),
    yScale1 = d3.scaleLinear().range([height, 0]),
    yScale2 = d3.scaleLinear().range([height, 0]);

let g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

let data1;
let data2;
let data3;
let data4;
let currentData = data1;
let index = 1;
document.addEventListener("DOMContentLoaded", function () {
    var dataSetElement = document.getElementById("dataSetName");
    dataSetElement.innerHTML = getCurrentData();
});

function loadData() {
    d3.csv("data/hourly_stats_non_vactions.csv").then(function (data) {
        data1 = data;
        currentData = data1;
        updateChart(data1);
    });
    d3.csv("data/hourly_stats_51.csv").then(function (data) {
        data2 = data;
    });
    d3.csv("data/hourly_stats_duanwu.csv").then(function (data) {
        data3 = data;
    });
    d3.csv("data/hourly_stats_101.csv").then(function (data) {
        data4 = data;
    });
}

function toggleData() {
    switch (index) {
        case 1:
            currentData = data2;
            index = index + 1;
            updateChart(data2);
            break;
        case 2:
            currentData = data3;
            index = index + 1;
            updateChart(data3);
            break;
        case 3:
            currentData = data4;
            index = index + 1;
            updateChart(data4);
            break;
        case 4:
            currentData = data1;
            index = 1;
            updateChart(data1);
            break;
    }
    var dataSetElement = document.getElementById("dataSetName");
    dataSetElement.innerHTML = getCurrentData();
}

function getCurrentData() {
    switch (currentData) {
        case data1:
            return "非节假日";
        case data2:
            return "五一节假日";
        case data3:
            return "端午节假日";
        case data4:
            return "国庆中秋节假日";
    }
}

function updateChart(data) {
    // Clear existing elements
    g.selectAll("*").remove();

    xScale.domain([0, d3.max(data, (d) => parseInt(d.hour))]);
    yScale1.domain([0, d3.max(data, (d) => parseInt(d.average_order_count))]);
    yScale2.domain([
        0,
        d3.max(data, (d) => parseInt(d.average_distance) / 1000),
    ]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("fill", "white");

    g.append("g")
        .call(d3.axisLeft(yScale1))
        .selectAll("text")
        .attr("fill", "white");

    g.append("g")
        .call(d3.axisRight(yScale2))
        .attr("transform", "translate(" + width + " ,0)")
        .selectAll("text")
        .attr("fill", "white");
    g.selectAll(".domain").attr("stroke", "white");
    g.selectAll(".tick line").attr("stroke", "white");

    g.append("text")
        .attr("y", height + 40)
        .attr("x", width - 50)
        .attr("fill", "white")
        .text("时刻");

    g.append("text")
        .attr("y", 6)
        .attr("dy", "-2em")
        .attr("fill", "white")
        .text("平均订单量");

    g.append("text")
        .attr("y", 6)
        .attr("dy", "-2em")
        .attr("fill", "white")
        .attr("x", height)
        .text("平均里程数");

    g.selectAll(".firstCircle")
        .data(data)
        // .join("circle")
        .enter()
        .append("circle")
        .attr("class", "firstCircle")
        .attr("r", 4)
        .attr("cx", (d) => xScale(d["hour"]))
        .attr("cy", (d) => yScale1(d["average_order_count"]))
        .attr("fill", "rgb(255, 190, 68)")
        .on("mouseover", function (event, d) {
            // 在鼠标悬停时显示信息
            d3.select(this).attr("r", 8).attr("fill", "steelblue");

            // 添加信息提示框
            g.append("text")
                .attr("class", "tooltip")
                .attr("x", xScale(d["hour"]) + 10)
                .attr("y", yScale1(d["average_order_count"]) - 10)
                .text(
                    "Hour: " +
                        d["hour"] +
                        ", Order Count: " +
                        d["average_order_count"]
                )
                .attr("font-size", "12px")
                .style("opacity", 0)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("fill", "white");
        })
        .on("mouseout", function () {
            // 鼠标移出时移除信息提示框
            d3.select(this).attr("r", 4).attr("fill", "rgb(255, 190, 68)");

            g.selectAll(".tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0)
                .remove();
        });

    g.selectAll(".secondCircle")
        .data(data)
        // .join("circle")
        .enter()
        .append("circle")
        .attr("class", "secondCircle")
        .attr("r", 4)
        .attr("cx", (d) => xScale(d["hour"]))
        .attr("cy", (d) => yScale2(d["average_distance"] / 1000))
        .attr("fill", "rgb(255, 255, 104)")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 8).attr("fill", "steelblue");

            g.append("text")
                .attr("class", "tooltip")
                .attr("x", xScale(d["hour"]) + 10)
                .attr("y", yScale2(d["average_distance"] / 1000) - 10)
                .text(
                    "Hour: " +
                        d["hour"] +
                        ", Distance: " +
                        (d["average_distance"] / 1000).toFixed(2) +
                        " km"
                )
                .attr("font-size", "12px")
                .style("opacity", 0)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("fill", "white");
        })
        .on("mouseout", function () {
            d3.select(this).attr("r", 4).attr("fill", "rgb(255, 255, 104)");

            g.selectAll(".tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0)
                .remove();
        });

    // draw lines
    reveal = (path) =>
        path
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attrTween("stroke-dasharray", function () {
                const length = this.getTotalLength();
                return d3.interpolate(`0,${length}`, `${length},${length}`);
            });
    let lnMkr1 = d3
        .line()
        .curve(d3.curveNatural)
        .x((d) => xScale(d["hour"]))
        .y((d) => yScale1(d["average_order_count"]));

    g.append("path")
        .attr("fill", "none")
        .attr("d", lnMkr1(data))
        .attr("stroke", "rgb(255, 190, 68)")
        .call(reveal)
        .node();

    let lnMkr2 = d3
        .line()
        .curve(d3.curveNatural)
        .x((d) => xScale(d["hour"]))
        .y((d) => yScale2(d["average_distance"] / 1000));

    g.append("path")
        .attr("fill", "none")
        .attr("d", lnMkr2(data))
        .attr("stroke", "rgb(255, 255, 104)")
        .call(reveal)
        .node();
}

loadData();
