# backend/scripts/add_typography_columns.py
import sys
import os
from sqlalchemy import create_engine, text

# Adiciona o diretório pai ao path para importar as configs se necessário
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Erro: DATABASE_URL não encontrada no .env")
    sys.exit(1)

# Fix para o driver do postgres se necessário (postgres:// -> postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def run_migration():
    engine = create_engine(DATABASE_URL)
    
    # Comandos SQL para adicionar as colunas se não existirem
    # Usando 'IF NOT EXISTS' é mais seguro no Postgres para blocos DO, mas o ALTER COLUMN básico não tem IF NOT EXISTS.
    # Vamos tentar adicionar, se falhar é porque já existe provavavelmente.
    
    sqls = [
        "ALTER TABLE cards ADD COLUMN IF NOT EXISTS subtitle VARCHAR DEFAULT NULL;",
        "ALTER TABLE cards ADD COLUMN IF NOT EXISTS title_size VARCHAR DEFAULT 'md';",
        "ALTER TABLE cards ADD COLUMN IF NOT EXISTS title_color VARCHAR DEFAULT 'default';",
        "ALTER TABLE cards ADD COLUMN IF NOT EXISTS subtitle_size VARCHAR DEFAULT 'sm';",
    ]

    with engine.connect() as conn:
        for sql in sqls:
            try:
                print(f"Executando: {sql}")
                conn.execute(text(sql))
                print("✅ Sucesso.")
            except Exception as e:
                print(f"⚠️ Aviso (pode ignorar se já existir): {e}")
        
        conn.commit()
    
    print("🚀 Migração de tipografia concluída!")

if __name__ == "__main__":
    run_migration()
