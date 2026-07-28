precision highp float;
uniform float u_time; uniform vec2 u_res; uniform float u_speed; uniform float u_intensity; uniform float u_scale; uniform float u_family; uniform float u_structure; uniform float u_spectral; uniform float u_edge; uniform float u_flow; uniform float u_depth;
#define PI 3.14159265359
#define TAU 6.28318530718
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.877,.479,-.479,.877);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.03;a*=.5;}return v;}
vec3 spectrum(float x){return .55+.45*cos(TAU*(x+vec3(0.,.33,.67)));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float lineSdf(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),.0001),0.,1.);return length(pa-ba*h);}

vec3 boseEinstein(vec2 uv,float t){
  vec2 q=rot(.13*sin(t*.33))*uv; float r=length(q); float phase=atan(q.y,q.x)*5.+r*15.-t*2.1;
  float density=exp(-3.2*r*r); float rings=.5+.5*cos(phase+2.2*fbm(q*2.+t*.08));
  float vortex=exp(-18.*abs(r-(.34+.05*sin(t*.7)))); vec3 cold=mix(vec3(.003,.015,.05),vec3(.12,.85,1.),density);
  return cold+density*spectrum(phase*.08+t*.04)*pow(rings,3.)*1.15+vortex*vec3(.7,.25,1.)*.8;
}
vec3 chladni(vec2 uv,float t){
  vec2 q=rot(.08*sin(t*.35))*uv; float m=3.+floor(mod(t*.18,3.)); float n=5.+floor(mod(t*.13,4.));
  float f=sin(m*PI*q.x)*sin(n*PI*q.y)-sin(n*PI*q.x)*sin(m*PI*q.y); float node=exp(-34.*abs(f));
  float dust=noise(q*160.+t*.2); vec3 c=spectrum(q.x*.18+q.y*.14+t*.03);
  return vec3(.004,.006,.018)+c*node*(.45+1.15*pow(dust,4.))+vec3(.2,.08,.4)*exp(-6.*abs(f));
}
vec3 ferrofluid(vec2 uv,float t){
  vec2 q=uv; vec2 m=.28*vec2(sin(t*.55),cos(t*.43)); vec2 d=q-m; float r=max(length(d),.03),a=atan(d.y,d.x);
  float field=sin(a*24.-3.1/r+t*1.4+fbm(q*3.)*2.8); float spikes=pow(.5+.5*field,18.)*exp(-.55*r);
  float ridge=pow(.5+.5*sin(a*37.+1.8/r-t*.9),22.)*exp(-.82*r); float glint=step(.91,noise(floor(vec2(a*13.,r*35.))));
  vec3 ink=vec3(.003,.004,.009)+vec3(.09,.11,.15)*spikes*1.8+vec3(.02,.04,.055)*ridge;
  return ink+spectrum(a/TAU+t*.02)*spikes*glint*.18;
}
vec3 standingWave(vec2 uv,float t){
  vec2 q=uv; float w1=sin(q.x*11.+t*1.7)*cos(q.y*8.-t*1.2); float w2=cos(q.x*7.-t*.9)*sin(q.y*13.+t*1.4);
  float amp=w1+w2; float nodes=exp(-24.*abs(amp)); float energy=.5+.5*sin(amp*5.+t*2.);
  return vec3(.003,.008,.025)+spectrum(amp*.18+t*.06)*(nodes*.9+energy*.24)+vec3(.05,.3,.55)*abs(amp)*.22;
}
vec3 causticLens(vec2 uv,float t){
  vec2 tilt=.16*vec2(sin(t*.47),cos(t*.39)); vec2 q=uv-tilt; float r=length(q); float z=sqrt(max(.001,1.-min(1.,r*r*.72)));
  float n=fbm(q*2.8+vec2(t*.18,-t*.14)); float c1=pow(.5+.5*sin((q.x+n*.55)*13.+t*2.2),9.);
  float c2=pow(.5+.5*cos((q.y-n*.45)*15.-t*1.8),10.); float rim=exp(-28.*abs(r-(.7+.04*sin(t))));
  return vec3(.005,.016,.035)+vec3(.12,.6,1.)*(c1+c2)*z*.72+spectrum(n+t*.04)*rim*.95+pow(z,24.)*vec3(.8,.95,1.)*.65;
}
vec3 soapFilm(vec2 uv,float t){
  vec2 q=uv; float n1=fbm(q*1.6+vec2(t*.16,-t*.11)); float n2=fbm(q*4.1+vec2(-t*.13,t*.19));
  float thickness=n1*.75+n2*.25+.12*sin(q.x*4.+q.y*3.-t); vec3 ir=spectrum(thickness*2.4+t*.05);
  float vein=pow(.5+.5*sin((n1-n2)*24.+t*1.8),14.); float edge=pow(clamp(1.-length(q)*.55,0.,1.),.28);
  return mix(vec3(.006,.012,.03),ir,.82)*(edge+.32)+ir*vein*.72+vec3(.7,.95,1.)*pow(edge,9.)*.18;
}
vec3 polarization(vec2 uv,float t){
  vec2 q=rot(t*.09)*uv; float a=atan(q.y,q.x); float r=length(q); float p1=cos(a*6.+r*12.-t*1.8); float p2=sin(a*8.-r*9.+t*1.3);
  float malus=pow(abs(cos(.5*(p1-p2)+t*.25)),2.); float cross=exp(-18.*abs(p1*p2));
  return vec3(.004,.007,.026)+spectrum(a/TAU+r*.22+t*.04)*(malus*.75+cross*.65)+vec3(.1,.55,1.)*pow(malus,8.)*.32;
}
vec3 gravLens(vec2 uv,float t){
  vec2 c=.18*vec2(sin(t*.31),cos(t*.27)); vec2 q=uv-c; float r=max(length(q),.035); vec2 bend=q*(1.+.16/(r*r+.08));
  float stars=step(.985,hash(floor((bend+t*.006)*145.))); float ring=exp(-42.*abs(r-(.42+.035*sin(t*.6))));
  float disk=exp(-18.*abs(q.y+.08*sin(q.x*6.+t)))*smoothstep(.85,.12,r); vec3 star=spectrum(hash(floor(bend*80.))+t*.01);
  return vec3(.001,.002,.009)+stars*star*1.8+ring*spectrum(aTan(q.y,q.x)/TAU+t*.03)*1.35+disk*mix(vec3(1.,.18,.04),vec3(.1,.55,1.),q.x*.5+.5)*1.1;
}
vec3 voronoiGrowth(vec2 uv,float t){
  vec2 q=uv*4.; vec2 i=floor(q),f=fract(q); float md=10.; float sid=0.;
  for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));float id=hash(i+g);vec2 o=.5+.38*vec2(sin(id*TAU+t*.33),cos(id*TAU-t*.29));float d=length(g+o-f);if(d<md){md=d;sid=id;}}}
  float wall=exp(-18.*md); float pulse=.55+.45*sin(t*1.6+sid*TAU); vec3 c=spectrum(sid+t*.035);
  return mix(vec3(.005,.012,.03),c,.34+u_spectral*.45)*(1.-md*.4)+c*wall*(.4+.8*pulse);
}
vec3 electromagnetic(vec2 uv,float t){
  vec2 q=uv; vec3 col=vec3(.002,.006,.02); for(int i=0;i<7;i++){float fi=float(i);float phase=t*(1.1+fi*.08)+fi*.9;
    vec2 p=.48*vec2(cos(phase),sin(phase*.83)); vec2 d=q-p; float r=max(length(d),.03); float a=atan(d.y,d.x);
    float flux=exp(-8.*r)*pow(.5+.5*sin(a*10.+2.2/r-phase*2.),8.); col+=spectrum(fi*.11+t*.04)*flux*.72;}
  return col;
}
vec3 curlVorticity(vec2 uv,float t){
  vec2 q=uv; float n=fbm(q*1.7+vec2(t*.09,-t*.07)); vec2 v=vec2(fbm(q*2.3+vec2(.02,t*.12))-fbm(q*2.3-vec2(.02,-t*.12)),fbm(q*2.3+vec2(t*.1,.02))-fbm(q*2.3-vec2(-t*.1,.02)));
  q+=v*.55; float curl=sin((q.x+q.y+n)*13.-t*2.1); float fil=pow(.5+.5*curl,9.); return vec3(.003,.008,.024)+spectrum(n+t*.04)*fil*.95+vec3(.05,.25,.48)*length(v)*.5;
}
vec3 flowNetworks(vec2 uv,float t){
  vec2 q=uv*2.4; vec3 col=vec3(.003,.007,.022); for(int i=0;i<8;i++){float fi=float(i);float y=-1.05+fi*.3+.07*sin(t*.7+fi);float curve=y+.18*sin(q.x*(1.2+fi*.04)+fi*1.6+t*.55);
    float path=exp(-55.*abs(q.y-curve));float packet=pow(.5+.5*sin(q.x*4.-t*(2.8+fi*.16)+fi),20.);col+=spectrum(fi*.09+t*.03)*path*(.12+packet*1.15);}
  return col;
}

void main(){
  vec2 res=max(u_res,vec2(1.)); vec2 uv=gl_FragCoord.xy/res*2.-1.; uv.x*=res.x/res.y; uv*=u_scale;
  float t=u_time*max(u_speed,.01)*4.5; vec3 col;
  if(u_family<.5)col=boseEinstein(uv,t);else if(u_family<1.5)col=chladni(uv,t);else if(u_family<2.5)col=ferrofluid(uv,t);else if(u_family<3.5)col=standingWave(uv,t);else if(u_family<4.5)col=causticLens(uv,t);else if(u_family<5.5)col=soapFilm(uv,t);else if(u_family<6.5)col=polarization(uv,t);else if(u_family<7.5)col=gravLens(uv,t);else if(u_family<8.5)col=voronoiGrowth(uv,t);else if(u_family<9.5)col=electromagnetic(uv,t);else if(u_family<10.5)col=curlVorticity(uv,t);else col=flowNetworks(uv,t);
  float grain=(hash(gl_FragCoord.xy+floor(u_time*15.))-.5)*.012*u_structure; col+=grain; col*=max(u_intensity,.01)*1.3; col=col/(1.+col); col=pow(max(col,vec3(0.)),vec3(.82)); gl_FragColor=vec4(col,1.);
}