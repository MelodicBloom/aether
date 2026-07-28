precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;
uniform float u_family;
uniform float u_structure;
uniform float u_spectral;
uniform float u_edge;

#define TAU 6.28318530718

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  mat2 r=mat2(0.877,0.479,-0.479,0.877);
  for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.03;a*=0.5;}
  return v;
}
vec3 spectrum(float x){
  vec3 phase=vec3(0.0,0.33,0.67);
  return 0.55+0.45*cos(TAU*(x+phase));
}

vec3 thinFilm(vec2 uv,float t){
  float pulse=0.12*sin(t*1.25);
  vec2 center=vec2(0.16*sin(t*0.7),0.12*cos(t*0.55));
  float radial=length((uv-center)*vec2(0.82+pulse,1.0-pulse));
  float warp=fbm(uv*1.35+vec2(t*0.55,-t*0.36));
  float bands=radial*6.5+warp*2.1-t*1.35;
  vec3 spectral=spectrum(bands*0.18+t*0.08);
  float rim=pow(smoothstep(0.12,1.15,radial),2.4+u_edge*3.0);
  float sheen=0.35+0.65*sin(bands)*sin(bands);
  vec3 base=mix(vec3(0.025,0.045,0.09),spectral,u_spectral*0.86);
  return base*(0.62+0.58*sheen)+spectral*rim*0.85;
}

vec3 shell(vec2 uv,float t){
  vec2 q=uv;
  q+=vec2(0.08*sin(t*0.55),0.06*cos(t*0.43));
  vec2 w=vec2(
    fbm(q*1.4+vec2(t*0.72,1.7+t*0.18)),
    fbm(q*1.7+vec2(4.2-t*0.31,-t*0.58))
  );
  float ridges=sin((q.x+w.x*0.95)*13.0+(q.y+w.y)*4.5+t*1.1);
  float depth=fbm(q*2.8+w*1.7+vec2(t*0.22,-t*0.16));
  float phase=depth*2.4+ridges*0.18+t*0.62;
  vec3 pearl=vec3(0.62,0.74,0.78)+0.34*cos(TAU*(phase+vec3(0.02,0.24,0.49)));
  float highlight=pow(clamp(depth+ridges*0.14,0.0,1.0),5.0);
  vec3 nacre=mix(vec3(0.12,0.06,0.16),pearl,0.72+0.25*u_spectral);
  return nacre*(0.72+depth*0.65)+vec3(1.0,0.92,0.78)*highlight*0.8;
}

vec3 aurora(vec2 uv,float t){
  vec2 q=uv;
  q.y+=t*0.22;
  q.x+=sin(q.y*1.8+t*1.15)*0.28;
  float veil1=exp(-8.0*abs(q.x+0.32*sin(q.y*1.3+t*0.9)));
  float veil2=exp(-10.0*abs(q.x-0.42*cos(q.y*1.1-t*0.78)));
  float shimmer=0.72+0.28*sin(q.y*5.0-t*1.8);
  float haze=fbm(vec2(q.x*1.2+t*0.18,q.y*2.5-t*0.95));
  vec3 night=vec3(0.008,0.018,0.075);
  vec3 cyan=vec3(0.02,0.95,0.82);
  vec3 violet=vec3(0.46,0.16,0.95);
  vec3 green=vec3(0.28,1.0,0.48);
  vec3 col=night;
  col+=cyan*veil1*(0.38+0.62*haze)*shimmer;
  col+=mix(violet,green,haze)*veil2*0.82*(1.0-shimmer*0.18);
  col+=vec3(0.04,0.08,0.22)*haze;
  return col;
}

void main(){
  vec2 safeRes=max(u_res,vec2(1.0));
  vec2 uv=(gl_FragCoord.xy/safeRes)*2.0-1.0;
  uv.x*=safeRes.x/safeRes.y;
  uv*=u_scale;

  // Preset speed remains semantic, while the multiplier keeps motion readable
  // on small mobile previews instead of appearing frozen.
  float t=u_time*max(u_speed,0.01)*4.5;

  vec3 col;
  if(u_family<0.5){
    col=thinFilm(uv,t);
  }else if(u_family<1.5){
    col=shell(uv,t);
  }else{
    col=aurora(uv,t);
  }

  float grain=(hash(gl_FragCoord.xy+floor(u_time*18.0))-0.5)*0.035*u_structure;
  col+=grain;
  col*=max(u_intensity,0.01)*1.35;
  col=col/(1.0+col);
  col=pow(max(col,vec3(0.0)),vec3(0.82));
  gl_FragColor=vec4(col,1.0);
}
