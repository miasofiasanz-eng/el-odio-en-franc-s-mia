// Campo de desplazamiento animado: refracción acanalada, ondas y desgarros.
// Puro: nunca modifica el fotograma de entrada ni accede a cámara/DOM.
(function(root){
  const clamp=(n,max)=>Math.max(0,Math.min(max,n));
  function warp(src,w,h,time,amount,cx=.5,cy=.46,out=new Uint8ClampedArray(src.length)){
    if(amount<=0){out.set(src);return out}
    const t=time/1000,a=amount/100,sxScale=w/640,syScale=h/360;
    const cols=new Float32Array(w),rows=new Float32Array(h),gx=new Float32Array(w),gy=new Float32Array(h),vertical=new Float32Array(w);
    for(let x=0;x<w;x++){const nx=x/w;cols[x]=Math.sin(nx*72+t*.7)*12+Math.sin(nx*31-t*.4)*8;vertical[x]=Math.sin(nx*55+t*.6)*17+Math.sin(nx*13-t*.7)*12;gx[x]=Math.exp(-(((nx-cx)/.33)**2))}
    for(let y=0;y<h;y++){const ny=y/h;rows[y]=Math.sin(ny*24-t*.9)*16+Math.sin(ny*63+t*.5)*7;gy[y]=Math.exp(-(((ny-cy)/.43)**2))}
    const tearY=(.44+Math.sin(t*.65)*.19)*h;
    for(let y=0;y<h;y++){const tear=Math.max(0,1-Math.abs(y-tearY)/(h*.045))*Math.sin(t*1.6)*25;for(let x=0;x<w;x++){
      const field=.18+.82*gx[x]*gy[y];
      const xx=clamp(x+a*sxScale*(rows[y]+cols[x]*1.4+tear)*field,w-1);
      const yy=clamp(y+a*syScale*vertical[x]*field,h-1);
      const x0=Math.floor(xx),y0=Math.floor(yy),x1=Math.min(x0+1,w-1),y1=Math.min(y0+1,h-1),fx=xx-x0,fy=yy-y0;
      const p=(y0*w+x0)*4,q=(y0*w+x1)*4,r=(y1*w+x0)*4,s=(y1*w+x1)*4,i=(y*w+x)*4;
      for(let c=0;c<3;c++)out[i+c]=(src[p+c]*(1-fx)+src[q+c]*fx)*(1-fy)+(src[r+c]*(1-fx)+src[s+c]*fx)*fy;
      out[i+3]=255;
    }}return out;
  }
  // Malla regular con desplazamientos suaves concentrados en el rostro.
  // Interpola el campo entre vértices; el borde queda fijo para evitar cortes.
  function mesh(time,amount,cx=.5,cy=.46){
    const cols=12,rows=10,points=[],a=Math.max(0,Math.min(100,amount))/100,t=time/1000;
    for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
      const nx=x/cols,ny=y/rows;
      const face=Math.exp(-2*(((nx-cx)/.25)**2+((ny-cy)/.4)**2));
      const edge=Math.sin(nx*Math.PI)*Math.sin(ny*Math.PI);
      const dx=a*face*edge*(Math.sin(ny*19+t*.9)*.065+Math.cos(nx*23-t*.6)*.035);
      const dy=a*face*edge*(Math.sin(nx*20-t*.8)*.07+Math.cos(ny*17+t*.5)*.025);
      points.push({x:nx,y:ny,dx,dy});
    }
    return{cols,rows,points};
  }
  function warpMesh(src,w,h,field,out=new Uint8ClampedArray(src.length)){
    const{cols,rows,points}=field;
    for(let y=0;y<h;y++){
      const gy=y/(h-1)*rows,iy=Math.min(rows-1,Math.floor(gy)),fy=gy-iy;
      for(let x=0;x<w;x++){
        const gx=x/(w-1)*cols,ix=Math.min(cols-1,Math.floor(gx)),fx=gx-ix;
        const a=points[iy*(cols+1)+ix],b=points[iy*(cols+1)+ix+1],c=points[(iy+1)*(cols+1)+ix],d=points[(iy+1)*(cols+1)+ix+1];
        const dx=(a.dx*(1-fx)+b.dx*fx)*(1-fy)+(c.dx*(1-fx)+d.dx*fx)*fy;
        const dy=(a.dy*(1-fx)+b.dy*fx)*(1-fy)+(c.dy*(1-fx)+d.dy*fx)*fy;
        const xx=clamp(x+dx*w,w-1),yy=clamp(y+dy*h,h-1);
        const x0=Math.floor(xx),y0=Math.floor(yy),x1=Math.min(x0+1,w-1),y1=Math.min(y0+1,h-1),u=xx-x0,v=yy-y0;
        const p=(y0*w+x0)*4,q=(y0*w+x1)*4,r=(y1*w+x0)*4,s=(y1*w+x1)*4,i=(y*w+x)*4;
        for(let channel=0;channel<3;channel++)out[i+channel]=(src[p+channel]*(1-u)+src[q+channel]*u)*(1-v)+(src[r+channel]*(1-u)+src[s+channel]*u)*v;
        out[i+3]=src[i+3];
      }
    }
    return out;
  }
  root.GrungeDisplacement={warp,mesh,warpMesh};
})(globalThis);
