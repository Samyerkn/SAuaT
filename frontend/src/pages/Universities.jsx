import { useState } from 'react'
import useStore from '../store'

const UNIS = [
  {
    id:1, short:'NU', name:'Nazarbayev University', city:'Астана', req:1400,
    programs:['Engineering','Medicine','IT','Business','Law','Social Sciences'],
    deadlines:[{round:'Round 1',date:'1 декабря 2024',status:'Прошёл'},{round:'Round 2',date:'1 марта 2025',status:'Активен'},{round:'Round 3',date:'1 мая 2025',status:'Скоро'}],
    docs:['Аттестат (нотариальный перевод)','SAT Score Report','Эссе (500 слов)','2 рекомендательных письма','Мед. справка','Фото 3×4'],
    schol:'До 100% покрытие обучения + стипендия $400/мес',
    fee:'Бесплатно',
    site:'https://nu.edu.kz',
    color:'#1E3A5F',
    accent:'#3B82F6',
  },
  {
    id:2, short:'KBTU', name:'Казахстанско-Британский технический университет', city:'Алматы', req:1300,
    programs:['IT & Computer Science','Oil & Gas Engineering','Business Analytics','Cybersecurity'],
    deadlines:[{round:'Весенний набор',date:'1 февраля 2025',status:'Прошёл'},{round:'Основной набор',date:'1 мая 2025',status:'Активен'},{round:'Дополнительный',date:'15 июля 2025',status:'Скоро'}],
    docs:['Аттестат','SAT результаты','Мотивационное письмо','Рекомендация от учителя','Медсправка 086'],
    schol:'Гранты от 25% до 100% за SAT 1300+',
    fee:'Бесплатно',
    site:'https://kbtu.edu.kz',
    color:'#064E3B',
    accent:'#059669',
  },
  {
    id:3, short:'AITU', name:'Astana IT University', city:'Астана', req:1200,
    programs:['Artificial Intelligence','Data Science','Cybersecurity','Software Engineering','Game Development'],
    deadlines:[{round:'1-я волна',date:'15 марта 2025',status:'Прошёл'},{round:'2-я волна',date:'15 июня 2025',status:'Активен'},{round:'3-я волна',date:'1 августа 2025',status:'Скоро'}],
    docs:['Аттестат','SAT/ЕНТ результаты','Портфолио (опционально)','Мед. справка'],
    schol:'100% грант для SAT 1400+, 50% для SAT 1200-1399',
    fee:'Бесплатно',
    site:'https://astanait.edu.kz',
    color:'#1E1B4B',
    accent:'#7C3AED',
  },
  {
    id:4, short:'KIMEP', name:'KIMEP University', city:'Алматы', req:1250,
    programs:['Business Administration','Law','International Relations','Journalism','Finance'],
    deadlines:[{round:'Early Decision',date:'1 декабря 2024',status:'Прошёл'},{round:'Regular',date:'15 мая 2025',status:'Активен'},{round:'Late',date:'1 июля 2025',status:'Скоро'}],
    docs:['Аттестат (нотариальный)','SAT Score Report','Эссе на английском','2 рекомендации','Финансовые документы','Фото'],
    schol:'Merit scholarships 10-75%, нет государственных грантов',
    fee:'$50',
    site:'https://kimep.kz',
    color:'#7C2D12',
    accent:'#EA580C',
  },
  {
    id:5, short:'SDU', name:'Suleyman Demirel University', city:'Кентау', req:1100,
    programs:['Engineering','Economics','IT','International Relations','Pedagogy'],
    deadlines:[{round:'Основной набор',date:'1 июня 2025',status:'Активен'},{round:'Дополнительный',date:'15 августа 2025',status:'Скоро'}],
    docs:['Аттестат','ЕНТ или SAT','Медсправка','Фото 3×4'],
    schol:'Государственные образовательные гранты РК',
    fee:'Бесплатно',
    site:'https://sdu.edu.kz',
    color:'#1A3C5E',
    accent:'#0EA5E9',
  },
]

export default function Universities() {
  const { progress } = useStore()
  const [selected, setSelected] = useState(null)
  const sat = progress?.sat_score || 800

  const u = selected ? UNIS.find(x => x.id === selected) : null

  return (
    <div className="page-in">
      <div className="mb3">
        <h1 className="serif" style={{ fontSize:26, letterSpacing:'-.5px' }}>Университеты Казахстана</h1>
        <p className="text-sm text-muted mt1">Твой текущий балл: <strong style={{ color:'var(--emerald-d)', fontFamily:'var(--ff-serif)' }}>{sat}</strong> · Нажми на карточку для подробной информации</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: u ? '1fr 380px' : '1fr', gap:20, alignItems:'start' }}>
        {/* List */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {UNIS.map(uni => {
            const ok = sat >= uni.req
            const pct = Math.min(100, Math.round(sat/uni.req*100))
            const isActive = selected===uni.id
            return (
              <div key={uni.id} onClick={()=>setSelected(isActive?null:uni.id)}
                style={{ background:'var(--card)', border:`1.5px solid ${isActive?uni.accent:'var(--border)'}`, borderRadius:'var(--r-lg)', padding:'20px 24px', cursor:'pointer', transition:'var(--tr)', boxShadow: isActive?`0 8px 32px ${uni.accent}22`:'var(--shadow)' }}
                onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor=uni.accent;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 24px ${uni.accent}18`}}}
                onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow)'}}}>
                <div className="flex fac gap3">
                  <div style={{ width:52, height:52, borderRadius:14, background:uni.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:14, fontWeight:400, color:'#fff', flexShrink:0 }}>{uni.short}</div>
                  <div style={{ flex:1 }}>
                    <div className="flex fac fjb mb1">
                      <div>
                        <span style={{ fontSize:15, fontWeight:700, color:'var(--ink)' }}>{uni.name}</span>
                        <span style={{ marginLeft:8, fontSize:12, color:'var(--ink3)' }}>· {uni.city}</span>
                      </div>
                      <div className="flex gap2">
                        <span className={`badge ${ok?'badge-green':'badge-gold'}`}>{ok?'✓ Проходишь':`−${uni.req-sat} баллов`}</span>
                        <span className="badge badge-blue">SAT {uni.req}+</span>
                      </div>
                    </div>
                    <div className="flex fac gap3">
                      <div className="prog-track" style={{ flex:1 }}>
                        <div className="prog-fill" style={{ width:`${pct}%`, background: ok?'var(--emerald)':'var(--gold)' }}/>
                      </div>
                      <span style={{ fontSize:12, color:'var(--ink3)', flexShrink:0 }}>{sat}/{uni.req}</span>
                    </div>
                    <div style={{ marginTop:8, display:'flex', gap:6, flexWrap:'wrap' }}>
                      {uni.programs.slice(0,3).map(p=><span key={p} style={{ fontSize:11, padding:'2px 8px', background:'var(--bg2)', borderRadius:10, color:'var(--ink3)' }}>{p}</span>)}
                      {uni.programs.length>3&&<span style={{ fontSize:11, color:'var(--ink4)' }}>+{uni.programs.length-3}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        {u && (
          <div style={{ position:'sticky', top:76, display:'flex', flexDirection:'column', gap:12 }}>
            {/* Header */}
            <div style={{ background:u.color, borderRadius:'var(--r-lg)', padding:'24px', color:'#fff' }}>
              <div style={{ fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:13, opacity:.6, marginBottom:4 }}>{u.city}</div>
              <div style={{ fontFamily:'var(--ff-serif)', fontSize:22, marginBottom:8 }}>{u.name}</div>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ background:'rgba(255,255,255,.15)', borderRadius:20, padding:'3px 12px', fontSize:11, fontWeight:600 }}>SAT {u.req}+</span>
                <span style={{ background:'rgba(255,255,255,.15)', borderRadius:20, padding:'3px 12px', fontSize:11, fontWeight:600 }}>Взнос: {u.fee}</span>
              </div>
            </div>

            {/* Deadlines */}
            <div className="card">
              <div className="card-label">Дедлайны подачи</div>
              {u.deadlines.map(d=>(
                <div key={d.round} className="flex fac fjb" style={{ padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{d.round}</div>
                    <div style={{ fontSize:11, color:'var(--ink3)' }}>{d.date}</div>
                  </div>
                  <span className={`badge ${d.status==='Активен'?'badge-green':d.status==='Прошёл'?'badge-rose':'badge-gold'}`}>{d.status}</span>
                </div>
              ))}
            </div>

            {/* Required docs */}
            <div className="card">
              <div className="card-label">Необходимые документы</div>
              {u.docs.map((doc,i)=>(
                <div key={i} className="flex fac gap2" style={{ padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--emerald)', fontSize:14, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13 }}>{doc}</span>
                </div>
              ))}
            </div>

            {/* Scholarship */}
            <div style={{ background:'var(--gold-l)', border:'1px solid #FDE68A', borderRadius:'var(--r)', padding:'16px 18px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--gold)', letterSpacing:'.8px', textTransform:'uppercase', marginBottom:8 }}>Стипендии и гранты</div>
              <p style={{ fontSize:13, color:'var(--gold)', lineHeight:1.6 }}>{u.schol}</p>
            </div>

            {/* Programs */}
            <div className="card">
              <div className="card-label">Программы ({u.programs.length})</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {u.programs.map(p=><span key={p} style={{ fontSize:12, padding:'4px 11px', background:'var(--bg2)', borderRadius:20, color:'var(--ink2)', fontWeight:500 }}>{p}</span>)}
              </div>
            </div>

            <a href={u.site} target="_blank" rel="noreferrer" className="btn btn-primary btn-full" style={{ padding:13, fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:15, textAlign:'center' }}>
              Перейти на сайт →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
