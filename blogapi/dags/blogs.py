from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.decorators import task
import pendulum
import requests

POSTGRES_CONN_ID='postgres_default'

default_args={
    'owner': 'airflow',
    'start_date': pendulum.now().subtract(days=1)
}

with DAG(dag_id='blog_etl_pipeline',
         default_args=default_args,
         schedule='@monthly',
         catchup=False) as dags:
    
    @task()
    def extract_blog_info():
        url = 'https://newsapi.org/v2/everything?q=travel+blog&language=en&sortBy=publishedAt&pageSize=10&apiKey=d1092bf2ea1f4748a515db7716b0d89f'
        headers = {
            'User-Agent': 'Mozilla/5.0'
        }

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch blogs information: {response.status_code}")
        
        return response.json()["articles"]

    @task()
    def transform_blog_data(raw_data):
        blogs = []
        for blog in raw_data:
            author = blog.get("author", "N/A")
            title = blog.get("title", "N/A")
            description = blog.get("description", "N/A")
            url = blog.get("url", "N/A")
            time = blog.get("publishedAt", "N/A")
            content = blog.get("content", "N/A")

            blogs.append({
                "author": author,
                "title": title,
                "description": description,
                "url": url,
                "time": time,
                "content": content
            })
        return blogs
    
    @task
    def load_blog_info(transformed_data):
        pg_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
        conn = pg_hook.get_conn()
        cursor = conn.cursor()

        cursor.execute("""
                       CREATE TABLE IF NOT EXISTS travel_blogs (
                            author TEXT,
                            title TEXT,
                            description TEXT,
                            url TEXT,
                            time TEXT,
                            content TEXT,
                            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                       );
                    """)
        
        # cursor.execute("DELETE FROM travel_blogs;")
        
        for blog in transformed_data:  
            cursor.execute("""
                        INSERT INTO travel_blogs (author, title, description, url, time, content)
                        VALUES (%s, %s, %s, %s, %s, %s);
                    """, (
                        blog['author'],
                        blog['title'],
                        blog['description'],
                        blog['url'],
                        blog['time'],
                        blog['content']
                    ))
        
        conn.commit()
        cursor.close()

    raw = extract_blog_info()
    transformed_data = transform_blog_data(raw)
    load_blog_info(transformed_data)