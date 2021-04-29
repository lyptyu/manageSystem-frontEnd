<template>
  <div class="container">
    <div class="card2" id="card2"></div>
    <div class="card1" id="card1"></div>
    <div class="card3" id="card3"></div>
    <div class="card4" id="card4"></div>
  </div>
</template>

<script>
import {api_getDept, api_getExperience,api_getEducation,api_getSalary} from "@/utils/api/analyse/analyse_salary"
import {inject, onMounted} from "vue"

export default {
  name: "analyseSalary",
  setup() {
    let echarts = inject("ec")
    onMounted(async () => {
      const dept = await api_getDept();
      const deptInfo = dept.data.data.analyseSalaryDept
      const experience = await api_getExperience()
      const experienceInfo = experience.data.data.salaryList
      const education = await api_getEducation()
      const educationInfo=education.data.data.salaryList
      const salary = await api_getSalary()
      const salaryInfo = salary.data
      console.log("salary", salary)
      let chart1data = []
      Object.keys(deptInfo).map(val => {
        const name = val
        const value = deptInfo[val]
        chart1data.push({name, value})
      })
      console.log("chart1data", chart1data)
      let card1Chart = echarts.init(document.getElementById("card1"), "dark");
      card1Chart.setOption({
        backgroundColor: "#2c343c",
        tooltip: {
          trigger: "item"
        },
        legend: {
          top: "5%",
          left: "center"
        },
        series: [
          {
            name: "部门",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: chart1data
          }
        ]
      })
      let card2Chart = echarts.init(document.getElementById("card2"))
      var dataAxis = ["入门", "初级", "中级", "高级", "资深"];
      var chart2data = [0, 0, 0, 0, 0];
      var chart2num = [0, 0, 0, 0, 0]
      experienceInfo.map(val => {
        console.log(val.experience)
        const exp = val.experience
        if (0 <= exp && exp < 1) {
          chart2num[0]++
          chart2data[0]=(chart2data[0]+val.real)/chart2num[0]
        } else if (exp < 3) {
          chart2num[1]++
          chart2data[1]=(chart2data[1]+val.real)/chart2num[1]
        } else if (exp < 5) {
          chart2num[2]++
          chart2data[2]=(chart2data[2]+val.real)/chart2num[2]
        } else if (exp < 10) {
          chart2num[3]++
          chart2data[3]=(chart2data[3]+val.real)/chart2num[3]
        } else {
          chart2num[4]++
          chart2data[4]=(chart2data[4]+val.real)/chart2num[4]
        }
      })

      var yMax = 50;
      var dataShadow = [];

      for (var i = 0; i < chart2data.length; i++) {
        dataShadow.push(yMax);
      }


      card2Chart.setOption({
        title: {
          text: "不同工作经验工资图表",
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
              color: "#fff"
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
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            type: "bar",
            showBackground: true,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: "#55657e"},
                    {offset: 0.5, color: "#507696"},
                    {offset: 1, color: "#235a88"}
                  ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: "#2378f7"},
                      {offset: 0.7, color: "#2378f7"},
                      {offset: 1, color: "#83bff6"}
                    ]
                )
              }
            },
            data: chart2data
          }
        ]
      })


      let card3Chart = echarts.init(document.getElementById("card3"))
      var chart3data = [0, 0, 0, 0, 0];
      var chart3num = [0, 0, 0, 0, 0]
      educationInfo.map(val=>{
        if(val.education==='中专'){
          chart3num[0]++
          chart3data[0]=(chart3data[0]+val.real)/chart3num[0]
        }else if(val.education==='大专'){
          chart3num[1]++
          chart3data[1]=(chart3data[1]+val.real)/chart3num[1]
        }
        else if(val.education==='本科'){
          chart3num[2]++
          chart3data[2]=(chart3data[2]+val.real)/chart3num[2]
        }
        else if(val.education==='硕士'){
          chart3num[3]++
          chart3data[3]=(chart3data[3]+val.real)/chart3num[3]
        }
        else if(val.education==='博士'){
          chart3num[4]++
          chart3data[4]=(chart3data[4]+val.real)/chart3num[4]
        }
      })
      console.log('c3d',chart3data)
      const chart3final = [{
        name:'中专',value:chart3data[0]
      },{
        name:'大专',value:chart3data[1]
      },{
        name:'本科',value:chart3data[2]
      },{
        name:'硕士',value:chart3data[3]
      },{
        name:'博士',value:chart3data[4]
      }]
      card3Chart.setOption({
        backgroundColor: "#2c343c",

        title: {
          text: "不同学历工资图表",
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
          max: 35000,
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
            data: chart3final.sort(function (a, b) {
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
      })
      let card4Chart = echarts.init(document.getElementById("card4"))
      let card4data=[0,0,0,0,0,0,0]
      salaryInfo.map(val=>{
        if(0<=val&&val<5000){
          card4data[0]++
        }else if(val<10000){
          card4data[1]++
        }else if(val<15000){
          card4data[2]++
        }else if(val<20000){
          card4data[3]++
        }else if(val<25000){
          card4data[4]++
        }else if(val<30000){
          card4data[5]++
        }else{
          card4data[6]++
        }
      })
      card4Chart.setOption(  {
        title: {
          text: "员工工资分布图",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        xAxis: {
          type: 'category',
          data: ['0-5k', '5-10k', '10-15k', '15-20k', '20-25k', '25-30k', '30k+'],
          scale:true
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: card4data,
          type: 'bar'
        }]
      })
      window.onresize = function () {//自适应大小
        card1Chart.resize();
        card2Chart.resize()
      };

    })
  }
}
</script>

<style scoped>
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
  width: 45vw;
  height: 32vh;
  background: #2c343c;
  border-radius: 16px;
  margin-left: 1vw;
  margin-right: 2vw;

}

.card3 {
  padding: 15px;
  width: 20vw;
  height:35vh;
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