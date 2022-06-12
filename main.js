// 定义颜色
var noTwitter_color = 'gray';
var normal_color = 'rgba(0,191,255,1)';
var selected_color = '#7b68ee';
var follow_color = 'rgb(216,82,19)';
var follower_color = 'rgb(242,194,0)';
var mutualfollow_color = 'rgb(9,212,163)';

// 设置图例颜色
document.getElementById('selected').style['background-color'] = selected_color;
document.getElementById('follow').style['background-color'] = follow_color;
document.getElementById('follower').style['background-color'] = follower_color;
document.getElementById('mutualfollow').style['background-color'] = mutualfollow_color;
document.getElementById('noTwitter').style['background-color'] = noTwitter_color;

// 设置图例是否显示
var visual = [true, true, true, true]  // 关注、被关注、互关、无推特
var visualId = ['followText', 'followerText', 'mutualfollowText', 'noTwitterText']

function disableVisual(id) {
    if (visual[id]) {
        visual[id] = !visual[id]
        document.getElementById(visualId[id]).style['text-decoration'] = 'line-through'
        document.getElementById(visualId[id]).style['color'] = 'gray'
        resetOption()
        setOption(selectedId)
    }
    else {
        visual[id] = !visual[id]
        document.getElementById(visualId[id]).style['text-decoration'] = 'none'
        document.getElementById(visualId[id]).style['color'] = 'rgb(15, 248, 251)'
        resetOption()
        setOption(selectedId)
    }


}

// 标记目前是2d图还是3d图
var mapType = '2d'

var myChart = echarts.init(document.getElementById('world'));
bindClick()
var option;
var selectedId = -1;

// 点击国家后显示该国信息
function bindClick() {
    myChart.on('click', function (params) {
        console.log('点击', params.name);
        // console.log(option.geo.regions[0].itemStyle.areaColor, option.geo.zoom, option.geo.center)
        let id = country2id[params.name];
        console.log("id", id);
        selectedId = id - 1;
        // excel编号从1开始了
        setOption(selectedId);
        if (countryData[selectedId].tState == 0) {
            document.getElementById('notice1').hidden = false
            document.getElementById('notice2').hidden = false
            document.getElementById('pie').hidden = true
            document.getElementById('bar').hidden = true

        }
        else {

            document.getElementById('notice1').hidden = true
            document.getElementById('notice2').hidden = true
            document.getElementById('pie').hidden = false
            document.getElementById('bar').hidden = false

            drawPie(selectedId);
            drawBar(selectedId);
        }
    })
}


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
    if (id != -1) {
        resetOption()
        console.log(option.geo.regions[id])

        let country = countryData[id]

        document.getElementById('countryName').innerHTML = country.countryName
        document.getElementById('twitter').innerHTML = country.twitter
        document.getElementById('name').innerHTML = country.name
        document.getElementById('position').innerHTML = country.position
        document.getElementById('flag').src = country.flagUrl
        document.getElementById('no').innerHTML = '影响力排名：' + country.no
        document.getElementById('eigc').innerHTML = 'EIGC：' + country.eigc



        // 设置新的地图颜色

        // 由于id从0开始，每个索引需要-1
        // 该国家关注的国家变红
        if (visual[0]) {
            for (let i in country.follow) {
                // console.log("follow:", country.follow[i])
                // print("tar",country.follow[i])
                option.geo.regions[country.follow[i] - 1].itemStyle.areaColor = follow_color;
            }
        }
        else {
            for (let i in country.follow) {
                option.geo.regions[country.follow[i] - 1].itemStyle.areaColor = normal_color;
            }
        }
        // 关注该国家的国家变黄
        if (visual[1]) {
            for (let i in country.follower) {
                option.geo.regions[country.follower[i] - 1].itemStyle.areaColor = follower_color;
            }
        }
        else {
            for (let i in country.follower) {
                option.geo.regions[country.follower[i] - 1].itemStyle.areaColor = normal_color;
            }
        }

        // 互关国家变粉
        if (visual[2]) {
            for (let i in country.mutualFollower) {
                option.geo.regions[country.mutualFollower[i] - 1].itemStyle.areaColor = mutualfollow_color;
            }
        }
        else {
            for (let i in country.mutualFollower) {
                option.geo.regions[country.mutualFollower[i] - 1].itemStyle.areaColor = mutualfollow_color;
            }
        }

        // 无推特国家变黑
        if (visual[3]) {
            for (let i in option.geo.regions) {
                if (option.geo.regions[i].name != 'graticule') {
                    // console.log(countryData[country2id[(option.geo.regions[i].name)] - 1])
                    if (countryData[country2id[option.geo.regions[i].name] - 1].tState == 0) {
                        option.geo.regions[i].itemStyle.areaColor = noTwitter_color
                    }
                }


            }
        }

        // 该国变绿
        option.geo.regions[id].itemStyle.areaColor = selected_color;
        myChart.setOption(option)
    }
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
// var myRegions //地图样式
var country2id //国家id映射

$.getJSON('text3.json', function (data) {
    console.log("数据导入成功");
    countryData = data;

    draw2D()
    // draw3D()
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
    let myRegions = []
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
    console.log('初始化',myRegions)
    return myRegions

}

// 绘制饼图
function drawPie(id) {
    var pieChart = echarts.init(document.getElementById('pie'))
    console.log(countryData[id], countryData[id].follow.length)
    let color0 = 'rgba(255,255,255,0.8)'
    let pieData = [
        {
            value: countryData[id].follow.length == 0 ? null : countryData[id].follow.length,
            name: "关注数",
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,  //右
                    y: 0,  //下
                    x2: 1,  //左
                    y2: 0,  //上
                    colorStops: [
                        {
                            offset: 0,
                            color: color0 // 0% 处的颜色
                        },

                        {
                            offset: 1,
                            color: follow_color // 100% 处的颜色
                        }
                    ]
                }

            }
        },
        {
            value: countryData[id].follower.length == 0 ? null : countryData[id].follower.length,
            name: "被关注数",
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,  //右
                    y: 0,  //下
                    x2: 1,  //左
                    y2: 0,  //上
                    colorStops: [
                        {
                            offset: 0,
                            color: color0 // 0% 处的颜色
                        },

                        {
                            offset: 1,
                            color: follower_color // 100% 处的颜色
                        }
                    ]
                }
            }
        },
        {
            value: countryData[id].mutualFollower.length == 0 ? null : countryData[id].mutualFollower.length,
            name: "互关数",
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,  //右
                    y: 0,  //下
                    x2: 1,  //左
                    y2: 0,  //上
                    colorStops: [
                        {
                            offset: 0,
                            color: color0 // 0% 处的颜色
                        },

                        {
                            offset: 1,
                            color: mutualfollow_color // 100% 处的颜色
                        }
                    ]
                }
            }
        },
    ]
    let optionPie = {
        tooltip: {
            trigger: 'item'
        },
        // legend: {
        //     orient: 'vertical',
        //     left: 'left'
        //   },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    // borderRadius: 4,
                    borderColor: 'rgb(8,14,60)',
                    borderWidth: 5
                },
                label: {
                    show: true,
                    position: 'inner',
                    color: 'black'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    pieChart.setOption(optionPie)
}

function drawBar(id) {
    var barChart = echarts.init(document.getElementById('bar'))

    // 计算各州的关注、被关注、互关数
    let continent2index = {
        'Africa': 0,
        'South Africa': 1,
        'Asia': 2,
        'Europe': 3,
        'North America': 4,
        'South America': 5,
        'Oceania': 6
    }
    // 各洲统计数据
    // let barData = countryData[id].eigcContinent
    let barOption = {
        xAxis: {
            type: 'category',
            data: [
                '非洲',
                '亚洲',
                '欧洲',
                '北美',
                '南美',
                '大洋洲'
            ],
            axisLabel: {
                interval: 0,
                // rotate: 30
            }
        },
        yAxis: {
            type: 'value'
        },

        textStyle: {
            color: 'white'
        },

        series: [
            {
                data: countryData[id].eigcContinent,
                // data:[1,2,3,4,5,6,7],
                type: 'bar',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,  //右
                        y: 1,  //下
                        x2: 0,  //左
                        y2: 0,  //上
                        colorStops: [
                            {
                                offset: 0,
                                color: '#2e3192' // 0% 处的颜色
                            },

                            {
                                offset: 1,
                                color: '#1bffff' // 100% 处的颜色
                            }
                        ]
                    }
                },
                barWidth: '60%',

            }
        ]
    }
    barChart.setOption(barOption)

}

function draw2D() {
    mapType = '2d'
    let myRegions = dataInit();
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
            roam: true,
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
                    areaColor: "rgba(65,105,225)",
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
    console.log(myRegions)
    myChart.setOption(option);
}
var app = {};
var xRotate = 0;
var projection;
function draw3D() {

    mapType = '3d'
    // myChart = echarts.init(document.getElementById('world'), null, {
    //     renderer: 'canvas',
    //     useDirtyRect: false
    //   });
    let myRegions = dataInit()

    $.when(
        $.get('echarts/3dworld.json'),
        $.getScript('d3-array.js'),
        $.getScript('d3-geo.js')
    ).done(function (res) {
        // console.log(res)

        // 中文名映射
        // for (let i in res[0].features) {
        //     res[0].features[i].properties.name = nameMap[res[0].features[i].properties.name]
        // }
        // myChart.hideLoading();
        // Add graticule
        const graticuleLineStrings = [];
        for (let lat = -80; lat <= 80; lat += 10) {
            graticuleLineStrings.push(createLineString([-180, lat], [180, lat]));
        }
        for (let lng = -180; lng <= 180; lng += 10) {
            graticuleLineStrings.push(createLineString([lng, -80], [lng, 80]));
        }
        res[0].features.unshift({
            geometry: {
                type: 'MultiLineString',
                coordinates: graticuleLineStrings
            },
            properties: {
                name: 'graticule'
            }
        });
        echarts.registerMap('world', res[0]);
        projection = d3.geoOrthographic();

        // myRegions = []
        // for (let i = 0; i < countryData.length; i++) {
        //     let myAreaColor = ""
        //     // 没有推特
        //     if (countryData[i].tState == 0)
        //         myAreaColor = noTwitter_color
        //     // 有推特但没关注
        //     // else if(countryData[i].tState==1)
        //     //     myAreaColor="0d0045"
        //     else
        //         myAreaColor = normal_color
        //     let tmp = {
        //         name: nameMap[countryData[i].countryName],
        //         itemStyle: {
        //             areaColor: myAreaColor
        //         }
        //     }
        //     myRegions.push(tmp)
        // }
        // myRegions.push({
        //     name: 'graticule',
        //     itemStyle: {
        //         borderColor: '#bbb'
        //     },
        //     emphasis: {
        //         disabled: true
        //     }
        // })
        // console.log(myRegions)
        option = {
            tooltip: {},
            geo: {
                map: 'world',
                projection: {
                    project: (pt) => projection(pt),
                    unproject: (pt) => projection.invert(pt),
                    stream: projection.stream
                },
                itemStyle: {
                    borderColor: '#333',
                    borderWidth: 1,
                    borderJoin: 'round',
                    color: '#000'
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        color: 'skyblue'
                    }
                },
                regions: myRegions
            }
        };
        myChart.setOption(option);
    });

    app.config = {
        rotateX: 100,
        rotateY: 50,
        onChange() {
            projection && projection.rotate([app.config.rotateX, app.config.rotateY]);
            myChart.setOption({
                geo: {}
            });
        }
    };
    app.configParameters = {
        rotateX: {
            min: -180,
            max: 180
        },
        rotateY: {
            min: -80,
            max: 80
        }
    };
    function rotation() {
        setTimeout(() => {
            xRotate += 0.1
            projection.rotate([xRotate, 0])
            myChart.setOption({
                geo: {}
            });
            console.log(xRotate)
            rotation()
        }, 5);
    }
    // rotation()
    function createLineString(start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const segs = 50;
        const stepX = dx / segs;
        const stepY = dy / segs;
        const points = [];
        // TODO needs adaptive sampling on the -180 / 180 of azimuthal projections.
        for (let i = 0; i <= segs; i++) {
            points.push([start[0] + i * stepX, start[1] + i * stepY]);
        }
        return points;
    }

}
var flag = 0
setInterval(() => {
    if (flag != 0) {
        xRotate += flag
        projection.rotate([xRotate, 0])
        myChart.setOption({
            geo: {}
        });
    }
}, 10);
function toleft() {
    console.log('鼠标按下')
    flag = -1


}
function endleft() {
    console.log('鼠标放开')

    flag = 0
}
function toright() {
    console.log('鼠标按下')
    flag = 1


}
function endright() {
    console.log('鼠标放开')

    flag = 0
}

function changeMapType() {
    if (mapType == '2d') {
        document.getElementsByTagName('body')[0].style['background'] = "url('images//bg1.jpg')"
        document.getElementsByTagName('body')[0].style['background-size'] = "100%"
        myChart.dispose()
        myChart = echarts.init(document.getElementById('world'));
        bindClick()
        draw3D()
    }
    else if (mapType == '3d') {
        document.getElementsByTagName('body')[0].style['background'] = "url('images//bg.jpg')no-repeat"
        document.getElementsByTagName('body')[0].style['background-size'] = "100%"
        myChart.dispose()
        myChart = echarts.init(document.getElementById('world'));
        bindClick()
        draw2D()
    }
}