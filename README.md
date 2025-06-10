📦 FlowBiz - Instruções para usar com Docker

Este projeto usa Docker para correr tanto o frontend como o backend. As imagens já estão publicadas no Docker Hub, portanto não precisas do código-fonte, apenas do ficheiro docker-compose.yml.

✅ Requisitos

- Docker instalado
- Ligação à internet

🚀 Passos para iniciar o sistema

1. Cria uma nova pasta no teu computador:
      mkdir flowbiz
      cd flowbiz

2. Criar um ficheiro chamado docker-compose.yml com o seguinte conteúdo:

      ```yaml
      version: "3.8"

      services:
      backend:
         image: rodrigoesteves45/flowbiz-backend:latest
         container_name: FlowBiz-backend
         ports:
            - "4000:4000"
         environment:
            - NODE_ENV=production

      frontend:
         image: rodrigoesteves45/flowbiz-frontend:latest
         container_name: FlowBiz-frontend
         ports:
            - "3000:80"
         depends_on:
            - backend
         environment:
            - VITE_API_URL=http://backend:4000

3. Abrir o terminal dentro dessa pasta e executa:
      
      docker compose up

Isso vai:

- Fazer pull automático das imagens do Docker Hub
- Criar e iniciar os containers

🌐 Como aceder:

- Frontend (app web): http://localhost:3000
- Backend (API): http://localhost:4000

🛑 Para parar os containers

- docker compose down

ℹ️ Notas

O sistema corre localmente, mas as imagens vêm diretamente do Docker Hub.
