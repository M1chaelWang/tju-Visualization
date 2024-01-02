
$.get('./data/Haikou_Order_Cleaned/cleaned_data1.csv', function (data) {
  Papa.parse(data, {
    header: true,
    dynamicTyping: true,
    complete: function (result) {
      const data = result.data;
      
      const map = new AMap.Map('map', {
        mapStyle: 'amap://styles/grey',
        zoom: 13.5,
        center: [110.33, 20.01]
      });

      const layer = new Loca.PointCloudLayer({
        map: map,
        visible: true
      });

      data.forEach(function (item) {
        item.departure_time = new Date(item.departure_time);
      });
      
      let currentIndex = 0;
      console.log(data.length)
      function updatePointCloud() {
        const currentTime = data[currentIndex].departure_time;
        const filteredData = data.filter(function (item) {
          return item.departure_time >= currentTime && item.departure_time < new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour interval
        });

        layer.setData(filteredData, {
          lnglat: function (obj) {
            var val = obj.value;
            var lnglat = [val['starting_lng'], val['starting_lat']];
            return lnglat;
          },
          type: 'json'
        });

        layer.setOptions({
          style: {
            radius: 100,
            color: '#4FC2FF',
            opacity: 0.9,
          }
        });

        layer.render();

        currentIndex = (currentIndex + 1) % data.length; // Move to the next time point
        const startTimeh = currentTime.getHours();
        const startTimed = currentTime.getDate();
        const startTimem = currentTime.getMonth();
        const startTimey = currentTime.getFullYear();
        const endTime = (startTimeh + 1) % 24; // Assuming 1-hour intervals
        document.getElementById('time-display').innerText = `显示时间段：${startTimey}-${startTimem}-${startTimed}-${startTimeh}:00 - ${endTime}:00`;
      }

      setInterval(updatePointCloud, 100); // Update every second
      updatePointCloud(); // Initial update
      
    }
  });
});
