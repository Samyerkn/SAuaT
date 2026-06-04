import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import useStore from '../store'
import { userApi } from '../api'

const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:8, padding:'7px 12px', fontSize:12, boxShadow:'var(--sh)' }}>
      <div style={{ color:'var(--ink4)', marginBottom:2 }}>{label}</div>
      <div style={{ color:'var(--ink)', fontWeight:600 }}>{payload[0].value}</div>
    </div>
  )
}

export default function Dashboard() {
  const { user, progress, setProgress } = useStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    userApi.progress()
      .then(({ data }) => { setProgress(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400, gap:14, flexDirection:'column' }}>
      <div className="spinner"/><p style={{ fontSize:13, color:'var(--ink3)' }}>Загружаем данные</p>
    </div>
  )

  if (error) return (
    <div className="err-box" style={{ padding:20 }}>Бэкенд недоступен: {error}</div>
  )

  const p   = progress || {}
  const sat = p.sat_score    || 800
  const tgt = p.target_score || 1300
  const pct = Math.min(100, Math.round(sat / tgt * 100))
  const activity = (p.activity || [0,0,0,0,0,0,0]).map((v,i) => ({ д: DAYS[i], мин: v }))
  const history  = (p.test_history || []).map(h => ({ d: h.created_at?.slice(5,10)||'', балл: h.sat_score })).reverse()

  return (
    <div className="page-in">

      {/* ── HERO ── */}
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: 20, overflow: 'hidden', marginBottom: 24,
        display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 260,
      }}>
        {/* Left */}
        <div style={{ padding:'44px 48px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--ink4)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:14 }}>
              {user?.city} · {new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}
            </div>
            <h1 style={{ fontFamily:'var(--ffs)', fontSize:40, color:'var(--ink)', lineHeight:1.1, letterSpacing:'-.5px', marginBottom:12 }}>
              {user?.name?.split(' ')[0]},<br />
              <span style={{ fontStyle:'italic', color:'var(--green)' }}>продолжаем</span> подготовку
            </h1>
            <p style={{ fontSize:14, color:'var(--ink3)', lineHeight:1.65, maxWidth:340 }}>
              До цели {tgt} — осталось {Math.max(0,tgt-sat)} баллов. Университет: {p.target_university||'КБТУ'}.
            </p>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:28 }}>
            <button className="btn btn-primary" onClick={() => navigate('/exam')}>Начать тест</button>
            <button className="btn btn-ghost" onClick={() => navigate('/ai')}>Спросить AI</button>
          </div>
        </div>

        {/* Right — score panel */}
        <div style={{
          background:'var(--ink)', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:8, padding:40,
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }}/>
          <div style={{ position:'absolute', bottom:-30, left:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.02)' }}/>

          {/* Ring */}
          <div style={{ position:'relative', width:140, height:140 }}>
            <svg width="140" height="140" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke="#1A7A5E" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2*Math.PI*58}
                strokeDashoffset={2*Math.PI*58*(1-pct/100)}
                style={{ transition:'stroke-dashoffset 1.2s ease' }}
              />
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:'var(--ffs)', fontSize:38, color:'#fff', lineHeight:1, letterSpacing:'-2px' }}>{sat}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:4 }}>из {tgt}</div>
            </div>
          </div>

          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.35)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:4 }}>SAT Score</div>
            <div style={{ fontSize:13, color:'#1A7A5E', fontWeight:600 }}>{pct}% от цели</div>
          </div>
        </div>
      </div>

      {/* ── KPI ── */}
      <div className="g4 mb3">
        {[
          { label:'SAT Score',       value: sat,                    sub: `цель ${tgt}` },
          { label:'Тестов пройдено', value: p.tests_completed || 0, sub: 'в базе данных' },
          { label:'До экзамена',     value: 84,                     sub: 'дней' },
          { label:'Серия',           value: `${p.streak_days||0}д`, sub: 'подряд' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── GRID ── */}
      <div className="g2 mb3">
        <div className="card">
          <div className="card-label">Прогресс по предметам</div>
          {[
            { name:'Математика', val: p.math_progress    || 0, color:'var(--ink)' },
            { name:'Чтение',     val: p.reading_progress || 0, color:'var(--green)' },
            { name:'Письмо',     val: p.writing_progress || 0, color:'var(--amber)' },
          ].map(s => (
            <div key={s.name} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                <span style={{ fontSize:13, color:'var(--ink2)', fontWeight:500 }}>{s.name}</span>
                <span style={{ fontSize:12, color:'var(--ink4)' }}>{s.val}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width:`${s.val}%`, background:s.color }}/>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-label">Активность за неделю</div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={activity} margin={{ top:4, right:0, left:-32, bottom:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--bg2)" vertical={false}/>
              <XAxis dataKey="д" tick={{ fontSize:11, fill:'var(--ink4)' }} axisLine={false} tickLine={false}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="мин" fill="var(--ink)" radius={[4,4,0,0]} opacity={.85}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-label">История баллов</div>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={history} margin={{ top:4, right:8, left:-32, bottom:0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--bg2)"/>
                <XAxis dataKey="d" tick={{ fontSize:10, fill:'var(--ink4)' }} axisLine={false} tickLine={false}/>
                <Tooltip content={<TT/>}/>
                <Line type="monotone" dataKey="балл" stroke="var(--green)" strokeWidth={2} dot={{ fill:'var(--green)', r:3, strokeWidth:0 }}/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:130, gap:12 }}>
              <p style={{ fontSize:13, color:'var(--ink4)' }}>Нет данных — пройди первый тест</p>
              <button className="btn btn-ghost" onClick={() => navigate('/exam')} style={{ fontSize:13 }}>Начать тест</button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-label">Навигация</div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {[
              { label:'Mock Exam',     desc:'Тест с таймером и результатами', to:'/exam' },
              { label:'AI Ассистент',  desc:'Вопросы и объяснения',           to:'/ai' },
              { label:'Университеты', desc:'Требования и дедлайны',           to:'/universities' },
              { label:'Профиль',       desc:'Статистика и настройки',         to:'/profile' },
            ].map(a => (
              <button key={a.to} onClick={() => navigate(a.to)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 12px', borderRadius:10, background:'transparent', border:'none', cursor:'pointer', transition:'var(--tr)', textAlign:'left', width:'100%' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--ink)', marginBottom:1 }}>{a.label}</div>
                  <div style={{ fontSize:11, color:'var(--ink4)' }}>{a.desc}</div>
                </div>
                <span style={{ color:'var(--ink4)', fontSize:18 }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {(p.test_history||[]).length > 0 && (
        <div className="card mt3">
          <div className="card-label">Последние тесты</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
            {(p.test_history||[]).slice(0,5).map((h,i) => (
              <div key={i} style={{ padding:'14px', background:'var(--bg)', borderRadius:10, border:'1.5px solid var(--border)', textAlign:'center' }}>
                <div style={{ fontFamily:'var(--ffs)', fontSize:22, color:'var(--ink)', marginBottom:4 }}>{h.sat_score}</div>
                <div style={{ fontSize:10, color:'var(--ink4)', marginBottom:8 }}>{h.subject} · {h.created_at?.slice(5,10)||'—'}</div>
                <span className="badge badge-green" style={{ fontSize:10 }}>{h.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}