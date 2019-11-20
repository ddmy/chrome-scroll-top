let ipt = document.querySelector('#url')
let sub = document.querySelector('.sub')
let reg = document.querySelector('#reg')
console.log('options-js加载成功')

let set, optionsList, btnSet, tabs
let optionsData = []
initTab()
bindTabClick()
getOptions()
bindDelOptions()
bindAddOptions()
initOptionsListDom()
// 保存配置信息

// 初始化tab
function initTab () {
  set = document.querySelector('.setting')
  optionsList = document.querySelector('.options-list')
  btnSet = document.querySelector('.btn-styl')
  tabs = document.querySelectorAll('.table a')
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
      optionsData.push(value)
      // 保存数据
      chrome.storage.sync.set({'to-top': JSON.stringify(optionsData)}, function() {
          msg('添加成功', 'success')
          initOptionsListDom()
          ipt.value = ''
      })
    } else {
      msg('不能为空')
    }
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
  chrome.storage.sync.get({'to-top': '[]'}, function(items) {
    optionsData = JSON.parse(items['to-top'])
    console.log('getOptions当前配置', optionsData)
    // 初始化新的列表
    initOptionsListDom()
  }) 
}
// 初始化配置信息列表
function initOptionsListDom () {
  if (!Array.isArray(optionsData)) return
  let str = optionsData.map((v, i) => {
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
// 绑定删除配置的事件
function bindDelOptions () {
  optionsList.addEventListener('click', v => {
    let target = v.target
    if (target.tagName.toUpperCase() === 'A') {
      let parent = target.closest('p')
      let index = target.dataset.index
      parent.parentNode.removeChild(parent)
      optionsData.splice(index, 1)
      chrome.storage.sync.set({'to-top': JSON.stringify(optionsData)}, function() {
        msg('删除成功!', 'success')
        initOptionsListDom()
      })
    }
  })
}
// 文字提示
function msg(str = '测试消息', type = 'fail') {
  let msgDom = document.querySelector('.msg-box')
  if (msgDom) {
    msgDom.parentNode.removeChild(msgDom)
  }
  let bgColor = type === 'fail' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)'
  let div = document.createElement('div')
  div.className = 'msg-box'
  div.innerText = str
  div.style.cssText = `width: 200px; line-height: 30px; padding: 4px 10px;font-size: 12px; text-align: center; color: #fff; background-color: ${bgColor}; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); opacity: 0; animation: show 2s; border-radius: 10px;`
  document.body.appendChild(div)
}