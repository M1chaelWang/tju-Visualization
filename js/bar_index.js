// 加载 CSV 数据
d3.json("data/calendarHeatMap.json").then((data) => {
    data.forEach((d) => {
        d.Date = d3.timeParse("%Y-%m-%d")(d[0]); // 日期
        d.Count = +d[1]; // 订单数
        d.Weather = d[2]; // 天气
        d.WeekDay = d[3]; // 星期几
        d.HighTemp = isFinite(d[4]) ? +d[4] : null; // 如果不是有效数字，则设为 null
        d.LowTemp = isFinite(d[5]) ? +d[5] : null;
        d.AvgTemp = isFinite(d[6]) ? +d[6] : null;
        d.Holiday = d[7] ? d[7] : "无"; // 节假日
    });

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // 设置 SVG 画布的尺寸和边距
    const margin = { top: 10, right: 20, bottom: 10, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // 在 SVG 中添加一个 `g` 元素
    const svg = d3
        .select("#bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 设置 x 和 y 轴的比例尺
    const x = d3.scaleBand().range([0, width]).padding(0.1),
        y = d3.scaleLinear().range([height, 0]),
        yTemp = d3.scaleLinear().range([height, 0]);

    // 定义 x 轴和 y 轴
    const xAxis = d3.axisBottom(x).tickFormat(""),
        yAxis = d3.axisLeft(y).ticks(10),
        yAxisRight = d3.axisRight(yTemp);

    // 定义折线生成器
    const lineGenerator = d3
        .line()
        .x((d) => x(d.Date) + x.bandwidth() / 2)
        .y((d) => yTemp(d.Temp));

    // 设置初始数据
    var maxBars = 15;
    var displayData = data.slice(0, maxBars);

    // 设置比例尺的域
    x.domain(displayData.map((d) => d.Date));
    y.domain([0, 100000]);
    yTemp.domain([
        0,
        d3.max(data, (d) => Math.max(d.HighTemp, d.LowTemp, d.AvgTemp)),
    ]);

    function formatTooltipData(d) {
        return `日期: ${d3.timeFormat("%Y-%m-%d")(d.Date)}<br>
        订单数: ${d.Count}<br>
        天气: ${d.Weather}<br>
        ${d.WeekDay}<br>
        最高温度: ${d.HighTemp}°C<br>
        最低温度: ${d.LowTemp}°C<br>
        平均温度: ${d.AvgTemp}°C<br>
        节假日: ${d.Holiday}`;
    }

    svg.selectAll(".bar")
        .data(displayData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.Date))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y(d.Count))
        .attr("height", (d) => height - y(d.Count))
        .on("mouseover", function (event, d) {
            // 显示提示框
            //console.log("Mouseover event triggered", d);
            d3.select("#tooltip")
                .style("display", null)
                .html(formatTooltipData(d))
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 20 + "px");
        })
        .on("mouseout", function () {
            // 隐藏提示框
            d3.select("#tooltip").style("display", "none");
        });

    // 添加 x 轴和 y 轴
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g").call(yAxis);

    // 添加右侧温度轴
    svg.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(yAxisRight);

    svg.selectAll(".domain").attr("stroke", "white");
    svg.selectAll(".tick line").attr("stroke", "white");
    svg.selectAll("text").attr("fill", "white");

    // 绘制三条折线
    ["HighTemp", "LowTemp", "AvgTemp"].forEach((tempType) => {
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr(
                "stroke",
                tempType === "HighTemp"
                    ? "#ff5656"
                    : tempType === "LowTemp"
                    ? "rgb(121, 121, 255)"
                    : "rgb(158, 255, 158)"
            )
            .attr("stroke-width", 1.5)
            .attr("class", tempType)
            .attr(
                "d",
                lineGenerator.y((d) => yTemp(d[tempType]))
            );
    });

    // 创建水平滑块
    var slider = d3
        .sliderBottom()
        .min(d3.min(data, (d) => d.Date))
        .max(d3.max(data, (d) => d.Date))
        .step(1000 * 60 * 60 * 24) // 一天
        .width(500)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .ticks(5)
        .default(d3.min(data, (d) => d.Date))
        .fill("#2196f3")
        .on("onchange", (val) => {
            var startIndex = data.findIndex(
                (d) => d.Date.getTime() === val.getTime()
            );
            var endIndex = Math.min(startIndex + maxBars, data.length); // 确保不会超出数组范围
            updateBars(data.slice(startIndex, endIndex));
        });

    var gSlider = d3
        .select("#slider")
        .append("svg")
        .attr("width", 600)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(30,30)");
    gSlider.call(slider);

    // 创建垂直滑块
    var sliderVertical = d3
        .sliderLeft()
        .min(1)
        .max(60) // 假设最多显示60个条形图
        .step(1)
        .height(200)
        .tickFormat(d3.format("d"))
        .ticks(20)
        .default(maxBars)
        .on("onchange", (val) => {
            maxBars = val;
            updateBars(data.slice(0, maxBars));
        });

    var gSliderVertical = d3
        .select("#slider-vertical")
        .append("svg")
        .attr("width", 100)
        .attr("height", 300)
        .append("g")
        .attr("transform", "translate(60,30)");

    gSliderVertical.call(sliderVertical);

    // 更新柱状图的函数
    function updateBars(newData) {
        // 更新 x 轴的域
        x.domain(newData.map((d) => d.Date));
        svg.select(".x.axis")
            .transition()
            .duration(300)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        var bars = svg.selectAll(".bar").data(newData, (d) => d.Date);

        bars.exit()
            .transition()
            .duration(300)
            .attr("y", height)
            .attr("height", 0)
            .remove();

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.Date))
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .attr("height", 0)
            .on("mouseover", function (event, d) {
                d3.select("#tooltip")
                    .style("display", null)
                    .html(formatTooltipData(d))
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 20 + "px");
            })
            .on("mouseout", function () {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(300)
            .attr("y", (d) => y(d.Count))
            .attr("height", (d) => height - y(d.Count));

        bars.transition()
            .duration(300)
            .attr("x", (d) => x(d.Date))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.Count))
            .attr("height", (d) => height - y(d.Count));

        // 更新 y 轴
        svg.select(".y.axis").transition().duration(300).call(yAxis);

        ["HighTemp", "LowTemp", "AvgTemp"].forEach((tempType) => {
            svg.selectAll(`path.${tempType}`).remove(); // 先移除旧的折线图

            svg.append("path")
                .datum(newData)
                .attr("fill", "none")
                .attr(
                    "stroke",
                    tempType === "HighTemp"
                        ? "#ff5656"
                        : tempType === "LowTemp"
                        ? "rgb(121, 121, 255)"
                        : "rgb(158, 255, 158)"
                )
                .attr("stroke-width", 1.5)
                .attr("class", tempType)
                .attr(
                    "d",
                    lineGenerator.y((d) => yTemp(d[tempType]))
                );
        });
    }

    // 在水平滑块变化时更新图表
    slider.on("onchange", (val) => {
        var startIndex = data.findIndex(
            (d) => d.Date.getTime() === val.getTime()
        );
        var endIndex = Math.min(startIndex + maxBars, data.length);
        var newData = data.slice(startIndex, endIndex);
        updateBars(newData);
    });

    // 在垂直滑块变化时更新图表
    sliderVertical.on("onchange", (val) => {
        maxBars = val;
        var newData = data.slice(0, maxBars);
        updateBars(newData);
    });
});
