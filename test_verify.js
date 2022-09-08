const { exec,spawn,spawnSync } = require('node:child_process')


//const pingServerAsync = spawn('ping',['google.com'])


const pingServerSync = spawnSync('ping',['google.com'], {
    timeout:1000
})

console.log(pingServerSync.stdout.toString().split("\n"))