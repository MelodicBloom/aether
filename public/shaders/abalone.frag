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
uniform float u_flow;
uniform float u_depth;
#define TAU 6.28318530718

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.877,.479,-.479,.877);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.03;a*=.5;}return v;}
vec3 spectrum(float x){return .55+.45*cos(TAU*(x+vec3(0.,.33,.67)));}

vec3 thinFilm(vec2 uv,float t){vec2 c=.16*vec2(sin(t*.7),cos(t*.55));float r=length((uv-c)*vec2(.82+.1*sin(t),1.-.1*sin(t)));float w=fbm(uv*1.35+vec2(t*.55,-t*.36));float b=r*6.5+w*2.1-t*1.35;vec3 s=spectrum(b*.18+t*.08);float rim=pow(smoothstep(.12,1.15,r),2.4+u_edge*3.);return mix(vec3(.025,.045,.09),s,u_spectral*.86)*(.72+.48*sin(b)*sin(b))+s*rim*.85;}
vec3 shell(vec2 uv,float t){vec2 q=uv+.07*vec2(sin(t*.55),cos(t*.43));vec2 w=vec2(fbm(q*1.4+vec2(t*.72,1.7)),fbm(q*1.7+vec2(4.2,-t*.58)));float rid=sin((q.x+w.x*.95)*13.+(q.y+w.y)*4.5+t*1.1);float d=fbm(q*2.8+w*1.7+vec2(t*.22,-t*.16));float ph=d*2.4+rid*.18+t*.62;vec3 p=vec3(.62,.74,.78)+.34*cos(TAU*(ph+vec3(.02,.24,.49)));float hi=pow(clamp(d+rid*.14,0.,1.),5.);return mix(vec3(.12,.06,.16),p,.72+.25*u_spectral)*(.72+d*.65)+vec3(1.,.92,.78)*hi*.8;}
vec3 aurora(vec2 uv,float t){vec2 q=uv;q.y+=t*.22*u_flow;q.x+=sin(q.y*1.8+t*1.15)*.28;float a=exp(-8.*abs(q.x+.32*sin(q.y*1.3+t*.9)));float b=exp(-10.*abs(q.x-.42*cos(q.y*1.1-t*.78)));float h=fbm(vec2(q.x*1.2+t*.18,q.y*2.5-t*.95));return vec3(.008,.018,.075)+vec3(.02,.95,.82)*a*(.38+.62*h)+mix(vec3(.46,.16,.95),vec3(.28,1.,.48),h)*b*.82+vec3(.04,.08,.22)*h;}
vec3 fresnel(vec2 uv,float t){float r=length(uv);float n=fbm(uv*2.+vec2(t*.2,-t*.16));float rim=pow(smoothstep(.18,1.08,r+n*.08),2.+u_edge*5.);vec3 edge=spectrum(n*.35+t*.04)*u_spectral;return vec3(.008,.012,.025)*(1.-rim)+edge*rim*(.65+u_depth*.75)+vec3(.06,.09,.14)*n;}
vec3 holo(vec2 uv,float t){vec2 q=uv+vec2(t*.16,-t*.11)*u_flow;float gx=abs(fract(q.x*18.)-.5),gy=abs(fract(q.y*14.)-.5);float grid=1.-smoothstep(.42,.5,min(gx,gy));float scan=.5+.5*sin((q.x+q.y)*18.-t*4.);vec3 sp=spectrum(q.x*.8+q.y*.45+t*.13);return vec3(.03,.035,.07)+sp*(.18+.62*grid+.28*scan)*u_spectral;}
vec3 metal(vec2 uv,float t){vec2 w=vec2(fbm(uv*1.8+vec2(t*.42,0.)),fbm(uv*1.8+vec2(3.,-t*.35)));float f=sin((uv.x+w.x)*7.+t)+cos((uv.y+w.y)*6.-t*.8);float hi=pow(.5+.5*f*.5,6.);vec3 steel=mix(vec3(.025,.03,.04),vec3(.75,.82,.9),smoothstep(-.5,.8,f));return steel*(.45+u_depth*.55)+hi*vec3(1.,.9,.72);}
vec3 velvet(vec2 uv,float t){float ang=.2*sin(t*.5);vec2 d=vec2(cos(ang),sin(ang));float fibers=.5+.5*sin(dot(uv,d)*110.+fbm(uv*5.)*8.);float nap=pow(abs(dot(normalize(vec3(d,0.)).xy,normalize(uv+.001))),2.);vec3 base=mix(vec3(.025,.008,.045),vec3(.35,.035,.28),nap);return base+vec3(.42,.12,.48)*fibers*.12*u_structure;}
vec3 crystal(vec2 uv,float t){vec2 q=uv*3.;vec2 cell=floor(q),f=fract(q)-.5;float id=hash(cell);float facet=abs(dot(f,normalize(vec2(cos(id*TAU+t*.08),sin(id*TAU+t*.08)))));float seam=1.-smoothstep(.42,.49,max(abs(f.x),abs(f.y)));vec3 pr=spectrum(id+t*.04+facet*.35);return mix(vec3(.02,.055,.09),pr,.3+u_spectral*.45)*(1.-facet*.35)+pr*seam*.35*u_edge;}

void main(){vec2 res=max(u_res,vec2(1.));vec2 uv=gl_FragCoord.xy/res*2.-1.;uv.x*=res.x/res.y;uv*=u_scale;float t=u_time*max(u_speed,.01)*4.5;vec3 col;if(u_family<.5)col=thinFilm(uv,t);else if(u_family<1.5)col=shell(uv,t);else if(u_family<2.5)col=aurora(uv,t);else if(u_family<3.5)col=fresnel(uv,t);else if(u_family<4.5)col=holo(uv,t);else if(u_family<5.5)col=metal(uv,t);else if(u_family<6.5)col=velvet(uv,t);else col=crystal(uv,t);float grain=(hash(gl_FragCoord.xy+floor(u_time*18.))-.5)*.025*u_structure;col+=grain;col*=max(u_intensity,.01)*1.35;col=col/(1.+col);col=pow(max(col,vec3(0.)),vec3(.82));gl_FragColor=vec4(col,1.);}