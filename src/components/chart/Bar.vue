<template>
  <div>
    <v-chart
      :height="height"
      :data="data"
      :scale="scale"
      :forceFit="true"
      :padding="['auto', 'auto', 'auto', '20']">
      <v-tooltip />
      <v-axis />
      <v-bar position="x*y"/>
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    height:{
      type: Number,
      default: 284
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    scale: {
      type: Array,
      default: () => {
        return [{
          dataKey: 'x',
          min: 2
        }, {
          dataKey: 'y',
          title: '时间',
          min: 1,
          max: 22
        }]
      }
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y
          })
        ]
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>
