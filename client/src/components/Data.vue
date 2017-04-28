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
// import moment from 'moment'
export default {
  props: ['title'],
  data () {
    return {
      lineConfig: {
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'round',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointRadius: 0
      },
      question: {},
      qData: []
    }
  },
  methods: {
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
      const f = []
      const a = []
      const r = []
      this.qData.forEach((d, k) => {
        // if (k % 3 === 0) {
        //   labels.push(moment(d.createTime).format('h:mm'))
        // }
        // labels.push(moment(d.createTime).format('MMM YYYY'))
        labels.push(d.createTime)
        f.push(d.followers)
        a.push(d.answers)
        r.push(d.readers)
      })
      const data = {
        labels: labels,
        datasets: [
          this.getFollowers(f),
          this.getAnswers(a),
          this.getReaders(r)
        ]
      }
      new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          scales: {
            yAxes: [{
              // stacked: true
            }],
            xAxes: [{
              time: {
                unit: 'hour'
              },
              type: 'time'
            }]
          }
        }
      })
      // window.console.log(c)
    },
    renderFollows (data) {

    },
    getFollowers (data) {
      const d = {
        data,
        label: '关注人数',
        ...this.lineConfig
      }
      d.borderColor = 'rgba(66,165,245,1)'
      d.backgroundColor = 'rgba(66,165,245,0.4)'
      return d
    },
    getAnswers (data) {
      const d = {
        data,
        label: '回答人数',
        ...this.lineConfig
      }
      d.borderColor = 'rgba(255,167,38,1)'
      d.backgroundColor = 'rgba(255,167,38,0.4)'
      return d
    },
    getReaders (data) {
      const d = {
        data,
        label: '阅读人数',
        ...this.lineConfig
      }
      return d
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style>
/*.data-page .mu-appbar-title {
  white-space: normal;
}*/
#chart-box {
  padding: 10px 20px;
}
</style>
