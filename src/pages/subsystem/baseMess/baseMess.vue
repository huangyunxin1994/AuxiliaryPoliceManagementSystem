<template>
    <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
        <a-card :bordered="true"></a-card>
        <a-card :bordered="true"></a-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
export default {
    components:{
        STable
    },
    data(){
        return{

        }
    },
    methods:{

    },
    computed: {
    ...mapState("setting", ["pageMinHeight"]),
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
}
</script>

<style lang="less" scoped>
    @import "../index";
</style>