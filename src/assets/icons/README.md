### 目录介绍

- icons 作者提供的图标库
- system 系统所需图标

### 使用方式

- icons <i class='iconfont'>&#xe649;</i>

### 如何使用自定义图标

- 1、从iconfont官网下载项目到本地（https://www.iconfont.cn/）
- 2、在/src/assets/icons下创建一个文件夹
- 3、将下载的图标解压出来放到新创建的文件夹下面
- 4、然后在main.js中引入图标库即可使用 import "@icons/xxx/iconfont.css"

### 如何提取iconfont中的图标标识

- 1、下载iconfont项目至本地
- 2、复制下面的方法放到下载的图标库xxx.html文件里面的script标签里面
- 3、然后打开控制台刷新页面，控制台会输出所有的unicode图标

```bash
  function getIconUnicode() {
    let el = document.querySelector('.unicode > .icon_lists').querySelectorAll('.code-name')
    let iconList = []
    for(let i=0; i<el.length; i++) {
      let item = el[i]
      iconList.push(item.innerText)
    }
    console.log(iconList)
  }
```
