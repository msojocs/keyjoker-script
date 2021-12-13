const fs = require('fs');
const changeLog = fs.readFileSync("CHANGELOG.md", 'utf-8')
// console.log(changeLog)
const logList = changeLog.split("\r\n## ")
const logObject = {}
let latestVersion = null
for (const log of logList) {
    const versionExp = new RegExp(/(v\d+\.\d+\.\d+) \(\d{4}-\d{2}-\d{2}\)([\s\S]+)/)
    let version = log.match(versionExp)
    const logOfVer = logObject[version[1]] = []
    const changeDetail = version[2]
    const changeArr = changeDetail.split("\r\n### ")
    
    for (const change of changeArr) {
        parseChengeLogByType(change, logOfVer)
    }
    if(!latestVersion){
        latestVersion = [version[1], logObject[version[1]]]
    }
}
console.log("日志数据: ", logObject)
console.log("最新版本: ", latestVersion)
fs.writeFileSync("changelog/changelog.json", JSON.stringify(logObject))
fs.writeFileSync("changelog/latestVersion.json", JSON.stringify(latestVersion))

// Refactor\r\n- **version**: 稳定测试版本\r\n
function parseChengeLogByType(detail, logOfVer){
    const changeTypeExp = new RegExp(/(.*?)\r\n([\s\S]+)/)
    if(!changeTypeExp.test(detail))return

    let changeType = detail.match(changeTypeExp)

    const changesExp = new RegExp(/- \*\*([a-zA-Z]+)\*\*: (.*?)\r/g)
    let changes = changeType[2].matchAll(changesExp)
    for (const change of changes) {
        logOfVer.push(`${changeType[1]}(${change[1]}): ${change[2]}`)
    }
}


let a = {
    "v1.0.0": {
        "refactor": {
            "test": "测试",
            "discord": "xxx"
        }
    }
}