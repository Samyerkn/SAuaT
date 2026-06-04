import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { examApi } from '../api'
import useStore from '../store'

const LETTERS = ['A','B','C','D']

const ALL_QUESTIONS = {
  math: [
    {id:1,text:"Если 3x + 7 = 22, чему равно x?",options:["3","4","5","6"],correct:2,topic:"Линейные уравнения",explanation:"3x = 22−7 = 15, x = 5"},
    {id:2,text:"Площадь прямоугольника 48 см². Длина 8 см. Найдите периметр.",options:["22 см","24 см","28 см","32 см"],correct:2,topic:"Геометрия",explanation:"Ширина = 48÷8 = 6. Периметр = 2×(8+6) = 28"},
    {id:3,text:"Решите: x² − 5x + 6 = 0",options:["x=1, x=6","x=2, x=3","x=−2, x=−3","x=3, x=−2"],correct:1,topic:"Квадратные уравнения",explanation:"(x−2)(x−3)=0, x=2 или x=3"},
    {id:4,text:"Если f(x) = 2x² − 3x + 1, найдите f(3).",options:["8","10","11","12"],correct:1,topic:"Функции",explanation:"f(3)=18−9+1=10"},
    {id:5,text:"Скидка 25% на товар за 12 000 ₸. Цена после скидки?",options:["8 000 ₸","9 000 ₸","9 600 ₸","10 000 ₸"],correct:1,topic:"Проценты",explanation:"12000×0.75=9000"},
    {id:6,text:"Среднее чисел 4, 8, 12, 16, 20?",options:["10","11","12","14"],correct:2,topic:"Статистика",explanation:"Сумма=60, кол-во=5, ср=12"},
    {id:7,text:"Если 2ˣ = 32, чему равно x?",options:["4","5","6","8"],correct:1,topic:"Степени",explanation:"2⁵=32, x=5"},
    {id:8,text:"Длина окружности с радиусом 7 см (π≈3.14)?",options:["21.98 см","43.96 см","49 см","14 см"],correct:1,topic:"Геометрия",explanation:"C=2πr=2×3.14×7=43.96"},
    {id:9,text:"Если a:b = 3:5 и a=12, найдите b.",options:["15","18","20","24"],correct:2,topic:"Пропорции",explanation:"12/b=3/5, b=20"},
    {id:10,text:"Найдите 15% от 240.",options:["24","30","36","42"],correct:2,topic:"Проценты",explanation:"240×0.15=36"},
    {id:11,text:"Упростите: (x²-9)/(x+3)",options:["x-3","x+3","x²-3","(x-3)(x+3)"],correct:0,topic:"Алгебра",explanation:"x²-9=(x-3)(x+3), делим на (x+3)→x-3"},
    {id:12,text:"Угол треугольника равен 40° и 75°. Третий угол?",options:["55°","65°","75°","85°"],correct:1,topic:"Геометрия",explanation:"180−40−75=65°"},
  ],
  reading: [
    {id:1,text:"«Таяние арктических льдов ускоряется, угрожая белым медведям.» Главная мысль:",options:["Климат стабилен","Изменение климата угрожает арктике","Медведи мигрировали","Лёд всегда таял"],correct:1,topic:"Главная мысль",explanation:"Оба предложения — о последствиях изменения климата"},
    {id:2,text:"'Benevolent' ближе всего к:",options:["злой","добродушный","быстрый","умный"],correct:1,topic:"Лексика",explanation:"Benevolent=добросердечный"},
    {id:3,text:"Автор критикует систему образования. Его тон:",options:["нейтральный","восторженный","критический","безразличный"],correct:2,topic:"Тон автора",explanation:"Критика=критический тон"},
    {id:4,text:"'The tip of the iceberg' означает:",options:["верхушка льда","видимая часть большой проблемы","конец истории","начало пути"],correct:1,topic:"Идиомы",explanation:"Видимая часть скрытой проблемы"},
    {id:5,text:"«96% студентов готовы платить за онлайн-платформу» показывает:",options:["Студенты не учатся","Высокий спрос на платформы","Курсы бесплатны","Нет данных"],correct:1,topic:"Анализ данных",explanation:"96%=высокий спрос"},
    {id:6,text:"Текст: «Реформы 1990-х изменили экономику Казахстана.» Какой тип это предложения?",options:["Аргументация","Фактическое утверждение","Личное мнение","Гипотеза"],correct:1,topic:"Типы утверждений",explanation:"Это исторический факт без оценки"},
    {id:7,text:"Слово 'meticulous' означает:",options:["небрежный","внимательный к деталям","торопливый","скучный"],correct:1,topic:"Лексика",explanation:"Meticulous=очень внимательный, педантичный"},
    {id:8,text:"Автор заканчивает эссе призывом к действию. Это пример:",options:["Введения","Заключения с призывом","Контраргумента","Тезиса"],correct:1,topic:"Структура текста",explanation:"Призыв к действию=стандартное заключение"},
  ],
  writing: [
    {id:1,text:"Ошибка: «Each of the students have completed their assignment.»",options:["Each","of the students","have completed","their assignment"],correct:2,topic:"Согласование",explanation:"Each=ед.число, нужно 'has completed'"},
    {id:2,text:"«Neither the teacher nor the students ___ ready.»",options:["was","were","is","are"],correct:1,topic:"Neither...nor",explanation:"Согласуется с ближайшим: students→were"},
    {id:3,text:"«However___ the results were positive.»",options:["нет знака","запятая после However","точка с запятой","двоеточие"],correct:1,topic:"Пунктуация",explanation:"Вводные наречия отделяются запятой"},
    {id:4,text:"Лучший вариант для академического эссе:",options:["I think this is super cool","The evidence suggests a significant correlation","OMG this is amazing","Kinda looks like it works"],correct:1,topic:"Академический стиль",explanation:"Академический текст=формальный язык"},
    {id:5,text:"Выберите правильный вариант: «The data ___ collected yesterday.»",options:["was","were","is","are"],correct:0,topic:"Пассивный залог",explanation:"Data как единое целое=was collected"},
    {id:6,text:"Найдите ошибку: «He don't know the answer.»",options:["He","don't","know","the answer"],correct:1,topic:"Глагол do",explanation:"He→3-е лицо ед.ч.→doesn't"},
    {id:7,text:"Какой союз лучше: «I studied hard, ___ I failed the exam.»",options:["and","but","so","because"],correct:1,topic:"Союзы",explanation:"Противопоставление→but"},
    {id:8,text:"«The team ___ playing well this season.»",options:["is","are","was","were"],correct:0,topic:"Согласование коллективных существительных",explanation:"Team как единое целое→is"},
  ]
}

function Ring({ pct }) {
  const r = 52, circ = 2 * Math.PI * r
  return (
    <svg width="126" height="126" style={{ transform:'rotate(-90deg)' }}>
      <circle cx="63" cy="63" r={r} fill="none" stroke="var(--bg2)" strokeWidth="10"/>
      <circle cx="63" cy="63" r={r} fill="none" stroke="var(--emerald)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        style={{ transition:'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}/>
    </svg>
  )
}

export default function Exam() {
  const [view, setView]       = useState('select')
  const [subject, setSubject] = useState(null)
  const [questions, setQs]    = useState([])
  const [qi, setQi]           = useState(0)
  const [answers, setAns]     = useState([])
  const [picked, setPicked]   = useState(null)
  const [revealed, setRev]    = useState(false)
  const [timeLeft, setTime]   = useState(0)
  const [timerId, setTid]     = useState(null)
  const [result, setResult]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [saveErr, setSaveErr] = useState(null)
  const navigate = useNavigate()

  const SUBJECTS = [
    { key:'math',    icon:'∑', label:'Математика', count:`${ALL_QUESTIONS.math.length} вопросов`, desc:'Алгебра, геометрия, статистика, функции', color:'var(--emerald-d)' },
    { key:'reading', icon:'¶', label:'Чтение',     count:`${ALL_QUESTIONS.reading.length} вопросов`, desc:'Анализ текста, лексика, идиомы, тон автора', color:'var(--teal)' },
    { key:'writing', icon:'✦', label:'Письмо',     count:`${ALL_QUESTIONS.writing.length} вопросов`, desc:'Грамматика, пунктуация, стиль, согласование', color:'var(--gold)' },
  ]

  const start = (subj) => {
    setSubject(subj); const qs = ALL_QUESTIONS[subj.key]
    setQs(qs); setQi(0); setAns([]); setPicked(null); setRev(false)
    const t = qs.length * 75; setTime(t)
    clearInterval(timerId)
    const id = setInterval(() => setTime(p => { if (p<=1){clearInterval(id);return 0} return p-1 }), 1000)
    setTid(id); setView('exam')
  }

  const pick = (i) => { if (!revealed) setPicked(i) }

  const next = () => {
    if (picked===null) return
    const newAns = [...answers, picked]; setAns(newAns); setRev(true)
    setTimeout(() => {
      if (qi+1 >= questions.length) { clearInterval(timerId); finish(newAns) }
      else { setQi(qi+1); setPicked(null); setRev(false) }
    }, 700)
  }

  const finish = async (ans) => {
    setView('result'); setSaving(true); setSaveErr(null)
    try {
      const { data } = await examApi.submit({ subject: subject.key, answers: ans, time_spent: (questions.length*75)-timeLeft })
      setResult(data)
    } catch(e) {
      setSaveErr('Не сохранено в БД: ' + e.message)
      const correct = ans.filter((a,i)=>i<questions.length&&a===questions[i].correct).length
      setResult({ correct, total:questions.length, accuracy:Math.round(correct/questions.length*100), sat_score:0, wrong_topics:[] })
    } finally { setSaving(false) }
  }

  const reset = () => { clearInterval(timerId); setView('select'); setResult(null); setAns([]); setQi(0); setPicked(null); setRev(false) }
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const q = questions[qi]

  /* ── SELECT ── */
  if (view==='select') return (
    <div className="page-in">
      <div className="mb3">
        <h1 className="serif" style={{ fontSize:26, letterSpacing:'-.5px' }}>Mock Exam</h1>
        <p className="text-sm text-muted mt1">Результаты сохраняются в базу данных · 75 сек на вопрос</p>
      </div>
      <div className="g3 mb3">
        {SUBJECTS.map(s => (
          <button key={s.key} onClick={()=>start(s)} style={{ background:'var(--card)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', padding:'28px 24px', textAlign:'left', cursor:'pointer', transition:'var(--tr)', boxShadow:'var(--shadow)', position:'relative', overflow:'hidden' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-lg)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow)'}}>
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:s.color, opacity:.06 }} />
            <div style={{ fontSize:28, fontFamily:'var(--ff-serif)', fontStyle:'italic', color:s.color, marginBottom:12, fontWeight:400 }}>{s.icon}</div>
            <div style={{ fontFamily:'var(--ff-serif)', fontSize:20, color:'var(--ink)', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:11, fontWeight:700, color:s.color, marginBottom:8, letterSpacing:'.5px', textTransform:'uppercase' }}>{s.count}</div>
            <div style={{ fontSize:12, color:'var(--ink3)', lineHeight:1.5 }}>{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )

  /* ── EXAM ── */
  if (view==='exam' && q) return (
    <div className="page-in" style={{ maxWidth:640, margin:'0 auto' }}>
      <div className="flex fac fjb mb3">
        <div>
          <span className="serif" style={{ fontSize:15, color:'var(--emerald-d)' }}>{subject?.label}</span>
          <span className="text-sm text-muted"> · Вопрос {qi+1} из {questions.length}</span>
        </div>
        <span style={{ background: timeLeft<120?'var(--rose)':'var(--emerald-d)', color:'#fff', padding:'7px 18px', borderRadius:20, fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:15, transition:'background .3s' }}>
          {fmt(timeLeft)}
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ display:'flex', gap:5, marginBottom:22 }}>
        {questions.map((_,i) => <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<qi?'var(--emerald)':i===qi?'var(--emerald-l)':'var(--bg2)', transition:'background .3s' }}/>)}
      </div>

      <div className="card mb3">
        <div style={{ display:'inline-block', background:'var(--emerald-l)', color:'var(--emerald-d)', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:14 }}>{q.topic}</div>
        <p style={{ fontSize:16, lineHeight:1.75, color:'var(--ink)', marginBottom:22 }}>{q.text}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {q.options.map((opt,i) => {
            let bg='var(--bg)', border='var(--border)', color='var(--ink2)'
            if (revealed) {
              if (i===q.correct) { bg='var(--emerald-l)'; border='var(--emerald)'; color='var(--emerald-d)' }
              else if (i===picked) { bg='var(--rose-l)'; border='var(--rose)'; color='var(--rose)' }
            } else if (i===picked) { bg='var(--blue-l)'; border='var(--blue)'; color='var(--blue)' }
            return (
              <button key={i} onClick={()=>pick(i)} style={{ padding:'12px 16px', border:`1.5px solid ${border}`, borderRadius:'var(--r-sm)', background:bg, color, display:'flex', alignItems:'center', gap:12, cursor:revealed?'default':'pointer', transition:'all .15s', textAlign:'left', fontFamily:'var(--ff-sans)', fontSize:14 }}>
                <span style={{ width:24, height:24, borderRadius:'50%', border:'1.5px solid currentColor', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, fontFamily:'var(--ff-serif)', fontStyle:'italic' }}>{LETTERS[i]}</span>
                <span style={{ flex:1 }}>{opt}</span>
                {revealed && i===q.correct && <span style={{ color:'var(--emerald)', fontSize:18 }}>✓</span>}
                {revealed && i===picked && i!==q.correct && <span style={{ color:'var(--rose)', fontSize:18 }}>✗</span>}
              </button>
            )
          })}
        </div>
        {revealed && q.explanation && (
          <div style={{ marginTop:14, padding:'12px 14px', background:'var(--gold-l)', borderRadius:'var(--r-sm)', border:'1px solid #FDE68A', fontSize:13, color:'var(--gold)' }}>
            💡 {q.explanation}
          </div>
        )}
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button className="btn btn-ghost" onClick={reset}>Завершить</button>
        <button className="btn btn-primary" onClick={next} disabled={picked===null||revealed} style={{ fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:15 }}>
          {qi+1===questions.length?'Завершить тест →':'Далее →'}
        </button>
      </div>
    </div>
  )

  /* ── RESULT ── */
  if (view==='result') return (
    <div className="page-in" style={{ maxWidth:500, margin:'0 auto', textAlign:'center' }}>
      <div className="card" style={{ padding:'36px 32px' }}>
        {saving ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <div className="spinner" style={{ width:36, height:36 }}/>
            <p style={{ fontSize:14, color:'var(--ink3)' }}>Сохраняем в базу данных...</p>
          </div>
        ) : result && (<>
          {saveErr ? (
            <div style={{ background:'var(--rose-l)', borderRadius:'var(--r-sm)', padding:'10px 14px', fontSize:12, color:'var(--rose)', marginBottom:20, textAlign:'left' }}>{saveErr}</div>
          ) : (
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--emerald-l)', color:'var(--emerald-d)', borderRadius:20, padding:'4px 14px', fontSize:11, fontWeight:700, marginBottom:20 }}>✓ Сохранено в базу данных</div>
          )}
          <div style={{ position:'relative', width:126, height:126, margin:'0 auto 20px' }}>
            <Ring pct={result.accuracy}/>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>
              <div className="serif" style={{ fontSize:26 }}>{result.correct}/{result.total}</div>
            </div>
          </div>
          <h2 className="serif" style={{ fontSize:22, marginBottom:8 }}>
            {result.accuracy>=80?'Отличный результат! 🎉':result.accuracy>=60?'Хороший результат 👍':'Продолжай стараться 💪'}
          </h2>
          <p style={{ fontSize:13, color:'var(--ink3)', marginBottom:24 }}>
            {result.accuracy}% правильных · {result.sat_score>0&&`Новый SAT: ${result.sat_score}`}
          </p>
          <div className="g3 mb3">
            {[{v:result.correct,l:'Верно',c:'var(--emerald)'},{v:result.total-result.correct,l:'Неверно',c:'var(--rose)'},{v:result.accuracy+'%',l:'Точность',c:'var(--ink)'}].map(s=>(
              <div key={s.l} style={{ background:'var(--bg)', borderRadius:'var(--r-sm)', padding:16, border:'1px solid var(--border)' }}>
                <div className="serif" style={{ fontSize:24, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--ink4)', marginTop:4, textTransform:'uppercase', letterSpacing:'.5px' }}>{s.l}</div>
              </div>
            ))}
          </div>
          {result.wrong_topics?.length>0 && (
            <div style={{ background:'var(--gold-l)', border:'1px solid #FDE68A', borderRadius:'var(--r-sm)', padding:'12px 16px', marginBottom:20, textAlign:'left' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'var(--gold)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px' }}>Повторить темы:</p>
              {result.wrong_topics.map(t=><p key={t} style={{ fontSize:13, color:'var(--gold)' }}>· {t}</p>)}
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <button className="btn btn-primary btn-full" onClick={reset} style={{ padding:13, fontFamily:'var(--ff-serif)', fontStyle:'italic', fontSize:15 }}>Ещё раз</button>
            <button className="btn btn-ghost btn-full" onClick={()=>navigate('/ai')}>🤖 Разобрать ошибки с AI</button>
            <button className="btn btn-ghost btn-full" onClick={()=>navigate('/dashboard')}>← На главную</button>
          </div>
        </>)}
      </div>
    </div>
  )
}
