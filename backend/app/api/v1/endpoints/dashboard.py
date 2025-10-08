# backend/app/api/v1/endpoints/dashboard.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas, services
from app.db.session import get_db

router = APIRouter()

# --- Endpoints para Dashboards ---

@router.post("/", response_model=schemas.Dashboard)
def create_dashboard(
    dashboard: schemas.DashboardCreate, 
    db: Session = Depends(get_db)
):
    """
    Cria um novo dashboard.
    """
    return services.dashboard_service.create_dashboard(db=db, dashboard=dashboard)


@router.get("/", response_model=List[schemas.Dashboard])
def read_dashboards(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Retorna uma lista de dashboards.
    """
    dashboards = services.dashboard_service.get_dashboards(db, skip=skip, limit=limit)
    return dashboards


@router.get("/{dashboard_id}", response_model=schemas.Dashboard)
def read_dashboard(dashboard_id: int, db: Session = Depends(get_db)):
    """
    Retorna um dashboard específico pelo seu ID, incluindo seus cards.
    """
    db_dashboard = services.dashboard_service.get_dashboard(db, dashboard_id=dashboard_id)
    if db_dashboard is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return db_dashboard


# --- Endpoints para Cards ---

@router.post("/cards/", response_model=schemas.Card)
def create_card_for_dashboard(
    card: schemas.CardCreate, 
    db: Session = Depends(get_db)
):
    """
    Cria um novo card associado a um dashboard.
    """
    # Validação: Verifica se o dashboard ao qual o card pertence existe
    db_dashboard = services.dashboard_service.get_dashboard(db, dashboard_id=card.dashboard_id)
    if not db_dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found for this card")
    return services.dashboard_service.create_card(db=db, card=card)


@router.patch("/cards/{card_id}", response_model=schemas.Card)
def update_card_layout(
    card_id: int, 
    card_update: schemas.CardUpdate, 
    db: Session = Depends(get_db)
):
    """
    Atualiza as propriedades de um card (posição, tamanho, etc.).
    """
    db_card = services.dashboard_service.update_card_layout(db, card_id=card_id, card_update=card_update)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    # AQUI é onde você enviaria a notificação via WebSocket no futuro
    # await websocket_manager.broadcast(...)
    return db_card


@router.delete("/cards/{card_id}", response_model=schemas.Card)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    """
    Deleta um card.
    """
    db_card = services.dashboard_service.delete_card(db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card