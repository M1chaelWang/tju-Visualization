
$.get('./data/Haikou_Order_Cleaned/cleaned_data_test.csv', function (data) {
  Papa.parse(data, {
    header: true,
    dynamicTyping: true,
    complete: function (result) {
      const data = result.data;
      
      const map = new AMap.Map('heatMap', {
        mapStyle: 'amap://styles/grey',
        zoom: 13,
        pitch: 30,
        center: [110.33, 20.01],
        viewMode: '3D'
      });

      var layer = new Loca.HeatmapLayer({
        map: map,
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
          value: 'normal_time',
          type: 'json'
        });
        layer.setOptions({
          style: {
              radius: 16,
              color: {
                  0.5: '#2c7bb6',
                  0.65: '#abd9e9',
                  0.7: '#ffffbf',
                  0.9: '#fde468',
                  1.0: '#d7191c'
              }
          }
      });

        layer.render();

        currentIndex = (currentIndex + 1) % data.length; // Move to the next time point
        const startTimeh = currentTime.getHours();
        const endTime = (startTimeh + 1) % 24; // Assuming 1-hour intervals
      }

      setInterval(updatePointCloud, 1000); // Update every second
      updatePointCloud(); // Initial update
      
    }
  });
});
