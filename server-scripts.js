/*
Sharlotte's script list. used with command or console.
basically these scripts are used for running on server, so most codes are one-line compressed.
*/

Packages.arc.util.async.Threads.daemon(() =>
  Reflect.get(Vars.mods.scripts.class, "blacklist").clear()
).join();
Vars.content.blocks().each(
  (b) =>
    b.buildVisibility != BuildVisibility.hidden &&
    b.buildVisibility != BuildVisibility.shown,
  (b) => Vars.state.rules.revealedBlocks.add(b)
);
Call.sendMessage("server-scripts 스크립트 새로고침 완료");
Call.setRules(Vars.state.rules);

findp = (s) =>
  Groups.player.find(
    (p) => Strings.stripColors(p.name.toLowerCase()) == s.toLowerCase()
  ) || Groups.player.index(s);
sharp = findp("Sharlotte");

setFloor = (o, e) => {
  e.isOverlay() ? o.setFloorNet(o.floor(), e) : e.isFloor() && o.setFloorNet(e);
};
setTile = (e, l, t, i, r) => {
  (tile = Vars.world.tile(e, l)),
    t.isFloor() || t.isOverlay()
      ? setFloor(tile, t)
      : tile.setNet(t, i || Team.derelict, r || 0);
};
circleTile = (s, t, e, l, c, d, i) => {
  Vars.world.tile(s, t).circle(
    e,
    cons((r) => {
      (dst = Mathf.dst(s, t, r.x, r.y)),
        (!i || (e - i <= dst && dst <= e)) && setTile(r.x, r.y, l, c, d);
    })
  );
};
square = (i, e, s, x, y, r, f) => {
  for (ix = i; ix < s; ix += y.size)
    for (iy = e; iy < x; iy += y.size) setTile(ix, iy, y, f, r);
};
squareTile = (e, a, q, r, s, u, i, l) => {
  square(e, a, q, r, s, u, i),
    l || ((e += l), (a += l), (q -= l), (r -= l), square(e, a, q, r, s, u, i));
};
researchCost = (e) => {
  (str = "[accent]" + e.name + "[]"),
    e.researchRequirements().forEach((e) => {
      str += "\n" + e.item.emoji() + "[#" + e.item.color + "]" + e.amount;
    }),
    print(str);
};
checkPlayers = (e, l) => {
  for (i = l * e; i < l * (e + 1); i++)
    (p = Groups.player.index(i)),
      Call.sendMessage(
        "#" + i + ": " + p.name + " (" + p.tileX() + ", " + p.tileY() + ")"
      );
};

revealBlock = (b) => Vars.state.rules.revealedBlocks.add(b);
hideBlock = (b) => Vars.state.rules.revealedBlocks.remove(b);
banBlock = (b) => Vars.state.rules.bannedBlocks.add(b);
unbanBlock = (b) => Vars.state.rules.bannedBlocks.remove(b);
updaterule = () => {
  Call.sendMessage("[#ffd37f]game rules are updated!");
  Call.setRules(Vars.state.rules);
};

syncp = (p) => {
  Call.worldDataBegin(p.con);
  Vars.netServer.sendWorldData(p);
};
syncall = () => {
  Call.sendMessage("[#7457ce]World reloaded");
  Groups.player.each((p) => syncp(p));
};

/js Groups.all.each(e=>if(e instaceof Healthc && Mathf.dst(e.getX(), e.getY(), sharp.x, sharp.y)) Call.sendMessage(