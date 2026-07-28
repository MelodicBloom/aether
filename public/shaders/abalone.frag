precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(
    mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
    mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),
    f.y
  );
}
float fbm(vec2 p){
  float v=0.0;
  float a=0.5;
  mat2 r=mat2(0.877,0.479,-0.479,0.877);
  for(int i=0;i<5;i++){
    v+=a*noise(p);
    p=r*p*2.03;
    a*=0.5;
  }
  return v;
}
vec3 pearl(float t){
  vec3 a=vec3(0.58,0.52,0.62);
  vec3 b=vec3(0.48,0.42,0.52);
  vec3 c=vec3(1.0,1.04,0.96);
  vec3 d=vec3(0.00,0.18,0.38);
  return a+b*cos(6.28318*(c*t+d));
}

void main(){
  vec2 safeRes=max(u_res,vec2(1.0));
  vec2 uv=(gl_FragCoord.xy/safeRes)*2.0-1.0;
  uv.x*=safeRes.x/safeRes.y;
  uv*=u_scale;

  float t=u_time*u_speed;
  vec2 w1=vec2(
    fbm(uv*1.55+vec2(t*0.65,t*0.42)),
    fbm(uv*1.55+vec2(t*0.38+4.3,-t*0.35+1.7))
  );
  vec2 w2=vec2(
    fbm(uv*3.1+w1*1.55+vec2(t*0.28,0.0)),
    fbm(uv*3.1+w1*1.55+vec2(0.0,-t*0.24)+9.1)
  );

  vec3 n=normalize(vec3((w2-0.5)*1.45,1.0));
  vec3 l=normalize(vec3(sin(t*0.7)*0.55,cos(t*0.5)*0.55,1.0));
  float ndl=clamp(dot(n,l)*0.5+0.5,0.0,1.0);
  float phase=fbm(uv*1.85+w1*0.72)*2.25+ndl*1.45+t*0.18;

  vec3 col=pearl(phase);
  float spec=pow(max(0.0,dot(n,l)),24.0);
  col+=vec3(1.0,0.97,0.94)*spec*0.95;

  float depth=fbm(uv*1.1+vec2(t*0.08,-t*0.05));
  col=mix(col*0.62,col*1.25,smoothstep(0.12,0.82,depth));

  float edge=1.0-smoothstep(0.35,1.55,length(uv));
  col*=mix(0.72,1.0,edge);

  col*=max(u_intensity,0.01)*1.65;
  col=col/(1.0+col);
  col=pow(max(col,vec3(0.0)),vec3(0.78));

  gl_FragColor=vec4(col,1.0);
}
