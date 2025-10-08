# backend/app/schemas/card.py
from pydantic import BaseModel, ConfigDict

# Campos base compartilhados por todos os schemas de Card
class CardBase(BaseModel):
    title: str
    chart_type: str
    position_x: int
    position_y: int
    width: int
    height: int

# Schema para criar um novo card (recebido pela API)
class CardCreate(CardBase):
    dashboard_id: int

# Schema para atualizar um card (campos opcionais)
class CardUpdate(BaseModel):
    title: str | None = None
    chart_type: str | None = None
    position_x: int | None = None
    position_y: int | None = None
    width: int | None = None
    height: int | None = None

# Schema para ler um card (retornado pela API)
class Card(CardBase):
    id: int
    dashboard_id: int
    
    # Habilita o modo "ORM" para que o Pydantic possa ler dados de objetos SQLAlchemy
    model_config = ConfigDict(from_attributes=True)