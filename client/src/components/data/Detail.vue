<template>
  <div class="detail-data">
      <h3>平均每小时数据</h3>
      <mu-table :showCheckbox="false">
        <mu-thead>
          <mu-th>维度</mu-th>
          <mu-th>平均增长量</mu-th>
          <mu-th>平均增长率 %</mu-th>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="(d, k) in rates" :key="k">
            <mu-td v-for="(v, i) in d" :key="k">{{v}}</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    data: Array
  },
  computed: {
    rates () {
      return this.getRates(['answers', 'followers', 'readers'], this.data)
    }
  },
  data () {
    return {
      dayInterval: 1000 * 60 * 60
    }
  },
  methods: {
    getRates (keys, data) {
      const first = data[data.length - 1]
      const last = data[0]
      const median = data[parseInt(data.length / 2)]
      const interval = (moment(last.createTime) - moment(first.createTime)) / this.dayInterval
      return keys.map(k => {
        const increment = ((last[k] - first[k]) / interval).toFixed(2)
        const rate = (increment / median[k] * 100).toFixed(2)
        return [
          k,
          increment,
          rate
        ]
      })
    }
  }
}
</script>

<style scoped>
.detail-data {
  padding: 0 20px;
  margin: 40px 0;
}
h3 {
  text-align: center;
}
</style>
