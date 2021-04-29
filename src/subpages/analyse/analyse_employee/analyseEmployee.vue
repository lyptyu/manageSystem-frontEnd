<template>
  <div class="container">
    <div class="card3" id="card3"></div>
    <div class="card1" id="card1"></div>
    <div class="card2" id="card2"></div>

    <div class="card4" id="card4"></div>
  </div>
</template>

<script>

import {inject, onMounted} from "vue"
import {api_getEducation, api_getGender, api_getDept,api_getExperience} from "@/utils/api/analyse/analyse_employee"


export default {
  name: "analyseDept",
  setup() {
    let echarts = inject("ec")

    onMounted(async () => {
      const education = await api_getEducation();
      const educationInfo = education.data
      const gender = await api_getGender()
      const genderInfo = gender.data
      const dept = await api_getDept()
      const deptInfo = dept.data
      const experience = await  api_getExperience()
      const experienceInfo = experience.data
      console.log("experienceInfo", experienceInfo)
      let card1Chart = echarts.init(document.getElementById("card1"));
      card1Chart.setOption({
        backgroundColor: "#2c343c",

        title: {
          text: "职工学历分析图表",
          left: "center",
          top: 5,
          textStyle: {
            color: "#ccc"
          }
        },

        tooltip: {
          trigger: "item"
        },

        visualMap: {
          show: false,
          min: 0,
          max: 10,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "学历",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              {value: educationInfo.zhongzhuan, name: "中专"},
              {value: educationInfo.dazhuan, name: "大专"},
              {value: educationInfo.benke, name: "本科"},
              {value: educationInfo.shuoshi, name: "硕士"},
              {value: educationInfo.boshi, name: "博士"}
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              color: "rgba(255, 255, 255, 0.3)"
            },
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)"
              },
              smooth: 0.2,
              length: 1,
              length2: 1
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 1,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      });
      let card2Chart = echarts.init(document.getElementById("card2"));
      card2Chart.setOption({

        title: {
          text: "职工性别分析图表",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        yAxis: {
          type: "category",
          data: ["男", "女"]
        },
        xAxis: {
          type: "value"
        },
        series: [{
          data: [genderInfo.male, {
            value: genderInfo.female,
            itemStyle: {
              color: "#a90000"
            }
          }],
          type: "bar"
        }]
      })
      let card3Chart = echarts.init(document.getElementById("card3"));
      let deptData = []
      Object.keys(deptInfo).map(val => {
        let obj = {
          name: val,
          value: deptInfo[val]
        }
        deptData.push(obj)
      })
      card3Chart.setOption({
        title: {
          text: "职工部门分布",
          left: "center",

          textStyle: {
            color: "#ccc"
          }
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            data: deptData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      })
      let card4Chart = echarts.init(document.getElementById("card4"));
      var dataAxis = ['入门', '初级', '中级', '高级', '资深'];
      var data = [0, 0, 0, 0, 0];
      Object.keys(experienceInfo).map(val=>{
        switch (val){
          case 'zero2one':
            data[0]=experienceInfo[val];
            break;
          case 'one2three':
            data[1]=experienceInfo[val];
            break;
          case 'three2five':
            data[2]=experienceInfo[val];
            break;
          case 'five2ten':
            data[3]=experienceInfo[val];
            break;
          case 'ten2more':
            data[4]=experienceInfo[val];
            break;
        }
      })
      var yMax = 50;
      var dataShadow = [];

      for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
      }

      card4Chart.setOption({
        title: {
          text: "职工工作经验分析图表",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            type: 'bar',
            showBackground: true,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#55657e'},
                    {offset: 0.5, color: '#507696'},
                    {offset: 1, color: '#235a88'}
                  ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#2378f7'},
                      {offset: 0.7, color: '#2378f7'},
                      {offset: 1, color: '#83bff6'}
                    ]
                )
              }
            },
            data: data
          }
        ]
      })
      window.onresize = function () {//自适应大小
        card1Chart.resize();
        card2Chart.resize()
        card3Chart.resize()
        card4Chart.resize()
      };


    })
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}


.card1 {
  padding: 15px;
  width: 20vw;
  height: 35vh;
  background: #2c343c;
  border-radius: 16px;
  margin-left: 1vw;
  margin-right: 2vw;
  margin-top: 3vh;
}


.card2 {
  padding: 15px;
  width: 20vw;
  height:35vh;
  background: #2c343c;
  border-radius: 16px;
  margin-left: 1vw;
  margin-right: 2vw;
}

.card3 {
  padding: 15px;
  width: 45vw;
  height: 32vh;
  background: #2c343c;
  border-radius: 16px;
  margin-left: 1vw;
  margin-right: 2vw;
}
.card4 {
  padding: 15px;
  width: 45vw;
  height: 32vh;
  background-color:  #2c343c;
  border-radius: 16px;
  margin-left: 1vw;
  margin-right: 2vw;
  margin-top: 3vh;
}
</style>