if(!cmd) cmds = Vars.netServer.clientCommands;
if(!cl) cl = Vars.netServer.clientCommands.getCommandList();

function cmdvalid(player) {
  return player.admin||Vars.state.rules.mode()==Gamemode.sandbox||player.sendMessage("[red]이 명령어는 샌드박스 전용입니다!");
};

function initcmds() {
  const seq = new Seq();
  cl.each(c=>{
    if(!seq.contains(cc=>cc.text==c.text)) seq.add(c);
  });
  cl.clear();
  cl.addAll(seq);
};

cmds.register("chat", "<strings...>", "send message", new JavaAdapter(CommandHandler.CommandRunner, {
  accept: function(args, player) {
    const str = args.join(" ");
    Call.sendMessage(player.name+" [orange]>[] "+str);
  }
}));



cmds.register("w", "<player> <strings...>", "send message to special player", new JavaAdapter(CommandHandler.CommandRunner, {
  accept: function(args, player) {
    const message = args.slice(1).join(" ");
    const target = findp(args[0]);
    if(target) {
      target.sendMessage("[orange][[[]"+player.name+" [orange]->[] "+target.name+"[orange]][] "+message);
      player.sendMessage("[orange][[[]"+player.name+" [orange]->[] "+target.name+"[orange]][] "+message);
    }
    else Call.sendMessage(args[0]+" is not found");
  }
}));

cmds.register("spawn", "<unit> [amount] [team] [worldx] [worldy]", "spawn units", new JavaAdapter(CommandHandler.CommandRunner, {
  accept: function(args, player) {
    if(!cmdvalid(player)) return;

    let [ unitName, amount, teamName, x, y ] = args;
    let spawnUnit = Vars.content.units().find(unit=>unit.name.toLowerCase()==unitName.toLowerCase());
    let team = Team.baseTeams.find(team=>team==teamName);
    
    if(!amount) amount = 1;
    if(!team) team = Team.sharded;
    if(!x) x = player.x;
    if(!y) y = player.y;

    if(!spawnUnit) {
      return player.sendMessage("[orange]"+a[0]+"[red]을(를) 찾을 수 없습니다![][]\n추천 단어들 "+Vars.content.units().map(unit=>{
        if(unit.name.includes(unitName)) return "[lightgray]"+unit.name.replace(unitName, "[orange]"+unitName+"[]")+"[] ";
      }).filter(e=>e).toString());
    }
    else if(spawnUnit==UnitTypes.block) 
      return player.sendMessage("[red]금지된 유닛입니다.");

    for(var i = 0; i < amount; i++){
      if(Groups.unit.count(unit=>unit.team==team&&unit.type==spawnUnit)+i <= Vars.state.rules.unitCap) Time.run(i, ()=>spawnUnit.spawn(team, x, y));
      else return player.sendMessage(i+"개 소환됨.\n[red]유닛이 너무 많습니다![]\n현재 제한 수: [orange]"+Vars.state.rules.unitCap);
    }
  }
}));
/*
gett=(a,p,i)=>{try{return Team[a[i]||'sharded']}catch(e){p.sendMessage("[orange]"+a[i]+"[red]을(를) 찾을 수 없습니다!");return Team['sharded']}};
teamrunner=(a, p)=>{if(!cmdvalid(p))return;p.team(gett(a,p,0))};
teamadapter=new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){teamrunner(a, p)}});
cmds.register("team","<team>", "change player team",teamadapter);

hlstr=(a,str)=>str.replace(a[0], "[orange]"+a[0]+"[]");
findb=a=>{str="";Vars.content.blocks().copy().filter(b=>b.name.includes(a[0])).each(b=>str+=("[lightgray]"+hlstr(a,b.name)+"[] "));return str};
getb=(a,p)=>Vars.content.blocks().find(b=>b.name==a[0])||p.sendMessage("[orange]"+a[0]+"[red]을(를) 찾을 수 없습니다![][]\n추천 단어들 "+findb(a));
setblockrunner=(a,p)=>{if(!cmdvalid(p))return;setTile(a[2]||p.tileX(),a[3]||p.tileY(),getb(a,p),gett(a,p,1),a[4]||0)};
setblockadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){setblockrunner(a, p)}});
cmds.register("setblock","<block> [team] [tilex] [tiley] [rotation]", "set the block",setblockadapter);

playersrunner = (a, p) => {g=Groups.player;for(i=0;i<g.size();i++)p.sendMessage("["+i+"]# "+g.index(i).name)};
playersadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){playersrunner(a, p)}});
cmds.register("players","show player list",playersadapter);

bfilter=(a,b)=>a[0]=='floor'?b.isFloor():a[0]=='env'?b.isStatic():a[0]=='block'?b.canBeBuilt():true;
blocksrunner = (a, p) => {str="";Vars.content.blocks().each(b=>bfilter(a,b), b=>str+=b.name+", ");p.sendMessage(str)};
blocksadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){blocksrunner(a, p)}});
cmds.register("blocks", "[floor/env/block]", "show block list",blocksadapter);

unitsrunner = (a, p) => {str="";Vars.content.units().each(u=>str+=u.name+", ");p.sendMessage(str)};
unitsadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){unitsrunner(a, p)}});
cmds.register("units", "show unit list",unitsadapter);

hck =(a,p)=> (a.length>0&&!Strings.canParseInt(a[0]))&&(p.sendMessage("[scarlet]'page' must be a number.")||true);
hckk =(p,pa,pas)=>(pa>=pas||pa<0)&&(p.sendMessage("[scarlet]'page' must be a number between[orange] 1[] and[orange] "+pa+"[scarlet].")||true);
pa =a=> (a.length>0?Strings.parseInt(a[0]):1)-1;pas =()=> Mathf.ceil(cmds.getCommandList().size/6);
ar=a=>aar(a,"[orange]-- Commands Page[lightgray] "+(pa(a)+1)+"[gray]/[lightgray]"+pas()+"[orange] --\n\n");
aar=(a,r)=>{for(i=6*pa(a);i<Math.min(6*(pa(a)+1),cl.size);i++){r=aaar(r,cl.get(i))};return r};
aaar=(r,c)=>r+="[orange] /"+c.text+"[white] "+c.paramText+"[lightgray] - "+c.description+"\n";
helprunner =(a, p)=> {hck(a,p)||(p.sendMessage(ar(a)))};
helpadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){helprunner(a, p)}});
cmds.register("help", "[page]", "Lists all commands.", helpadapter);

voting = false;votes = 0;votereq =()=> Math.max(1, Mathf.round(Groups.player.size()/2));votors = new Seq();var schedule;
vinit=()=>{schedule.cancel();votes=0;voting=false;votors.clear()};
votecheck =p=> voting&&p.sendMessage('투표가 진행 중입니다!')||voting;
votepasscheck=()=>(votes>=votereq())&&(Call.sendMessage("투표 성공!"),Events.fire(GameOverEvent(Team.sharded)))||(vinit());
votesch=()=>{schedule=Timer.schedule(()=>votepasscheck()||(Call.sendMessage('투표 실패!'),vinit()),60)};
prevote=(a,p)=>{Call.sendMessage("[orange]"+p.name+"[]님이 게임오버 투표를 시작했습니다!");votesch();voting=true};
votegorunner =(a, p)=> votecheck(p)||prevote(a,p);
votegoadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){votegorunner(a, p)}});
cmds.register("votegameover", "게임오버 투표", votegoadapter);

svotecheck =p=> voting||p.sendMessage("아직 투표가 없습니다.");
svoteck =(p,ip)=> (!votors.contains(p.uuid())&&!votors.contains(ip))||p.sendMessage("이미 투표하셨습니다!");
svay =(i,p)=> Call.sendMessage("[orange]"+p.name+"[]님이 "+(i==1?"찬성":"반대")+"했습니다! [orange]"+votes+"[]/[lightgray]"+votereq());
svoted =(i,p)=>{ip=Vars.netServer.admins.getInfo(p.uuid()).lastIP;if(svoteck(p,ip)){votors.addAll(p.uuid(),ip);votes+=i;svay(i,p)}};
presvote =(a,p) =>{s=a[0].toLowerCase();i=(s=='y'?1:s=='n'?-1:0);((i==0&&p.sendMessage("y 또는 n를 선택해주세요"))||svoted(i,p))};
svoterunner =(a, p)=> svotecheck(p)&&presvote(a,p);
svoteadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){svoterunner(a, p)}});
cmds.register("svote", "<y/n>", "투표하기", svoteadapter);
*/
Call.sendMessage("commands 스크립트 새로고침 완료");