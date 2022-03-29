preurl='https://raw.githubusercontent.com/Sharlottes/server-scripts/master/';
Packages.arc.util.Http.get(preurl+'server-scripts.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{});
Packages.arc.util.Http.get(preurl+'commands.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{});
Packages.arc.util.Http.get(preurl+'fx.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{});
Packages.arc.util.Http.get(preurl+'ai.js',r=>Vars.mods.getScripts().runConsole(r.getResultAsString()),err=>{});
initcmds();