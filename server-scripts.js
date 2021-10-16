/*
Sharlotte's script list. used with command or console.
basically these scripts are used for running on server, so most codes are one-line compressed.
*/

/*
//define color getter
fxcol=()=>Color.red.shiftHue(60%Time.delta);
fxcol=()=>Pal.lancerLaser.cpy().lerp(Pal.sap,60%Time.delta).lerp(Pal.place,60%Time.delta);
fxcol=()=>Color.cyan.cpy().lerp(Items.titanium.color,60%Time.delta).lerp(Liquids.cryofluid.color,60%Time.delta)

//put multiple effects into seq (option)
partfx1=(p,fx)=>Call.effect(fx,p.x+Mathf.range(8*8),p.y+Mathf.range(8*8),p.unit().rotation,fxcol());
partfx2=(p,fx)=>Call.effect(fx,p.x,p.y,p.unit().rotation*Time.time/20,fxcol());
partfx3=(p,fx)=>Call.effect(fx,p.x,p.y,p.unit().rotation,Color.red.shiftSaturation(60%Time.delta));
fxPack=Seq.with(partfx1, partfx2, partfx1, partfx3);fxPack;
fxs=Seq.with(Fx.sparkShoot, Fx.lancerLaserShoot, Fx.bubble, Fx.mine);fxs;

//define event runner for fx
runner=()=>Call.effect(Fx.sparkShoot,sharp.x+Mathf.range(4*8),sharp.y+Mathf.range(4*8),sharp.unit().rotation,fxcol());
runner=()=>Call.effect(Fx.lancerLaserShoot,sharp.x,sharp.y,sharp.unit().rotation*Time.time/20,fxcol());
runner=()=>fxs.each(fx=>fxPack.each(f=>f(sharp,fx)));
runner=()=>Groups.player.each(cons(p=>Call.effect(Fx.mine,p.x,p.y,p.unit().rotation,fxcol())));

//run this only **once**, you don't need to run this again when re-defining runner
Events.run(Trigger.update, ()=>runner());
*/

Packages.arc.util.async.Threads.daemon(() => Reflect.get(Vars.mods.scripts.class, "blacklist").clear()).join();


findp=s=>Groups.player.find(p=>Strings.stripColors(p.name.toLowerCase())==s.toLowerCase())||Groups.player.index(s);sharp=findp("Sharlotte")

setFloor=(o,e)=>{e.isOverlay()?o.setFloorNet(o.floor(),e):e.isFloor()&&o.setFloorNet(e)}
setTile=(e,l,t,i,r)=>{tile=Vars.world.tile(e,l),t.isFloor()||t.isOverlay()?setFloor(tile,t):tile.setNet(t,i||Team.derelict,r||0)}
circleTile=(s,t,e,l,c,d,i)=>{Vars.world.tile(s,t).circle(e,cons(r=>{dst=Mathf.dst(s,t,r.x,r.y),(!i||e-i<=dst&&dst<=e)&&setTile(r.x,r.y,l,c,d)}))}
square=(i,e,s,x,y,r,f)=>{for(ix=i;ix<s;ix+=y.size)for(iy=e;iy<x;iy+=y.size)setTile(ix,iy,y,f,r)}
squareTile=(e,a,q,r,s,u,i,l)=>{square(e,a,q,r,s,u,i),l||(e+=l,a+=l,q-=l,r-=l,square(e,a,q,r,s,u,i))}
researchCost=e=>{str="[accent]"+e.name+"[]",e.researchRequirements().forEach(e=>{str+="\n"+e.item.emoji()+"[#"+e.item.color+"]"+e.amount}),print(str)}
checkPlayers=(e,l)=>{for(i=l*e;i<l*(e+1);i++)p=Groups.player.index(i),Call.sendMessage("#"+i+": "+p.name+" ("+p.tileX()+", "+p.tileY()+")")}

revealBlock=b=>Vars.state.rules.revealedBlocks.add(b);
hideBlock=b=>Vars.state.rules.revealedBlocks.remove(b);
banBlock=b=>Vars.state.rules.bannedBlocks.add(b);
unbanBlock=b=>Vars.state.rules.bannedBlocks.remove(b);
updaterule=()=>{Call.sendMessage("[#ffd37f]game rules are updated!");Call.setRules(Vars.state.rules);}

syncp=p=>{Call.worldDataBegin(p.con);Vars.netServer.sendWorldData(p)}
syncall=()=>{Call.sendMessage("[#7457ce]World reloaded");Groups.player.each(p=>syncp(p))}


cmds = Vars.netServer.clientCommands;cl = Vars.netServer.clientCommands.getCommandList();
initcmds=()=>{seq = new Seq();cl.each(c=>seq.find(cc=>cc.text==c.text)==null&&seq.add(c));cl.clear();cl.addAll(seq)}

chatrunner = (a, p) => {str="";a.map(s=>str+=s);Call.sendMessage(p.name+" [orange]>[] "+str)}
cmds.register("chat","<strings...>","send message",new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){chatrunner(a, p)}}))

whis=(p,tp,t,str)=>t.sendMessage("[orange][[[]"+p.name+" [orange]->[] "+tp.name+"[orange]][] "+str)
whisperrunner=(a,p)=>{s="";a.map((h,i)=>{i>0&&(s+=h)});t=findp(a[0]);(t||Call.sendMessage(a[0]+' is not found'))&&(whis(p,t,t,s),whis(p,t,p,s))}
whisperadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){whisperrunner(a, p)}})
cmds.register("w","<player> <strings...>","send message to special player",whisperadapter)

cap=Vars.state.rules.unitCap;tolc=str=>str.toLowerCase();hlstr=(a,str)=>str.replace(a[0], "[orange]"+a[0]+"[]")
findu=a=>{str="";Vars.content.units().copy().filter(u=>u.name.includes(a[0])).each(u=>str+=("[lightgray]"+hlstr(a,u.name)+"[] "));return str}
getu=(a,p)=>Vars.content.units().find(u=>tolc(u.name)==tolc(a[0]))||p.sendMessage("[orange]"+a[0]+"[red]을(를) 찾을 수 없습니다![][]\n추천 단어들 "+findu(a))
gett=(a,p,i)=>{try{return Team[a[i]||'sharded']}catch(e){p.sendMessage("[orange]"+a[i]+"[red]을(를) 찾을 수 없습니다![][]");return Team['sharded']}}
spawn=(a,p,u,t,i)=>{Time.run(i, ()=>u.spawn(t,(a[3]||p.x||8),(a[4]||p.y||8)))}
amountck=(u,t,p,i)=>(Groups.unit.count(g=>g.team==t&&g.type==u)+1<cap)||p.sendMessage(i+"개 소환됨.\n[red]유닛이 너무 많습니다![]\n현재 제한 수: [orange]"+cap)
spawnrunner=(a,p)=>{u=getu(a,p);t=gett(a,p,2);if(u!=null){for(i=0;i<(a[1]||1);i++) {if(amountck(u,t,p,i)){spawn(a,p,u,t,i)}else break}}}
spawnadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){spawnrunner(a, p)}})
cmds.register("spawn","<unit> [amount] [team] [worldx] [worldy]","spawn units",spawnadapter)

teamrunner=(a, p)=>p.team(gett(a,p,0));
teamadapter=new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){teamrunner(a, p)}})
cmds.register("team","<team>", "change player team",teamadapter)

findb=a=>{str="";Vars.content.blocks().copy().filter(b=>b.name.includes(a[0])).each(b=>str+=("[lightgray]"+hlstr(a,b.name)+"[] "));return str}
getb=(a,p)=>Vars.content.blocks().find(b=>b.name==a[0])||p.sendMessage("[orange]"+a[0]+"[red]을(를) 찾을 수 없습니다![][]\n추천 단어들 "+findb(a))
setblockrunner = (a, p) => setTile(a[2]||p.tileX(),a[3]||p.tileY(),getb(a,p),gett(a,p,1),a[4]||0)
setblockadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){setblockrunner(a, p)}})
cmds.register("setblock","<block> [team] [tilex] [tiley] [rotation]", "set the block",setblockadapter)

playersrunner = (a, p) => {g=Groups.player;for(i=0;i<g.size();i++)p.sendMessage("["+i+"]# "+g.index(i).name)}
playersadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){playersrunner(a, p)}})
cmds.register("players","show player list",playersadapter)

bfilter=(a,b)=>a[0]=='floor'?b.isFloor():a[0]=='env'?b.isStatic():a[0]=='block'?b.canBeBuilt():true
blocksrunner = (a, p) => {str="";Vars.content.blocks().each(b=>bfilter(a,b), b=>str+=b.name+", ");p.sendMessage(str)}
blocksadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){blocksrunner(a, p)}})
cmds.register("blocks", "[floor/env/block]", "show block list",blocksadapter)

unitsrunner = (a, p) => {str="";Vars.content.units().each(u=>str+=u.name+", ");p.sendMessage(str)}
unitsadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){unitsrunner(a, p)}})
cmds.register("units", "show unit list",unitsadapter)

hck =(a,p)=> (a.length>0&&!Strings.canParseInt(a[0]))&&(p.sendMessage("[scarlet]'page' must be a number.")||true)
hckk =(p,pa,pas)=>(pa>=pas||pa<0)&&(p.sendMessage("[scarlet]'page' must be a number between[orange] 1[] and[orange] "+pa+"[scarlet].")||true)
pa =a=> (a.length>0?Strings.parseInt(a[0]):1)-1;pas =()=> Mathf.ceil(cmds.getCommandList().size/6); 
ar=a=>aar(a,"[orange]-- Commands Page[lightgray] "+(pa(a)+1)+"[gray]/[lightgray]"+pas()+"[orange] --\n\n")
aar=(a,r)=>{for(i=6*pa(a);i<Math.min(6*(pa(a)+1),cl.size);i++){r=aaar(r,cl.get(i))};return r}
aaar=(r,c)=>r+="[orange] /"+c.text+"[white] "+c.paramText+"[lightgray] - "+c.description+"\n"
helprunner =(a, p)=> {hck(a,p)||(p.sendMessage(ar(a)))}
helpadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){helprunner(a, p)}})
cmds.register("help", "[page]", "Lists all commands.", helpadapter);

voting = false;votes = 0;votereq =()=> Mathf.max(1, Mathf.round(Groups.player.size()/2));votors = new Seq();var schedule;
vinit=()=>{schedule.cancel();votes=0;voting=false;votors.clear()}
votecheck =p=> voting&&p.sendMessage('투표가 진행 중입니다!')||voting
votepasscheck=()=>(votes>=votereq())&&(Call.sendMessage("투표 성공!"),Events.fire(GameOverEvent(Team.sharded)))||(vinit())
votesch=()=>{schedule=Timer.schedule(()=>votepasscheck()||(Call.sendMessage('투표 실패!'),vinit()),60)}
prevote=(a,p)=>{Call.sendMessage("[orange]"+p.name+"[]님이 게임오버 투표를 시작했습니다!");votesch();voting=true}
votegorunner =(a, p)=> votecheck(p)||prevote(a,p)
votegoadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){votegorunner(a, p)}})
cmds.register("votegameover", "게임오버 투표", votegoadapter);

svotecheck =p=> voting||p.sendMessage("아직 투표가 없습니다.")
svoteck =(p,ip)=> (!votors.contains(p.uuid())&&!votors.contains(ip))||p.sendMessage("이미 투표하셨습니다!")
svay =(i,p)=> Call.sendMessage("[orange]"+p.name+"[]님이 "+(i==1?"찬성":"반대")+"했습니다! [orange]"+votes+"[]/[lightgray]"+votereq())
svoted =(i,p)=>{ip=Vars.netServer.admins.getInfo(p.uuid()).lastIP;if(svoteck(p,ip)){votors.addAll(p.uuid(),ip);votes+=i;svay(i,p)}}
presvote =(a,p) =>{s=a[0].toLowerCase();i=(s=='y'?1:s=='n'?-1:0);((i==0&&p.sendMessage("y 또는 n를 선택해주세요"))||svoted(i,p))}
svoterunner =(a, p)=> svotecheck(p)&&presvote(a,p)
svoteadapter = new JavaAdapter(CommandHandler.CommandRunner,{accept(a,p){svoterunner(a, p)}})
cmds.register("svote", "<y/n>", "투표하기", svoteadapter);