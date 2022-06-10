import xlrd, json


def read_xlsx_file(filename):
    # 打开Excel文件
    data = xlrd.open_workbook(filename)
    # 读取第一个工作表
    table = data.sheets()[0]
    # 统计行数
    rows = table.nrows
    data = []  # 存放数据

    # follow tState
    for i in range(1, rows):
        values = table.row_values(i)
        values.append("")
        tmpFollow = []
        tmpTState = 2
        # 没有推特
        if values[5] == "没号":
            tmpTState = 0
        # 有推特但是没关注人
        elif values[6] == "/":
            tmpTState = 1
        # 有推特且有关注人
        if isinstance(values[6], float):
            # print(i, "find", len(values))
            idx = 6
            while isinstance(values[idx], float):
                # print(idx)
                tmpFollow.append(int(values[idx]))
                idx += 1
        data.append(
            (
                {
                    "id": int(values[0]),
                    "countryName": values[1],
                    "flagUrl": "",
                    "name": values[2],
                    "position": values[3],
                    "twitter": values[4],
                    "avatarUrl": "",
                    "follow": tmpFollow,
                    "follower": [],
                    "mutualFollower": [],
                    "no": int(values[0])+1,
                    "tState": tmpTState
                }
            )
        )
    # print("**",len(data))
    # follower
    for i in range(len(data)):
        if data[i]["tState"] == 2:
            curID = i+1
            curFollow = data[i]["follow"]
            # print(curID, curFollow)
            for item in curFollow:
                # print(item)
                # 如果curid也在item的follow里，加入mutual
                if curID in data[item-1]["follow"]:
                    data[curID-1]["mutualFollower"].append(item)
                    data[item-1]["mutualFollower"].append(curID)
                    # 不用移出follow或follower，可以被覆盖
                    # data[curID-1]["follow"].remove(item)
                    # data[item-1]["follow"].remove(curID)
                # else:
                data[item-1]["follower"].append(curID)



    return data


if __name__ == '__main__':
    d1 = read_xlsx_file("list-for-python.xlsx")
    # 字典中的数据都是单引号，但是标准的json需要双引号
    js1 = json.dumps(d1, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ':'))
    # print(js1)
    # 前面的数据只是数组
    # 可读可写，如果不存在则创建，如果有内容则覆盖
    jsFile = open("./text3.json", "w+", encoding='utf-8')
    jsFile.write(js1)
    jsFile.close()