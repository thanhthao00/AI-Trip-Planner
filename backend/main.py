from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

# Allow frontend access (adjust the origin for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL config (based on your docker-compose)
DB_CONFIG = {
    "host": "localhost",
    "port": "5432",
    "database": "postgres",
    "user": "postgres",
    "password": "postgres"
}

@app.get("/api/blogs")
def get_blogs():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT title, description, url, time, author
            FROM travel_blogs
            ORDER BY time DESC
            LIMIT 10;
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        blogs = []
        for row in rows:
            blogs.append({
                "title": row[0],
                "description": row[1],
                "url": row[2],
                "time": row[3],
                "author": row[4]
            })
        return {"blogs": blogs}

    except Exception as e:
        return {"error": str(e)}
