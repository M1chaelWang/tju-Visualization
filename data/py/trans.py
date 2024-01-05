import csv

def txt_to_csv(input_file, output_file):
    with open(input_file, 'r') as txtfile:
        # 读取txt文件中的数据，假设数据以逗号分隔
        lines = txtfile.readlines()

    # 提取每一行的数据，并将其分割成列表
    data = [line.strip().split('\t') for line in lines]

    with open(output_file, 'w', newline='') as csvfile:
        # 创建CSV写入器
        csvwriter = csv.writer(csvfile)

        # 将数据写入CSV文件
        csvwriter.writerows(data)

if __name__ == "__main__":
    # 输入和输出文件的路径
    input_path = 'D3/Homework/data/Haikou_Order/dwv_order_make_haikou_8.txt'  # 请替换为你的txt文件路径
    output_path = 'D3/Homework/data/Haikou_Order/dwv_order_make_haikou_8.csv'  # 请替换为你希望保存CSV文件的路径

    # 调用函数进行转换
    txt_to_csv(input_path, output_path)

    print(f"转换完成，CSV文件保存在 {output_path}")
