import xlrd, json


def read_xlsx_file(filename):
    # 打开Excel文件
    data = xlrd.open_workbook(filename)
    # 读取第一个工作表
    table = data.sheets()[0]
    # 统计行数
    rows = table.nrows
    data = []  # 存放数据


    for i in range(1, rows):
        values = table.row_values(i)
        # 处理idx和id的兼容
        values.append("")

        # 关注列表follow 推特状态tState 关注国家平均编号aveFollow
        tmpFollow = []
        tmpTState = 2
        tmpAveFollow = 0
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
                tmpAveFollow += int(values[idx])
                idx += 1
            tmpAveFollow /= len(tmpFollow)

        # 所属大洲continent
        if int(values[0]) in range(1,57):
            tmpContinent = "Africa"
        elif int(values[0]) in range(57, 104):
            tmpContinent = "Asia"
        elif int(values[0]) in range(104, 160):
            tmpContinent = "Europe"
        elif int(values[0]) in range(160, 183):
            tmpContinent = "North America"
        elif int(values[0]) in range (183, 197):
            tmpContinent = "Oceania"
        else:
            tmpContinent = "South America"


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
                    "no": 0,
                    "tState": tmpTState,
                    "eigc": 0,
                    "continent": tmpContinent,
                    "aveFollow": tmpAveFollow
                }
            )
        )
        # print(int(values[0]), values[1])
    # print("**",len(data))


    # 粉丝列表follower
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
                    # 不用移出follow或follower，可以被覆盖,而且便于计算eigc
                    # data[curID-1]["follow"].remove(item)
                    # data[item-1]["follow"].remove(curID)
                # else:
                data[item-1]["follower"].append(curID)

    # 特征向量中心性eigc: eigenvector centrality
    # eigc(item)= sum of item's follower's follower number
    for i in range(len(data)):
        if data[i]["tState"] != 0:
            curID = i+1
            curFollower = data[i]["follower"]
            for item in curFollower:
                data[i]["eigc"] += len(data[item-1]["follower"])

    # 影响力排名no: rank of eigc
    id2no = []
    for item in data:
        tmp = {
            "id": item["id"],
            "eigc": item["eigc"]
        }
        id2no.append(tmp)
        # print(tmp)
    id2no.sort(key=lambda x:x["eigc"], reverse=True)
    # print(id2no)
    for i in range(len(id2no)):
        curID = id2no[i]["id"]
        data[curID-1]["no"] = i+1

    # 政治地缘性体现 中心性之和sumEig[Continent]
    tmpContinent = ""
    sumEigAfrica = 0
    sumEigAsia = 0
    sumEigEurope = 0
    sumEigNorthAmerica = 0
    sumEigOceania = 0
    sumEigSouthAmerica = 0
    aveAfrica = 0
    aveAsia = 0
    aveEurope = 0
    aveNorthAmerica = 0
    aveOceania = 0
    aveSouthAmerica = 0;

    for item in data:
        # 仅讨论有推特且有关注的领导人
        if item["tState"]==2:
            eigc = item["eigc"]
            if item["continent"]=="Africa":
                sumEigAfrica += eigc
                aveAfrica += (eigc*item["aveFollow"])
            elif item["continent"]=="Asia":
                sumEigAsia += eigc
                aveAsia += (eigc*item["aveFollow"])
            elif item["continent"]=="Europe":
                sumEigEurope += eigc
                aveEurope += (eigc*item["aveFollow"])
            elif item["continent"]=="North America":
                sumEigNorthAmerica += eigc
                aveNorthAmerica += (eigc*item["aveFollow"])
            elif item["continent"]=="Oceania":
                sumEigOceania += eigc
                aveOceania += (eigc*item["aveFollow"])
            else:
                sumEigSouthAmerica += eigc
                aveSouthAmerica += (eigc*item["aveFollow"])
    aveAfrica /= sumEigAfrica
    aveAsia /= sumEigAsia
    aveEurope /= sumEigEurope
    aveNorthAmerica /= sumEigNorthAmerica
    aveOceania /= sumEigOceania
    aveSouthAmerica /= sumEigSouthAmerica
    # print(aveAfrica,aveAsia,aveEurope,aveNorthAmerica,aveOceania,aveSouthAmerica)

    # 国旗flagUrl
    for item in data:
        if item["countryName"]=="Algeria" :
            item["flagUrl"]="flags/dz.png"
        elif item["countryName"]=="Angola" :
            item["flagUrl"]="flags/ao.png"
        elif item["countryName"]=="Benin" :
            item["flagUrl"]="flags/bj.png"
        elif item["countryName"]=="Botswana" :
            item["flagUrl"]="flags/bw.png"
        elif item["countryName"]=="Burkina Faso" :
            item["flagUrl"]="flags/bf.png"
        elif item["countryName"]=="Burundi" :
            item["flagUrl"]="flags/bi.png"
        elif item["countryName"]=="Cameroon" :
            item["flagUrl"]="flags/cm.png"
        elif item["countryName"]=="Cape Verde" :
            item["flagUrl"]="flags/cv.png"
        elif item["countryName"]=="Central African Republic" :
            item["flagUrl"]="flags/cf.png"
        elif item["countryName"]=="Chad" :
            item["flagUrl"]="flags/td.png"
        elif item["countryName"]=="Comoros" :
            item["flagUrl"]="flags/km.png"
        elif item["countryName"]=="Congo–Brazzaville (Republic of the Congo)" :
            item["flagUrl"]="flags/cg.png"
        elif item["countryName"]=="Congo–Kinshasa (Democratic Republic of the Congo)" :
            item["flagUrl"]="flags/cd.png"
        elif item["countryName"]=="Djibouti" :
            item["flagUrl"]="flags/dj.png"
        elif item["countryName"]=="Egypt" :
            item["flagUrl"]="flags/eg.png"
        elif item["countryName"]=="Equatorial Guinea" :
            item["flagUrl"]="flags/gq.png"
        elif item["countryName"]=="Eritrea" :
            item["flagUrl"]="flags/er.png"
        elif item["countryName"]=="Eswatini" :
            item["flagUrl"]="flags/sz.png"
        elif item["countryName"]=="Ethiopia" :
            item["flagUrl"]="flags/et.png"
        elif item["countryName"]=="Gabon" :
            item["flagUrl"]="flags/ga.png"
        elif item["countryName"]=="The Gambia" :
            item["flagUrl"]="flags/gm.png"
        elif item["countryName"]=="Ghana" :
            item["flagUrl"]="flags/gh.png"
        elif item["countryName"]=="Guinea" :
            item["flagUrl"]="flags/gn.png"
        elif item["countryName"]=="Guinea-Bissau" :
            item["flagUrl"]="flags/gw.png"
        elif item["countryName"]=="Ivory Coast" :
            item["flagUrl"]="flags/ci.png"
        elif item["countryName"]=="Kenya" :
            item["flagUrl"]="flags/ke.png"
        elif item["countryName"]=="Lesotho" :
            item["flagUrl"]="flags/ls.png"
        elif item["countryName"]=="Liberia" :
            item["flagUrl"]="flags/lr.png"
        elif item["countryName"]=="Libya" :
            item["flagUrl"]="flags/ly.png"
        elif item["countryName"]=="Madagascar" :
            item["flagUrl"]="flags/mg.png"
        elif item["countryName"]=="Malawi" :
            item["flagUrl"]="flags/mw.png"
        elif item["countryName"]=="Mali" :
            item["flagUrl"]="flags/ml.png"
        elif item["countryName"]=="Mauritania" :
            item["flagUrl"]="flags/mr.png"
        elif item["countryName"]=="Mauritius" :
            item["flagUrl"]="flags/mu.png"
        elif item["countryName"]=="Morocco" :
            item["flagUrl"]="flags/ma.png"
        elif item["countryName"]=="Mozambique" :
            item["flagUrl"]="flags/mz.png"
        elif item["countryName"]=="Namibia" :
            item["flagUrl"]="flags/na.png"
        elif item["countryName"]=="Niger" :
            item["flagUrl"]="flags/ne.png"
        elif item["countryName"]=="Nigeria" :
            item["flagUrl"]="flags/ng.png"
        elif item["countryName"]=="Rwanda" :
            item["flagUrl"]="flags/rw.png"
        elif item["countryName"]=="São Tomé and Príncipe" :
            item["flagUrl"]="flags/st.png"
        elif item["countryName"]=="Senegal" :
            item["flagUrl"]="flags/sn.png"
        elif item["countryName"]=="Seychelles" :
            item["flagUrl"]="flags/sc.png"
        elif item["countryName"]=="Sierra Leone" :
            item["flagUrl"]="flags/sl.png"
        elif item["countryName"]=="Somalia" :
            item["flagUrl"]="flags/so.png"
        elif item["countryName"]=="South Africa" :
            item["flagUrl"]="flags/za.png"
        elif item["countryName"]=="South Sudan" :
            item["flagUrl"]="flags/ssd.png"
        elif item["countryName"]=="Sudan" :
            item["flagUrl"]="flags/sd.png"
        elif item["countryName"]=="Tanzania" :
            item["flagUrl"]="flags/tz.png"
        elif item["countryName"]=="Togo" :
            item["flagUrl"]="flags/tg.png"
        elif item["countryName"]=="Tunisia" :
            item["flagUrl"]="flags/tn.png"
        elif item["countryName"]=="Uganda" :
            item["flagUrl"]="flags/ug.png"
        elif item["countryName"]=="Zambia" :
            item["flagUrl"]="flags/zm.png"
        elif item["countryName"]=="Zimbabwe" :
            item["flagUrl"]="flags/zw.png"
        elif item["countryName"]=="Afghanistan" :
            item["flagUrl"]="flags/af.png"
        elif item["countryName"]=="Bahrain" :
            item["flagUrl"]="flags/bh.png"
        elif item["countryName"]=="Bangladesh" :
            item["flagUrl"]="flags/bd.png"
        elif item["countryName"]=="Bhutan" :
            item["flagUrl"]="flags/bt.png"
        elif item["countryName"]=="Brunei" :
            item["flagUrl"]="flags/bn.png"
        elif item["countryName"]=="Cambodia":
            item["flagUrl"]="flags/kh.png"
        elif item["countryName"]=="China (People's Republic of China)" :
            item["flagUrl"]="flags/cn.png"
        elif item["countryName"]=="East Timor" :
            item["flagUrl"]="flags/tp.png"
        elif item["countryName"]=="India" :
            item["flagUrl"]="flags/in.png"
        elif item["countryName"]=="Indonesia" :
            item["flagUrl"]="flags/id.png"
        elif item["countryName"]=="Iran" :
            item["flagUrl"]="flags/ir.png"
        elif item["countryName"]=="Iraq" :
            item["flagUrl"]="flags/iq.png"
        elif item["countryName"]=="Israel" :
            item["flagUrl"]="flags/il.png"
        elif item["countryName"]=="Japan" :
            item["flagUrl"]="flags/jp.png"
        elif item["countryName"]=="Jordan" :
            item["flagUrl"]="flags/jo.png"
        elif item["countryName"]=="Kazakhstan" :
            item["flagUrl"]="flags/kz.png"
        elif item["countryName"]=="North Korea (Democratic People's Republic of Korea)" :
            item["flagUrl"]="flags/kp.png"
        elif item["countryName"]=="South Korea (Republic of Korea)" :
            item["flagUrl"]="flags/kr.png"
        elif item["countryName"]=="Kuwait" :
            item["flagUrl"]="flags/kw.png"
        elif item["countryName"]=="Kyrgyzstan" :
            item["flagUrl"]="flags/kg.png"
        elif item["countryName"]=="Laos" :
            item["flagUrl"]="flags/la.png"
        elif item["countryName"]=="Lebanon" :
            item["flagUrl"]="flags/lb.png"
        elif item["countryName"]=="Malaysia" :
            item["flagUrl"]="flags/my.png"
        elif item["countryName"]=="Maldives" :
            item["flagUrl"]="flags/mv.png"
        elif item["countryName"]=="Mongolia" :
            item["flagUrl"]="flags/mn.png"
        elif item["countryName"]=="Myanmar" :
            item["flagUrl"]="flags/mm.png"
        elif item["countryName"]=="Nepal" :
            item["flagUrl"]="flags/np.png"
        elif item["countryName"]=="Oman" :
            item["flagUrl"]="flags/om.png"
        elif item["countryName"]=="Pakistan" :
            item["flagUrl"]="flags/pk.png"
        elif item["countryName"]=="Palestine" :
            item["flagUrl"]="flags/bl.png"
        elif item["countryName"]=="Philippines" :
            item["flagUrl"]="flags/ph.png"
        elif item["countryName"]=="Qatar" :
            item["flagUrl"]="flags/qa.png"
        elif item["countryName"]=="Saudi Arabia" :
            item["flagUrl"]="flags/sa.png"
        elif item["countryName"]=="Singapore" :
            item["flagUrl"]="flags/sg.png"
        elif item["countryName"]=="Sri Lanka" :
            item["flagUrl"]="flags/lk.png"
        elif item["countryName"]=="Syrian Arab Republic" :
            item["flagUrl"]="flags/sy.png"
        elif item["countryName"]=="Taiwan (Republic of China)" :
            item["flagUrl"]="flags/tw.png"
        elif item["countryName"]=="Tajikistan" :
            item["flagUrl"]="flags/tj.png"
        elif item["countryName"]=="Thailand" :
            item["flagUrl"]="flags/th.png"
        elif item["countryName"]=="Turkey" :
            item["flagUrl"]="flags/tr.png"
        elif item["countryName"]=="Turkmenistan" :
            item["flagUrl"]="flags/tm.png"
        elif item["countryName"]=="United Arab Emirates" :
            item["flagUrl"]="flags/ae.png"
        elif item["countryName"]=="Uzbekistan" :
            item["flagUrl"]="flags/uz.png"
        elif item["countryName"]=="Vietnam" :
            item["flagUrl"]="flags/vn.png"
        elif item["countryName"]=="Yemen(Republic of Yemem)" :
            item["flagUrl"]="flags/ye.png"
        elif item["countryName"] == "Albania":
            item["flagUrl"] = "flags/al.png"
        elif item["countryName"] == "Andorra":
            item["flagUrl"] = "flags/ad.png"
        elif item["countryName"] == "Armenia":
            item["flagUrl"] = "flags/am.png"
        elif item["countryName"] == "Austria":
            item["flagUrl"] = "flags/at.png"
        elif item["countryName"] == "Azerbaijan":
            item["flagUrl"] = "flags/az.png"
        elif item["countryName"] == "Belarus":
            item["flagUrl"] = "flags/by.png"
        elif item["countryName"] == "Belgium":
            item["flagUrl"] = "flags/be.png"
        elif item["countryName"] == "Bosnia and Herzegovina":
            item["flagUrl"] = "flags/ba.png"
        elif item["countryName"] == "Bulgaria":
            item["flagUrl"] = "flags/bg.png"
        elif item["countryName"] == "Croatia":
            item["flagUrl"] = "flags/hr.png"
        elif item["countryName"] == "Cyprus":
            item["flagUrl"] = "flags/cy.png"
        elif item["countryName"] == "Czech Republic":
            item["flagUrl"] = "flags/cz.png"
        elif item["countryName"] == "Denmark":
            item["flagUrl"] = "flags/dk.png"
        elif item["countryName"] == "Estonia":
            item["flagUrl"] = "flags/ee.png"
        elif item["countryName"] == "Finland":
            item["flagUrl"] = "flags/fi.png"
        elif item["countryName"] == "France":
            item["flagUrl"] = "flags/fr.png"
        elif item["countryName"] == "Georgia":
            item["flagUrl"] = "flags/ge.png"
        elif item["countryName"] == "Germany":
            item["flagUrl"] = "flags/de.png"
        elif item["countryName"] == "Greece":
            item["flagUrl"] = "flags/gr.png"
        elif item["countryName"] == "Hungary":
            item["flagUrl"] = "flags/hu.png"
        elif item["countryName"] == "Iceland":
            item["flagUrl"] = "flags/is.png"
        elif item["countryName"] == "Ireland":
            item["flagUrl"] = "flags/ie.png"
        elif item["countryName"] == "Italy":
            item["flagUrl"] = "flags/it.png"
        elif item["countryName"] == "Latvia":
            item["flagUrl"] = "flags/lv.png"
        elif item["countryName"] == "Liechtenstein":
            item["flagUrl"] = "flags/li.png"
        elif item["countryName"] == "Lithuania":
            item["flagUrl"] = "flags/lt.png"
        elif item["countryName"] == "Luxembourg":
            item["flagUrl"] = "flags/lu.png"
        elif item["countryName"] == "Malta":
            item["flagUrl"] = "flags/mt.png"
        elif item["countryName"] == "Moldova":
            item["flagUrl"] = "flags/md.png"
        elif item["countryName"] == "Monaco":
            item["flagUrl"] = "flags/mc.png"
        elif item["countryName"] == "Montenegro":
            item["flagUrl"] = "flags/me.png"
        elif item["countryName"] == "Netherlands":
            item["flagUrl"] = "flags/nl.png"
        elif item["countryName"] == "North Macedonia":
            item["flagUrl"] = "flags/mk.png"
        elif item["countryName"] == "Norway":
            item["flagUrl"] = "flags/no.png"
        elif item["countryName"] == "Poland":
            item["flagUrl"] = "flags/pl.png"
        elif item["countryName"] == "Portugal":
            item["flagUrl"] = "flags/pt.png"
        elif item["countryName"] == "Romania":
            item["flagUrl"] = "flags/ro.png"
        elif item["countryName"] == "Russia":
            item["flagUrl"] = "flags/ru.png"
        elif item["countryName"] == "San Marino":
            item["flagUrl"] = "flags/sm.png"
        elif item["countryName"] == "Serbia":
            item["flagUrl"] = "flags/rs.png"
        elif item["countryName"] == "Slovakia":
            item["flagUrl"] = "flags/cs.png"
        elif item["countryName"] == "Slovenia":
            item["flagUrl"] = "flags/si.png"
        elif item["countryName"] == "Spain":
            item["flagUrl"] = "flags/es.png"
        elif item["countryName"] == "Sweden":
            item["flagUrl"] = "flags/se.png"
        elif item["countryName"] == "Switzerland":
            item["flagUrl"] = "flags/ch.png"
        elif item["countryName"] == "Ukraine":
            item["flagUrl"] = "flags/ua.png"
        elif item["countryName"] == "United Kingdom":
            item["flagUrl"] = "flags/gb.png"
        elif item["countryName"] == "Vatican City":
            item["flagUrl"] = "flags/va.png"
        elif item["countryName"] == "Antigua and Barbuda":
            item["flagUrl"] = "flags/ag.png"
        elif item["countryName"] == "The Bahamas":
            item["flagUrl"] = "flags/bf.png"
        elif item["countryName"] == "Barbados":
            item["flagUrl"] = "flags/bb.png"
        elif item["countryName"] == "Belize":
            item["flagUrl"] = "flags/bz.png"
        elif item["countryName"] == "Canada":
            item["flagUrl"] = "flags/ca.png"
        elif item["countryName"] == "Costa Rica":
            item["flagUrl"] = "flags/cr.png"
        elif item["countryName"] == "Cuba":
            item["flagUrl"] = "flags/cu.png"
        elif item["countryName"] == "Dominica":
            item["flagUrl"] = "flags/dm.png"
        elif item["countryName"] == "Dominican Republic":
            item["flagUrl"] = "flags/do.png"
        elif item["countryName"] == "El Salvador":
            item["flagUrl"] = "flags/sv.png"
        elif item["countryName"] == "Grenada":
            item["flagUrl"] = "flags/gd.png"
        elif item["countryName"] == "Guatemala":
            item["flagUrl"] = "flags/gt.png"
        elif item["countryName"] == "Haiti":
            item["flagUrl"] = "flags/ht.png"
        elif item["countryName"] == "Honduras":
            item["flagUrl"] = "flags/hn.png"
        elif item["countryName"] == "Jamaica":
            item["flagUrl"] = "flags/jm.png"
        elif item["countryName"] == "Mexico":
            item["flagUrl"] = "flags/mx.png"
        elif item["countryName"] == "Nicaragua":
            item["flagUrl"] = "flags/ni.png"
        elif item["countryName"] == "Panama":
            item["flagUrl"] = "flags/pa.png"
        elif item["countryName"] == "Saint Kitts and Nevis":
            item["flagUrl"] = "flags/kn.png"
        elif item["countryName"] == "Saint Lucia":
            item["flagUrl"] = "flags/lc.png"
        elif item["countryName"] == "Saint Vincent and the Grenadines":
            item["flagUrl"] = "flags/vc.png"
        elif item["countryName"] == "Trinidad and Tobago":
            item["flagUrl"] = "flags/tt.png"
        elif item["countryName"] == "United States":
            item["flagUrl"] = "flags/us.png"
        elif item["countryName"] == "Australia":
            item["flagUrl"] = "flags/au.png"
        elif item["countryName"] == "Fiji":
            item["flagUrl"] = "flags/fj.png"
        elif item["countryName"] == "Kiribati":
            item["flagUrl"] = "flags/ki.png"
        elif item["countryName"] == "Marshall Islands":
            item["flagUrl"] = "flags/mh.png"
        elif item["countryName"] == "Micronesia":
            item["flagUrl"] = "flags/fm.png"
        elif item["countryName"] == "Nauru":
            item["flagUrl"] = "flags/nr.png"
        elif item["countryName"] == "New Zealand":
            item["flagUrl"] = "flags/nz.png"
        elif item["countryName"] == "Palau":
            item["flagUrl"] = "flags/pw.png"
        elif item["countryName"] == "Papua New Guinea":
            item["flagUrl"] = "flags/pg.png"
        elif item["countryName"] == "Samoa":
            item["flagUrl"] = "flags/ws.png"
        elif item["countryName"] == "Solomon Islands":
            item["flagUrl"] = "flags/sb.png"
        elif item["countryName"] == "Tonga":
            item["flagUrl"] = "flags/tg.png"
        elif item["countryName"] == "Tuvalu":
            item["flagUrl"] = "flags/tv.png"
        elif item["countryName"] == "Vanuatu":
            item["flagUrl"] = "flags/vu.png"
        elif item["countryName"] == "Argentina":
            item["flagUrl"] = "flags/ar.png"
        elif item["countryName"] == "Bolivia":
            item["flagUrl"] = "flags/bo.png"
        elif item["countryName"] == "Brazil":
            item["flagUrl"] = "flags/br.png"
        elif item["countryName"] == "Chile":
            item["flagUrl"] = "flags/cl.png"
        elif item["countryName"] == "Colombia":
            item["flagUrl"] = "flags/co.png"
        elif item["countryName"] == "Ecuador":
            item["flagUrl"] = "flags/ec.png"
        elif item["countryName"] == "Guyana":
            item["flagUrl"] = "flags/gy.png"
        elif item["countryName"] == "Paraguay":
            item["flagUrl"] = "flags/py.png"
        elif item["countryName"] == "Peru":
            item["flagUrl"] = "flags/pe.png"
        elif item["countryName"] == "Suriname":
            item["flagUrl"] = "flags/sr.png"
        elif item["countryName"] == "Uruguay":
            item["flagUrl"] = "flags/uy.png"
        elif item["countryName"] == "Venezuela":
            item["flagUrl"] = "flags/ve.png"

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