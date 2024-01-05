import pandas as pd
from glob import glob

# 读取所有 CSV 文件并合并为一个 DataFrame
file_paths = glob('data/Haikou_Order_Cleaned/cleaned_data*.csv')
all_data = pd.concat((pd.read_csv(f) for f in file_paths))

# 合并年、月、日为日期列
all_data['date'] = pd.to_datetime(all_data[['year', 'month', 'day']])

result = all_data.groupby(['date'])['county'].value_counts(normalize=True).unstack(fill_value=0)

# # 按日期分类，并计算每天不同product_id的占比
# result_product_id = all_data.groupby(['date'])['product_id'].value_counts(normalize=True).unstack(fill_value=0)

# # 按日期分类，并计算每天不同product_id的占比
# result_product_id = all_data.groupby(['date'])['product_id'].value_counts(normalize=True).unstack(fill_value=0)

# # 计算每天pre_total_fee大于40的占比
# all_data['pre_total_fee_gt_40'] = all_data['pre_total_fee'] > 40
# result_pre_total_fee = all_data.groupby('date')['pre_total_fee_gt_40'].mean()

# # 计算每天normal_time大于30的占比
# all_data['normal_time_gt_30'] = all_data['normal_time'] > 30
# result_normal_time = all_data.groupby('date')['normal_time_gt_30'].mean()

# # 合并结果
# final_result = pd.concat([result_product_id, result_pre_total_fee, result_normal_time], axis=1)
final_result = pd.concat([result], axis=1)

# 将结果输出到CSV文件
final_result.to_csv('data/daily_statistics.csv', float_format='%.4f')

