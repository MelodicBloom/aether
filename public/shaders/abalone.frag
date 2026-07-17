precision mediump float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;mat2 r=mat2(0.877,0.479,-0.479,0.877);for(int i=0;i<6;i++){v+=a*noise(p);p=r*p*2.1;a*=0.48;}return v;}
vec3 pearl(float t){vec3 a=vec3(0.55,0.50,0.55),b=vec3(0.45),c=vec3(1.0),d=vec3(0.0,0.15,0.40);return a+b*cos(6.28318*(c*t+d));}

void main(){
  vec2 uv=(gl_FragCoord.xy/u_res)*2.0-1.0;
  uv.x*=u_res.x/u_res.y;
  uv*=u_scale;
  float t=u_time*u_speed;
  vec2 w1=vec2(fbm(uv*1.8+vec2(t,t*0.7)),fbm(uv*1.8+vec2(t*0.6+4.3,-t*0.5+1.7)));
  vec2 w2=vec2(fbm(uv*3.5+w1*1.4+t*0.5),fbm(uv*3.5+w1*1.4-t*0.4+9.1));
  vec3 n=normalize(vec3(w2*0.8,1.0));
  vec3 l=normalize(vec3(sin(t*0.7)*0.6,cos(t*0.5)*0.6,1.0));
  float ndl=dot(n,l)*0.5+0.5;
  float phase=fbm(uv*2.0+w1*0.6)*2.0+ndl*1.6+t*0.25;
  vec3 col=pearl(phase);
  float spec=pow(max(0.0,dot(n,l)),32.0);
  col+=vec3(1.0,0.97,0.92)*spec*0.6;
  float depth=fbm(uv*1.2+t*0.1);
  col=mix(col*0.25,col,smoothstep(0.2,0.7,depth));
  float vig=1.0-dot(uv*0.42,uv*0.42);
  col*=smoothstep(0.0,0.7,vig)*u_intensity;
  gl_FragColor=vec4(col,1.0);
}
