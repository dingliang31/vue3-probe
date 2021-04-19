const area = {
  getProvinceList () { // 获取省列表
    return this.administrativeDivisionMaps.map((item) => {
      const { areaName = '', areaCode = '' } = item
      return {
        areaCode,
        areaName,
        parentCode: null
      }
    })
  },
  getCityListByProvinceCode (provinceCode) { // 获取市列表
    let list = this.administrativeDivisionMaps.find((item) => item.areaCode === provinceCode)
    list = list ? list.children.map((item) => {
      return {
        ...item,
        parentCode: provinceCode
      }
    }) : []
    return [ ...list ]
  },
  getDistrictListByCityCode (cityCode) { // 获取区县列表
    let list = []
    this.administrativeDivisionMaps.map(item => {
      if (item && item.children.length > 0) {
        const listStr = JSON.stringify(item.children)
        if (listStr.indexOf(cityCode) > -1) {
          const cityList = item.children.find(it => it.areaCode === cityCode) || { children: [] }
          cityList.children && cityList.children.length > 0 && cityList.children.map((it) => {
            it.parentCode = cityCode
          })
          list = [ ...cityList.children ]
        }
      }
    })
    return list
  },
  getProvinceNameByCode (code) {
    const list = [ ...this.administrativeDivisionMaps ]
    const obj = list.find((item) => item.areaCode === code)
    return obj ? obj.areaName : ''
  },
  getCityNameByCode (code) {
    const list = [ ...this.administrativeDivisionMaps ]
    let str = ''
    list.map(item => {
      if (item && item.children.length > 0) {
        const listStr = JSON.stringify(item.children)
        if (listStr.indexOf(code) > -1) {
          const cityList = item.children.find(it => it.areaCode === code)
          str = cityList ? cityList.areaName : ''
        }
      }
    })
    return str
  },
  getDirectoryNameByCode (code) {
    const list = [ ...this.administrativeDivisionMaps ]
    let str = ''
    list.map(item => {
      if (item && item.children.length > 0) {
        const listStr = JSON.stringify(item.children)
        if (listStr.indexOf(code) > -1) {
          item.children.map((it) => {
            if (it && it.children.length > 0) {
              const liststr = JSON.stringify(it.children)
              if (liststr.indexOf(code) > -1) {
                const directoryList = it.children.find(o => o.areaCode === code)
                str = directoryList ? directoryList.areaName : ''
              }
            }
          })
        }
      }
    })
    return str
  },
  getProvinceCodeByName (name) {
    const list = [ ...this.administrativeDivisionMaps ]
    const obj = list.find((item) => item.areaName === name)
    return obj ? obj.areaCode : ''
  },
  getCityCodeByName (name) {
    const list = [ ...this.administrativeDivisionMaps ]
    let str = ''
    list.map(item => {
      if (item && item.children.length > 0) {
        const listStr = JSON.stringify(item.children)
        if (listStr.indexOf(name) > -1) {
          const cityList = item.children.find(it => it.areaName === name)
          str = cityList ? cityList.areaCode : ''
        }
      }
    })
    return str
  },
  getDirectoryCodeByName (name) { // 区可能重名
    const list = [ ...this.administrativeDivisionMaps ]
    let str = ''
    list.map(item => {
      if (item && item.children.length > 0) {
        const listStr = JSON.stringify(item.children)
        if (listStr.indexOf(name) > -1) {
          item.children.map((it) => {
            if (it && it.children.length > 0) {
              const liststr = JSON.stringify(it.children)
              if (liststr.indexOf(name) > -1) {
                const directoryList = it.children.find(o => o.areaName === name)
                str = directoryList ? directoryList.areaCode : ''
              }
            }
          })
        }
      }
    })
    return str
  }
}