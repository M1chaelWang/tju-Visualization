$.get("./data/Haikou_Order_Cleaned/cleaned_data_test.csv", function (data) {
    Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        complete: function (result) {
            const data = result.data;

            const map = new AMap.Map("heatMap", {
                mapStyle: "amap://styles/grey",
                zoom: 11.5,
                pitch: 30,
                center: [110.33, 20.01],
                viewMode: "3D",
            });

            var layer = new Loca.HeatmapLayer({
                map: map,
            });

            function updateHeatMap(targetTime) {
                const filteredData = data.filter(function (item) {
                    const departureTime = new Date(item.departure_time);
                    const targetDate = new Date(targetTime);
                    return (
                        departureTime >= targetDate &&
                        departureTime <
                            new Date(targetDate.getTime() + 60 * 60 * 1000)
                    );
                });
                layer.setData(filteredData, {
                    lnglat: function (obj) {
                        var val = obj.value;
                        var lnglat = [val["starting_lng"], val["starting_lat"]];
                        return lnglat;
                    },
                    value: "normal_time",
                    type: "json",
                });
                layer.setOptions({
                    style: {
                        radius: 16,
                        color: {
                            0.5: "#2c7bb6",
                            0.65: "#abd9e9",
                            0.7: "#ffffbf",
                            0.9: "#fde468",
                            1.0: "#d7191c",
                        },
                    },
                });

                layer.render();
            }
            const sliderContainer = document.getElementById("timeSlider2");
            sliderContainer.innerHTML = ""; // 清空之前的滑块

            // 创建时间滑块
            const slider = d3
                .sliderBottom()
                .min(0)
                .max(24)
                .step(1) // 一个小时
                .width(500)
                .ticks(24)
                .default(0)
                .fill("#2196f3")
                .on("onchange", (val) => {
                    const targetTime = val;
                    const newDate = new Date(
                        `${globalVariable} ${targetTime
                            .toString()
                            .padStart(2, "0")}:00:00`
                    );
                    const formattedDate =
                        d3.timeFormat("%Y-%m-%d %H:%M:%S")(newDate);
                    updateHeatMap(formattedDate);
                });
            d3.select(sliderContainer)
                .append("svg")
                .attr("width", 600)
                .attr("height", 50)
                .append("g")
                .attr("transform", "translate(90,10)")
                .call(slider);

            // 默认显示日期的热力图

            updateHeatMap("2017-05-19 00:00:00");
        },
    });
});
