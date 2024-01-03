
$.get('./data/Haikou_Order_Cleaned/cleaned_data_test.csv', function (data) {
  Papa.parse(data, {
    header: true,
    dynamicTyping: true,
    complete: function (result) {
      const data = result.data;
      
      const map = new AMap.Map('startHex', {
        mapStyle: 'amap://styles/grey',
        zoom: 13,
        center: [110.33, 20.01]
      });

      var layer = new Loca.HexagonLayer({
        map: map,
        fitView: true
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
          value:'value',
          type: 'json'
        });
        
        layer.setOptions({
          mode: 'count',
          unit: 'meter',
          style: {
              color: ['#2c7bb6', '#abd9e9', '#ffffbf', '#fde468', '#d7191c'],
              radius: 200,
              opacity: 0.9,
              gap: 30
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
