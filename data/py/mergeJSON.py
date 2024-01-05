import pandas as pd
import json

# 读取 CSV 文件并按日期分类计算
# 假设final_result包含了上面计算出的结果
final_result = pd.read_csv('data/daily_statistics.csv', encoding='utf-8')
final_result['date'] = pd.to_datetime(final_result['date']).dt.strftime('%Y-%m-%d')

# 读取 JSON 文件
with open('data/daily_stats/calendarHeatMap.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

# 将 JSON 数据转换为 DataFrame
json_df = pd.DataFrame(json_data, columns=["Date", "Value1", "Value2", "Value3", "Value4", "Value5", "Value6", "Value7","Value8","Value9","Value10","Value11","Value12"])
json_df['Date'] = pd.to_datetime(json_df['Date']).dt.strftime('%Y-%m-%d')

# 合并数据
merged_data = pd.merge(json_df, final_result, left_on='Date', right_on='date', how='left').drop(columns=['date'])

# 将合并后的结果转换为 JSON 格式并写入新的文件
merged_json = merged_data.to_json(orient='values', force_ascii=False)

with open('data/merged_data.json', 'w', encoding='utf-8') as f:
    f.write(merged_json)
