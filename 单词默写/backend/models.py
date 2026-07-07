from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")  # "teacher" / "student"
    display_name = Column(String, default="")
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    token = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # self-referential: teacher -> students
    students = relationship("User", backref="teacher_obj", remote_side=[id], foreign_keys=[teacher_id])


class AnswerRecord(Base):
    __tablename__ = "answer_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_id = Column(String, nullable=False)
    item_index = Column(Integer, nullable=False)
    item_en = Column(String, default="")
    item_cn = Column(String, default="")
    user_answer = Column(String, default="")
    is_correct = Column(Boolean, default=False)
    time_spent_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="answer_records")


class StudyProgress(Base):
    __tablename__ = "study_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_id = Column(String, nullable=False)
    completed_set = Column(JSON, default=list)   # list[int]
    wrong_set = Column(JSON, default=dict)        # dict[str, int]
    last_index = Column(Integer, default=0)
    section_filter = Column(String, default="")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="study_progress")


class PerItemStatus(Base):
    __tablename__ = "per_item_status"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_id = Column(String, nullable=False)
    item_index = Column(Integer, nullable=False)
    status = Column(String, default="correct")  # "correct" / "wrong"
    wrong_count = Column(Integer, default=0)
    last_answer_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_answer = Column(String, default="")

    user = relationship("User", backref="per_item_statuses")
