# backend/app/schemas/dashboard.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from .card import Card  # Importa o schema de leitura do Card

# Campos base para o Dashboard
class DashboardBase(BaseModel):
    name: str

# Schema para criar um dashboard
class DashboardCreate(DashboardBase):
    pass

# Schema para ler um dashboard, incluindo sua lista de cards
class Dashboard(DashboardBase):
    id: int
    created_at: datetime
    cards: list[Card] = [] # Retornará uma lista de cards que pertencem a este dashboard

    model_config = ConfigDict(from_attributes=True)