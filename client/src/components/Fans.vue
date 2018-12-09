<template>
  <div id="fans">
    <mu-appbar title="真正的粉丝"></mu-appbar>
    <div class="app-content">
      <div class="dimension">
        <mu-raised-button v-for="dimension in dimensions"
                          :key="dimension[0]"
                          @click.native="handleGet(dimension[0])"
                          :backgroundColor="bgColor(dimension[0])"
                          :label="dimension[1]" />
      </div>
      <mu-list>
        <mu-list-item v-for="f in fans"
                      :key="f.url_token"
                      :disableRipple="true"
                      :class="['fans', f.is_following ? '' : 'no-follow' ]">
          <div class="mu-item-title">
            <a :href="'https://www.zhihu.com/people/' + f.url_token"
               target="_blank">@{{f.name}}</a>
          </div>
          <div class="mu-item-data">
            <span>{{f.voted}} 点赞</span>
            <span>{{f.thanked}} 感谢</span>
            <span>{{f.follower_count}} 关注</span>
          </div>
        </mu-list-item>
      </mu-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fans: [],
      dimension: 'follower_count',
      dimensions: [
        ['follower_count', '关注量'],
        ['voted', '点赞'],
        ['thanked', '感谢']
      ]
    }
  },
  methods: {
    bgColor (dimension) {
      return this.dimension === dimension ? '#2196f3' : ''
    },
    handleGet (dimension) {
      this.dimension = dimension
      this.getMyFans()
    },
    getMyFans () {
      if (this.loadToken) return
      this.loadToken = true
      this.$api
        .getFans({
          query: {
            page: 1,
            size: 200
          },
          sort: {
            [this.dimension]: -1
          }
        })
        .then(rs => {
          if (rs.data.success) {
            this.loadToken = false
            this.fans = rs.data.data
          } else {
            window.alert(rs.data.msg)
          }
        })
        .finally(() => {
          this.loadToken = false
        })
    },
    buildFans () {
      this.$api.buildFans().then(rs => console.log(rs.data))
    },
    richFans () {
      this.$api.richFans()
    }
  },
  mounted () {
    this.getMyFans()
    // this.buildFans()
    // this.richFans()
  }
}
</script>

<style>
#fans .dimension {
  padding: 15px 10px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
}
.dimension .mu-raised-button {
  flex: 1;
  margin: 0 10px;
}
.fans .mu-item {
  border-bottom: 1px solid #f5f5f5;
}
.fans.no-follow .mu-item {
  /* border-color: #259; */
  background: #f5f8f5;
}
.fans .mu-item-title a {
  color: #259;
}
.fans .mu-item-content {
  display: flex;
}
.fans .mu-item-data span {
  margin-left: 20px;
}
</style>
