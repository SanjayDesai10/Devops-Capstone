from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.requests import Request
from starlette.responses import Response
import time

from app.routes.books import router as books_router

app = FastAPI(title="BookShelf API", version="1.0.0")

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Prometheus Metrics ----------
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"],
)
REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"],
)


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    """Record request count and latency for Prometheus."""
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code,
    ).inc()
    REQUEST_LATENCY.labels(
        method=request.method,
        endpoint=request.url.path,
    ).observe(duration)
    return response


# ---------- Core Endpoints ----------
@app.get("/health")
def health_check():
    """Health check endpoint — required by M1."""
    return {"status": "healthy", "service": "bookshelf-api"}


@app.get("/metrics")
def metrics():
    """Prometheus metrics endpoint — required by M9."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


# ---------- Register Routers ----------
app.include_router(books_router)
