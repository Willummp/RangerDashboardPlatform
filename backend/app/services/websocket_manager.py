from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        # Dicionário para guardar conexões ativas por dashboard
        # Estrutura: { "dashboard_id_1": [websocket1, websocket2], ... }
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, dashboard_id: str):
        await websocket.accept()
        if dashboard_id not in self.active_connections:
            self.active_connections[dashboard_id] = []
        self.active_connections[dashboard_id].append(websocket)

    def disconnect(self, websocket: WebSocket, dashboard_id: str):
        if dashboard_id in self.active_connections:
            self.active_connections[dashboard_id].remove(websocket)

    async def broadcast(self, message: dict, dashboard_id: str):
        connections = self.active_connections.get(dashboard_id, [])
        for connection in connections:
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()
