document.addEventListener('DOMContentLoaded', (event) => {
    const height = 500;
    const width = 800;
    let currentDataIndex = 0;

    const svg = d3.select('#my_svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('stroke', 'grey');

    const switchButton = document.getElementById('switchData');
    switchButton.addEventListener('click', switchData);

    function switchData() {
        currentDataIndex = (currentDataIndex + 1) % 8;

        d3.json("data/Haikou_Map/haikou.geoJson").then((geojson) => {
            d3.csv(`data/Haikou_Order_Cleaned/cleaned_data${currentDataIndex + 1}.csv`).then((newData) => {
                updateChart(geojson, newData);
                updateDatasetName(currentDataIndex + 1);
            });
        });
    }
    const datasetNameDiv = document.getElementById('datasetName');
    function updateDatasetName(index) {
        datasetNameDiv.textContent = `当前数据集: cleaned_data${index}.csv`;
    }
    function updateChart(geojson, newData) {
        let dots = newData;
        let projection = d3.geoMercator().center(d3.geoCentroid(geojson)).scale(26000);
        let path = d3.geoPath().projection(projection);

        svg.select("path").remove(); // Remove previous GeoJSON path
        svg.selectAll(".hex").remove(); // Remove previous hexagons

        svg.append("path")
            .attr("d", path(geojson))
            .attr("fill", "#a6cee3")
            .attr("opacity", 0.3)
            .attr("stroke", "black");

        let hexbin = d3.hexbin()
            .x(d => d.x).y(d => d.y)
            .extent([[0, 0], [width, height]]).radius(3);

        dots.forEach(d => {
            let coordinate = projection([d.starting_lng, d.starting_lat]);
            d.x = coordinate[0];
            d.y = coordinate[1];
        });

        let hex_data = hexbin(dots);
        let pudCount = arr => d3.set(arr.map(d => d['order_id'])).size();
        let color = d3.scaleSequential([0, d3.max(hex_data, d => Math.sqrt(pudCount(d)))], d3.interpolateReds);

        svg.selectAll(".hex")
            .data(hex_data).join("path")
            .attr("class", "hex")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("d", d => hexbin.hexagon(hexbin.radius()))
            .attr("fill", d => color(Math.sqrt(pudCount(d))))
            .attr("stroke", "#a6cee3")
            .transition() // 添加过渡效果
            .duration(1000) // 过渡时间（毫秒）
            .text(d => `${pudCount(d)} PUD`);
    }

    // 初始化加载第一个数据集
    d3.json("data/Haikou_Map/haikou.geoJson").then((geojson) => {
        d3.csv("data/Haikou_Order_Cleaned/cleaned_data1.csv").then((initialData) => {
            updateChart(geojson, initialData);
            updateDatasetName(1);
        });
    });
});