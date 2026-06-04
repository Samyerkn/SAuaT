import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import useStore from '../store'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const { data } = await authApi.login(form)
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch(e) { setErr(e.response?.data?.detail || 'Неверный email или пароль') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'grid', gridTemplateColumns:'1fr 1fr' }}>

      {/* LEFT — info */}
      <div style={{ padding:'56px 64px', display:'flex', flexDirection:'column', justifyContent:'space-between', borderRight:'1.5px solid var(--border)' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:'var(--ink)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--ffs)', fontSize:18, color:'#fff', fontStyle:'italic' }}>S</span>
          </div>
          <span style={{ fontFamily:'var(--ffs)', fontSize:20, color:'var(--ink)' }}>SAua<span style={{ color:'var(--green)', fontStyle:'italic' }}>T</span></span>
        </div>

        {/* Headline */}
        <div>
          <p style={{ fontSize:12, fontWeight:600, color:'var(--green)', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:16 }}>
            Казахстан · SAT 2027
          </p>
          <h1 style={{ fontFamily:'var(--ffs)', fontSize:52, color:'var(--ink)', lineHeight:1.08, letterSpacing:'-.5px', marginBottom:20 }}>
            Готовься<br />к SAT<br /><span style={{ fontStyle:'italic', color:'var(--green)' }}>умнее</span>
          </h1>
          <p style={{ fontSize:15, color:'var(--ink3)', lineHeight:1.7, maxWidth:380 }}>
            Первая платформа для казахстанских студентов — AI-ассистент, mock-тесты и аналитика прогресса.
          </p>
        </div>

        {/* Stats */}
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            {[['96%','готовы платить'],['78%','хотят mock-тесты'],['82%','AI полезен'],['3.82/5','уровень стресса']].map(([v,l]) => (
              <div key={v} style={{ padding:'16px', background:'#fff', border:'1.5px solid var(--border)', borderRadius:12 }}>
                <div style={{ fontFamily:'var(--ffs)', fontSize:26, color:'var(--ink)', marginBottom:4 }}>{v}</div>
                <div style={{ fontSize:12, color:'var(--ink4)' }}>{l}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:11, color:'var(--ink4)' }}>Опрос n=50 · Kazakhstan 2024</p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'56px 64px' }}>
        <div style={{ width:'100%', maxWidth:380 }}>
          <h2 style={{ fontFamily:'var(--ffs)', fontSize:32, color:'var(--ink)', marginBottom:6 }}>Войти</h2>
          <p style={{ fontSize:14, color:'var(--ink3)', marginBottom:32 }}>Продолжи с того места, где остановился</p>

          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="student@mail.ru" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
            </div>
            <div className="field">
              <label>Пароль</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
            </div>
            {err && <div className="err-box">{err}</div>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}
              style={{ padding:'13px', fontSize:15, borderRadius:12, marginTop:4 }}>
              {loading ? <><span className="spinner" style={{width:16,height:16,borderTopColor:'#fff'}}/> Входим...</> : 'Войти →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--ink3)' }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color:'var(--ink)', fontWeight:700, textDecoration:'underline', textUnderlineOffset:3 }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}