# backend/app/models/card.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, default="Novo Card")
    chart_type = Column(String, nullable=False, default="bar")
    
    # Propriedades do grid
    position_x = Column(Integer, nullable=False)
    position_y = Column(Integer, nullable=False)
    width = Column(Integer, nullable=False, default=4)
    height = Column(Integer, nullable=False, default=4)
    
    # Chave estrangeira para o dashboard
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"), nullable=False)
    
    # Relação: Um card pertence a um dashboard
    dashboard = relationship("Dashboard", back_populates="cards")