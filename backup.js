url='https://raw.githubusercontent.com/Sharlottes/server-scripts/master/server-scripts.js'
url='https://raw.githubusercontent.com/Sharlottes/server-scripts/master/commands.js'
url='https://raw.githubusercontent.com/Sharlottes/server-scripts/master/fx.js'
Core.net.httpGet(url, r => Vars.mods.getScripts().runConsole(r.getResultAsString()), err=>{})