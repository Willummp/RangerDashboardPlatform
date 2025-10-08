# backend/app/models/dashboard.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relação: Um dashboard tem muitos cards
    cards = relationship("Card", back_populates="dashboard", cascade="all, delete-orphan")