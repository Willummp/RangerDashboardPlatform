# backend/app/services/dashboard_service.py
from sqlalchemy.orm import Session
from app import models, schemas

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
    db_card = models.Card(**card.model_dump())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

def update_card_layout(db: Session, card_id: int, card_update: schemas.CardUpdate):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card:
        # Pega os dados do schema de atualização
        update_data = card_update.model_dump(exclude_unset=True)
        # Atualiza os campos do objeto do banco de dados
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