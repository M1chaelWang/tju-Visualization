import pandas as pd
import glob

# 设置 Pandas 输出格式，禁用科学计数法
pd.set_option('display.float_format', lambda x: '%.4f' % x)

# 匹配所有以 cleaned_data 开头且以 .csv 结尾的文件
file_list = glob.glob('data/Haikou_Order_Cleaned/cleaned_data*.csv')

# 读取所有 CSV 文件并合并为一个 DataFrame
dfs = [pd.read_csv(file) for file in file_list]
combined_df = pd.concat(dfs, ignore_index=True)

# 统计 county 列中每个值的数量
county_counts = combined_df['county'].value_counts(normalize=True)

print(county_counts)
