import pandas as pd

min_lng = 110.1167
max_lng = 110.7
min_lat = 19.5167
max_lat = 20.3935
# 读取 CSV 文件
csv_file_path = 'D3/Homework/data/Haikou_Order/dwv_order_make_haikou_8.csv'  # 请替换成你的 CSV 文件路径
df = pd.read_csv(csv_file_path)

df_cleaned_combined = (
    df.dropna()  # 第一步：删除包含 NULL 值的行
      .loc[  # 第二步：删除时间缺失的行和经纬度超过指定区间的行
          (df['dwv_order_make_haikou_8.arrive_time'] != '0000-00-00 00:00:00') &
          (df['dwv_order_make_haikou_8.starting_lng'] >= min_lng) & (df['dwv_order_make_haikou_8.starting_lng'] <= max_lng) &
          (df['dwv_order_make_haikou_8.starting_lat'] >= min_lat) & (df['dwv_order_make_haikou_8.starting_lat'] <= max_lat)&
          (df['dwv_order_make_haikou_8.dest_lng'] >= min_lng) & (df['dwv_order_make_haikou_8.dest_lng'] <= max_lng) &
          (df['dwv_order_make_haikou_8.dest_lat'] >= min_lat) & (df['dwv_order_make_haikou_8.dest_lat'] <= max_lat)
      ]
      .rename(columns=lambda x: x.replace('dwv_order_make_haikou_8.', ''))  # 删除属性名称中的"dwv_order_make_haikou_8."
)
# 将清理后的数据保存到新的 CSV 文件
output_file_path = 'D3/Homework/data/Haikou_Order_Cleaned/cleaned_data8.csv'  # 请替换成你想要保存的文件路径
df_cleaned_combined.to_csv(output_file_path, index=False)
print("清理前数据集大小:", df.shape)
print("第一步清理后数据集大小:", df_cleaned_combined.shape)

