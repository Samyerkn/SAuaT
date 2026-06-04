import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import useStore from '../store'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', grade:'11', city:'Алматы', target_university:'КБТУ' })
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)
  const { setAuth } = useStore(); const navigate = useNavigate()
  const upd = k => e => setForm({...form,[k]:e.target.value})

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try { const {data} = await authApi.register(form); setAuth(data.user,data.token); navigate('/dashboard') }
    catch(e) { setErr(e.response?.data?.detail||'Ошибка регистрации') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:36 }}>
          <div style={{ width:34,height:34,background:'var(--ink)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--ffs)',fontSize:18,color:'#fff',fontStyle:'italic' }}>S</span>
          </div>
          <span style={{ fontFamily:'var(--ffs)',fontSize:20,color:'var(--ink)' }}>SAua<span style={{ color:'var(--green)',fontStyle:'italic' }}>T</span></span>
        </div>

        <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:'32px 36px' }}>
          <h2 style={{ fontFamily:'var(--ffs)',fontSize:28,color:'var(--ink)',marginBottom:6 }}>Создать аккаунт</h2>
          <p style={{ fontSize:13,color:'var(--ink3)',marginBottom:24 }}>Присоединись к студентам Казахстана</p>
          <form onSubmit={submit}>
            <div className="field"><label>Имя и фамилия</label><input placeholder="Самал Еркин" value={form.name} onChange={upd('name')} required/></div>
            <div className="field"><label>Email</label><input type="email" placeholder="student@mail.ru" value={form.email} onChange={upd('email')} required/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="field"><label>Класс</label>
                <select value={form.grade} onChange={upd('grade')}>
                  <option value="10">10 класс</option><option value="11">11 класс</option>
                  <option value="Выпускник">Выпускник</option><option value="Студент">Студент</option>
                </select>
              </div>
              <div className="field"><label>Город</label>
                <select value={form.city} onChange={upd('city')}>
                  <option>Алматы</option><option>Астана</option><option>Шымкент</option><option>Другой</option>
                </select>
              </div>
            </div>
            <div className="field"><label>Целевой университет</label>
              <select value={form.target_university} onChange={upd('target_university')}>
                <option>КБТУ</option><option>Nazarbayev University</option><option>AITU</option><option>KIMEP</option><option>SDU</option>
              </select>
            </div>
            <div className="field"><label>Пароль</label><input type="password" placeholder="Минимум 6 символов" value={form.password} onChange={upd('password')} required minLength={6}/></div>
            {err && <div className="err-box">{err}</div>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{padding:'13px',fontSize:15,borderRadius:12}}>
              {loading ? 'Создаём...' : 'Начать подготовку →'}
            </button>
          </form>
        </div>
        <p style={{textAlign:'center',marginTop:18,fontSize:13,color:'var(--ink3)'}}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{color:'var(--ink)',fontWeight:700,textDecoration:'underline',textUnderlineOffset:3}}>Войти</Link>
        </p>
      </div>
    </div>
  )
}