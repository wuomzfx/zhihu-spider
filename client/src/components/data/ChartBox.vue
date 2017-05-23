<template>
  <div id="chart-box">
    <canvas id="chart-number" width="375" height="400"></canvas>
    <canvas id="chart-increment" width="375" height="400"></canvas>
    <canvas id="chart-rate" width="375" height="400"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import moment from 'moment'
export default {
  props: {
    data: Array
  },
  data () {
    return {
      color: {
        readers: '75,192,192', // 绿色
        answers: '30,150,243', // 蓝色
        followers: '255,167,38' // 橙色
      },
      labels: [], // 时间横坐标
      dimension: ['readers', 'answers', 'followers'],
      chartsName: ['number', 'increment', 'rate'],
      chartData: {}
    }
  },
  computed: {
    dataLength () {
      return this.data.length - 1
    }
  },
  methods: {
    initChartData () {
      this.chartsName.forEach(name => {
        this.chartData[name] = {
          readers: [],
          answers: [],
          followers: []
        }
      })
    },
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
    getIncrement (dimension, index) {
      if (index === 0) {
        return 0
      }
      return this.data[dimension]
    },
    buildData () {
      const material = this.data
      material.forEach((d, k) => {
        this.labels.push(d.createTime)
        this.dimension.forEach(f => {
          this.chartData.number[f].push(d[f])
          if (k === this.dataLength) {
            this.chartData.increment[f].push(0)
            this.chartData.rate[f].push(0)
          } else {
            const prevData = material[k + 1]
            const increment = d[f] - prevData[f]
            // const interval = (moment(d.createTime).toDate() - moment(prevData.createTime).toDate()) / 1000 / 60 / 60
            this.chartData.increment[f].push(increment)
            this.chartData.rate[f].push((increment / prevData[f] * 100).toFixed(2))
          }
        })
      })
      this.chartsName.forEach(name => {
        this.chartData[name] = this.dimension.map(f => {
          return this.getLineConfig(f, this.chartData[name][f])
        })
      })
    },
    render (datasets, name) {
      const ctx = document.getElementById(`chart-${name}`)
      const data = {
        labels: this.labels,
        datasets: datasets
      }
      new Chart(ctx, {
        type: 'line',
        data: data,
        options: this.buildChartOption(this.dimension, name)
      })
    },
    renderChart () {
      for (const name in this.chartData) {
        this.render(this.chartData[name], name)
      }
    },
    buildChartOption (fields, boxName) {
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
          intersect: true
        },
        hover: {
          mode: 'nearest',
          intersect: false
        },
        title: {
          display: true,
          padding: 20,
          text: boxName
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
    this.initChartData()
    this.buildData()
    this.renderChart()
  }
}
</script>

<style>
#chart-box {
  padding: 10px;
}
</style>
