var setup = (vec1, vec2, vec3, colors, radius) => {
  if(!(vec1 instanceof Vec2&&vec2 instanceof Vec2&&vec3 instanceof Vec2)) return Log.warn('YOU MUST PUT THREE VEC2 IN PARAMETER');
  if(radius&&Array.isArray(radius)) return Log.warn('THIS PARAMETER SHOULD BE NOT ARRAY, THE CURVE LINE STOKE');
  if(colors&&!Array.isArray(colors)) return Log.warn('THIS PARAMETER SHOULD BE ARRAY, THE LINE COLOR');

  const ef = new Effect(240, e => {
    Draw.color(e.color);
    Fill.circle(e.x, e.y, radius||1.5);
  });

  const drawLines = (v1, v2, v3, color) => {
    Draw.color(color);
    ef.at(v1.x, v1.y, 0, color);
    ef.at(v2.x, v2.y, 0, color);
    ef.at(v3.x, v3.y, 0, color);
    Lines.line(v1.x, v1.y, v2.x, v2.y);
    Lines.line(v2.x, v2.y, v3.x, v3.y);
    Lines.line(v3.x, v3.y, v1.x, v1.y);
  };

  const drawBezier = (v1, v2, v3, colors) => {
    if(colors.length < 1) return;
    const t = Mathf.absin(20,1);
    const n1 = new Vec2(v1.x * (1-t) + v2.x * t, v1.y * (1-t) + v2.y * t);
    const n2 = new Vec2(v2.x * (1-t) + v3.x * t, v2.y * (1-t) + v3.y * t);
    const n3 = new Vec2(v3.x * (1-t) + v1.x * t, v3.y * (1-t) + v1.y * t);
    drawLines(n1, n2, n3, colors.shift());
    drawBezier(n1, n2, n3, colors);
  };

  const drawing = () => drawBezier(vec1, vec2, vec3, colors||[Pal.accent, Pal.lancerLaser, Pal.spore, Pal.surge, Pal.heal]);

  Events.on(Trigger.draw.class, drawing);
  return () => Events.remove(Trigger.draw.class, drawing);
};

cancel = setup(new Vec2(130*8,70*8), new Vec2(140*8,85*8), new Vec2(150*8,70*8));

//cancel();
