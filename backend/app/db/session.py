from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Cria a "engine" de conexão com o banco de dados
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Cria uma fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# (Futuro) Função para injeção de dependência que fornecerá uma sessão para cada requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()