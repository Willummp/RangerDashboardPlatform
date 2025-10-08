# backend/app/db/base.py
from sqlalchemy.orm import declarative_base

# Cria uma classe Base que nossos modelos SQLAlchemy herdarão
Base = declarative_base()