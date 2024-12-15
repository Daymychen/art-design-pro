<template>
  <div class="page-content">
    <Editor v-model="editorHtml" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const editorHtml = ref(`<h1>欢迎使用富文本编辑器</h1>
  <p>这是一个段落示例，下面展示了一些常用的富文本格式：</p>
  
  <h2>文本样式</h2>
  <p><strong>这是加粗的文字</strong></p>
  <p><em>这是斜体文字</em></p>
  
  <h2>列表示例</h2>
  <ul>
    <li>无序列表项 1</li>
    <li>无序列表项 2</li>
    <li>无序列表项 3</li>
  </ul>
  
  
  <ol>
    <li>有序列表项 1</li>
    <li>有序列表项 2</li>
    <li>有序列表项 3</li>
  </ol>
  
  <h2>引用示例</h2>
  <blockquote style="border-left: 4px solid #ccc; margin-left: 0; padding-left: 1em;">
    这是一段引用文字，可以用来突出显示重要内容。
  </blockquote>
  
  <h2>表格示例</h2>
  <table border="1" cellpadding="5">
    <tr>
      <th>表头 1</th>
      <th>表头 2</th>
    </tr>
    <tr>
      <td>单元格 1</td>
      <td>单元格 2</td>
    </tr>
  </table>
  
  <h2>代码示例</h2>
  <pre><code class="language-javascript">// JavaScript 代码示例
function greeting(name) {
    return \`Hello, \${name}!\`;
}

console.log(greeting('世界'));</code></pre>

<pre><code class="language-python"># Python 代码示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))</code></pre>
  
  <h2>链接示例</h2>
  <p><a href="https://www.lingchen.kim/art-design-pro/docs/">这是一个超链接</a></p>
`)
</script>
