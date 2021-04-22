<template>
  <div id="vm" class="pages" ref="pages">
    <div class="content" ref="table">
      <!--首列固定-->
      <div class="left-content">
        <div class="table-head">
          <table class="full-table">
            <thead>
              <tr v-for="header in tableHeader" :key="header">
                <th class="firstCol" v-for="(b,index) in header" :key="index" v-show="index === 0">
                  <p>{{b}}</p>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-left">
          <div class="table" ref="firstColLayer" >
            <table class="full-table">
              <tbody>
                <tr v-for="row in dataSheet" :key="row">
                    <td v-for="(c,index) in row" :key="index" v-show="index === 0">
                        <p>{{c}}</p>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="right-content" ref="right">
        <!--首行固定-->
        <div class="table-head" ref="firstRowLayer">
          <table class="full-table table-box">
            <thead>
              <tr v-for="header in tableHeader" :key="header">
                  <th v-for="(b,index) in header" :key="index" v-show="index!=0 && index!=1" style="width:101px">
                    <p>{{b}}</p>
                  </th>
              </tr>
            </thead>
          </table>
        </div>
          <!--正常表格内容(只有表格内容，没有表头和首列)-->
          <div class="table" style="overflow: auto" ref="tableContainer" @scroll="tableDivScroll($event)">
            <table class="content-table">
              <tbody ref="tbody">
                <tr v-for="row in dataSheet" :key="row">
                  <td v-for="(c,index) in row" :key="index" v-show="index!=0 && index!=1">
                    <p>{{c}}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import vue, { reactive, onMounted, toRefs, computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as pubMtd from '@/utils/publicMethods'
import _ from 'lodash'
export default {
  name: '',
  components: {
  },
  data() {
    return {
      table: null,
      dataSheet: {
        "data1": ['数据1', '数据1', '数据1', '数据1', '数据1', '数据1', '数据1', '数据1', '数据1', '数据1', '数据1', '数据1'],
        "data2": ['数据2', '数据2', '数据2', '数据2', '数据2', '数据2', '数据2', '数据2', '数据2', '数据2', '数据2', '数据2'],
        "data3": ['数据3', '数据3', '数据3', '数据3', '数据3', '数据3', '数据3', '数据3', '数据3', '数据3', '数据3', '数据3'],
        "data4": ['数据5', '数据5', '数据5', '数据5', '数据5', '数据5', '数据5', '数据5', '数据5', '数据5', '数据5', '数据5'],
        "data5": ['数据6', '数据6', '数据6', '数据6', '数据6', '数据6', '数据6', '数据6', '数据6', '数据6', '数据6', '数据6'],
        "data7": ['数据7', '数据7', '数据7', '数据7', '数据7', '数据7', '数据7', '数据7', '数据7', '数据7', '数据7', '数据7'],
        "data8": ['数据8', '数据8', '数据8', '数据8', '数据8', '数据8', '数据8', '数据8', '数据8', '数据8', '数据8', '数据8'],
        "data9": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
        "data10": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
        "data11": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
        "data12": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
        "data13": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
        "data14": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
        "data15": ['数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9', '数据9'],
      },
      tableHeader: {
        "data1": [
          '测试1', '测试2', '测试3', '测试4', '测试5', '测试6', '测试7', '测试8', '测试9', '测试10', '测试11', '测试12', '测试13', '测试14', '测试15'
        ],
      }
    }
  },
  mounted() {
    // document.body.style.overflow = 'hidden';
    const _this: any = this
    _this.autoResizeTable()
    window.addEventListener('resize', _this.resize)
  },
  unmounted() {
    const _this: any = this
    window.removeEventListener('resize', _this.resize)
  },
  methods: {
    autoResizeTable(){
      const _this: any = this
      _this.$refs.right.style.width = `${_this.$refs.table.offsetWidth - 105}px`; //这里的减107是减去左侧div宽度
    },
    tableDivScroll(event: any) {
      const _this: any = this
      const $target: any = _this.$refs.tableContainer
      const firstRowLayer: any = _this.$refs.firstRowLayer
      const firstColLayer: any = _this.$refs.firstColLayer
      // 首行固定
      firstRowLayer.scrollLeft = $target.scrollLeft
      // 首列固定
      firstColLayer.scrollTop = $target.scrollTop
    },
    resize() {
      const _this: any = this
      _this.autoResizeTable()
    }
  }
}
</script>

<style lang="stylus">
@import('./table.css');
</style>