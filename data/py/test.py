import pandas as pd

# 读取CSV文件
csv_file_path = 'data\Haikou_Order_Cleaned\cleaned_data_test.csv'  # 替换为你的CSV文件路径
df = pd.read_csv(csv_file_path)

# 添加名为"value"的新属性，所有值都设置为1
df['value'] = 1

# 保存修改后的数据到新的CSV文件
output_csv_file_path = 'data\Haikou_Order_Cleaned\cleaned_data_test.csv'  # 替换为你想保存的CSV文件路径
df.to_csv(output_csv_file_path, index=False)

print("属性'value'已成功添加并保存到新的CSV文件。")
