const fs = require('fs');
const p = JSON.parse(fs.readFileSync('src/spec/parametersets.json','utf8'));
console.log(Object.keys(p).filter(k=>k.toLowerCase().includes('fileclose')).join('\n'));
