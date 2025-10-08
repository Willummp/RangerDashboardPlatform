# backend/test_db.py
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

print("--- Iniciando teste de conexão com o banco de dados ---")

# Carrega as variáveis do arquivo .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERRO: A variável DATABASE_URL não foi encontrada no arquivo .env!")
else:
    # Por segurança, mostra apenas o começo e o fim da URL
    url_preview = f"{DATABASE_URL[:25]}...{DATABASE_URL[-20:]}"
    print(f"Tentando conectar com a URL: {url_preview}")

    try:
        # Tenta criar a engine (o ponto onde a conexão é testada)
        engine = create_engine(DATABASE_URL)

        # Tenta estabelecer uma conexão de fato e executar um comando simples
        with engine.connect() as connection:
            print("\nSUCESSO! ✅ Conexão com o banco de dados estabelecida!")
            
            print("Executando uma query de teste (SELECT 1)...")
            result = connection.execute(text("SELECT 1"))
            print("Query de teste executada com sucesso.")

    except Exception as e:
        print("\nFALHA! ❌ Não foi possível conectar ao banco de dados.")
        print(f"\nO erro detalhado foi:\n{e}")

print("\n--- Teste finalizado ---")