import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import useStore from '../store'

const LINKS = [
  { to:'/dashboard',    label:'Главная' },
  { to:'/topics',       label:'Темы' },
  { to:'/exam',         label:'Экзамен' },
  { to:'/ai',           label:'AI' },
  { to:'/universities', label:'Университеты' },
  { to:'/profile',      label:'Профиль' },
]

export default function Layout() {
  const { user } = useStore()
  const navigate = useNavigate()
  const initials = (user?.name||'').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'СА'

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, height:'var(--nav-h)',
        background:'rgba(242,240,235,0.95)', backdropFilter:'blur(16px)',
        borderBottom:'1.5px solid var(--border)', zIndex:200,
        display:'flex', alignItems:'center', padding:'0 32px',
      }}>
        <div onClick={() => navigate('/dashboard')} style={{ flex:1, display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <div style={{ width:34, height:34, background:'var(--ink)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--ffs)', fontSize:18, color:'#fff', fontStyle:'italic' }}>S</span>
          </div>
          <span style={{ fontFamily:'var(--ffs)', fontSize:20, color:'var(--ink)' }}>
            SAua<span style={{ color:'var(--green)', fontStyle:'italic' }}>T</span>
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to}
              style={({ isActive }) => ({
                padding:'6px 13px', borderRadius:20, fontSize:13.5, fontWeight:500,
                color: isActive ? '#fff' : 'var(--ink3)',
                background: isActive ? 'var(--ink)' : 'transparent',
                border: '1px solid transparent',
                transition:'var(--tr)', textDecoration:'none', display:'block',
              })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes('rgb(26')) e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { if (!e.currentTarget.style.background.includes('rgb(26')) e.currentTarget.style.color = 'var(--ink3)' }}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div onClick={() => navigate('/profile')} style={{
          width:34, height:34, borderRadius:'50%', background:'var(--ink)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:12, fontWeight:700, color:'#fff', marginLeft:18,
          cursor:'pointer', flexShrink:0, transition:'var(--tr)',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity='.75'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >{initials}</div>
      </nav>
      <main style={{ marginTop:'var(--nav-h)', padding:'32px', maxWidth:1040, marginLeft:'auto', marginRight:'auto', width:'100%' }}>
        <Outlet />
      </main>
    </>
  )
}