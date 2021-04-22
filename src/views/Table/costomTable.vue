<template>
  <div id="vm" class="pages" ref="cover">
    <div class="content" ref="tableDiv">
      <!--首列固定-->
      <div class="left-content">
        <div class="table-head">
          <table class="full-table">
            <thead>
              <tr v-for="header in tableHeader" :key="header">
                <th class="firstCol" v-for="(b,index) in header" :key="index" v-show="index === 0 || index === 1">
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
                    <td v-for="(c,index) in row" :key="index" v-show="index === 0 || index === 1">
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
import vue, { reactive, onMounted, onUnmounted, toRefs, computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as pubMtd from '@/utils/publicMethods'
import _ from 'lodash'
export default {
  name: 'costomTable',
  setup() {
    const table: any = reactive({
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
      },
      cover: null,
      tableDiv: null,
      firstColLayer: null,
      right: null,
      firstRowLayer: null,
      tableContainer: null,
      tbody: null,
      autoResizeTable() {
        table.right && (table.right.style.width = `${table.tableDiv.offsetWidth - 210}px`)
      },
      tableDivScroll(event: any) {
        console.log(table)
        const $target: any = table.tableContainer
        // 首行固定
        table.firstRowLayer.scrollLeft = $target.scrollLeft
        // 首列固定
        table.firstColLayer.scrollTop = $target.scrollTop
      }
    })
    onMounted(() => {
      table.autoResizeTable()
      window.addEventListener('resize', resize)
    })
    onUnmounted(() => {
      table.autoResizeTable()
      window.removeEventListener('resize', resize)
    })
    const resize: any = () => {
      table.autoResizeTable()
    }
    const tableRef: any = toRefs(table)
    return {
      ...tableRef
    }
  }
}
</script>

<style lang="stylus">
@import('./table.css');
</style>