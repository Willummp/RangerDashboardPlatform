from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router

app = FastAPI(
    title="RangerDashboardPlatform API",
    openapi_url="/api/v1/openapi.json"
)

# Configuração de CORS (Cross-Origin Resource Sharing)
# Permite que o frontend Angular (que rodará em outra porta) se comunique com a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para o domínio do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint raiz para um simples health check
@app.get("/")
def read_root():
    return {"status": "API is running!"}

# Inclui todas as rotas da v1 sob o prefixo /api/v1
app.include_router(api_router, prefix="/api/v1")