
Vars.state.rules.unitCap=500;
UnitTypes.flare.speed=50;
sharp=Vars.player;
/*
when it doesn't work, use this
*/
amount=500;
type=UnitTypes.flare;
player=sharp;
speed=0.3;
spacing = 80;
commandAll = false;
var angle = 360;
var units = new Seq();
var initformat=(equ, amount, type, player, speed, spacing, commandAll)=>{
  amount = Math.min(amount, Vars.state.rules.unitCap);
  
  units = Groups.unit.copy(new Seq()).filter(u=>commandAll || u.type==type);

  if(!commandAll && units.size <= amount){
    for(var i = 0; i < amount-Groups.unit.count(u=>u.type==type); i++) 
      type.spawn(player.team(), player.x, player.y);
  }

  player.unit().command(new Formation(new Vec3(player.x, player.y, 0), new JavaAdapter(FormationPattern, {
    calculateSlotLocation(out, slot){
      angle+=speed;
      var radian = angle / 360 * slot/this.slots * Mathf.degRad;
      equ(out, radian);
      return out;
    }
  })), units);

  player.unit().formation.pattern.spacing = spacing;
};

/*나비 방정식*/
var nabi=(out, radian)=>{
  const sizeScaling = 1;
  const rotateSpeed = 0.005;
  const equ = sizeScaling * (Mathf.pow(Mathf.E, Mathf.sin(radian)) - 2 * Mathf.cos(4 * radian) + Mathf.pow(Mathf.sin((2 * radian - Mathf.PI) / 24), 5));

  out.set(Tmp.v1.set(this.spacing * equ * Mathf.cos(radian), this.spacing * equ * Mathf.sin(radian)).rotateRad(Time.time * rotateSpeed), 0);
};

/*별의 방정식 베타(비교차)*/
var starBeta=(out, radian)=>{
  const sizeScaling = 0.5;
  const rotateSpeed = 0.005;
  const a = 3.5;
  const equ = sizeScaling * (Mathf.sin(5 * radian) + a);

  out.set(Tmp.v1.set(this.spacing * equ * Mathf.cos(radian), this.spacing * equ * Mathf.sin(radian)).rotateRad(Time.time * rotateSpeed), 0);
};

/*하트 방정식*/
var heart=(out, radian)=>{
  const sizeScaling = 0.5;
  const rotateSpeed = 0.001;

  out.set(Tmp.v1.set(this.spacing * sizeScaling * 16 * Mathf.pow(Mathf.sin(radian), 3), this.spacing * (sizeScaling * 13 * Mathf.cos(radian) - sizeScaling * 5 * Mathf.cos(2 * radian) - sizeScaling * 2 * Mathf.cos(3 * radian) - sizeScaling * Mathf.cos(4 * radian))).rotateRad(Time.time * rotateSpeed), 0);
};

/*연꽃 방정식*/
var flower=(out, radian)=>{
  const sizeScaling = 0.25;
  const rotateSpeed = 0.005;
  const value1 = 11 * sizeScaling;
  const value2 = 6 * sizeScaling;
  const value = value1/value2;

  out.set(Tmp.v1.set(this.spacing * (value1 * Mathf.cos(radian) - value2 * Mathf.cos(value * radian)), this.spacing * (value1 * Mathf.sin(radian) - value2 * Mathf.sin(value * radian))).rotateRad(Time.time * rotateSpeed), 0);
};

/*곡선별 방정식(교차)*/
var curvStar=(out, radian)=>{
  const sizeScaling = 0.25;
  const rotateSpeed = 0.01;

  out.set(Tmp.v1.set(this.spacing * (sizeScaling * 5 * Mathf.cos(2 * radian) + sizeScaling * 2 * Mathf.cos(3 * radian)), this.spacing * (sizeScaling * 2 * Mathf.sin(3 * radian) - sizeScaling * 5 * Mathf.sin(2 * radian))).rotateRad(Time.time * rotateSpeed), 0);
};

/*사인도배 별의 방정식*/
var sinStar=(out, radian)=>{
  const sizeScaling = 1;
  const rotateSpeed = 0.005; /*max*/
  let equ = Mathf.cos(5 * radian - 0.5 * Mathf.PI);
  for(var i = 0; i < 20; i++) equ = Math.sin(equ);
  equ = sizeScaling * (Mathf.PI * equ + 3.5);
  var vec = Tmp.v1.set(this.spacing * equ * Mathf.cos(radian), this.spacing * equ * Mathf.sin(radian)).rotateRad(Time.time * rotateSpeed);
  for(var i = 0; i < 2; i++) vec.rotateRad(radian);

  out.set(vec, 0);
};

/*다중 별의 방정식*/
var multiStar=(out, radian)=>{
  const sizeScaling = 1;
  const rotateSpeed = 0.005; /*max*/
  const equ = sizeScaling * (slot % 10) * Mathf.cos(Mathf.sin(2.5 * (radian - 0.5 * Mathf.PI)));

  out.set(Tmp.v1.set(this.spacing * equ * Mathf.cos(radian), this.spacing * equ * Mathf.sin(radian)).rotateRad(Time.time * rotateSpeed), 0);
};

/*다엽장미곡선 방정식*/
var flowmulti=(out, radian)=>{
  const sizeScaling = 1;
  const rotateSpeed = 0.005; /*max*/
  const size = 3; /*formation size*/
  const width = 7; /*rose width*/
  const k = width / 4;
  const equ = sizeScaling * size * Mathf.cos(k * radian);

  out.set(Tmp.v1.set(this.spacing * equ * Mathf.cos(radian), this.spacing * equ * Mathf.sin(radian)).rotateRad(Time.time * rotateSpeed), 0);
};

/*2파이 네잎클로버 방정식*/
var twopi=(out, radian)=>{
  const sizeScaling = 1;
  const rotateSpeed = 0.005; /*max*/
  const size = 4;
  const equ = sizeScaling * (radian + 1000 % (Mathf.PI * 2));

  out.set(Tmp.v1.set(this.spacing * size * Mathf.cos(2 * equ) * Mathf.cos(equ), this.spacing * size * Mathf.cos(2 * equ) * Mathf.sin(equ)).rotateRad(Time.time * rotateSpeed), 0);
};

var equs=[nabi, starBeta, heart, flower, curvStar, sinStar, multiStar, flowmulti, twopi];


initformat(equs[3], 500, UnitTypes.flare, sharp,0.3,80,false);