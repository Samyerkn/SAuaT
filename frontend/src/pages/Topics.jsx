import { useState } from 'react'
import useStore from '../store'

const TOPICS = {
  math: {
    label: 'Математика',
    color: '#1A7A5E',
    units: [
      {
        id: 'm1',
        title: 'Линейные уравнения',
        level: 'Базовый',
        time: '15 мин',
        videoUrl: 'https://www.youtube.com/embed/9DxrF6Ttws4',
        theory: `## Линейные уравнения

Линейное уравнение имеет вид: **ax + b = c**

**Алгоритм решения:**
1. Перенеси все слагаемые с x в левую часть
2. Перенеси числа в правую часть
3. Раздели обе части на коэффициент при x

**Пример:**
3x + 7 = 22
3x = 22 − 7
3x = 15
x = 5

**На SAT часто встречается:**
- Уравнения с дробями: x/3 + 2 = 5
- Уравнения с переменной в знаменателе
- Системы двух линейных уравнений`,
        tasks: [
          { q: 'Если 5x − 3 = 17, чему равно x?', a: 'x = 4. Решение: 5x = 20, x = 4' },
          { q: 'Найди x: 2(x + 3) = 14', a: 'x = 4. Раскроем скобки: 2x + 6 = 14, 2x = 8, x = 4' },
          { q: 'При каком x верно равенство: x/4 + 1 = 3?', a: 'x = 8. Решение: x/4 = 2, x = 8' },
        ]
      },
      {
        id: 'm2',
        title: 'Квадратные уравнения',
        level: 'Средний',
        time: '20 мин',
        videoUrl: 'https://www.youtube.com/embed/2ZzuZvz33X0',
        theory: `## Квадратные уравнения

Стандартный вид: **ax² + bx + c = 0**

**Три способа решения:**

**1. Разложение на множители**
x² − 5x + 6 = 0
(x − 2)(x − 3) = 0
x = 2 или x = 3

**2. Формула дискриминанта**
D = b² − 4ac
x = (−b ± √D) / 2a

**3. Формула Виета (быстро!)**
Если x₁ + x₂ = −b/a
и x₁ · x₂ = c/a

**Лайфхак для SAT:** всегда сначала пробуй разложить на множители — это быстрее.`,
        tasks: [
          { q: 'Реши: x² + 5x + 6 = 0', a: 'x = −2 и x = −3. Раскладываем: (x+2)(x+3) = 0' },
          { q: 'Реши: x² − 9 = 0', a: 'x = 3 и x = −3. Это разность квадратов: (x−3)(x+3) = 0' },
          { q: 'Найди сумму корней: 2x² − 8x + 6 = 0', a: 'Сумма = 4. По формуле Виета: −b/a = 8/2 = 4' },
        ]
      },
      {
        id: 'm3',
        title: 'Проценты и пропорции',
        level: 'Базовый',
        time: '12 мин',
        videoUrl: 'https://www.youtube.com/embed/WYIDzo5jmBo',
        theory: `## Проценты и пропорции

**Формулы:**
- Процент от числа: X% от N = N × X/100
- Число по проценту: если X% = A, то N = A × 100/X
- Изменение в %: (новое − старое) / старое × 100%

**Пропорция:**
a/b = c/d → a × d = b × c

**Типичные задачи SAT:**
- Скидки и наценки
- Смеси и концентрации
- Прирост населения, зарплата`,
        tasks: [
          { q: 'Товар стоил 8000 ₸, цену повысили на 25%. Новая цена?', a: '10 000 ₸. Решение: 8000 × 1.25 = 10 000' },
          { q: '30 — это 40% от какого числа?', a: '75. Решение: x = 30 × 100/40 = 75' },
          { q: 'Если 3/x = 5/20, найди x.', a: 'x = 12. Из пропорции: 3×20 = 5×x, x = 60/5 = 12' },
        ]
      },
      {
        id: 'm4',
        title: 'Функции и графики',
        level: 'Средний',
        time: '18 мин',
        videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI',
        theory: `## Функции и графики

**Функция** — правило, которое каждому x ставит в соответствие y.

**f(x) = ax + b** — линейная функция (прямая)
**f(x) = ax² + bx + c** — квадратичная (парабола)

**Важные понятия:**
- f(a) — подставь a вместо x и вычисли
- Нули функции — точки где f(x) = 0
- Область значений — все возможные y

**На SAT проверяют:**
- Вычислить f(конкретное число)
- Найти f(g(x)) — композиция функций
- Определить по графику свойства функции`,
        tasks: [
          { q: 'f(x) = 3x² − 2. Найди f(3).', a: '25. Решение: 3×9 − 2 = 27 − 2 = 25' },
          { q: 'g(x) = x + 4, f(x) = 2x. Найди f(g(1)).', a: '10. g(1) = 5, f(5) = 10' },
          { q: 'При каком x функция f(x) = x² − 4 равна нулю?', a: 'x = 2 и x = −2' },
        ]
      },
      {
        id: 'm5',
        title: 'Статистика и вероятность',
        level: 'Средний',
        time: '15 мин',
        videoUrl: 'https://www.youtube.com/embed/uhxtUt_-GyM',
        theory: `## Статистика и вероятность

**Среднее арифметическое:**
x̄ = (x₁ + x₂ + ... + xₙ) / n

**Медиана** — среднее значение при упорядочивании

**Мода** — наиболее частое значение

**Вероятность:**
P(A) = число благоприятных исходов / общее число исходов

P(A и B) = P(A) × P(B) — для независимых событий
P(A или B) = P(A) + P(B) − P(A и B)`,
        tasks: [
          { q: 'Среднее чисел 4, 8, 6, 10, 2 равно:', a: '6. Сумма = 30, делим на 5 = 6' },
          { q: 'В мешке 3 красных и 7 синих шаров. Вероятность вытащить красный?', a: '0.3 или 30%' },
          { q: 'Медиана набора {3, 7, 1, 9, 5} равна:', a: '5. Упорядочиваем: 1,3,5,7,9 → медиана = 5' },
        ]
      },
      {
        id: 'm6',
        title: 'Геометрия',
        level: 'Средний',
        time: '20 мин',
        videoUrl: 'https://www.youtube.com/embed/302eJ3TzJQU',
        theory: `## Геометрия на SAT

**Формулы которые надо знать:**

Прямоугольник: S = a×b, P = 2(a+b)
Треугольник: S = ½×a×h
Круг: S = πr², C = 2πr
Куб: V = a³, S = 6a²

**Теорема Пифагора:**
a² + b² = c²

**Стандартные треугольники SAT:**
- 3-4-5
- 5-12-13
- 30-60-90 (стороны: 1, √3, 2)
- 45-45-90 (стороны: 1, 1, √2)`,
        tasks: [
          { q: 'Катеты прямоугольного треугольника 6 и 8. Гипотенуза?', a: '10. 6²+8²=36+64=100, √100=10' },
          { q: 'Площадь круга с радиусом 5?', a: '25π ≈ 78.5' },
          { q: 'Сумма углов треугольника равна?', a: '180 градусов' },
        ]
      },
    ]
  },
  reading: {
    label: 'Чтение',
    color: '#1D4ED8',
    units: [
      {
        id: 'r1',
        title: 'Главная мысль текста',
        level: 'Базовый',
        time: '12 мин',
        videoUrl: 'https://www.youtube.com/embed/kgSMsxFkR6M',
        theory: `## Главная мысль (Main Idea)

Вопросы типа "What is the main idea?" — одни из самых частых на SAT Reading.

**Алгоритм:**
1. Прочитай первый и последний абзац полностью
2. Прочитай первое предложение каждого абзаца
3. Спроси себя: "О чём ВЕСЬ текст?"

**Ловушки SAT:**
- Слишком узкий ответ (только об одном абзаце)
- Слишком широкий ответ (не из текста)
- Верный факт, но не главная мысль

**Сигнальные слова:**
- "In conclusion..." / "Therefore..." → вывод
- "However..." / "But..." → противопоставление`,
        tasks: [
          { q: 'Текст описывает рост онлайн-образования в Казахстане. Что будет главной мыслью?', a: 'Онлайн-образование становится всё более популярным в Казахстане' },
          { q: 'Автор приводит три примера пользы физических упражнений. Главная мысль?', a: 'Физические упражнения полезны для здоровья — все три примера это доказывают' },
        ]
      },
      {
        id: 'r2',
        title: 'Тон и позиция автора',
        level: 'Средний',
        time: '15 мин',
        videoUrl: 'https://www.youtube.com/embed/A2jqFl0BSGA',
        theory: `## Тон автора (Author's Tone)

**Основные тоны:**
- **Критический** — автор не согласен, критикует
- **Объективный** — нейтральное изложение фактов
- **Саркастический** — скрытая насмешка
- **Восторженный** — восхищение, энтузиазм
- **Пессимистичный** — негативный взгляд

**Как определить тон:**
Смотри на прилагательные и глаголы.
"Провалилась" ≠ "не достигла результата"

**Ключевые слова тональности:**
- alarming, devastating → негативный
- promising, remarkable → позитивный
- merely, only → снижение значимости`,
        tasks: [
          { q: '"Несмотря на многолетние обещания, реформа так и не принесла реальных результатов." Тон автора?', a: 'Критический / скептический' },
          { q: '"Открытие учёных представляет собой значительный прорыв в медицине." Тон автора?', a: 'Позитивный / восторженный' },
        ]
      },
      {
        id: 'r3',
        title: 'Значение слов в контексте',
        level: 'Базовый',
        time: '10 мин',
        videoUrl: 'https://www.youtube.com/embed/Rg9MhPBV1hc',
        theory: `## Words in Context

SAT не спрашивает общее значение слова — он спрашивает значение в данном контексте.

**Алгоритм:**
1. Прочитай предложение без этого слова
2. Придумай своё слово которое подходит
3. Найди похожее в вариантах ответа

**Пример:**
"The scientist's approach was novel."
Здесь novel = new (новый), а не роман.

**Часто проверяемые слова:**
- novel → new (не книга)
- critical → important (не критичный)
- concrete → specific (не бетон)
- address → deal with (не адрес)`,
        tasks: [
          { q: '"Her argument was compelling." Что значит compelling здесь?', a: 'Убедительный, захватывающий — не принуждение' },
          { q: '"The team resolved the conflict." Что значит resolved?', a: 'Решили, урегулировали — не твёрдый характер' },
        ]
      },
    ]
  },
  writing: {
    label: 'Письмо',
    color: '#B06A00',
    units: [
      {
        id: 'w1',
        title: 'Согласование подлежащего и сказуемого',
        level: 'Базовый',
        time: '12 мин',
        videoUrl: 'https://www.youtube.com/embed/Bs6JC2oLMXg',
        theory: `## Subject-Verb Agreement

**Правило:** глагол должен согласоваться с подлежащим в числе.

**Ед. число → is/was/has/does**
**Мн. число → are/were/have/do**

**Ловушки SAT:**

1. Слова между подлежащим и глаголом:
"The box of chocolates IS on the table" (не are!)

2. Неопределённые местоимения (всегда ед. число):
each, every, anyone, everyone, nobody, either, neither

3. Коллективные существительные:
team, group, committee → обычно ед. число`,
        tasks: [
          { q: 'Найди ошибку: "Each of the students have their own desk."', a: 'have → has. Each = единственное число' },
          { q: 'Найди ошибку: "The group of scientists were awarded a prize."', a: 'were → was. Group = коллективное существительное' },
          { q: 'Верно или нет: "Neither the teacher nor the students were ready."', a: 'Верно! С neither...nor глагол согласуется с ближайшим словом (students → were)' },
        ]
      },
      {
        id: 'w2',
        title: 'Пунктуация',
        level: 'Средний',
        time: '15 мин',
        videoUrl: 'https://www.youtube.com/embed/bLlj_GeKniA',
        theory: `## Пунктуация на SAT

**Точка с запятой (;)**
Соединяет два полных предложения:
"I studied hard; I still failed." ✓

**Двоеточие (:)**
Вводит список или объяснение:
"She had one goal: to pass SAT." ✓

**Тире (—)**
Выделяет пояснение или паузу:
"The answer — surprisingly — was correct." ✓

**Запятая с вводными словами:**
However, Therefore, Nevertheless → запятая после!
"However, the results were positive." ✓

**Апостроф:**
its = принадлежность
it's = it is`,
        tasks: [
          { q: '"The experiment failed therefore we tried again." Как исправить?', a: '"The experiment failed; therefore, we tried again."' },
          { q: '"Its a beautiful day." Ошибка?', a: 'Its → It\'s (it is)' },
          { q: '"However the plan worked." Ошибка?', a: 'However, — нужна запятая после вводного слова' },
        ]
      },
      {
        id: 'w3',
        title: 'Академический стиль',
        level: 'Базовый',
        time: '10 мин',
        videoUrl: 'https://www.youtube.com/embed/DKMEd3YYQNM',
        theory: `## Академический стиль письма

**Что НЕ используют в академическом тексте:**
- Разговорные слова: kinda, gonna, wanna, super
- Первое лицо без необходимости: "I think", "I feel"
- Сокращения: don't → do not, can't → cannot
- Восклицательные знаки

**Что используют:**
- Формальные глаголы: suggests, demonstrates, indicates
- Пассивный залог: "It was found that..."
- Точные слова: "significant" вместо "big"

**Лайфхак:** если ответ звучит как разговор — скорее всего неправильный.`,
        tasks: [
          { q: 'Какой вариант лучше для эссе: A) "I think climate change is bad" B) "Evidence suggests that climate change poses significant risks"', a: 'B — формальный, конкретный, без "I think"' },
          { q: 'Исправь: "The results were kinda surprising to the researchers."', a: '"The results were somewhat surprising to the researchers."' },
        ]
      },
    ]
  }
}

const LEVEL_COLOR = { 'Базовый': '#1A7A5E', 'Средний': '#B06A00', 'Сложный': '#C94040' }
const LEVEL_BG    = { 'Базовый': '#E8F5F1', 'Средний': '#FDF4E7', 'Сложный': '#FBF0F0' }

function TheoryModal({ topic, onClose }) {
  const [tab, setTab] = useState('theory')
  const [revealed, setRevealed] = useState({})

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:680, maxHeight:'88vh', overflow:'hidden', display:'flex', flexDirection:'column', border:'1.5px solid var(--border)' }}>

        {/* Header */}
        <div style={{ padding:'22px 28px', borderBottom:'1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <span style={{ fontSize:11, fontWeight:600, color:LEVEL_COLOR[topic.level], background:LEVEL_BG[topic.level], padding:'2px 10px', borderRadius:20, marginRight:10 }}>{topic.level}</span>
            <span style={{ fontSize:11, color:'var(--ink4)' }}>{topic.time}</span>
            <h2 style={{ fontFamily:'var(--ffs)', fontSize:24, color:'var(--ink)', marginTop:6 }}>{topic.title}</h2>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:'50%', background:'var(--bg)', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:18, color:'var(--ink3)', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1.5px solid var(--border)', padding:'0 28px' }}>
          {[['theory','Конспект'],['video','Видеоурок'],['tasks','Задания']].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding:'12px 16px', fontSize:13, fontWeight:600, color: tab===id ? 'var(--ink)' : 'var(--ink4)', background:'transparent', borderBottom: tab===id ? '2px solid var(--ink)' : '2px solid transparent', marginBottom:-1, transition:'var(--tr)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px 28px' }}>

          {tab === 'theory' && (
            <div style={{ fontSize:14, lineHeight:1.8, color:'var(--ink2)' }}>
              {topic.theory.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h3 key={i} style={{ fontFamily:'var(--ffs)', fontSize:22, color:'var(--ink)', margin:'0 0 16px' }}>{line.slice(3)}</h3>
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{ fontWeight:700, color:'var(--ink)', margin:'12px 0 4px' }}>{line.slice(2,-2)}</p>
                if (line.trim() === '') return <div key={i} style={{ height:8 }}/>
                const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code style="background:var(--bg2);padding:1px 6px;border-radius:4px;font-size:13px">$1</code>')
                return <p key={i} style={{ margin:'4px 0' }} dangerouslySetInnerHTML={{ __html: formatted }}/>
              })}
            </div>
          )}

          {tab === 'video' && (
            <div>
              <div style={{ borderRadius:12, overflow:'hidden', background:'#000', aspectRatio:'16/9', marginBottom:16 }}>
                <iframe width="100%" height="100%" src={topic.videoUrl} title={topic.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen style={{ border:'none', display:'block' }}/>
              </div>
              <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.6 }}>
                Видеоурок по теме "{topic.title}". После просмотра перейди во вкладку "Задания" чтобы закрепить материал.
              </p>
            </div>
          )}

          {tab === 'tasks' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {topic.tasks.map((task, i) => (
                <div key={i} style={{ background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:12, padding:'18px 20px' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--ink4)', letterSpacing:'.8px', textTransform:'uppercase', marginBottom:8 }}>Задание {i+1}</div>
                  <p style={{ fontSize:14, color:'var(--ink)', lineHeight:1.65, marginBottom:14, fontWeight:500 }}>{task.q}</p>
                  {revealed[i] ? (
                    <div style={{ background:'#E8F5F1', border:'1px solid #A7D7C5', borderRadius:8, padding:'12px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', marginBottom:4 }}>ОТВЕТ</div>
                      <p style={{ fontSize:14, color:'var(--ink)', lineHeight:1.6 }}>{task.a}</p>
                    </div>
                  ) : (
                    <button onClick={() => setRevealed({...revealed,[i]:true})} className="btn btn-ghost" style={{ fontSize:13 }}>
                      Показать ответ
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Topics() {
  const [activeSection, setActiveSection] = useState('math')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const section = TOPICS[activeSection]

  return (
    <div className="page-in">
      {selectedTopic && <TheoryModal topic={selectedTopic} onClose={() => setSelectedTopic(null)}/>}

      <div className="mb3">
        <h1 style={{ fontFamily:'var(--ffs)', fontSize:28, color:'var(--ink)', letterSpacing:'-.5px' }}>Темы и материалы</h1>
        <p className="sm muted mt1">Конспекты, видеоуроки и задания по каждой теме SAT</p>
      </div>

      {/* Section tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {Object.entries(TOPICS).map(([key, s]) => (
          <button key={key} onClick={() => setActiveSection(key)}
            style={{ padding:'8px 20px', borderRadius:24, fontSize:14, fontWeight:600, cursor:'pointer', transition:'var(--tr)', border:'1.5px solid', borderColor: activeSection===key ? s.color : 'var(--border)', background: activeSection===key ? s.color : '#fff', color: activeSection===key ? '#fff' : 'var(--ink3)' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:22 }}>
        {[
          { label:'Тем в разделе', value: section.units.length },
          { label:'Видеоуроков', value: section.units.length },
          { label:'Заданий', value: section.units.reduce((s,u) => s + u.tasks.length, 0) },
        ].map(k => (
          <div key={k.label} style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--ink4)', letterSpacing:'.8px', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:'var(--ffs)', fontSize:28, color:'var(--ink)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Topics list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {section.units.map((topic, i) => (
          <button key={topic.id} onClick={() => setSelectedTopic(topic)}
            style={{ display:'flex', alignItems:'center', gap:18, padding:'18px 22px', background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, cursor:'pointer', textAlign:'left', width:'100%', transition:'var(--tr)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = section.color; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}>

            {/* Number */}
            <div style={{ width:40, height:40, borderRadius:10, background:'var(--bg)', border:'1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ffs)', fontSize:18, color:'var(--ink3)', flexShrink:0 }}>
              {i+1}
            </div>

            {/* Info */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:4 }}>{topic.title}</div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:600, color:LEVEL_COLOR[topic.level], background:LEVEL_BG[topic.level], padding:'2px 9px', borderRadius:20 }}>{topic.level}</span>
                <span style={{ fontSize:12, color:'var(--ink4)' }}>{topic.time}</span>
                <span style={{ fontSize:12, color:'var(--ink4)' }}>{topic.tasks.length} задания</span>
              </div>
            </div>

            {/* Right icons */}
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <div style={{ padding:'5px 12px', borderRadius:20, background:'var(--bg)', border:'1px solid var(--border)', fontSize:12, color:'var(--ink3)' }}>
                Конспект
              </div>
              <div style={{ padding:'5px 12px', borderRadius:20, background:'var(--bg)', border:'1px solid var(--border)', fontSize:12, color:'var(--ink3)' }}>
                Видео
              </div>
              <div style={{ fontSize:20, color:'var(--ink4)' }}>›</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
