from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app import models, schemas

# --- CONFIGURAÇÃO DO GRID ---
GRID_WIDTH = 12          # Largura do grid em unidades (agora com 6 colunas)
DEFAULT_CARD_WIDTH = 3  # Largura padrão de um novo card (metade do grid)
DEFAULT_CARD_HEIGHT = 1 # Altura padrão de um novo card (uma linha)

def _calculate_next_position(db: Session, dashboard_id: int) -> dict:
    """Calcula a próxima posição livre (x, y) no grid."""
    last_card = db.query(models.Card).filter(
        models.Card.dashboard_id == dashboard_id
    ).order_by(desc(models.Card.id)).first()

    if not last_card:
        return {"position_x": 0, "position_y": 0}

    # Calcula a próxima posição X
    next_x = last_card.position_x + last_card.width
    next_y = last_card.position_y

    # Se a próxima posição X ultrapassar a largura do grid, quebra a linha
    if next_x >= GRID_WIDTH:
        next_x = 0
        next_y = last_card.position_y + last_card.height
    
    return {"position_x": next_x, "position_y": next_y}

# --- Funções para Dashboards ---

def get_dashboard(db: Session, dashboard_id: int):
    return db.query(models.Dashboard).filter(models.Dashboard.id == dashboard_id).first()

def get_dashboards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Dashboard).offset(skip).limit(limit).all()

def create_dashboard(db: Session, dashboard: schemas.DashboardCreate):
    db_dashboard = models.Dashboard(name=dashboard.name)
    db.add(db_dashboard)
    db.commit()
    db.refresh(db_dashboard)
    return db_dashboard

# --- Funções para Cards ---

def create_card(db: Session, card: schemas.CardCreate):
    """Cria um novo card com posição e tamanho padrão calculados."""
    next_pos = _calculate_next_position(db, dashboard_id=card.dashboard_id)
    
    card_data = card.model_dump()
    card_data.update(next_pos)
    
    # Adiciona o tamanho padrão ao novo card
    card_data['width'] = DEFAULT_CARD_WIDTH
    card_data['height'] = DEFAULT_CARD_HEIGHT
    
    db_card = models.Card(**card_data)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

def update_card_layout(db: Session, card_id: int, card_update: schemas.CardUpdate):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card:
        update_data = card_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_card, key, value)
        
        db.add(db_card)
        db.commit()
        db.refresh(db_card)
    return db_card

def delete_card(db: Session, card_id: int):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card:
        db.delete(db_card)
        db.commit()
    return db_card

