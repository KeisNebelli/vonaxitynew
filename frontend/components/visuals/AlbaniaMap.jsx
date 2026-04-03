'use client';

const CITIES = [
  { name:'Tirana',   nurses:3, active:true },
  { name:'Durrës',  nurses:1, active:true },
  { name:'Elbasan', nurses:1, active:true },
  { name:'Fier',    nurses:1, active:true },
  { name:'Shkodër', nurses:1, active:true },
  { name:'Berat',   nurses:0, active:false },
  { name:'Vlorë',   nurses:0, active:false },
  { name:'Sarandë', nurses:0, active:false },
];

export default function AlbaniaMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

  // Center of Albania
  const center = '41.1533,20.1683';
  const zoom = 7;

  if (!apiKey) {
    return (
      <div style={{ background:'#EFF6FF', borderRadius:16, border:'1px solid #DBEAFE', padding:24, textAlign:'center', height:380, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize:14, color:'#6B7280' }}>Map loading...</div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid #DBEAFE', boxShadow:'0 4px 16px rgba(37,99,235,0.08)' }}>
      <iframe
        title="Vonaxity coverage map - Albania"
        width="100%"
        height="380"
        style={{ border:'none', display:'block' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center}&zoom=${zoom}&maptype=roadmap`}
      />
      {/* City legend below map */}
      <div style={{ background:'#fff', padding:'14px 18px', borderTop:'1px solid #E5E7EB' }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>Coverage</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {CITIES.map(city => (
            <div key={city.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:city.active?600:400, color:city.active?'#111827':'#9CA3AF' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:city.active?'#2563EB':'#D1D5DB', flexShrink:0 }} />
              {city.name}
              {city.nurses > 0 && <span style={{ fontSize:10, fontWeight:700, color:'#059669', background:'#ECFDF5', padding:'1px 6px', borderRadius:99 }}>{city.nurses}</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, display:'flex', gap:16, fontSize:11, color:'#9CA3AF' }}>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}><div style={{ width:6, height:6, borderRadius:'50%', background:'#2563EB' }}/> Active city</div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}><div style={{ width:6, height:6, borderRadius:'50%', background:'#D1D5DB' }}/> Coming soon</div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}><div style={{ width:8, height:8, borderRadius:'50%', background:'#059669' }}/> Nurses available</div>
        </div>
      </div>
    </div>
  );
}
