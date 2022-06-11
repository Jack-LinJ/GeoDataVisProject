// 定义颜色
var noTwitter_color = 'black';
var normal_color = 'rgba(15,248,251,0.65)';
var selected_color = 'green';
var follow_color = 'yellow';
var follower_color = 'red';
var mutualfollow_color = 'pink';

// 设置图例颜色
document.getElementById('selected').style['background-color'] = selected_color;
document.getElementById('follow').style['background-color'] = follow_color;
document.getElementById('follower').style['background-color'] = follower_color;
document.getElementById('mutualfollow').style['background-color'] = mutualfollow_color;
document.getElementById('noTwitter').style['background-color'] = noTwitter_color;


var myChart = echarts.init(document.getElementById('world'));

// 点击国家后显示该国信息
myChart.on('click', function (params) {
    console.log('点击', params.name)
    // console.log(option.geo.regions[0].itemStyle.areaColor, option.geo.zoom, option.geo.center)
    let id = country2id[params.name];
    console.log("id", id)
    // excel编号从1开始了
    setOption(id - 1)
})

// 重置option
var resetOption = function () {
    let tmp = option.geo.regions;
    for (let i in tmp) {
        tmp[i].itemStyle.areaColor = normal_color
    }
    option.geo.regions = tmp;
}

// 设置option
var setOption = function (id) {
    resetOption()
    console.log(option.geo.regions[id])

    let country = countryData[id]
    
    document.getElementById('countryName').innerHTML = country.countryName
    document.getElementById('twitter').innerHTML = country.twitter
    document.getElementById('name').innerHTML = country.name
    document.getElementById('position').innerHTML = country.position
    document.getElementById('flag').src = country.flagUrl
    document.getElementById('no').innerHTML = '影响力排名' + country.no

    // document.getElementById('avatar').src = country.avatarUrl

    // 设置新的地图颜色
    // 该国变绿
    option.geo.regions[id].itemStyle.areaColor = selected_color;
    // 由于id从0开始，每个索引需要-1
    // 该国家关注的国家变红
    for (let i in country.follow) {
        console.log("follow:", country.follow[i])
        // print("tar",country.follow[i])
        option.geo.regions[country.follow[i] - 1].itemStyle.areaColor = follow_color;
    }
    // 关注该国家的国家变黄
    for (let i in country.follower) {
        option.geo.regions[country.follower[i] - 1].itemStyle.areaColor = follower_color;
    }
    // 互关国家变粉
    for (let i in country.mutualFollower) {
        option.geo.regions[country.mutualFollower[i] - 1].itemStyle.areaColor = mutualfollow_color;
    }
    myChart.setOption(option)
}

// 国家名称中英对照
let nameMap =
{
    Afghanistan: '阿富汗',
    Singapore: '新加坡',
    Angola: '安哥拉',
    Albania: '阿尔巴尼亚',
    'United Arab Emirates': '阿联酋',
    Argentina: '阿根廷',
    Armenia: '亚美尼亚',
    'French Southern and Antarctic Lands':
        '法属南半球和南极领地',
    Australia: '澳大利亚',
    Austria: '奥地利',
    Azerbaijan: '阿塞拜疆',
    Burundi: '布隆迪',
    Belgium: '比利时',
    Benin: '贝宁',
    'Burkina Faso': '布基纳法索',
    Bangladesh: '孟加拉国',
    Bulgaria: '保加利亚',
    'The Bahamas': '巴哈马',
    'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那.',
    Belarus: '白俄罗斯',
    Belize: '伯利兹',
    Bermuda: '百慕大',
    Bolivia: '玻利维亚',
    Brazil: '巴西',
    Brunei: '文莱',
    Bhutan: '不丹',
    Botswana: '博茨瓦纳',
    "Central African Republic": '中非.',
    Canada: '加拿大',
    Switzerland: '瑞士',
    Chile: '智利',
    "China (People's Republic of China)": '中国',
    'Ivory Coast': '象牙海岸',
    Cameroon: '喀麦隆',
    'Congo–Kinshasa (Democratic Republic of the Congo)': '刚果民主共和国',
    'Congo–Brazzaville (Republic of the Congo)': 'Congo',
    Colombia: '哥伦比亚',
    'Costa Rica': '哥斯达黎加',
    Cuba: '古巴',
    'Northern Cyprus': '北塞浦路斯',
    Cyprus: '塞浦路斯',
    'Czech Republic': '捷克',
    Germany: '德国',
    Djibouti: '吉布提',
    Denmark: '丹麦',
    'Dominican Republic': '多明尼加共和国',
    Algeria: '阿尔及利亚',
    Ecuador: '厄瓜多尔',
    Egypt: '埃及',
    Eritrea: '厄立特里亚',
    Spain: '西班牙',
    Estonia: '爱沙尼亚',
    Ethiopia: '埃塞俄比亚',
    Finland: '芬兰',
    Fiji: '斐济',
    Kiribati: '基里巴斯',
    'Marshall Islands': '马绍尔群岛',
    Micronesia: '密克罗尼西亚',
    Nauru: '瑙鲁',
    'Falkland Islands': '福克兰群岛',
    France: '法国',
    Gabon: '加蓬',
    'United Kingdom': '英国',
    "Vatican City": '梵蒂冈',
    Georgia: '格鲁吉亚',
    Ghana: '加纳',
    Guinea: '几内亚',
    'The Gambia': '冈比亚',
    'Guinea Bissau': '几内亚比绍',
    Greece: '希腊',
    Greenland: '格陵兰',
    Guatemala: '危地马拉',
    'French Guiana': '法属圭亚那',
    Guyana: '圭亚那',
    Honduras: '洪都拉斯',
    Croatia: '克罗地亚',
    Haiti: '海地',
    Hungary: '匈牙利',
    Indonesia: '印度尼西亚',
    India: '印度',
    Ireland: '爱尔兰',
    Iran: '伊朗',
    Iraq: '伊拉克',
    Iceland: '冰岛',
    Israel: '以色列',
    Italy: '意大利',
    "Ivory Coast": '科特迪瓦',
    Jamaica: '牙买加',
    Jordan: '约旦',
    Japan: '日本',
    Kazakhstan: '哈萨克斯坦',
    Kenya: '肯尼亚',
    Kyrgyzstan: '吉尔吉斯斯坦',
    Cambodia: '柬埔寨',
    Kosovo: '科索沃',
    Kuwait: '科威特',
    Laos: '老挝',
    Lebanon: '黎巴嫩',
    Liberia: '利比里亚',
    Libya: '利比亚',
    'Sri Lanka': '斯里兰卡',
    Lesotho: '莱索托',
    Lithuania: '立陶宛',
    Luxembourg: '卢森堡',
    Latvia: '拉脱维亚',
    Liechtenstein: '列支登仕顿',
    Morocco: '摩洛哥',
    Moldova: '摩尔多瓦',
    Madagascar: '马达加斯加',
    Mexico: '墨西哥',
    "North Macedonia": '马其顿',
    Mali: '马里',
    Myanmar: '缅甸',
    Monaco: '摩纳哥',
    Montenegro: '黑山',
    Mongolia: '蒙古',
    Mozambique: '莫桑比克',
    Mauritania: '毛里塔尼亚',
    Malawi: '马拉维',
    Malaysia: '马来西亚',
    Maldives: '马尔代夫',
    Namibia: '纳米比亚',
    'New Caledonia': '新喀里多尼亚',
    Niger: '尼日尔',
    Nigeria: '尼日利亚',
    Nicaragua: '尼加拉瓜',
    Netherlands: '荷兰',
    Norway: '挪威',
    Nepal: '尼泊尔',
    'New Zealand': '新西兰',
    Oman: '阿曼',
    Pakistan: '巴基斯坦',
    Panama: '巴拿马',
    "Saint Kitts and Nevis": '圣基茨和尼维斯',
    "Saint Vincent and the Grenadines": '圣文森特和格林纳丁斯',
    Peru: '秘鲁',
    Philippines: '菲律宾',
    'Papua New Guinea': '巴布亚新几内亚',
    'Palau': '帕劳',
    Poland: '波兰',
    'Puerto Rico': '波多黎各',
    "North Korea (Democratic People's Republic of Korea)": '北朝鲜',
    Portugal: '葡萄牙',
    Paraguay: '巴拉圭',
    Qatar: '卡塔尔',
    Romania: '罗马尼亚',
    Russia: '俄罗斯',
    "San Marino": '圣马力诺',
    Rwanda: '卢旺达',
    'Western Sahara': 'W.撒哈拉',
    'Saudi Arabia': '沙特阿拉伯',
    Sudan: '苏丹',
    'South Sudan': '南苏丹',
    Senegal: '塞内加尔',
    'Solomon Islands': '所罗门群岛',
    'Sierra Leone': '塞拉利昂',
    'El Salvador': '萨尔瓦多',
    Somaliland: '索马里兰',
    Somalia: '索马里',
    'Republic of Serbia': '塞尔维亚',
    Suriname: '苏里南',
    Slovakia: '斯洛伐克',
    Slovenia: '斯洛文尼亚',
    Sweden: '瑞典',
    Swaziland: '斯威士兰',
    "Syrian Arab Republic": '叙利亚',
    Chad: '乍得',
    Togo: '多哥',
    Tonga: '汤加',
    Tuvalu: '图瓦卢',
    "Taiwan (Republic of China)": '中国台湾',
    Thailand: '泰国',
    Tajikistan: '塔吉克斯坦',
    Turkmenistan: '土库曼斯坦',
    'East Timor': '东帝汶',
    'Trinidad and Tobago': '特里尼达和多巴哥',
    Tunisia: '突尼斯',
    Turkey: '土耳其',
    'United Republic of Tanzania': '坦桑尼亚',
    Uganda: '乌干达',
    Ukraine: '乌克兰',
    Uruguay: '乌拉圭',
    'United States': '美国',
    Uzbekistan: '乌兹别克斯坦',
    Venezuela: '委内瑞拉',
    Vietnam: '越南',
    Vanuatu: '瓦努阿图',
    'West Bank': '西岸',
    "Yemen(Republic of Yemem)": '也门',
    'South Africa': '南非',
    Zambia: '赞比亚',
    "South Korea (Republic of Korea)": '韩国',
    Tanzania: '坦桑尼亚',
    Zimbabwe: '津巴布韦',
    // Congo: '刚果',
    'Central African Rep.': '中非',
    Serbia: '塞尔维亚',
    'Bosnia and Herz.': '波黑',
    // 'W. Sahara': '西撒哈拉',
    'Lao PDR': '老挝',
    'Dem.Rep.Korea': '朝鲜',
    'Falkland Is.': '福克兰群岛',
    'Timor-Leste': '东帝汶',
    'Solomon Is.': '所罗门群岛',
    Palestine: '巴勒斯坦',
    'N. Cyprus': '北塞浦路斯',
    Aland: '奥兰群岛',
    'Fr. S. Antarctic Lands': '法属南半球和南极陆地',
    Mauritius: '毛里求斯',
    Comoros: '科摩罗',
    'Equatorial Guinea': '赤道几内亚',
    'Guinea-Bissau': '几内亚比绍',
    'Dominican Rep.': '多米尼加',
    'Saint Lucia': '圣卢西亚',
    Dominica: '多米尼克',
    'Antigua and Barbuda': '安提瓜和巴布达',
    'U.S. Virgin Is.': '美国原始岛屿',
    Montserrat: '蒙塞拉特',
    Grenada: '格林纳达',
    Barbados: '巴巴多斯',
    Samoa: '萨摩亚',
    Bahamas: '巴哈马',
    'Cayman Is.': '开曼群岛',
    'Faeroe Is.': '法罗群岛',
    'IsIe of Man': '马恩岛',
    Malta: '马耳他共和国',
    Jersey: '泽西',
    'Cape Verde': '佛得角共和国',
    'Turks and Caicos Is.': '特克斯和凯科斯群岛',
    'St. Vin. and Gren.': '圣文森特和格林纳丁斯'
}
var countryData //国家信息
var myRegions //地图样式
var country2id //国家id映射

$.getJSON('text3.json', function (data) {
    console.log("数据导入成功");
    countryData = data;
    dataInit();
    // var dataValue = dealWithData();
    // console.log(myRegions)
    option = {
        // 图表主标题
        title: {
        },
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: function (params) {
                console.log(1)
                if (params.name) {
                    return params.name + ' : ' + (isNaN(params.value) ? 0 : parseInt(params.value));
                }
            }
        },
        // 视觉映射组件
        visualMap: {

            type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
            show: false, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
            // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
            // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』

            // 文本样式
            textStyle: {
                fontSize: 14,
                color: '#fff'
            },
            realtime: false, // 拖拽时，是否实时更新
            calculable: false, // 是否显示拖拽用的手柄

        },

        geo: {

            map: "world",
            roam: true,// 一定要关闭拖拽
            // zoom: 1.23,  
            //   center: [105, 36], // 调整地图位置
            label: {
                normal: {
                    show: false, //关闭省份名展示
                    fontSize: "10",
                    color: "rgba(0,0,0,0.6)"
                },
                emphasis: {
                    show: false
                }
            },

            regions: myRegions,
            itemStyle: {
                normal: {
                    areaColor: "rgba(20, 41, 87,0.65)",
                    // borderColor: "#195BB9",
                    // borderWidth: 1, //设置外层边框
                    // shadowBlur: 5,
                    // shadowOffsetY: 8,
                    shadowOffsetX: 0,
                    // shadowColor: "#01012a"
                },
                emphasis: {
                    areaColor: "#2B91B7",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 5,
                    borderWidth: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        },
        series: [
        ]
    };
    myChart.setOption(option);

})


function dataInit() {
    country2id = {}
    for (let i = 0; i < countryData.length; i++) {
        let cnName = nameMap[countryData[i]["countryName"]]
        // console.log("cn:",nameMap[countryData[i]["countryName"]])
        country2id[cnName] = countryData[i]["id"]
    }
    // console.log(country2id)

    // 初始化option.geo.regions
    myRegions = []
    for (let i = 0; i < countryData.length; i++) {
        let myAreaColor = ""
        // 没有推特
        if (countryData[i].tState == 0)
            myAreaColor = noTwitter_color
        // 有推特但没关注
        // else if(countryData[i].tState==1)
        //     myAreaColor="0d0045"
        else
            myAreaColor = normal_color
        let tmp = {
            name: nameMap[countryData[i].countryName],
            itemStyle: {
                areaColor: myAreaColor
            }
        }
        myRegions.push(tmp)
        // console.log(countryData[i].id, tmp.name, countryData[i].tState)
    }
}


