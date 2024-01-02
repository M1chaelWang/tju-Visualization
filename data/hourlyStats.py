import pandas as pd

# 读取所有 CSV 文件并整合数据
file_names = ['D3/Homework/data/Haikou_Order_Cleaned/cleaned_data1.csv', 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data2.csv', 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data3.csv', 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data4.csv', 
              'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data5.csv', 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data6.csv', 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data7.csv', 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data8.csv']

# file_names = ['D3/Homework/data/Haikou_Order_Cleaned/cleaned_data1.csv']

# 创建一个空的 DataFrame 存储所有数据
all_data = pd.DataFrame()

# 读取所有文件并整合数据
for file in file_names:
    data = pd.read_csv(file)
    all_data = pd.concat([all_data, data])

# 将出发时间字段转换为 datetime 类型
all_data['departure_time'] = pd.to_datetime(all_data['departure_time'])

# 过滤掉指定日期范围的数据
# all_data = all_data[~((all_data['departure_time'].dt.month == 5) & (all_data['departure_time'].dt.day.between(28, 30))) &
#                     ~((all_data['departure_time'].dt.month == 5) & (all_data['departure_time'].dt.day == 1)) &
#                     ~((all_data['departure_time'].dt.month == 10) & (all_data['departure_time'].dt.day.between(1, 8)))]

target_dates = ((all_data['departure_time'].dt.month == 5) & (all_data['departure_time'].dt.day.between(1, 8)))
all_data = all_data[target_dates]

# 添加日期和时间段列
all_data['date'] = all_data['departure_time'].dt.date
all_data['hour'] = all_data['departure_time'].dt.hour

# 按日期和时间段计算平均订单量和平均距离
daily_hourly_stats = all_data.groupby(['date', 'hour']).agg({'order_id': 'count', 'start_dest_distance': 'mean'})
daily_hourly_stats.reset_index(inplace=True)

# 计算每个时间段的平均订单量和平均距离
hourly_average = daily_hourly_stats.groupby('hour').agg({'order_id': 'mean', 'start_dest_distance': 'mean'})
hourly_average.rename(columns={'order_id': 'average_order_count', 'start_dest_distance': 'average_distance'}, inplace=True)

hourly_average.to_csv('D3/Homework/data/hourly_stats_101.csv')