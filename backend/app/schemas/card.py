from pydantic import BaseModel, ConfigDict

class CardBase(BaseModel):
    title: str
    chart_type: str | None = "bar"
class CardCreate(BaseModel):
    title: str
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
# Adicionamos os campos que não estavam no CardBase
class Card(BaseModel):
    id: int
    dashboard_id: int
    title: str
    chart_type: str
    position_x: int
    position_y: int
    width: int
    height: int
    

    model_config = ConfigDict(from_attributes=True)
