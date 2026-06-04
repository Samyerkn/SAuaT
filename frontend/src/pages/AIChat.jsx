import { useState, useEffect, useRef } from 'react'
import { aiApi } from '../api'
import useStore from '../store'

const SUGS = [
  'Объясни квадратные уравнения для SAT',
  'Как найти главную мысль текста?',
  'Writing секция SAT — стратегии',
  'План подготовки на 3 месяца',
  'Частые темы математики на SAT',
  'Объясни ошибки в последнем тесте',
]

function Msg({ role, content }) {
  const u = role === 'user'
  return (
    <div style={{display:'flex',gap:10,alignItems:'flex-start',flexDirection:u?'row-reverse':'row',animation:'fadeUp .18s ease'}}>
      <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:u?'var(--gray-3)':'var(--accent-l)',border:`1px solid ${u?'var(--gray-4)':'var(--accent-b)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:u?'var(--white)':'var(--accent)',fontFamily:'var(--mono)'}}>
        {u?'Я':'AI'}
      </div>
      <div style={{maxWidth:'76%',padding:'10px 14px',fontSize:14,lineHeight:1.65,borderRadius:u?'12px 3px 12px 12px':'3px 12px 12px 12px',background:u?'var(--gray-2)':'var(--gray-1)',color:u?'var(--white)':'var(--gray-7)',border:`1px solid ${u?'var(--gray-3)':'var(--gray-3)'}`,whiteSpace:'pre-wrap'}}>
        {content}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div style={{display:'flex',gap:10,alignItems:'center'}}>
      <div style={{width:28,height:28,borderRadius:'50%',background:'var(--accent-l)',border:'1px solid var(--accent-b)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--accent)',fontFamily:'var(--mono)',flexShrink:0}}>AI</div>
      <div style={{padding:'10px 16px',background:'var(--gray-1)',border:'1px solid var(--gray-3)',borderRadius:'3px 12px 12px 12px',display:'flex',gap:5,alignItems:'center'}}>
        {[0,.2,.4].map((d,i)=><span key={i} style={{width:5,height:5,borderRadius:'50%',background:'var(--accent)',display:'inline-block',animation:`blink 1.2s ${d}s infinite`}}/>)}
      </div>
    </div>
  )
}

export default function AIChat() {
  const { user, progress } = useStore()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [histLoading, setHL] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    aiApi.history().then(({data})=>{
      if (data.messages.length === 0) {
        setMessages([{role:'assistant',content:`Привет, ${user?.name?.split(' ')[0]||''}!\n\nЯ AI-ассистент для подготовки к SAT.\n• Текущий балл: ${progress?.sat_score||800}\n• Цель: ${progress?.target_score||1300} для ${user?.target_university||'КБТУ'}\n\nЧто разбираем?`}])
      } else { setMessages(data.messages) }
    }).catch(()=>setMessages([{role:'assistant',content:'Привет! Чем могу помочь?'}])).finally(()=>setHL(false))
  }, [])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev=>[...prev,{role:'user',content:msg}])
    setLoading(true)
    try {
      const {data} = await aiApi.chat(msg)
      setMessages(prev=>[...prev,{role:'assistant',content:data.reply}])
    } catch(e) {
      setMessages(prev=>[...prev,{role:'assistant',content:`Ошибка: ${e.message}\n\nAI модели временно перегружены. Попробуй через минуту или используй другую модель.`}])
    } finally { setLoading(false) }
  }

  const clear = async () => { try{await aiApi.clearHistory()}catch{}; setMessages([{role:'assistant',content:'Чат очищен.'}]) }

  return (
    <div className="page-in" style={{display:'flex',flexDirection:'column',height:'calc(100vh - 56px - 56px)',gap:14}}>
      <style>{`@keyframes blink{0%,60%,100%{opacity:.2}30%{opacity:1}}`}</style>

      <div className="flex fac fjb">
        <div>
          <h1 style={{fontSize:24,fontWeight:700,letterSpacing:'-1px'}}>AI Ассистент</h1>
          <div className="flex fac gap2 mt1">
            <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 8px var(--accent)'}}/>
            <span className="xs" style={{color:'var(--accent)',fontWeight:600,fontFamily:'var(--mono)'}}>OpenAI · GPT-4o mini</span>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={clear} style={{fontSize:12}}>Очистить</button>
      </div>

      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {SUGS.map(s=>(
          <button key={s} onClick={()=>send(s)} style={{padding:'5px 12px',border:'1px solid var(--gray-3)',borderRadius:20,fontSize:12,cursor:'pointer',background:'var(--gray-1)',color:'var(--gray-5)',transition:'var(--tr)',fontFamily:'var(--ff)',fontWeight:500}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.color='var(--accent)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-3)';e.currentTarget.style.color='var(--gray-5)'}}>
            {s}
          </button>
        ))}
      </div>

      <div className="card" style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:12,padding:18}}>
        {histLoading ? <div style={{display:'flex',justifyContent:'center',paddingTop:40}}><div className="spinner" style={{width:24,height:24}}/></div> : (
          <>{messages.map((m,i)=><Msg key={i} role={m.role} content={m.content}/>)}
          {loading && <Typing/>}
          <div ref={bottomRef}/></>
        )}
      </div>

      <div style={{display:'flex',gap:10}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
          placeholder="Задай вопрос по SAT... (Enter — отправить)"
          rows={2}
          style={{flex:1,padding:'10px 14px',border:'1px solid var(--gray-3)',borderRadius:'var(--r)',fontSize:14,fontFamily:'var(--ff)',background:'var(--gray-1)',color:'var(--white)',resize:'none',transition:'var(--tr)'}}
          onFocus={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='0 0 0 3px var(--accent-l)'}}
          onBlur={e=>{e.currentTarget.style.borderColor='var(--gray-3)';e.currentTarget.style.boxShadow=''}}
        />
        <button className="btn btn-primary" onClick={()=>send()} disabled={!input.trim()||loading}
          style={{padding:'0 22px',fontSize:18,alignSelf:'stretch',fontFamily:'var(--mono)'}}>
          {loading ? <span className="spinner" style={{width:16,height:16}}/> : '→'}
        </button>
      </div>
    </div>
  )
}