"""
Test suite for BookShelf API — 8 test cases covering all endpoints.
Satisfies M2: minimum 5 test cases covering at least 3 API endpoints.
"""


# ---------- Health ----------
def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# ---------- POST /api/books/ ----------
def test_create_book(client):
    book_data = {
        "title": "The Pragmatic Programmer",
        "author": "David Thomas",
        "genre": "Technology",
        "status": "reading",
        "rating": 5,
    }
    response = client.post("/api/books/", json=book_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "The Pragmatic Programmer"
    assert data["author"] == "David Thomas"
    assert data["status"] == "reading"
    assert "id" in data


# ---------- GET /api/books/ ----------
def test_list_books(client):
    client.post("/api/books/", json={"title": "Book A", "author": "Author A"})
    client.post("/api/books/", json={"title": "Book B", "author": "Author B"})
    response = client.get("/api/books/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_filter_books_by_status(client):
    client.post(
        "/api/books/", json={"title": "Book 1", "author": "Auth", "status": "reading"}
    )
    client.post(
        "/api/books/",
        json={"title": "Book 2", "author": "Auth", "status": "completed"},
    )
    response = client.get("/api/books/?status=reading")
    assert response.status_code == 200
    books = response.json()
    assert len(books) == 1
    assert books[0]["status"] == "reading"


# ---------- GET /api/books/{id} ----------
def test_get_book(client):
    create_resp = client.post(
        "/api/books/", json={"title": "Test Book", "author": "Test Author"}
    )
    book_id = create_resp.json()["id"]
    response = client.get(f"/api/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book"


def test_get_book_not_found(client):
    response = client.get("/api/books/9999")
    assert response.status_code == 404


# ---------- PUT /api/books/{id} ----------
def test_update_book(client):
    create_resp = client.post(
        "/api/books/", json={"title": "Old Title", "author": "Author"}
    )
    book_id = create_resp.json()["id"]
    response = client.put(
        f"/api/books/{book_id}", json={"title": "New Title", "author": "Author"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


# ---------- DELETE /api/books/{id} ----------
def test_delete_book(client):
    create_resp = client.post(
        "/api/books/", json={"title": "Delete Me", "author": "Author"}
    )
    book_id = create_resp.json()["id"]
    response = client.delete(f"/api/books/{book_id}")
    assert response.status_code == 204
    # Verify it's gone
    get_resp = client.get(f"/api/books/{book_id}")
    assert get_resp.status_code == 404
