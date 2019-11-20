let creatTop = false
chrome.storage.sync.get({'to-top': '[]'}, function(items) {
  let arr = JSON.parse(items['to-top'])
  creatTop = !!arr.find(v => {
    let type = Object.prototype.toString.call(v)
    if (type === '[object String]') {
      return location.host.indexOf(v) > -1
    } else if (type === '[object Object]' && v.type === 'reg') {
      return new RegExp(v.value).test(location.href)
    }
  })
})
window.addEventListener('load', () => {
  if (!creatTop) return false
  let div = document.createElement('div')
  div.innerHTML = '返回顶部'
  div.style.cssText = 'width:50px; height: 50px; display:none; background-color: #369; color: #fff; font-size: 12px; line-height: 50px; text-align: center; cursor: pointer; position: fixed; right: 20px; bottom: 100px; z-index: 99999; opacity: 0.8; border-radius: 6px;'
  div.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
  document.body.appendChild(div)
  // 窗口高度
  let clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight
  window.addEventListener('resize', () => {
    clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight
  })
  window.addEventListener('scroll', () => {
    let top = document.documentElement.scrollTop
    if (top > clientHeight) {
      div.style.display = 'block'
    } else {
      div.style.display = 'none'
    }
  })
})