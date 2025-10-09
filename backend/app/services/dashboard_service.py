# backend/app/services/dashboard_service.py
from sqlalchemy.orm import Session
from app import models, schemas
import operator # Usaremos para ordenar

# --- Constantes de Layout ---
GRID_WIDTH = 16 # Aumentado de 12 para 16 colunas
DEFAULT_CARD_WIDTH = 4
DEFAULT_CARD_HEIGHT = 4

def _calculate_next_position(db: Session, dashboard_id: int) -> tuple[int, int]:
    """
    Calcula a próxima posição livre no grid de um dashboard.
    """
    existing_cards = db.query(models.Card).filter(models.Card.dashboard_id == dashboard_id).all()

    if not existing_cards:
        return (0, 0) # Primeira posição se o dashboard estiver vazio

    # Ordena os cards por linha (y) e depois por coluna (x) para encontrar o último
    existing_cards.sort(key=operator.attrgetter('position_y', 'position_x'))
    
    # Encontra a linha mais baixa (maior valor de y) que está sendo usada
    max_y = 0
    for card in existing_cards:
        max_y = max(max_y, card.position_y + card.height)

    # Encontra o último card na última linha visual
    last_card = existing_cards[-1]
    
    # Calcula a próxima posição x na mesma linha
    next_x = last_card.position_x + last_card.width

    # Se a próxima posição x + a largura do novo card extrapolar o grid, quebra a linha
    if next_x + DEFAULT_CARD_WIDTH > GRID_WIDTH:
        next_x = 0
        # A próxima linha y é a linha mais baixa preenchida
        next_y = max_y
    else:
        # Senão, mantém na mesma linha do último card
        next_y = last_card.position_y

    return (next_x, next_y)


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
    # 1. Calcula a próxima posição livre
    next_pos_x, next_pos_y = _calculate_next_position(db, card.dashboard_id)

    # 2. Cria o objeto do modelo com os dados recebidos e os calculados
    db_card = models.Card(
        title=card.title,
        dashboard_id=card.dashboard_id,
        position_x=next_pos_x,
        position_y=next_pos_y,
        width=DEFAULT_CARD_WIDTH,
        height=DEFAULT_CARD_HEIGHT
    )
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

