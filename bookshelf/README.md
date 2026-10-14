# 📚 BookShelf — Personal Book Collection Manager

A full-stack web application for managing your personal book collection. Built with **FastAPI**, **React**, and **PostgreSQL**, with a complete DevOps pipeline covering containerization, CI/CD, infrastructure as code, Kubernetes orchestration, and observability.

---

## 🏗 Architecture

```
┌────────────┐     ┌────────────────┐     ┌──────────────┐
│   React    │────▶│   FastAPI      │────▶│  PostgreSQL  │
│  Frontend  │     │   Backend      │     │   Database   │
│  (Nginx)   │     │  /api/books    │     │              │
└────────────┘     │  /health       │     └──────────────┘
                   │  /metrics      │
                   └────────────────┘
                          │
               ┌──────────┴──────────┐
               │    Prometheus       │
               │    + Grafana        │
               └─────────────────────┘
```

---

## 🚀 Features

- **Book Management** — Add, edit, delete, and organize books
- **Status Tracking** — Mark books as Wishlist, Reading, or Completed
- **Rating System** — Rate books from 1 to 5 stars
- **Genre Filtering** — Filter your collection by reading status
- **Responsive UI** — Works on desktop and mobile
- **Health Monitoring** — `/health` and `/metrics` endpoints
- **Full DevOps Pipeline** — CI/CD, Docker, Kubernetes, Terraform, Monitoring

---

## 📦 Tech Stack

| Layer           | Technology              |
|-----------------|-------------------------|
| Frontend        | React 18, Nginx         |
| Backend         | FastAPI, SQLAlchemy      |
| Database        | PostgreSQL 16, Alembic   |
| Containerization| Docker, Docker Compose   |
| CI/CD           | GitHub Actions, GHCR     |
| Security        | Trivy vulnerability scan |
| Infrastructure  | Terraform, AWS (VPC + EKS) |
| Orchestration   | Kubernetes, Helm         |
| Monitoring      | Prometheus, Grafana      |

---

## 🛠 Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.12+
- Node.js 20+

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bookshelf.git
cd bookshelf

# Start all services
docker compose up --build

# Open in browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Health check: http://localhost:8000/health
```

### Run Locally (Development)

```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (separate terminal)
cd frontend
npm install
npm start
```

### Run Tests

```bash
cd backend
pytest -v
```

---

## 📡 API Endpoints

| Method   | Endpoint           | Description         |
|----------|--------------------|---------------------|
| `GET`    | `/health`          | Health check        |
| `GET`    | `/metrics`         | Prometheus metrics  |
| `GET`    | `/api/books/`      | List all books      |
| `GET`    | `/api/books/{id}`  | Get a book by ID    |
| `POST`   | `/api/books/`      | Add a new book      |
| `PUT`    | `/api/books/{id}`  | Update a book       |
| `DELETE` | `/api/books/{id}`  | Delete a book       |

---

## 🐳 Docker

Both Dockerfiles use **non-root users** for security:

- `backend/Dockerfile` — Python 3.12 slim image
- `frontend/Dockerfile` — Multi-stage build (Node 20 → Nginx 1.27)

---

## ⚙️ CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every push to `main`:

1. **Test** — Runs `pytest` and fails on any test failure
2. **Build Frontend** — Builds the React app
3. **Build & Push** — Builds Docker images and pushes to GHCR with SHA-based tags
4. **Security Scan** — Runs Trivy against both images, fails on HIGH/CRITICAL CVEs

---

## 🌍 Infrastructure (Terraform)

Provisions AWS infrastructure:

- **VPC** with 2 public subnets across availability zones
- **EKS** cluster with a managed worker node group

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply

# IMPORTANT: Destroy when done to avoid AWS charges
terraform destroy
```

---

## ☸️ Kubernetes + Helm

Deploy to the EKS cluster:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy with Helm
helm upgrade --install bookshelf helm/bookshelf -n bookshelf

# Verify
kubectl get pods -n bookshelf
kubectl get svc -n bookshelf
helm list -n bookshelf
```

---

## 📊 Observability

### Prometheus

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus -n bookshelf -f monitoring/prometheus-values.yaml
```

### Grafana

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana -n bookshelf -f monitoring/grafana-values.yaml
```

**Recommended Grafana panels:**
- Request Rate: `rate(http_requests_total[5m])`
- Latency (P95): `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`
- Error Rate: `rate(http_requests_total{status=~"5.."}[5m])`

---

## 📁 Project Structure

```
bookshelf/
├── .github/workflows/ci.yml    # CI/CD pipeline
├── backend/
│   ├── app/                    # FastAPI application
│   ├── alembic/                # Database migrations
│   ├── tests/                  # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/                    # React application
│   ├── public/
│   ├── Dockerfile              # Multi-stage build
│   └── nginx.conf
├── terraform/                  # AWS infrastructure (VPC + EKS)
├── k8s/                        # Kubernetes namespace manifest
├── helm/bookshelf/             # Helm chart
├── monitoring/                 # Prometheus + Grafana configs
├── docker-compose.yml
└── README.md
```

---

## 📝 License

This project was built as a DevOps Capstone project.
