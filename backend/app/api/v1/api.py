from fastapi import APIRouter
from app.api.v1.endpoints import dashboard

api_router = APIRouter()

# Inclui o router do dashboard com um prefixo e uma tag para a documentação
api_router.include_router(dashboard.router, prefix="/dashboards", tags=["Dashboards"])