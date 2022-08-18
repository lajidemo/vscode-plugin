const fs = require('fs-extra');
const path = require('path');

console.log('清理缓存===')

const snippetsPath = path.resolve(__dirname, 'snippets')
const templatesPath = path.resolve(__dirname, 'templates')

fs.writeJSONSync(path.resolve(__dirname,'userInfo/index.json'), {})

const snippetsFiles = fs.readdirSync(snippetsPath)
snippetsFiles.forEach(s=>{
  fs.writeJSONSync(path.join(snippetsPath, s), {})
})

fs.emptyDirSync(templatesPath)
