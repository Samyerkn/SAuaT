import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useStore from '../store'
import { userApi } from '../api'

const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function Toggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex fac fjb" style={{ padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:13 }}>{label}</span>
      <div onClick={() => setOn(!on)} style={{ width:40, height:22, borderRadius:11, background:on?'var(--emerald)':'var(--bg2)', position:'relative', cursor:'pointer', transition:'background .2s', border:'1px solid var(--border)' }}>
        <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:1, left:on?19:1, transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, progress, logout, updateUser } = useStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    city: user?.city || '',
    target_university: user?.target_university || '',
    target_score: user?.target_score || 1300
  })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const initials = (user?.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'СА'
  const activity = (progress?.activity || [0,0,0,0,0,0,0]).map((v,i) => ({ день: DAYS[i], мин: v }))
  const p = progress || {}

  const save = async () => {
    setSaving(true)
    try { await userApi.updateProfile(form); updateUser(form); setEditing(false) }
    catch(e) { alert('Ошибка сохранения: ' + e.message) }
    setSaving(false)
  }

  return (
    <div className="page-in">
      <h1 className="serif mb3" style={{ fontSize:26, letterSpacing:'-.5px' }}>Профиль</h1>
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:18 }}>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card" style={{ textAlign:'center', padding:'32px 24px' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--emerald-l),#A7F3D0)', border:'3px solid var(--emerald)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:26, color:'var(--emerald-d)', margin:'0 auto 16px' }}>
              {initials}
            </div>
            {!editing ? (<>
              <div className="serif" style={{ fontSize:19 }}>{user?.name}</div>
              <div style={{ fontSize:12, color:'var(--ink3)', marginTop:4 }}>{user?.grade} класс · {user?.city}</div>
              <div style={{ display:'inline-block', background:'var(--emerald-l)', color:'var(--emerald-d)', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:20, marginTop:10 }}>
                Цель: {user?.target_university}
              </div>
              <button className="btn btn-ghost btn-full" style={{ marginTop:16, fontSize:13 }} onClick={() => setEditing(true)}>
                Редактировать профиль
              </button>
            </>) : (<>
              <div style={{ textAlign:'left' }}>
                <div className="field" style={{ marginBottom:10 }}><label>Имя</label>
                  <input value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
                </div>
                <div className="field" style={{ marginBottom:10 }}><label>Город</label>
                  <select value={form.city} onChange={e => setForm({...form, city:e.target.value})}>
                    <option>Алматы</option><option>Астана</option><option>Шымкент</option><option>Другой</option>
                  </select>
                </div>
                <div className="field" style={{ marginBottom:10 }}><label>Университет</label>
                  <select value={form.target_university} onChange={e => setForm({...form, target_university:e.target.value})}>
                    <option>КБТУ</option><option>Nazarbayev University</option><option>AITU</option><option>KIMEP</option><option>SDU</option>
                  </select>
                </div>
                <div className="field" style={{ marginBottom:14 }}><label>Целевой балл</label>
                  <input type="number" min={400} max={1600} value={form.target_score} onChange={e => setForm({...form, target_score:+e.target.value})}/>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-primary" style={{ flex:1, fontFamily:'var(--ff-serif)', fontStyle:'italic' }} onClick={save} disabled={saving}>
                  {saving ? '...' : 'Сохранить'}
                </button>
                <button className="btn btn-ghost" onClick={() => setEditing(false)}>✕</button>
              </div>
            </>)}
            <div style={{ height:1, background:'var(--border)', margin:'20px 0 4px' }}/>
            <button className="btn btn-danger btn-full" onClick={() => { logout(); navigate('/login') }}>
              Выйти из аккаунта
            </button>
          </div>

          {/* ML Metrics from Lab 4 */}
          <div className="card">
            <div className="card-label">Метрики модели (Lab 4)</div>
            {[['Precision','88.2%','var(--emerald)'],['Recall','78.9%','var(--teal)'],['F1-Score','83.3%','var(--gold)']].map(([l,v,c]) => (
              <div key={l} className="flex fac fjb" style={{ padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:13 }}>{l}</span>
                <span className="serif" style={{ fontSize:18, color:c }}>{v}</span>
              </div>
            ))}
            <p style={{ fontSize:11, color:'var(--ink4)', marginTop:10, lineHeight:1.5 }}>
              WTP prediction · n=25 · TP=15, FP=2, FN=4, TN=4
            </p>
          </div>

          {/* Survey data */}
          <div className="card">
            <div className="card-label">Данные опроса (Lab 2 · n=50)</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[['96%','готовы платить'],['78%','хотят mock'],['82%','AI полезен'],['3.82','стресс /5']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center', padding:'12px 8px', background:'var(--bg)', borderRadius:10, border:'1px solid var(--border)' }}>
                  <div className="serif" style={{ fontSize:20, color:'var(--emerald-d)' }}>{v}</div>
                  <div style={{ fontSize:10, color:'var(--ink3)', marginTop:3, lineHeight:1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* KPI */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { label:'Текущий SAT', value: p.sat_score||800, sub:`цель ${p.target_score||1300}` },
              { label:'Тестов пройдено', value: p.tests_completed||0, sub:'в базе данных' },
              { label:'Серия', value:`${p.streak_days||0} дн.`, sub:'🔥 подряд' },
            ].map(k => (
              <div className="kpi" key={k.label}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Activity chart */}
          <div className="card">
            <div className="card-label">Активность за неделю (мин)</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={activity} margin={{ top:4, right:0, left:-32, bottom:0 }}>
                <XAxis dataKey="день" tick={{ fontSize:11, fill:'var(--ink3)' }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:'1px solid var(--border)' }}/>
                <Bar dataKey="мин" fill="var(--emerald)" radius={[5,5,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject progress */}
          <div className="card">
            <div className="card-label">Прогресс по предметам</div>
            {[
              ['Математика', p.math_progress||0, 'var(--emerald)'],
              ['Чтение',     p.reading_progress||0, 'var(--teal)'],
              ['Письмо',     p.writing_progress||0, 'var(--gold)'],
            ].map(([n,v,c]) => (
              <div key={n} style={{ marginBottom:16 }}>
                <div className="flex fjb" style={{ marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{n}</span>
                  <span style={{ fontSize:12, color:'var(--ink3)' }}>{v}%</span>
                </div>
                <div className="prog-track"><div className="prog-fill" style={{ width:`${v}%`, background:c }}/></div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="card">
            <div className="card-label">Настройки</div>
            <Toggle label="Уведомления о занятиях" defaultOn={true}/>
            <Toggle label="Напоминания о дедлайнах" defaultOn={true}/>
            <Toggle label="Email-дайджест прогресса" defaultOn={false}/>
            <Toggle label="Тёмная тема" defaultOn={false}/>
          </div>
        </div>
      </div>
    </div>
  )
}
