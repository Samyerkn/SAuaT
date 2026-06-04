from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import httpx, jwt, bcrypt, uuid, sqlite3, json, os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SAT for Kazakhstan API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

SECRET_KEY  = os.getenv("SECRET_KEY", "sat-kz-secret-2025")
ALGORITHM   = "HS256"
OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
security    = HTTPBearer()

# ══════════════════════════════════════════════
#  DATABASE — SQLite, 4 tables
# ══════════════════════════════════════════════
DB_PATH = "sat_kz.db"

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    db = get_db()
    db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id                TEXT PRIMARY KEY,
            name              TEXT NOT NULL,
            email             TEXT UNIQUE NOT NULL,
            password_hash     TEXT NOT NULL,
            grade             TEXT DEFAULT '11',
            city              TEXT DEFAULT 'Алматы',
            target_university TEXT DEFAULT 'КБТУ',
            target_score      INTEGER DEFAULT 1300,
            created_at        TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS progress (
            user_id           TEXT PRIMARY KEY REFERENCES users(id),
            sat_score         INTEGER DEFAULT 800,
            tests_completed   INTEGER DEFAULT 0,
            streak_days       INTEGER DEFAULT 0,
            math_progress     INTEGER DEFAULT 0,
            reading_progress  INTEGER DEFAULT 0,
            writing_progress  INTEGER DEFAULT 0,
            activity          TEXT    DEFAULT '[0,0,0,0,0,0,0]'
        );
        CREATE TABLE IF NOT EXISTS test_history (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    TEXT NOT NULL REFERENCES users(id),
            subject    TEXT NOT NULL,
            sat_score  INTEGER,
            accuracy   INTEGER,
            correct    INTEGER,
            total      INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS chat_messages (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    TEXT NOT NULL REFERENCES users(id),
            role       TEXT NOT NULL,
            content    TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    """)
    db.commit()
    db.close()
    print("✅ Database initialised:", DB_PATH)

init_db()

# ══════════════════════════════════════════════
#  SCHEMAS
# ══════════════════════════════════════════════
class RegisterReq(BaseModel):
    name: str
    email: EmailStr
    password: str
    grade: Optional[str] = "11"
    city: Optional[str] = "Алматы"
    target_university: Optional[str] = "КБТУ"
    target_score: Optional[int] = 1300

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class ExamSubmitReq(BaseModel):
    subject: str
    answers: List[int]
    time_spent: Optional[int] = 0

class ChatReq(BaseModel):
    message: str

class ProfileUpdateReq(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    target_university: Optional[str] = None
    target_score: Optional[int] = None

# ══════════════════════════════════════════════
#  AUTH HELPERS
# ══════════════════════════════════════════════
def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_pw(pw: str, h: str) -> bool:
    return bcrypt.checkpw(pw.encode(), h.encode())

def make_token(uid: str) -> str:
    exp = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"sub": uid, "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except Exception:
        raise HTTPException(401, "Invalid token")
    db = get_db()
    row = db.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
    db.close()
    if not row:
        raise HTTPException(401, "User not found")
    return dict(row)

def safe_user(u: dict) -> dict:
    return {k: v for k, v in u.items() if k != "password_hash"}

# ══════════════════════════════════════════════
#  QUESTIONS BANK
# ══════════════════════════════════════════════
QUESTIONS = {
    "math": [
        {"id":1,"text":"Если 3x + 7 = 22, чему равно x?","options":["3","4","5","6"],"correct":2,"topic":"Линейные уравнения","explanation":"3x = 22−7 = 15, поэтому x = 5"},
        {"id":2,"text":"Площадь прямоугольника 48 см². Длина 8 см. Найдите периметр.","options":["22 см","24 см","28 см","32 см"],"correct":2,"topic":"Геометрия","explanation":"Ширина = 48÷8 = 6. Периметр = 2×(8+6) = 28 см"},
        {"id":3,"text":"Решите: x² − 5x + 6 = 0","options":["x=1, x=6","x=2, x=3","x=−2, x=−3","x=3, x=−2"],"correct":1,"topic":"Квадратные уравнения","explanation":"(x−2)(x−3)=0 → x=2 или x=3"},
        {"id":4,"text":"Если f(x) = 2x² − 3x + 1, найдите f(3).","options":["8","10","11","12"],"correct":1,"topic":"Функции","explanation":"f(3) = 2×9 − 9 + 1 = 10"},
        {"id":5,"text":"Скидка 25% на товар за 12 000 ₸. Цена после скидки?","options":["8 000 ₸","9 000 ₸","9 600 ₸","10 000 ₸"],"correct":1,"topic":"Проценты","explanation":"12000 × 0.75 = 9 000 ₸"},
        {"id":6,"text":"Среднее чисел 4, 8, 12, 16, 20 равно:","options":["10","11","12","14"],"correct":2,"topic":"Статистика","explanation":"Сумма=60, кол-во=5, среднее=12"},
        {"id":7,"text":"Если 2ˣ = 32, чему равно x?","options":["4","5","6","8"],"correct":1,"topic":"Степени","explanation":"2⁵ = 32, значит x = 5"},
    ],
    "reading": [
        {"id":1,"text":"«Таяние льдов ускоряется, угрожая белым медведям.» Главная мысль:","options":["Климат стабилен","Изменение климата угрожает арктике","Медведи мигрировали","Лёд всегда таял"],"correct":1,"topic":"Главная мысль","explanation":"Оба предложения — о последствиях изменения климата"},
        {"id":2,"text":"Слово 'benevolent' ближе всего к:","options":["злой","добродушный","быстрый","умный"],"correct":1,"topic":"Лексика","explanation":"Benevolent = добросердечный"},
        {"id":3,"text":"Автор критикует систему образования. Его тон:","options":["нейтральный","восторженный","критический","безразличный"],"correct":2,"topic":"Тон автора","explanation":"Критика = критический тон"},
        {"id":4,"text":"'The tip of the iceberg' означает:","options":["верхушка льда","видимая часть большой проблемы","конец истории","начало пути"],"correct":1,"topic":"Идиомы","explanation":"Видимая часть скрытой большой проблемы"},
        {"id":5,"text":"«96% студентов готовы платить за платформу» показывает:","options":["Студенты не хотят учиться","Высокий спрос на платформы","Офлайн-курсы бесплатны","Нет данных"],"correct":1,"topic":"Анализ данных","explanation":"96% — высокий спрос"},
    ],
    "writing": [
        {"id":1,"text":"Ошибка: «Each of the students have completed their assignment.»","options":["Each","of the students","have completed","their assignment"],"correct":2,"topic":"Согласование","explanation":"Each — ед.число, нужно 'has completed'"},
        {"id":2,"text":"«Neither the teacher nor the students ___ ready.»","options":["was","were","is","are"],"correct":1,"topic":"Neither…nor","explanation":"Согласуется с ближайшим: students → were"},
        {"id":3,"text":"«However___ the results were positive.» — знак:","options":["не нужен","запятая после However","точка с запятой","двоеточие"],"correct":1,"topic":"Пунктуация","explanation":"Вводные слова отделяются запятой"},
        {"id":4,"text":"Лучший вариант для академического эссе:","options":["I think this is super cool","The evidence suggests a significant correlation","OMG amazing","Kinda looks like it works"],"correct":1,"topic":"Академический стиль","explanation":"Академический текст требует формального языка"},
    ]
}

# ══════════════════════════════════════════════
#  ROUTES
# ══════════════════════════════════════════════

@app.get("/")
def root():
    return {"status": "SAT for Kazakhstan API running", "db": DB_PATH, "gemini": bool(ANTHROPIC_KEY)}

# ── AUTH ──────────────────────────────────────
@app.post("/auth/register")
def register(req: RegisterReq):
    db = get_db()
    if db.execute("SELECT id FROM users WHERE email=?", (req.email,)).fetchone():
        db.close(); raise HTTPException(400, "Email уже зарегистрирован")
    uid = str(uuid.uuid4())
    db.execute(
        "INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)",
        (uid, req.name, req.email, hash_pw(req.password),
         req.grade, req.city, req.target_university, req.target_score,
         datetime.utcnow().isoformat())
    )
    db.execute(
        "INSERT INTO progress VALUES (?,?,?,?,?,?,?,?)",
        (uid, 800, 0, 0, 0, 0, 0, "[0,0,0,0,0,0,0]")
    )
    db.commit(); db.close()
    u = {"id":uid,"name":req.name,"email":req.email,"grade":req.grade,
         "city":req.city,"target_university":req.target_university,"target_score":req.target_score}
    print(f"✅ New user registered: {req.email}")
    return {"token": make_token(uid), "user": u}

@app.post("/auth/login")
def login(req: LoginReq):
    db = get_db()
    row = db.execute("SELECT * FROM users WHERE email=?", (req.email,)).fetchone()
    db.close()
    if not row or not verify_pw(req.password, row["password_hash"]):
        raise HTTPException(401, "Неверный email или пароль")
    u = dict(row)
    print(f"✅ User logged in: {req.email}")
    return {"token": make_token(u["id"]), "user": safe_user(u)}

# ── USER ──────────────────────────────────────
@app.get("/user/me")
def get_me(user=Depends(get_current_user)):
    return safe_user(user)

@app.put("/user/profile")
def update_profile(req: ProfileUpdateReq, user=Depends(get_current_user)):
    db = get_db()
    if req.name:              db.execute("UPDATE users SET name=? WHERE id=?", (req.name, user["id"]))
    if req.city:              db.execute("UPDATE users SET city=? WHERE id=?", (req.city, user["id"]))
    if req.target_university: db.execute("UPDATE users SET target_university=? WHERE id=?", (req.target_university, user["id"]))
    if req.target_score:      db.execute("UPDATE users SET target_score=? WHERE id=?", (req.target_score, user["id"]))
    db.commit()
    row = db.execute("SELECT * FROM users WHERE id=?", (user["id"],)).fetchone()
    db.close()
    return {"success": True, "user": safe_user(dict(row))}

@app.get("/user/progress")
def get_progress(user=Depends(get_current_user)):
    db = get_db()
    p = db.execute("SELECT * FROM progress WHERE user_id=?", (user["id"],)).fetchone()
    history = db.execute(
        "SELECT * FROM test_history WHERE user_id=? ORDER BY created_at DESC LIMIT 6",
        (user["id"],)
    ).fetchall()
    db.close()
    if not p:
        return {"sat_score":800,"tests_completed":0,"streak_days":0,
                "math_progress":0,"reading_progress":0,"writing_progress":0,
                "activity":[0,0,0,0,0,0,0],"test_history":[],
                "target_score":user["target_score"],"target_university":user["target_university"]}
    result = dict(p)
    result["activity"] = json.loads(result.get("activity","[0,0,0,0,0,0,0]"))
    result["test_history"] = [dict(h) for h in history]
    result["target_score"] = user["target_score"]
    result["target_university"] = user["target_university"]
    return result

# ── EXAM ──────────────────────────────────────
@app.get("/exam/questions/{subject}")
def get_questions(subject: str, user=Depends(get_current_user)):
    if subject not in QUESTIONS:
        raise HTTPException(404, "Раздел не найден")
    qs = [{"id":q["id"],"text":q["text"],"options":q["options"],"topic":q["topic"]}
          for q in QUESTIONS[subject]]
    return {"subject": subject, "questions": qs, "total": len(qs)}

@app.post("/exam/submit")
def submit_exam(req: ExamSubmitReq, user=Depends(get_current_user)):
    if req.subject not in QUESTIONS:
        raise HTTPException(404, "Раздел не найден")
    qs = QUESTIONS[req.subject]
    correct = sum(
        1 for i, q in enumerate(qs)
        if i < len(req.answers) and req.answers[i] == q["correct"]
    )
    total    = len(qs)
    accuracy = round(correct / total * 100)
    results  = [
        {
            "question_id":   q["id"],
            "topic":         q["topic"],
            "correct":       req.answers[i] == q["correct"] if i < len(req.answers) else False,
            "your_answer":   req.answers[i] if i < len(req.answers) else -1,
            "correct_answer":q["correct"],
            "explanation":   q["explanation"] if (i < len(req.answers) and req.answers[i] != q["correct"]) else None
        }
        for i, q in enumerate(qs)
    ]
    wrong_topics = list({r["topic"] for r in results if not r["correct"]})

    db = get_db()
    p  = dict(db.execute("SELECT * FROM progress WHERE user_id=?", (user["id"],)).fetchone() or {})
    new_score = min(1600, (p.get("sat_score", 800) or 800) + accuracy // 10)

    # update subject progress
    col_map = {"math": "math_progress", "reading": "reading_progress", "writing": "writing_progress"}
    col = col_map.get(req.subject, "math_progress")

    activity = json.loads(p.get("activity", "[0,0,0,0,0,0,0]"))
    day = datetime.utcnow().weekday()
    activity[day] = min(120, activity[day] + 30)

    db.execute(
        f"UPDATE progress SET sat_score=?, tests_completed=tests_completed+1, {col}=?, activity=? WHERE user_id=?",
        (new_score, accuracy, json.dumps(activity), user["id"])
    )
    db.execute(
        "INSERT INTO test_history (user_id,subject,sat_score,accuracy,correct,total) VALUES (?,?,?,?,?,?)",
        (user["id"], req.subject, new_score, accuracy, correct, total)
    )
    db.commit(); db.close()
    print(f"✅ Exam submitted: {user['email']} | {req.subject} | {correct}/{total} | score→{new_score}")
    return {"correct":correct,"total":total,"accuracy":accuracy,
            "sat_score":new_score,"results":results,"wrong_topics":wrong_topics}

# ── AI CHAT ───────────────────────────────────
@app.post("/ai/chat")
async def ai_chat(req: ChatReq, user=Depends(get_current_user)):
    db = get_db()
    p = dict(db.execute("SELECT * FROM progress WHERE user_id=?", (user["id"],)).fetchone() or {})
    history = [
        {"role": r["role"], "content": r["content"]}
        for r in db.execute(
            "SELECT role,content FROM chat_messages WHERE user_id=? ORDER BY created_at ASC LIMIT 20",
            (user["id"],)
        ).fetchall()
    ]

    system_ctx = (
        f"Ты AI-ассистент платформы 'SAT for Kazakhstan'. "
        f"Помогаешь казахстанским студентам готовиться к SAT (замена ЕНТ с 2027). "
        f"Отвечай кратко, структурированно, по-русски. Давай конкретные примеры. "
        f"Студент: {user['name']}, {user.get('grade','11')} класс, {user.get('city','Казахстан')}. "
        f"Балл SAT: {p.get('sat_score',800)}. "
        f"Цель: {user.get('target_score',1300)} для {user.get('target_university','КБТУ')}. "
        f"Математика {p.get('math_progress',0)}%, "
        f"Чтение {p.get('reading_progress',0)}%, "
        f"Письмо {p.get('writing_progress',0)}%."
    )

    if not OPENAI_KEY:
        reply = (
            f"[Demo] Нет OPENAI_API_KEY.\n\n"
            f"Добавь в backend/.env:\nOPENAI_API_KEY=sk-...\n\n"
            f"Твой вопрос: «{req.message}»"
        )
    else:
        msgs = history[-10:] + [{"role": "user", "content": req.message}]
        async with httpx.AsyncClient() as client:
            r = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "system", "content": system_ctx}] + msgs,
                    "max_tokens": 1000,
                    "temperature": 0.7,
                },
                timeout=30.0,
            )
        print(f"OpenAI status: {r.status_code}")
        if r.status_code != 200:
            print(f"OpenAI error: {r.text[:300]}")
            raise HTTPException(500, f"OpenAI error {r.status_code}: {r.text[:200]}")
        reply = r.json()["choices"][0]["message"]["content"]

        # Save to DB
    db.execute("INSERT INTO chat_messages (user_id,role,content) VALUES (?,?,?)",
               (user["id"], "user", req.message))
    db.execute("INSERT INTO chat_messages (user_id,role,content) VALUES (?,?,?)",
               (user["id"], "assistant", reply))
    db.commit(); db.close()
    print(f"✅ AI chat: {user['email']} → {req.message[:40]}…")
    return {"reply": reply}

@app.get("/ai/history")
def chat_history(user=Depends(get_current_user)):
    db = get_db()
    msgs = [{"role": r["role"], "content": r["content"]}
            for r in db.execute(
                "SELECT role,content FROM chat_messages WHERE user_id=? ORDER BY created_at ASC LIMIT 40",
                (user["id"],)
            ).fetchall()]
    db.close()
    return {"messages": msgs}

@app.delete("/ai/history")
def clear_history(user=Depends(get_current_user)):
    db = get_db()
    db.execute("DELETE FROM chat_messages WHERE user_id=?", (user["id"],))
    db.commit(); db.close()
    return {"success": True}

# ── UNIVERSITIES ──────────────────────────────
@app.get("/universities")
def get_unis(user=Depends(get_current_user)):
    return {"universities": [
        {"id":1,"name":"Nazarbayev University","short":"NU","city":"Астана","required_sat":1400,"deadline":"01.03.2025","scholarships":True},
        {"id":2,"name":"КБТУ","short":"KBTU","city":"Алматы","required_sat":1300,"deadline":"01.05.2025","scholarships":True},
        {"id":3,"name":"AITU","short":"AITU","city":"Астана","required_sat":1200,"deadline":"01.06.2025","scholarships":True},
        {"id":4,"name":"KIMEP University","short":"KIMEP","city":"Алматы","required_sat":1250,"deadline":"15.05.2025","scholarships":False},
        {"id":5,"name":"SDU University","short":"SDU","city":"Кентау","required_sat":1100,"deadline":"15.06.2025","scholarships":True},
    ]}

# ── DB VIEWER (for demo/presentation) ────────
@app.get("/admin/db-stats")
def db_stats():
    db = get_db()
    stats = {}
    for table in ["users","progress","test_history","chat_messages"]:
        count = db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        stats[table] = count
    db.close()
    return {"tables": stats, "db_path": DB_PATH}