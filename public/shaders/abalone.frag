precision highp float;
uniform float u_time; uniform vec2 u_res; uniform float u_speed; uniform float u_intensity; uniform float u_scale; uniform float u_family; uniform float u_structure; uniform float u_spectral; uniform float u_edge; uniform float u_flow; uniform float u_depth;
#define PI 3.14159265359
#define TAU 6.28318530718
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.877,.479,-.479,.877);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.03;a*=.5;}return v;}
vec3 spectrum(float x){return .55+.45*cos(TAU*(x+vec3(0.,.33,.67)));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float lineSdf(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}

vec3 thinFilm(vec2 uv,float t){
  vec2 q=rot(.18*sin(t*.4))*uv; float n1=fbm(q*2.1+vec2(t*.34,-t*.22)); float n2=fbm(q*4.2+vec2(-t*.18,t*.29));
  float membrane=sin((q.x+n1*.52)*8.5+t*1.3)+cos((q.y-n2*.4)*7.2-t*.9);
  float phase=membrane*.16+n1*.72+n2*.28+t*.12; vec3 sp=spectrum(phase*1.35);
  float caust=pow(.5+.5*sin((n1-n2)*18.+t*2.1),5.); float edge=pow(clamp(1.-length(q)*.68,0.,1.),.35);
  return mix(vec3(.015,.025,.07),sp,.76*u_spectral)*(edge+.42)+sp*caust*.7+vec3(.3,.75,1.)*pow(max(0.,sin(phase*22.)),12.)*.22;
}
vec3 shell(vec2 uv,float t){vec2 q=uv+.07*vec2(sin(t*.55),cos(t*.43));vec2 w=vec2(fbm(q*1.4+vec2(t*.72,1.7)),fbm(q*1.7+vec2(4.2,-t*.58)));float rid=sin((q.x+w.x*.95)*13.+(q.y+w.y)*4.5+t*1.1);float d=fbm(q*2.8+w*1.7+vec2(t*.22,-t*.16));float ph=d*2.4+rid*.18+t*.62;vec3 p=vec3(.62,.74,.78)+.34*cos(TAU*(ph+vec3(.02,.24,.49)));float hi=pow(clamp(d+rid*.14,0.,1.),5.);return mix(vec3(.12,.06,.16),p,.72+.25*u_spectral)*(.72+d*.65)+vec3(1.,.92,.78)*hi*.8;}
vec3 aurora(vec2 uv,float t){vec2 q=uv;q.y+=t*.22*u_flow;q.x+=sin(q.y*1.8+t*1.15)*.28;float a=exp(-8.*abs(q.x+.32*sin(q.y*1.3+t*.9)));float b=exp(-10.*abs(q.x-.42*cos(q.y*1.1-t*.78)));float h=fbm(vec2(q.x*1.2+t*.18,q.y*2.5-t*.95));return vec3(.008,.018,.075)+vec3(.02,.95,.82)*a*(.38+.62*h)+mix(vec3(.46,.16,.95),vec3(.28,1.,.48),h)*b*.82+vec3(.04,.08,.22)*h;}
vec3 fresnel(vec2 uv,float t){
  vec2 tilt=vec2(.32*sin(t*.72),.24*cos(t*.57)); vec2 q=uv-tilt*.28; q=rot(.18*sin(t*.41))*q;
  float z=sqrt(max(.001,1.-min(1.,dot(q,q)*.72))); vec3 n=normalize(vec3(q.x+tilt.x,q.y+tilt.y,z)); vec3 v=normalize(vec3(-tilt*.7,1.8));
  float fr=pow(1.-max(0.,dot(n,v)),2.2+u_edge*3.8); float aperture=abs(length(q)-(.58+.09*sin(t*1.1)));
  float ring=exp(-42.*aperture); float iris=.5+.5*cos(atan(q.y,q.x)*12.+t*1.8+fbm(q*3.)*2.);
  vec3 rim=spectrum(atan(q.y,q.x)/TAU+t*.08)*fr*(1.2+u_spectral); vec3 lens=vec3(.008,.014,.04)+vec3(.03,.16,.22)*z;
  return lens+rim+ring*mix(vec3(.1,.8,1.),vec3(1.,.15,.75),iris)*1.4+pow(z,18.)*vec3(.5,.8,1.)*.35;
}
vec3 holo(vec2 uv,float t){
  vec2 a=rot(.12*sin(t*.8))*uv, b=rot(-.17*cos(t*.63))*uv; float l1=.5+.5*sin(a.x*34.+a.y*6.-t*6.); float l2=.5+.5*sin(b.x*29.-b.y*8.+t*5.2);
  float moire=pow(abs(l1-l2),.42); float scan=.5+.5*sin((uv.x+uv.y)*12.-t*9.); float micro=step(.84,hash(floor((uv+t*.08)*180.)));
  vec3 sp=spectrum(uv.x*.56+uv.y*.32+moire*.72+t*.18); return vec3(.012,.018,.055)+sp*(.18+moire*.9+scan*.22)+micro*sp*1.6;
}
vec3 metal(vec2 uv,float t){vec2 w=vec2(fbm(uv*1.8+vec2(t*.42,0.)),fbm(uv*1.8+vec2(3.,-t*.35)));float f=sin((uv.x+w.x)*7.+t)+cos((uv.y+w.y)*6.-t*.8);float hi=pow(.5+.5*f*.5,6.);vec3 steel=mix(vec3(.025,.03,.04),vec3(.75,.82,.9),smoothstep(-.5,.8,f));return steel*(.45+u_depth*.55)+hi*vec3(1.,.9,.72);}
vec3 velvet(vec2 uv,float t){
  float block=floor(mod(t*3.,7.)); vec2 q=uv; float gate=step(.72,noise(vec2(floor(q.y*12.),block)));
  q.x+=gate*.09*sin(q.y*45.+t*11.); q.y+=step(.86,noise(vec2(block,floor(q.x*9.))))*.045;
  float ang=.25*sin(t*.8); vec2 d=vec2(cos(ang),sin(ang)); float fibers=.5+.5*sin(dot(q,d)*128.+fbm(q*5.+t*.12)*9.);
  float nap=pow(abs(dot(d,normalize(q+.001))),2.); vec3 base=mix(vec3(.018,.004,.035),vec3(.5,.018,.34),nap);
  vec3 chrom=vec3(fbm(q*3.+.02),fbm(q*3.),fbm(q*3.-.02)); float tear=step(.82,noise(vec2(floor(q.y*22.),block)))*gate;
  return base+vec3(.5,.12,.58)*fibers*.15*u_structure+chrom*tear*.8;
}
vec3 crystal(vec2 uv,float t){
  vec2 q=rot(t*.18)*uv*3.2; vec2 cell=floor(q),f=fract(q)-.5; float id=hash(cell); vec2 axis=vec2(cos(id*TAU+t*.7),sin(id*TAU+t*.7));
  float facet=abs(dot(f,axis)); float bevel=1.-smoothstep(.34,.5,max(abs(f.x),abs(f.y))); float refr=fbm(q*.8+axis*t*.35);
  vec3 pr=spectrum(id+t*.18+facet*.65+refr*.25); float pulse=.6+.4*sin(t*2.2+id*TAU); return mix(vec3(.01,.035,.08),pr,.42+u_spectral*.42)*(1.-facet*.28)+pr*bevel*(.4+.5*pulse)*u_edge;
}
vec3 ionBloom(vec2 uv,float t){vec2 q=uv;float d=10.;for(int i=0;i<5;i++){float fi=float(i);q=abs(q)/clamp(dot(q,q),.22,2.4)-vec2(.72+.08*sin(t+fi),.48+.06*cos(t*.8+fi));d=min(d,length(q)*pow(.62,fi));}float core=exp(-18.*d);float halo=exp(-4.*d);return vec3(.01,.005,.05)+spectrum(d*2.-t*.18)*core*2.4+vec3(.15,.25,1.)*halo*.8;}
vec3 opal(vec2 uv,float t){
  vec2 q=rot(.08*sin(t*.5))*uv; float lens=sqrt(max(.001,1.-min(1.,dot(q,q)*.58))); float n=fbm(q*2.2+vec2(t*.22,-t*.16));
  float c1=pow(.5+.5*sin((q.x+n*.5)*9.+t*1.8),6.); float c2=pow(.5+.5*cos((q.y-n*.4)*11.-t*1.4),7.);
  float bubbles=smoothstep(.94,1.,noise(floor((q+t*.03)*18.))); vec3 milk=mix(vec3(.045,.09,.13),vec3(.72,.82,.78),lens*.72);
  vec3 ir=spectrum(n*.8+t*.06)*(.22+.52*(c1+c2)); return milk*.72+ir+bubbles*vec3(.9,.8,1.)*.5+pow(lens,24.)*vec3(.8,.95,1.)*.7;
}
vec3 magnetic(vec2 uv,float t){vec2 m=.42*vec2(sin(t*.8),cos(t*.63));vec2 d=uv-m;float a=atan(d.y,d.x);float r=length(d);float lines=.5+.5*sin(a*12.-1.7/r+t*2.);float field=exp(-1.8*r)*pow(lines,6.);float ink=fbm(uv*3.+normalize(d+.001)*t*.8);return vec3(.008,.006,.02)+mix(vec3(.1,.02,.18),spectrum(a/TAU+t*.06),.65)*field*2.+vec3(.02,.16,.22)*ink*.35;}
vec3 mesh(vec2 uv,float t){
  vec2 q=uv*7.; vec2 cell=floor(q),f=fract(q)-.5; float id=hash(cell); vec2 node=.26*vec2(sin(id*TAU+t*2.4),cos(id*TAU-t*2.1));
  float nd=length(f-node); float links=min(abs(f.x-node.x),abs(f.y-node.y)); float wave=.5+.5*sin((cell.x+cell.y)*1.7-t*14.+id*TAU);
  float current=exp(-36.*links)*pow(wave,3.)+exp(-48.*nd)*(1.4+.8*sin(t*18.+id*TAU)); return vec3(.008,.015,.05)+spectrum(id+t*.35)*current*1.6;
}
vec3 quantumKnot(vec2 uv,float t){
  vec3 col=vec3(.004,.008,.035); for(int i=0;i<3;i++){float fi=float(i);float a=atan(uv.y,uv.x)+t*.22+fi*2.094;float r=.52+.16*cos(3.*a+t*.8);vec2 p=vec2(cos(a),sin(a))*r;float d=length(uv-p);col+=spectrum(a/TAU+fi*.18+t*.05)*exp(-34.*d)*(1.2+.6*sin(a*5.-t*2.));}return col;}
vec3 waveFn(vec2 uv,float t){
  float r=length(uv),a=atan(uv.y,uv.x); float psi=sin(5.*a+t*1.7)*exp(-1.8*r)*cos(r*12.-t*2.4); float node=abs(psi); float collapse=exp(-18.*length(uv-.28*vec2(sin(t*.7),cos(t*.9))));
  return vec3(.004,.006,.03)+spectrum(a/TAU+t*.08)*node*1.45+vec3(1.,.25,.85)*collapse*.9;
}
vec3 lorenz(vec2 uv,float t){
  vec3 col=vec3(.003,.006,.025); vec2 p=vec2(.01,.0); for(int i=0;i<42;i++){float fi=float(i);float a=t*.18+fi*.11;vec2 c=.44*vec2(sin(a)*cos(a*.63),sin(a*1.37));float d=length(uv-c);col+=spectrum(fi*.027+t*.04)*exp(-75.*d)*.12;}return col;
}
vec3 turing(vec2 uv,float t){float a=fbm(uv*3.+t*.08),b=fbm(uv*6.-t*.11);float pat=sin((a-b)*18.+t*.7);float cell=smoothstep(-.2,.55,pat);return mix(vec3(.015,.025,.08),spectrum(a*.8+t*.04),cell)*(.7+.5*b);}
vec3 phyllo(vec2 uv,float t){
  vec3 col=vec3(.005,.012,.03); float golden=2.39996323; for(int i=0;i<56;i++){float fi=float(i);float r=.055*sqrt(fi);float a=fi*golden+t*.16;vec2 p=r*vec2(cos(a),sin(a));float d=length(uv-p);float seed=exp(-260.*d*d);col+=spectrum(fi*.041+t*.05)*seed*(.7+.5*sin(t*2.+fi));}return col;
}
vec3 branch(vec2 uv,float t){
  vec3 col=vec3(.004,.01,.025); vec2 p=uv; float glow=0.; for(int i=0;i<7;i++){float fi=float(i);p.y+=.24;float side=sign(p.x);p.x=abs(p.x)-(.18+.035*sin(t*.7+fi));p=rot(side*(.34+.07*sin(t*.4+fi)))*p*1.34;glow+=exp(-42.*abs(p.x))*.16;}col+=mix(vec3(.08,.5,.22),vec3(.7,.15,1.),.5+.5*sin(p.y+t))*glow;return col;}

void main(){
  vec2 res=max(u_res,vec2(1.));vec2 uv=gl_FragCoord.xy/res*2.-1.;uv.x*=res.x/res.y;uv*=u_scale;float t=u_time*max(u_speed,.01)*4.5;vec3 col;
  if(u_family<.5)col=thinFilm(uv,t);else if(u_family<1.5)col=shell(uv,t);else if(u_family<2.5)col=aurora(uv,t);else if(u_family<3.5)col=fresnel(uv,t);else if(u_family<4.5)col=holo(uv,t);else if(u_family<5.5)col=metal(uv,t);else if(u_family<6.5)col=velvet(uv,t);else if(u_family<7.5)col=crystal(uv,t);else if(u_family<8.5)col=ionBloom(uv,t);else if(u_family<9.5)col=opal(uv,t);else if(u_family<10.5)col=magnetic(uv,t);else if(u_family<11.5)col=mesh(uv,t);else if(u_family<12.5)col=quantumKnot(uv,t);else if(u_family<13.5)col=waveFn(uv,t);else if(u_family<14.5)col=lorenz(uv,t);else if(u_family<15.5)col=turing(uv,t);else if(u_family<16.5)col=phyllo(uv,t);else col=branch(uv,t);
  float grain=(hash(gl_FragCoord.xy+floor(u_time*18.))-.5)*.018*u_structure;col+=grain;col*=max(u_intensity,.01)*1.35;col=col/(1.+col);col=pow(max(col,vec3(0.)),vec3(.82));gl_FragColor=vec4(col,1.);
}