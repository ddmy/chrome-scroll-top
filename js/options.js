let ipt = document.querySelector('#url')
let sub = document.querySelector('.sub')
let reg = document.querySelector('#reg')
console.log('options-js加载成功')

let set, optionsList, btnSet, tabs, btnSub, btnIpts
let optionsData = {
  // 规则数组
  rule: [],
  // 按钮样式
  btnSty: {
    text: '返回顶部',
    backgroundImage: '',
    backgroundColor: '#369',
    borderRadius: '6px',
    opacity: '0.8',
    color: '#fff'
  }
}
let deepBtnStyDefault = JSON.parse(JSON.stringify(optionsData.btnSty))

initTab()
bindTabClick()
bindBtnStyl()
getOptions()
bindDelOptions()
bindAddOptions()
initOptionsListDom()

// 初始化tab
function initTab () {
  set = document.querySelector('.setting')
  optionsList = document.querySelector('.options-list')
  btnSet = document.querySelector('.btn-styl')
  tabs = document.querySelectorAll('.table a')
  btnSub = document.querySelector('.btn-styl .btn-sub')
  btnIpts = document.querySelectorAll('.btn-styl input')
}
// 绑定添加规则事件
function bindAddOptions () {
  sub.addEventListener('click', () => {
    if (ipt.value) {
      // 读取数据，第一个参数是指定要读取的key以及设置默认值
      let value = ipt.value
      if (reg.checked) {
        value = {
          type: 'reg',
          value: value
        }
        reg.checked = false
      }
      optionsData.rule.push(value)
      // 保存数据
      chrome.storage.sync.set({'to-top': JSON.stringify(optionsData.rule)}, function() {
          msg('添加成功', 'success')
          initOptionsListDom()
          ipt.value = ''
      })
    } else {
      msg('不能为空')
    }
  })
}
// 按钮样式添加绑定事件
function bindBtnStyl () {
  btnSub.addEventListener('click', () => {
    [...btnIpts].forEach(v => {
      let key = findOptionsKeys(v.name, 'ipt')
      if (key && v.value.trim()) {
        optionsData.btnSty[key] = v.value.trim()
      }
    })
    optionsData.btnSty = {
      ...deepBtnStyDefault,
      ...optionsData.btnSty
    }
    console.log('保存', optionsData.btnSty)
    // 保存数据
    chrome.storage.sync.set({btnSty: optionsData.btnSty}, function() {
      msg('添加成功, 刷新页面生效', 'success')
    })
  })
}
// tabs 绑定点击事件
function bindTabClick () {
  [...tabs].forEach((v, i) => {
    v.removeEventListener('click', tabClick)
    v.addEventListener('click', tabClick)
  })
}
// tab 点击事件
function tabClick () {
  let clickIndex = this.dataset.index
  // table内容
  let tabInnerArr = [set, optionsList, btnSet]
  tabInnerArr.forEach(v => v.style.display = 'none')
  ;[...tabs].forEach(item => {
    item.className = ''
    if (item === this) {
      item.className = 'active'
    }
    tabInnerArr[clickIndex].style.display = 'block'

  })
  initOptionsListDom()
}
// 获取当前配置
function getOptions () {
  // 获取当前的本地配置信息
  chrome.storage.sync.get({'to-top': '[]', btnSty: optionsData.btnSty}, function(items) {
    optionsData.rule = JSON.parse(items['to-top'])
    optionsData.btnSty = items.btnSty
    console.log('getOptions当前配置', optionsData)
    // 初始化新的规则列表
    initOptionsListDom()
    // 初始化按钮样式配置信息
    initBtnStylOptions()
  }) 
}
// 初始化配置信息列表
function initOptionsListDom () {
  if (!Array.isArray(optionsData.rule)) return
  // 应用规则列表
  let str = optionsData.rule.map((v, i) => {
    let type = Object.prototype.toString.call(v)
    let indexStr = `<span style="font-weight: 500;">${i}:</span>`
    if (type === '[object String]') {
      return `<p>${indexStr}  ${v}    <a href="javascript:;" data-index="${i}">删除</a></p>`
    } else if (type === '[object Object]' && v.type === 'reg') {
      return `<p>${indexStr}  正则: ${v.value}    <a href="javascript:;" data-index="${i}">删除</a></p>`
    }
  }).join('')
  str = `<h1>配置列表</h1>${str}`
  optionsList.innerHTML = str
}
// 初始化按钮配置信息
function initBtnStylOptions () {
  // 把当前的配置信息填充到inout中做为默认值
  let keys = Object.keys(optionsData.btnSty)
  keys.forEach(v => {
    let name = findOptionsKeys(v, 'opt')
    if (name) {
      [...btnIpts].forEach(ipt => {
        if (ipt.name === name) {
          ipt.value = optionsData.btnSty[v]
        }
      })
    }
  })
}
// 通过syl的input的name找到对应的数据字段
function findOptionsKeys (key, type = 'opt') {
  let name
  if (type === 'opt') {
    switch (key) {
      case 'text':
        name = 'text'
        break;
      case 'backgroundImage':
        name = 'img'
        break;
      case 'backgroundColor':
        name = 'color'
        break;
      case 'borderRadius':
        name = 'radius'
        break;
      case 'opacity':
        name = 'opacity'
        break;
      case 'color':
        name = 'text-color'
        break;
      default:
        name = false
        break;
    }
  } else if (type === 'ipt') {
    switch (key) {
      case 'text':
        name = 'text'
        break;
      case 'img':
        name = 'backgroundImage'
        break;
      case 'color':
        name = 'backgroundColor'
        break;
      case 'radius':
        name = 'borderRadius'
        break;
      case 'opacity':
        name = 'opacity'
        break;
      case 'text-color':
        name = 'color'
        break;
      default:
        name = false
        break;
    }    
  }
  return name
}
// 绑定删除配置的事件
function bindDelOptions () {
  optionsList.addEventListener('click', v => {
    let target = v.target
    if (target.tagName.toUpperCase() === 'A') {
      let parent = target.closest('p')
      let index = target.dataset.index
      parent.parentNode.removeChild(parent)
      optionsData.rule.splice(index, 1)
      chrome.storage.sync.set({'to-top': JSON.stringify(optionsData.rule)}, function() {
        msg('删除成功!', 'success')
        initOptionsListDom()
      })
    }
  })
}
// 文字提示
function msg(str = '测试消息', type = 'fail') {
  let bgColor = type === 'fail' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)'
  let div = document.createElement('div')
  div.className = 'msg-box'
  div.innerText = str
  div.style.cssText = `width: 200px; line-height: 30px; padding: 4px 10px;font-size: 12px; text-align: center; color: #fff; background-color: ${bgColor}; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); opacity: 0; animation: show 2s; border-radius: 10px;`
  document.body.appendChild(div)
  setTimeout(() => {
    div.parentNode.removeChild(div)
  }, 2500)
}