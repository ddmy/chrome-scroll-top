let creatTop = false
let btnSty = {
  text: '返回顶部',
  backgroundImage: '',
  backgroundColor: '#369',
  borderRadius: '6px',
  opacity: '0.8',
  color: '#fff'
}
let clientX, clientY
let bottom = 100
let right = 50
let btnWidth = 50
let btnHeight = 50
let startTime = 0
chrome.storage.sync.get({'to-top': '[]', btnSty }, function(items) {
  let arr = JSON.parse(items['to-top'])
  btnSty = items.btnSty
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
  div.innerHTML = btnSty.text
  let css = `width:${btnWidth}px; height: ${btnHeight}px; display:none; background-color: ${btnSty.backgroundColor}; color: ${btnSty.color}; font-size: 12px; line-height: 50px; text-align: center; cursor: pointer; position: fixed; right: ${right}px; bottom: ${bottom}px; z-index: 99999; opacity: ${btnSty.opacity}; border-radius: ${parseInt(btnSty.borderRadius)}px; background-image: url(${btnSty.backgroundImage}); background-repeat: no-repeat; background-size: cover; background-position: center; user-select: none;`
  div.style.cssText = css
  div.addEventListener('mousedown', (event) => {
    clientX = event.clientX
    clientY = event.clientY
    startTime = Date.now()
    let body = document.querySelector('body')
    body.addEventListener('mousemove', btnMouseMove)
    body.addEventListener('mouseup', function (event) {
      if (event.type === 'mouseup' && Date.now() - startTime < 300) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      startTime = 0
      body.removeEventListener('mousemove', btnMouseMove)
      bottom = parseInt(div.style.bottom)
      right = parseInt(div.style.right)
    })
  })
  // 鼠标拖动
  function btnMouseMove (event) {
    let clientXMove = event.clientX
    let clientYMove = event.clientY
    div.style.bottom = clientY - clientYMove + bottom + 'px'
    div.style.right = clientX - clientXMove + right + 'px'
  }
  document.body.appendChild(div)
  // 窗口高度
  let clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight
  if (document.documentElement.scrollTop > clientHeight) {
    div.style.display = 'block'
  }
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