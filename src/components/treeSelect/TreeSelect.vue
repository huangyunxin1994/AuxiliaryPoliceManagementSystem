<template>
  <a-tree-select
    :value="value"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="tree"
    :allowClear="allowClear"
    :replaceFields="replaceFields"
    :treeCheckStrictly="treeCheckStrictly"
    :multiple="multiple"
    :tree-checkable="checkable"
    placeholder="请选择组织"
    tree-default-expand-all
    :disabled="disabled"
    @change="change"
  >
  </a-tree-select>
</template>
<script>
import { mapGetters } from "vuex";
function filterArray(data) {
  data.forEach(function (item) {
    delete item.children;
  });
  var map = {};
  data.forEach(function (item) {
    map[item.id] = item;
  });
  var val = [];
  data.forEach(function (item) {
    var parent = map[item.parentId] || map[item.code];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      val.push(item);
    }
  });
  return val;
}
export default {
  props: {
    value:[String,Number],
    disabled:Boolean,
    keyName:String,
    labelName:String,
    defaultFun:{
      type: Boolean,
      default: true,
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    replaceFields: {
      type: Object,
      default() {
        return {
          children: "children",
          title: "name",
          key: "id",
          value: "id",
        };
      },
    },
    treeCheckStrictly: {
      type: Boolean,
      default: true,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tree: []
    };
  },
  mounted() {
    if(this.defaultFun){
        const oid = this.user.isSystem !==1 && this.user.organizationId || ""
        this.$api.organizationService.getOrganization({organizationId:oid}).then((res)=>{
            let tree = res.data.data.data
            tree.forEach(item => {
                item.scopedSlots = { title: "custom" }
            })
            this.tree = filterArray(res.data.data.data)
            // this.$emit("getTreeData",this.filterTree)
        })
    }
  },
  watch:{
    value(){
    }
  },
  methods: {
    change(value,label) {
      // 将组织id传出去
      let val = "";
      if (Array.isArray(value)) {
        value.map((i) => (val += i.value + ","));
        val = val.slice(0, val.length - 1);
      } else {
        val = value;
      }
      const params = {
          val:val,
          keyName:this.keyName,
          labelName:this.labelName&&this.labelName||"",
          label:label[0]
      }
      this.$emit("handleTreeChange", params);
    },
  },
  computed:{
    ...mapGetters("account", ["user"])
  }
};
</script>