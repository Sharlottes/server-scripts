Call.sendMessage("fxs 스크립트 새로고침 완료");

/*define color getter*/
fxcol=()=>Color.red.shiftHue(60%Time.delta);
fxcol=()=>Pal.lancerLaser.cpy().lerp(Pal.sap,60%Time.delta).lerp(Pal.place,60%Time.delta);
fxcol=()=>Color.cyan.cpy().lerp(Items.titanium.color,60%Time.delta).lerp(Liquids.cryofluid.color,60%Time.delta)

/*put multiple effects into seq (option)*/
partfx1=(p,fx)=>Call.effect(fx,p.x+Mathf.range(8*8),p.y+Mathf.range(8*8),p.unit().rotation,fxcol());
partfx2=(p,fx)=>Call.effect(fx,p.x,p.y,p.unit().rotation*Time.time/20,fxcol());
partfx3=(p,fx)=>Call.effect(fx,p.x,p.y,p.unit().rotation,Color.red.shiftSaturation(60%Time.delta));
fxPack=Seq.with(partfx1, partfx2, partfx1, partfx3);fxPack;
fxs=Seq.with(Fx.sparkShoot, Fx.lancerLaserShoot, Fx.bubble, Fx.mine);fxs;

/*define event runner for fx*/
runner=()=>Call.effect(Fx.sparkShoot,sharp.x+Mathf.range(4*8),sharp.y+Mathf.range(4*8),sharp.unit().rotation,fxcol());
runner=()=>Call.effect(Fx.lancerLaserShoot,sharp.x,sharp.y,sharp.unit().rotation*Time.time/20,fxcol());
runner=()=>fxs.each(fx=>fxPack.each(f=>f(sharp,fx)));
runner=()=>Groups.player.each(cons(p=>Call.effect(Fx.mine,p.x,p.y,p.unit().rotation,fxcol())));

/*run this only **once**, you don't need to run this again when re-defining runner*/
startedfx=false;startfx=()=>{startedfx=true;startedfx||Events.run(Trigger.update, ()=>runner())}