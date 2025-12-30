from pydantic import BaseModel, ConfigDict
from .enums import ChartType, SizeOption, ColorOption

class CardBase(BaseModel):
    title: str
    subtitle: str | None = None
    chart_type: ChartType | None = ChartType.BAR
    title_size: SizeOption | None = SizeOption.MD
    title_color: ColorOption | None = ColorOption.DEFAULT
    subtitle_size: SizeOption | None = SizeOption.SM
class CardCreate(BaseModel):
    title: str
    dashboard_id: int
    subtitle: str | None = None
    chart_type: ChartType | None = ChartType.BAR
    title_size: SizeOption | None = SizeOption.MD
    title_color: ColorOption | None = ColorOption.DEFAULT
    subtitle_size: SizeOption | None = SizeOption.SM

# Schema para atualizar um card (campos opcionais)
class CardUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    chart_type: ChartType | None = None
    title_size: SizeOption | None = None
    title_color: ColorOption | None = None
    subtitle_size: SizeOption | None = None
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
    chart_type: ChartType
    position_x: int
    position_y: int
    width: int
    height: int
    

    model_config = ConfigDict(from_attributes=True)
