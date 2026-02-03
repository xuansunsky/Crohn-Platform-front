import os
import requests
import json

# 目标文件夹 (脚本运行目录下会自动创建)
save_dir = "./citys"
if not os.path.exists(save_dir):
    os.makedirs(save_dir)

# 省份代码映射
provinces = {
    '110000': '北京', '120000': '天津', '130000': '河北', '140000': '山西', '150000': '内蒙古',
    '210000': '辽宁', '220000': '吉林', '230000': '黑龙江', '310000': '上海', '320000': '江苏',
    '330000': '浙江', '340000': '安徽', '350000': '福建', '360000': '江西', '370000': '山东',
    '410000': '河南', '420000': '湖北', '430000': '湖南', '440000': '广东', '450000': '广西',
    '460000': '海南', '500000': '重庆', '510000': '四川', '520000': '贵州', '530000': '云南',
    '540000': '西藏', '610000': '陕西', '620000': '甘肃', '630000': '青海', '640000': '宁夏',
    '650000': '新疆', '710000': '台湾', '810000': '香港', '820000': '澳门'
}

print("开始下载地图数据...")

for adcode, name in provinces.items():
    url = f"https://geo.datav.aliyun.com/areas_v3/bound/{adcode}_full.json"
    print(f"正在下载 {name} ({adcode})...")

    try:
        r = requests.get(url)
        if r.status_code == 200:
            with open(f"{save_dir}/{adcode}.json", "wb") as f:
                f.write(r.content)
        else:
            # 有些地方没有 _full，试试不带 full 的
            url_backup = f"https://geo.datav.aliyun.com/areas_v3/bound/{adcode}.json"
            r = requests.get(url_backup)
            if r.status_code == 200:
                 with open(f"{save_dir}/{adcode}.json", "wb") as f:
                    f.write(r.content)
            else:
                print(f"❌ {name} 下载失败")
    except Exception as e:
        print(f"❌ {name} 出错: {e}")

print("✅ 所有地图下载完成！请把 citys 文件夹复制到 public/map/ 下")