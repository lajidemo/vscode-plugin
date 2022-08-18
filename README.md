# 食用文档

详情请查看：https://xingyun.feishu.cn/wiki/wikcnE4xGsNVGvMi3kyzreodK6b?from=from_copylink

## 近战版(.ST)

```Gherkin
~根路径
├── package.json
├── .ST
|  ├── templates 页面模板
|  |   ├── LinkieStock-vue    // 模板名称
|  |   |   ├── __upperCase_name__    // 创建模板从这层文件夹开始
|  |   |   |   ├── template1.vue.tpl    // 如需模板语法，在声明目标文件类型后添加 .tpl
|  ├── snippets 代码片段（目前只支持以下文件类型）
|  |   |   ├── base.json   // 通用片段（不写业务代码），支持 js/ts/jsx/tsx 文件类型
|  |   |   ├── css.json    // css/less/scss片段
|  |   |   ├── vue.json    // vue片段
|  |   |   ├── taro.json    // taro片段
|  |   |   └── react.json    // react片段
```

## 模板解析（引用 `handlebars` 解析模板内容）

在生成模板时，会要求输入文件名称，该名称会根据以下模板占位符被转换成对应文本变量。

**(name 即为 input 输入的文件名，是插件注入的名称固定变量)**

|      名称      |         模板中          | 文件/文件夹名称中（精确匹配） |       结果       |
| :------------: | :---------------------: | :---------------------------: | :--------------: |
|      name      |        {{name}}         |         \_\_name\_\_          |       name       |
|   upperCase    |   {{upperCase name}}    |    \_\_upperCase_name\_\_     |    UPPERCASE     |
|   lowerCase    |   {{lowerCase name}}    |    \_\_lowerCase_name\_\_     |    lowercase     |
|   camelCase    |   {{camelCase name}}    |    \_\_camelCase_name\_\_     |    camelCase     |
|  pascalCase{   |   {pascalCase name}}    |    \_\_pascalCase_name\_\_    |    PascalCase    |
|   snakeCase    |   {{snakeCase name}}    |    \_\_snakeCase_name\_\_     |    snake_case    |
| upperSnakeCase | {{upperSnakeCase name}} |  \_\_upperSnakeCase_name\_\_  | UPPER_SNAKE_CASE |
|   kebabCase    |   {{kebabCase name}}    |    \_\_kebabCase_name\_\_     |    kebab-case    |
|  lowerDotCase  |  {{lowerDotCase name}}  |   \_\_lowerDotCase_name\_\_   |  lower.dot.case  |

###  Tips

##### 模板

```jsx
// 因为'{{}}'模板语法跟 vue 冲突，为保留 vue 模板语法，需使用以下方式做转义

// index.vue.tpl
<div>
// 在 {{}} 前面加个 \ 即可
        \{{data.msg}}
</div>

// 转换后
<div>
        {{data.msg}}
</div>
```

##### 片段

在线格式化片段：https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode