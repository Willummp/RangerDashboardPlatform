from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Carrega as variáveis do arquivo .env
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    DATABASE_URL: str
    # GEMINI_API_KEY: str | None = None # Exemplo de variável opcional

# Cria uma instância das configurações que será usada em toda a aplicação
settings = Settings()