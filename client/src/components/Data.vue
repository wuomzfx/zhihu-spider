<template>
  <div class="data-page">
    <mu-appbar :title="question.title"></mu-appbar>
    <div id="chart-box">
      <canvas id="chart" width="375" height="400"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import moment from 'moment'
export default {
  props: ['title'],
  data () {
    return {
      question: {},
      qData: [],
      color: {
        readers: '75,192,192', // 绿色
        answers: '30,150,243', // 蓝色
        followers: '255,167,38' // 橙色
      }
    }
  },
  methods: {
    getLineConfig (label, data) {
      this.colorIdx ++
      return {
        label: label,
        data: data,
        fill: false,
        lineTenstion: 0.4,
        backgroundColor: `rgba(${this.color[label]},0.4)`,
        borderColor: `rgba(${this.color[label]},1)`,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        spanGaps: false,
        yAxisID: label,
        pointRadius: 0
        // pointBorderColor: 'rgba(75,192,192,1)',
        // pointBackgroundColor: '#fff'
      }
    },
    getData () {
      this.$api.questionData(this.$route.params.qid).then(rs => {
        this.question = rs.data.question
        this.qData = rs.data.data
        this.renderData()
      })
    },
    renderData () {
      const ctx = document.getElementById('chart')
      const labels = []
      const fieldData = {
        readers: [],
        answers: [],
        followers: []
      }
      const fields = Object.keys(fieldData)
      this.qData.forEach((d, k) => {
        labels.push(d.createTime)
        fields.forEach(f => {
          fieldData[f].push(d[f])
        })
      })
      const datasets = fields.map(f => {
        return this.getLineConfig(f, fieldData[f])
      })
      const data = {
        labels: labels,
        datasets: datasets
      }
      new Chart(ctx, {
        type: 'line',
        data: data,
        options: this.buildChartOption(fields)
      })
    },
    buildChartOption (fields) {
      const yAxes = fields.map(id => {
        const config = {
          display: true,
          // stacked: true,
          scaleLabel: {
            position: top,
            display: true
          },
          id: id,
          ticks: {
            fontColor: `rgb(${this.color[id]})`
          }
        }
        if (id === 'answers') {
          config.position = 'right'
          config.gridLines = {
            display: false
          }
        }
        if (id === 'readers') {
          config.display = false
        }
        return config
      })
      return {
        // responsiveAnimationDuration: 300,
        tooltips: {
          mode: 'index',
          callbacks: {
            title: function (item) {
              return moment(item[0].xLabel).format('YYYY-MM-DD HH:mm')
            }
          },
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        title: {
          display: true,
          padding: 20,
          text: '数据图'
        },
        legend: {
          labels: {
            padding: 25,
            usePointStyle: true
          },
          position: 'bottom'
        },
        scales: {
          yAxes: yAxes,
          xAxes: [{
            time: {
              // unit: 'hour',
              displayFormats: {
                minute: 'HH:mm',
                hour: 'HH:mm',
                day: 'ddd'
              }
            },
            type: 'time'
          }]
        }
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style>
#chart-box {
  padding: 10px;
}
</style>
