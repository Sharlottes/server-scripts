preurl='https://raw.githubusercontent.com/Sharlottes/server-scripts/master/';
Core.net.httpGet(preurl+'server-scripts.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{})
Core.net.httpGet(preurl+'commands.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{})
/*Core.net.httpGet(preurl+'fx.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{})*/
initcmds();