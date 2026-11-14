// TRADEMIND — scène 3D procédurale (ray-marching, WebGL 1, sans bibliothèque).
// Utilisée (a) en direct sur l'accueil pour les appareils capables, (b) hors ligne pour
// produire les rendus pré-calculés (tools/render-scenes). SCENE = 1..6 (défini avant compilation).
precision highp float;
uniform vec2 uFull;     // résolution totale de l'image
uniform vec2 uOff;      // décalage de tuile (rendu hors ligne)
uniform float uTime;
uniform vec4 uCam;      // x: lacet, y: hauteur (tangage), z: distance, w: décalage horizontal de cadrage
uniform vec3 uTarget;   // point visé
uniform vec2 uMouse;    // -1..1
#ifndef SCENE
#define SCENE 1
#endif
#ifdef LIVE
#define STEPS 72
#define BOUNCES 3
#else
#define STEPS 150
#define BOUNCES 5
#endif
const float PI = 3.14159265;
mat2 R(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float sdBox(vec3 p, vec3 b){ vec3 q = abs(p) - b; return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.); }
float sdRBox(vec3 p, vec3 b, float r){ return sdBox(p, b - r) - r; }
float sdTorus(vec3 p, vec2 t){ vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
float sdCyl(vec3 p, float r, float h){ vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h); return min(max(d.x, d.y), 0.) + length(max(d, 0.)); }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.); return length(pa - ba * h) - r; }
float sdFrame(vec3 p, vec3 b, float e){
  p = abs(p) - b; vec3 q = abs(p + e) - e;
  return min(min(length(max(vec3(p.x, q.y, q.z), 0.)) + min(max(p.x, max(q.y, q.z)), 0.),
                 length(max(vec3(q.x, p.y, q.z), 0.)) + min(max(q.x, max(p.y, q.z)), 0.)),
                 length(max(vec3(q.x, q.y, p.z), 0.)) + min(max(q.x, max(q.y, p.z)), 0.));
}
// fwidth indisponible en WebGL1 sans extension : largeur de ligne constante en espace monde
float fwidthSafe(vec2 p){ return .02; }
vec2 opU(vec2 a, vec2 b){ return a.x < b.x ? a : b; }
// matériaux : 0 sol · 1 chrome · 2 verre fumé · 3 métal brossé sombre · 4 émissif cyan · 5 émissif cuivre

#if SCENE == 1
const vec3 GC = vec3(0., .35, 0.); const float GR = 1.05; const float FLOOR = -1.;
vec2 scn(vec3 p, bool gl){
  vec2 r = vec2(p.y + 1., 0.);
  if (gl) r = opU(r, vec2(length(p - GC) - GR, 2.));
  vec3 q = p - GC;
  vec3 a = q; a.yz = R(1.25) * a.yz; a.xz = R(uTime * .18) * a.xz; r = opU(r, vec2(sdTorus(a, vec2(1.85, .045)), 1.));
  vec3 b = q; b.xy = R(.55) * b.xy; b.xz = R(-uTime * .12 + 1.) * b.xz; r = opU(r, vec2(sdTorus(b, vec2(2.35, .028)), 1.));
  vec3 c = q; c.yz = R(-.4) * c.yz; c.xz = R(uTime * .07) * c.xz; r = opU(r, vec2(sdTorus(c, vec2(1.45, .011)), 4.));
  r = opU(r, vec2(sdBox(p - vec3(-3.6, 1.6, -3.2), vec3(.42, 2.6, .42)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(3.8, 2.6, -4.4), vec3(.6, 3.6, .6)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(1.9, 1.1, -3.0), vec3(.28, 2.1, .28)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(-1.4, 2.2, -5.0), vec3(.5, 3.2, .5)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(1.9, 1.1, -2.7), vec3(.02, 2.0, .012)), 4.));
  r = opU(r, vec2(sdBox(p - vec3(-3.6, 1.6, -2.77), vec3(.02, 2.4, .012)), 4.));
  r = opU(r, vec2(sdCyl(p - vec3(0., -.96, 0.), 1.5, .04), 1.));
  return r;
}
#elif SCENE == 2
const vec3 GC = vec3(0., 100., 0.); const float GR = 0.; const float FLOOR = -1.;
vec2 scn(vec3 p, bool gl){
  vec2 r = vec2(p.y + 1., 0.);
  for (int i = 0; i < 9; i++){
    float fi = float(i);
    float y = -.86 + fi * .27;
    float rad = 1.25 - fi * .085 + .03 * sin(fi * 2.1);
    vec3 q = p - vec3(.025 * sin(fi * 1.7), y, .025 * cos(fi * 1.3));
    r = opU(r, vec2(sdCyl(q, rad, .105), 1.));
  }
  r = opU(r, vec2(sdTorus(p - vec3(0., .52, 0.), vec2(.82, .008)), 4.));
  r = opU(r, vec2(sdBox(p - vec3(2.4, 1.6, -3.0), vec3(.55, 3.0, .14)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(-2.9, 1.0, -3.6), vec3(.32, 2.5, .32)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(2.4, 1.6, -2.84), vec3(.012, 2.6, .01)), 4.));
  return r;
}
#elif SCENE == 3
const vec3 GC = vec3(0., 100., 0.); const float GR = 0.; const float FLOOR = -1.;
vec3 curve(float t){ return vec3(t * 3.6, -.55 + (t + 1.) * .78 + .2 * sin(t * 5.6), .55 * sin(t * 1.7) - .25); }
vec2 scn(vec3 p, bool gl){
  vec2 r = vec2(p.y + 1., 0.);
  vec3 prev = curve(-1.);
  for (int i = 1; i <= 16; i++){
    vec3 nx = curve(-1. + float(i) * .125);
    r = opU(r, vec2(sdCap(p, prev, nx, .062), 1.));
    if (i - (i / 2) * 2 == 0){ r = opU(r, vec2(sdCap(p, vec3(nx.x, -1., nx.z), nx, .006), 4.)); }
    prev = nx;
  }
  vec3 e = curve(1.);
  r = opU(r, vec2(length(p - e) - .15, 4.));
  r = opU(r, vec2(sdBox(p - vec3(-3.4, 1.3, -2.6), vec3(.4, 2.4, .3)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(4.0, 1.9, -3.2), vec3(.5, 3.0, .35)), 3.));
  return r;
}
#elif SCENE == 4
const vec3 GC = vec3(0., .28, 0.); const float GR = .36; const float FLOOR = -1.;
vec2 scn(vec3 p, bool gl){
  vec2 r = vec2(p.y + 1., 0.);
  if (gl) r = opU(r, vec2(length(p - GC) - GR, 2.));
  vec3 q = p - vec3(0., .28, 0.);
  vec3 id = clamp(floor(q + .5), vec3(-2., 0., -1.), vec3(2., 1., 1.));
  vec3 l = q - id;
  float m = 1.;
  if (id.x == 1. && id.y == 1. && id.z == -1.) m = 4.;
  if (id.x == -1. && id.y == 0. && id.z == 1.) m = 4.;
  r = opU(r, vec2(sdFrame(l, vec3(.455), .024), m));
  r = opU(r, vec2(sdBox(p - vec3(-4.0, 1.6, -3.2), vec3(.4, 2.6, .35)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(4.6, 2.2, -4.0), vec3(.55, 3.2, .5)), 3.));
  return r;
}
#elif SCENE == 5
const vec3 GC = vec3(.05, -.38, .55); const float GR = .6; const float FLOOR = -1.;
vec2 scn(vec3 p, bool gl){
  vec2 r = vec2(p.y + 1., 0.);
  if (gl) r = opU(r, vec2(length(p - GC) - GR, 2.));
  r = opU(r, vec2(sdRBox(p - vec3(-1.85, .95, 0.), vec3(.52, 1.95, .52), .03), 3.));
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    vec3 q = p - vec3(1.85 + (fi == 1. ? .2 : (fi == 2. ? -.14 : 0.)), -.62 + fi * 1.28 + (fi == 2. ? .18 : 0.), 0. + (fi == 1. ? .08 : 0.));
    q.xz = R(fi == 1. ? .09 : (fi == 2. ? -.12 : 0.)) * q.xz;
    r = opU(r, vec2(sdRBox(q, vec3(.52, .58, .52), .03), 3.));
  }
  r = opU(r, vec2(sdTorus(p - vec3(0., -.97, .0), vec2(1.1, .008)), 4.));
  r = opU(r, vec2(sdBox(p - vec3(0., 1.8, -3.6), vec3(3.4, 3.0, .15)), 3.));
  return r;
}
#else
const vec3 GC = vec3(0., 100., 0.); const float GR = 0.; const float FLOOR = -1.;
vec2 scn(vec3 p, bool gl){
  vec2 r = vec2(p.y + 1., 0.);
  vec3 q = p - vec3(0., .55, 0.);
  r = opU(r, vec2(length(q) - .34, 5.));
  vec3 a = q; a.yz = R(.9) * a.yz; a.xz = R(.5) * a.xz; r = opU(r, vec2(sdTorus(a, vec2(1.15, .03)), 1.));
  vec3 b = q; b.xy = R(1.15) * b.xy; b.xz = R(-.7) * b.xz; r = opU(r, vec2(sdTorus(b, vec2(1.5, .024)), 1.));
  vec3 c = q; c.yz = R(-.35) * c.yz; r = opU(r, vec2(sdTorus(c, vec2(1.88, .018)), 1.));
  vec3 d = q; d.xy = R(.3) * d.xy; r = opU(r, vec2(sdTorus(d, vec2(2.25, .007)), 4.));
  for (int i = 0; i < 6; i++){
    float fi = float(i);
    float an = fi * 1.0472 + .4;
    r = opU(r, vec2(length(q - vec3(cos(an) * 1.5, sin(an * 2.) * .5, sin(an) * 1.5)) - .07, 1.));
  }
  r = opU(r, vec2(sdBox(p - vec3(-3.4, 1.4, -3.4), vec3(.4, 2.4, .35)), 3.));
  r = opU(r, vec2(sdBox(p - vec3(3.6, 2.0, -4.2), vec3(.55, 3.2, .45)), 3.));
  return r;
}
#endif

vec2 map(vec3 p){ return scn(p, true); }
float mapS(vec3 p){ return scn(p, false).x; }
vec3 nrm(vec3 p){
  vec2 e = vec2(1., -1.) * .0008;
  return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}
float strip(vec3 d, vec3 n, vec3 u, vec3 v, float w, float l){
  float f = step(.0, dot(d, n));
  float a = abs(dot(d, u)), b = abs(dot(d, v));
  return f * smoothstep(w, w * .35, a) * smoothstep(l, l * .6, b);
}
vec3 env(vec3 d){
  vec3 c = mix(vec3(.004, .005, .007), vec3(.022, .028, .036), smoothstep(-.3, 1., d.y));
  c += vec3(.55, .62, .70) * strip(d, normalize(vec3(-.55, .62, .55)), normalize(vec3(.62, .55, .55)), normalize(vec3(0., .75, -.66)), .30, .95) * 2.6;
  c += vec3(.36, .78, .85) * strip(d, normalize(vec3(.8, .25, -.5)), normalize(vec3(.5, 0., .8)), vec3(0., 1., 0.), .10, .75) * 2.0;
  c += vec3(.7, .76, .82) * strip(d, normalize(vec3(0., 1., .15)), vec3(1., 0., 0.), vec3(0., 0., 1.), .22, .8) * 1.1;
  c += vec3(.08, .20, .24) * exp(-abs(d.y) * 9.) * .16;
  return c;
}
float softShadow(vec3 ro, vec3 rd){
  float res = 1., t = .03;
  for (int i = 0; i < 26; i++){
    float h = mapS(ro + rd * t);
    res = min(res, 9. * h / t);
    t += clamp(h, .03, .5);
    if (res < .002 || t > 9.) break;
  }
  res = clamp(res, 0., 1.);
  if (GR > 0.){
    vec3 oc = GC - ro; float tc = dot(oc, rd);
    if (tc > 0.){ float dd = length(oc - rd * tc); res *= 1. - .5 * (1. - smoothstep(GR * .55, GR * 1.15, dd)); }
  }
  return res;
}
float calcAO(vec3 p, vec3 n){
  float o = 0., s = 1.;
  for (int i = 1; i <= 5; i++){ float h = .02 + .13 * float(i); o += (h - map(p + n * h).x) * s; s *= .72; }
  return clamp(1. - 1.6 * o, 0., 1.);
}
float fres(float c, float f0){ return f0 + (1. - f0) * pow(1. - clamp(c, 0., 1.), 5.); }

vec3 beamGlow(vec3 ro, vec3 rd, float tmax){
#if SCENE == 1
  vec3 o = vec3(.2, 6.2, -.8); vec3 ax = normalize(vec3(0., .35, 0.) - o);
  vec3 acc = vec3(0.);
  float dt = min(tmax, 14.) / 26.;
  for (int i = 0; i < 26; i++){
    float t = (float(i) + .5) * dt; vec3 p = ro + rd * t;
    vec3 v = p - o; float h = dot(v, ax);
    if (h > 0.){
      float rad = .15 + h * .24; float d = length(v - ax * h);
      float den = exp(-d * d / (rad * rad)) * exp(-h * .16);
      acc += vec3(.30, .72, .82) * den * dt * .06;
    }
  }
  return acc;
#else
  return vec3(0.);
#endif
}

vec3 render(vec3 ro, vec3 rd, vec2 frag){
  vec3 col = vec3(0.), thr = vec3(1.), glow = vec3(0.);
  vec3 vol = vec3(0.);
  float tFirst = 30.;
  vec3 L = normalize(vec3(-.5, .9, .62));
  for (int b = 0; b < BOUNCES; b++){
    float t = .02; float hit = -1.; float mat = -1.;
    for (int i = 0; i < STEPS; i++){
      vec3 p = ro + rd * t;
      vec2 m = map(p);
      if (b == 0 && (m.y > 3.5)) glow += (m.y > 4.5 ? vec3(.9, .55, .30) : vec3(.30, .78, .88)) / (1. + m.x * m.x * 55.) * .020;
      if (m.x < .0006 * t){ hit = t; mat = m.y; break; }
      t += m.x * .9;
      if (t > 40.) break;
    }
    if (b == 0){ tFirst = hit > 0. ? hit : 30.; vol = beamGlow(ro, rd, tFirst); }
    if (hit < 0.){ col += thr * env(rd); break; }
    vec3 p = ro + rd * hit;
    vec3 n = nrm(p);
    float cosv = dot(-rd, n);
    if (mat < .5){
      // sol : graphite poli, grille discrète, forte réflexion
      float g = 0.;
      vec2 gp = p.xz;
      vec2 gl2 = abs(fract(gp + .5) - .5) / fwidthSafe(gp);
      g = 1. - min(min(gl2.x, gl2.y), 1.);
      float fade = exp(-length(p.xz) * .18);
      float sh = softShadow(p + n * .01, L);
      float ao = calcAO(p, n);
      vec3 alb = vec3(.022, .026, .032);
      vec3 dif = alb * (env(n) * 1.4 + vec3(.7, .78, .85) * max(dot(n, L), 0.) * sh * .55) * ao;
      dif += vec3(.12, .30, .34) * g * fade * .22;
      float F = fres(cosv, .16);
      col += thr * dif * (1. - F);
      thr *= F * vec3(.96, .98, 1.);
      ro = p + n * .003;
      vec3 rr = reflect(rd, n);
      rr = normalize(rr + (vec3(hash(frag + float(b)), hash(frag.yx + 3.1 + float(b)), hash(frag + 7.7)) - .5) * .018);
      rd = rr;
    } else if (mat < 1.5){
      // chrome
      float F = fres(cosv, .62);
      thr *= mix(vec3(.82, .86, .90), vec3(1.), F) * .96;
      ro = p + n * .003; rd = reflect(rd, n);
    } else if (mat < 2.5){
      // verre fumé : réflexion + réfraction analytique, absorption teintée, lueur interne
      vec3 nI = normalize(p - GC);
      float F = fres(dot(-rd, nI), .045);
      col += thr * F * env(reflect(rd, nI)) * 1.15;
      vec3 rin = refract(rd, nI, 1. / 1.5);
      float tin = -2. * dot(p - GC, rin);
      vec3 pe = p + rin * tin;
      vec3 nE = normalize(pe - GC);
      float dc = length(cross(p - GC, rin));
      vec3 absorb = exp(-tin * vec3(.62, .46, .36));
      col += thr * absorb * vec3(.10, .34, .40) * exp(-dc * dc * 5.5) * .85 * (1. - F);
      thr *= absorb * (1. - F);
      vec3 rout = refract(rin, -nE, 1.5);
      if (dot(rout, rout) < .001) rout = reflect(rin, -nE);
      rd = normalize(rout); ro = pe + rd * .01;
    } else if (mat < 3.5){
      // métal brossé sombre
      float sh = softShadow(p + n * .01, L);
      float ao = calcAO(p, n);
      float F = fres(cosv, .08);
      vec3 alb = vec3(.052, .058, .068);
      vec3 dif = alb * (env(n) * 1.3 + vec3(.7, .78, .85) * max(dot(n, L), 0.) * sh * .9) * ao;
      col += thr * dif * (1. - F * .5);
      thr *= F * .55 + .06;
      ro = p + n * .003; rd = reflect(rd, n);
      rd = normalize(rd + (vec3(hash(frag + float(b) * 1.7), hash(frag.yx + 2.3), hash(frag + 5.1)) - .5) * .06);
    } else if (mat < 4.5){
      col += thr * vec3(.36, .84, .94) * 2.6; break;
    } else {
      col += thr * vec3(1., .62, .34) * 3.0; break;
    }
    if (thr.x + thr.y + thr.z < .03) break;
  }
  float fog = 1. - exp(-tFirst * .045);
  col = mix(col, vec3(.005, .007, .010), fog * .8);
  col += vol + glow;
  return col;
}

vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }

void main(){
  vec2 frag = gl_FragCoord.xy + uOff;
  vec2 uv = (frag - .5 * uFull) / uFull.y;
  uv.x += uCam.w;
  float yaw = uCam.x + uMouse.x * .06;
  float pit = uCam.y + uMouse.y * .03;
  vec3 ro = uTarget + uCam.z * vec3(sin(yaw) * cos(pit), sin(pit), cos(yaw) * cos(pit));
  vec3 fw = normalize(uTarget - ro);
  vec3 rt = normalize(cross(fw, vec3(0., 1., 0.)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(uv.x * rt + uv.y * up + 1.7 * fw);
  vec3 c = render(ro, rd, frag);
  // objectif : léger vignettage, tonalité cinéma
  vec2 q = (frag / uFull) - .5;
  c *= 1. - dot(q, q) * 1.05;
  c = aces(c * 1.05);
  c = pow(c, vec3(1. / 2.2));
  c += (hash(frag + uTime) - .5) * .012;
  gl_FragColor = vec4(c, 1.);
}
