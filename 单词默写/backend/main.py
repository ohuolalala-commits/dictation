"""
英语默写本 — 本地后端
FastAPI + SQLite，替代 LeanCloud
启动: uvicorn main:app --reload
文档: http://127.0.0.1:8000/docs
"""

import hashlib
import secrets
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, AnswerRecord, StudyProgress, PerItemStatus

# ========== 初始化 ==========

Base.metadata.create_all(bind=engine)

app = FastAPI(title="英语默写本 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========== 工具函数 ==========

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_token() -> str:
    return secrets.token_hex(32)


def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未登录")
    token = authorization[7:]
    user = db.query(User).filter(User.token == token).first()
    if not user:
        raise HTTPException(status_code=401, detail="登录已过期")
    return user


# ========== Pydantic 模型 ==========

class RegisterInput(BaseModel):
    username: str
    password: str
    display_name: str = ""
    role: str = "student"  # "teacher" / "student"


class LoginInput(BaseModel):
    username: str
    password: str


class CreateStudentInput(BaseModel):
    username: str
    password: str
    display_name: str = ""


class AnswerSyncItem(BaseModel):
    bank_id: str
    item_index: int
    item_en: str = ""
    item_cn: str = ""
    user_answer: str = ""
    is_correct: bool = False
    time_spent_ms: int = 0


class AnswerSyncBatch(BaseModel):
    answers: list[AnswerSyncItem]


class ProgressSync(BaseModel):
    bank_id: str
    completed_set: list[int] = []
    wrong_set: dict[str, int] = {}
    last_index: int = 0
    section_filter: str = ""


class ItemStatusSync(BaseModel):
    bank_id: str
    item_index: int
    status: str = "correct"
    wrong_count: int = 0
    last_answer: str = ""


class ItemStatusSyncBatch(BaseModel):
    items: list[ItemStatusSync]


class UserInfo(BaseModel):
    id: int
    username: str
    role: str
    display_name: str
    token: Optional[str] = None


# ========== 认证接口 ==========

@app.post("/api/register", response_model=UserInfo)
def register(data: RegisterInput, db: Session = Depends(get_db)):
    """注册（老师或学生）"""
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="该账号已被注册")

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role=data.role,
        display_name=data.display_name or data.username,
        token=generate_token(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserInfo(
        id=user.id,
        username=user.username,
        role=user.role,
        display_name=user.display_name,
        token=user.token,
    )


@app.post("/api/login", response_model=UserInfo)
def login(data: LoginInput, db: Session = Depends(get_db)):
    """登录，返回 token"""
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.password_hash != hash_password(data.password):
        raise HTTPException(status_code=400, detail="账号或密码错误")

    user.token = generate_token()
    db.commit()
    db.refresh(user)

    return UserInfo(
        id=user.id,
        username=user.username,
        role=user.role,
        display_name=user.display_name,
        token=user.token,
    )


@app.get("/api/me", response_model=UserInfo)
def me(current_user: User = Depends(get_current_user)):
    """获取当前登录用户信息"""
    return UserInfo(
        id=current_user.id,
        username=current_user.username,
        role=current_user.role,
        display_name=current_user.display_name,
        token=current_user.token,
    )


# ========== 学生管理（老师专用）==========

@app.post("/api/students", response_model=UserInfo)
def create_student(
    data: CreateStudentInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """老师创建学生账号"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有老师可以创建学生账号")

    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="该账号已存在")

    student = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role="student",
        display_name=data.display_name or data.username,
        teacher_id=current_user.id,
        token=generate_token(),
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    return UserInfo(
        id=student.id,
        username=student.username,
        role=student.role,
        display_name=student.display_name,
        token=None,  # 老师不需要学生 token
    )


@app.get("/api/students")
def list_students(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """老师查看所有学生"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有老师可以查看学生列表")

    students = (
        db.query(User)
        .filter(User.teacher_id == current_user.id, User.role == "student")
        .all()
    )
    return [
        {
            "id": s.id,
            "username": s.username,
            "display_name": s.display_name,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in students
    ]


class ResetPasswordInput(BaseModel):
    password: str


@app.put("/api/students/{student_id}/reset-password")
def reset_student_password(
    student_id: int,
    data: ResetPasswordInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """老师重置学生密码"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有老师可以操作")

    student = (
        db.query(User)
        .filter(User.id == student_id, User.teacher_id == current_user.id)
        .first()
    )
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    student.password_hash = hash_password(data.password)
    student.token = None  # 强制重新登录
    db.commit()
    return {"ok": True}


@app.delete("/api/students/{student_id}")
def delete_student(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """老师删除学生及其所有数据"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有老师可以操作")

    student = (
        db.query(User)
        .filter(User.id == student_id, User.teacher_id == current_user.id)
        .first()
    )
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    # 级联删除学生的所有数据
    db.query(AnswerRecord).filter(AnswerRecord.user_id == student_id).delete()
    db.query(StudyProgress).filter(StudyProgress.user_id == student_id).delete()
    db.query(PerItemStatus).filter(PerItemStatus.user_id == student_id).delete()
    db.delete(student)
    db.commit()
    return {"ok": True}


# ========== 同步接口 ==========

@app.post("/api/sync/answers")
def sync_answers(
    data: AnswerSyncBatch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """批量保存答题记录"""
    count = 0
    for a in data.answers:
        record = AnswerRecord(
            user_id=current_user.id,
            bank_id=a.bank_id,
            item_index=a.item_index,
            item_en=a.item_en,
            item_cn=a.item_cn,
            user_answer=a.user_answer,
            is_correct=a.is_correct,
            time_spent_ms=a.time_spent_ms,
        )
        db.add(record)
        count += 1
    db.commit()
    return {"saved": count}


@app.post("/api/sync/progress")
def sync_progress(
    data: ProgressSync,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """保存 / 更新学习进度（upsert）"""
    progress = (
        db.query(StudyProgress)
        .filter(
            StudyProgress.user_id == current_user.id,
            StudyProgress.bank_id == data.bank_id,
        )
        .first()
    )

    if progress:
        progress.completed_set = data.completed_set
        progress.wrong_set = data.wrong_set
        progress.last_index = data.last_index
        progress.section_filter = data.section_filter
        progress.updated_at = datetime.now(timezone.utc)
    else:
        progress = StudyProgress(
            user_id=current_user.id,
            bank_id=data.bank_id,
            completed_set=data.completed_set,
            wrong_set=data.wrong_set,
            last_index=data.last_index,
            section_filter=data.section_filter,
        )
        db.add(progress)

    db.commit()
    return {"ok": True}


@app.post("/api/sync/item-statuses")
def sync_item_statuses(
    data: ItemStatusSyncBatch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """批量更新每个词条的状态（upsert）"""
    for item in data.items:
        existing = (
            db.query(PerItemStatus)
            .filter(
                PerItemStatus.user_id == current_user.id,
                PerItemStatus.bank_id == item.bank_id,
                PerItemStatus.item_index == item.item_index,
            )
            .first()
        )

        if existing:
            # 一旦错过就保持"wrong"，不因后来答对而覆盖
            if item.status == "wrong":
                existing.status = "wrong"
            # "correct" 不覆盖已有的 "wrong"
            existing.wrong_count = existing.wrong_count + (0 if item.status == "correct" else 1)
            existing.last_answer_at = datetime.now(timezone.utc)
            existing.last_answer = item.last_answer
        else:
            new_item = PerItemStatus(
                user_id=current_user.id,
                bank_id=item.bank_id,
                item_index=item.item_index,
                status=item.status,
                wrong_count=0 if item.status == "correct" else 1,
                last_answer=item.last_answer,
            )
            db.add(new_item)

    db.commit()
    return {"ok": True}


@app.get("/api/progress/{bank_id}")
def fetch_progress(
    bank_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """从服务端拉取某个词库的学习进度"""
    progress = (
        db.query(StudyProgress)
        .filter(
            StudyProgress.user_id == current_user.id,
            StudyProgress.bank_id == bank_id,
        )
        .first()
    )
    if not progress:
        return {"found": False}

    return {
        "found": True,
        "completed_set": progress.completed_set,
        "wrong_set": progress.wrong_set,
        "last_index": progress.last_index,
        "section_filter": progress.section_filter,
    }


# ========== 教师仪表盘接口 ==========

def _build_student_entry(user: User, db: Session):
    """构建一个学生/用户的仪表盘条目"""
    progress_list = (
        db.query(StudyProgress)
        .filter(StudyProgress.user_id == user.id)
        .all()
    )
    answer_count = (
        db.query(AnswerRecord)
        .filter(AnswerRecord.user_id == user.id)
        .count()
    )
    correct_count = (
        db.query(AnswerRecord)
        .filter(AnswerRecord.user_id == user.id, AnswerRecord.is_correct == True)
        .count()
    )
    return {
        "student_id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "answer_count": answer_count,
        "correct_rate": round(correct_count / max(answer_count, 1) * 100, 1),
        "progress": [
            {
                "bank_id": p.bank_id,
                "completed_count": len(p.completed_set) if p.completed_set else 0,
                "wrong_count": len(p.wrong_set) if p.wrong_set else 0,
                "last_index": p.last_index,
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            }
            for p in progress_list
        ],
    }


@app.get("/api/teacher/dashboard")
def teacher_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """教师仪表盘概览数据"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="仅老师可访问")

    students = (
        db.query(User)
        .filter(User.teacher_id == current_user.id, User.role == "student")
        .all()
    )

    result = []
    # 老师自己的练习数据排最前面（方便测试查看）
    teacher_entry = _build_student_entry(current_user, db)
    teacher_entry["display_name"] = current_user.display_name + "（老师自己）"
    teacher_entry["is_teacher"] = True
    result.append(teacher_entry)
    for s in students:
        result.append(_build_student_entry(s, db))

    return result


@app.get("/api/teacher/student/{student_id}/answers")
def student_answers(
    student_id: int,
    bank_id: Optional[str] = None,
    limit: int = 200,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """查看某个学生的答题记录"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="仅老师可访问")

    # 验证是该老师的学生（或老师自己）
    if student_id == current_user.id:
        student = current_user
    else:
        student = db.query(User).filter(
            User.id == student_id,
            User.teacher_id == current_user.id,
        ).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    query = db.query(AnswerRecord).filter(AnswerRecord.user_id == student_id)
    if bank_id:
        query = query.filter(AnswerRecord.bank_id == bank_id)

    records = query.order_by(AnswerRecord.created_at.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "bank_id": r.bank_id,
            "item_index": r.item_index,
            "item_en": r.item_en,
            "item_cn": r.item_cn,
            "user_answer": r.user_answer,
            "is_correct": r.is_correct,
            "time_spent_ms": r.time_spent_ms,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in records
    ]


@app.get("/api/teacher/student/{student_id}/progress")
def student_progress(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """查看某个学生所有词库的详细进度"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="仅老师可访问")

    if student_id == current_user.id:
        student = current_user
    else:
        student = db.query(User).filter(
            User.id == student_id,
            User.teacher_id == current_user.id,
        ).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    progress_list = (
        db.query(StudyProgress)
        .filter(StudyProgress.user_id == student_id)
        .all()
    )

    item_statuses = (
        db.query(PerItemStatus)
        .filter(PerItemStatus.user_id == student_id)
        .all()
    )

    return {
        "student": {
            "id": student.id,
            "username": student.username,
            "display_name": student.display_name,
        },
        "progress": [
            {
                "bank_id": p.bank_id,
                "completed_set": p.completed_set,
                "wrong_set": p.wrong_set,
                "last_index": p.last_index,
                "section_filter": p.section_filter,
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            }
            for p in progress_list
        ],
        "item_statuses": [
            {
                "bank_id": s.bank_id,
                "item_index": s.item_index,
                "status": s.status,
                "wrong_count": s.wrong_count,
                "last_answer": s.last_answer,
                "last_answer_at": s.last_answer_at.isoformat() if s.last_answer_at else None,
            }
            for s in item_statuses
        ],
    }


# ========== 健康检查 ==========

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "英语默写本后端"}


# ========== 启动入口 ==========

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
