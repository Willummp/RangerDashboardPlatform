from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import json

from app import models, schemas, services
from app.db.session import get_db
from app.services.websocket_manager import manager

router = APIRouter()

# --- Endpoint de WebSocket ---

@router.websocket("/ws/{dashboard_id}")
async def websocket_endpoint(websocket: WebSocket, dashboard_id: str):
    """Mantém a conexão WebSocket para um dashboard específico."""
    await manager.connect(websocket, dashboard_id)
    try:
        while True:
            # Apenas mantém a conexão viva, esperando por mensagens (se necessário no futuro)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, dashboard_id)


# --- Endpoints para Dashboards ---

@router.post("/", response_model=schemas.Dashboard)
def create_dashboard(
    dashboard: schemas.DashboardCreate, 
    db: Session = Depends(get_db)
):
    """Cria um novo dashboard."""
    return services.dashboard_service.create_dashboard(db=db, dashboard=dashboard)


@router.get("/", response_model=List[schemas.Dashboard])
def read_dashboards(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Retorna uma lista de dashboards."""
    dashboards = services.dashboard_service.get_dashboards(db, skip=skip, limit=limit)
    return dashboards


@router.get("/{dashboard_id}", response_model=schemas.Dashboard)
def read_dashboard(dashboard_id: int, db: Session = Depends(get_db)):
    db_dashboard = services.dashboard_service.get_dashboard(db, dashboard_id=dashboard_id)
    if db_dashboard is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return schemas.Dashboard.from_orm(db_dashboard)



# --- Endpoints para Cards ---

@router.post("/cards/", response_model=schemas.Card)
async def create_card_for_dashboard(
    card: schemas.CardCreate, 
    db: Session = Depends(get_db)
):
    """Cria um novo card em uma posição calculada e transmite a mudança."""
    db_dashboard = services.dashboard_service.get_dashboard(db, dashboard_id=card.dashboard_id)
    if not db_dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found for this card")
    
    new_card = services.dashboard_service.create_card(db=db, card=card)
    
    # Transmite em tempo real que um novo card foi criado
    await manager.broadcast({
        "event": "card_created",
        "data": schemas.Card.from_orm(new_card).model_dump()
    }, str(card.dashboard_id))
    
    return new_card


@router.patch("/cards/{card_id}", response_model=schemas.Card)
async def update_card_layout(
    card_id: int, 
    card_update: schemas.CardUpdate, 
    db: Session = Depends(get_db)
):
    """Atualiza um card e transmite a mudança em tempo real."""
    db_card = services.dashboard_service.update_card_layout(db, card_id=card_id, card_update=card_update)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
        
    # Transmite a mudança para todos os clientes conectados
    await manager.broadcast({
        "event": "card_updated",
        "data": schemas.Card.from_orm(db_card).model_dump()
    }, str(db_card.dashboard_id))
    
    return db_card


@router.delete("/cards/{card_id}", response_model=schemas.Card)
async def delete_card(card_id: int, db: Session = Depends(get_db)):
    """Deleta um card e transmite a mudança em tempo real."""
    db_card = services.dashboard_service.delete_card(db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    # Transmite que um card foi removido
    await manager.broadcast({
        "event": "card_deleted",
        "data": {"id": card_id} # Envia apenas o ID do card removido
    }, str(db_card.dashboard_id))
        
    return db_card
