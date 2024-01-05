$.get("./data/Haikou_Order_Cleaned/cleaned_data_test.csv", function (data) {
    Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        complete: function (result) {
            const data = result.data;

            const map = new AMap.Map("map", {
                mapStyle: "amap://styles/grey",
                zoom: 12.0,
                center: [110.33, 20.01],
            });

            const layer = new Loca.PointCloudLayer({
                map: map,
                visible: true,
            });

            function updatePointCloud(targetTime) {
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
                    type: "json",
                });

                layer.setOptions({
                    style: {
                        radius: 100,
                        color: "#4FC2FF",
                        opacity: 0.9,
                    },
                });

                layer.render();
            }
            const sliderContainer = document.getElementById("timeSlider1");
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
                    updatePointCloud(formattedDate);
                });
            d3.select(sliderContainer)
                .append("svg")
                .attr("width", 600)
                .attr("height", 50)
                .append("g")
                .attr("transform", "translate(90,10)")
                .call(slider);

            // 默认显示日期的热力图

            updatePointCloud("2017-05-19 00:00:00");
        },
    });
});
