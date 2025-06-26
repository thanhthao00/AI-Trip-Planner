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

with DAG(dag_id='transportation_etl_pipeline',
         default_args=default_args,
         schedule='@daily',
         catchup=False) as dags:
    
    @task()
    def extract_transportation_info():
        url = 'https://newsapi.org/v2/everything?q=public+transportation+discount&language=en&sortBy=publishedAt&pageSize=4&apiKey=d1092bf2ea1f4748a515db7716b0d89f'
        headers = {
            'User-Agent': 'Mozilla/5.0'
        }

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch blogs information: {response.status_code}")
        
        return response.json()["articles"]

    @task()
    def transform_transportation_data(raw_data):
        transportations = []
        for transportation in raw_data:
            title = transportation.get("title", "N/A")
            description = transportation.get("description", "N/A")
            url = transportation.get("url", "N/A")
            time = transportation.get("publishedAt", "N/A")

            transportations.append({
                "title": title,
                "description": description,
                "url": url,
                "time": time,
            })
        return transportations
    
    @task
    def load_transportation_info(transformed_data):
        pg_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
        conn = pg_hook.get_conn()
        cursor = conn.cursor()

        cursor.execute("""
                       CREATE TABLE IF NOT EXISTS transportations (
                            title TEXT,
                            description TEXT,
                            url TEXT,
                            time TEXT,
                            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                       );
                    """)
        
        cursor.execute("DELETE FROM transportations;")
        
        for transportation in transformed_data:  
            cursor.execute("""
                        INSERT INTO transportations (title, description, url, time)
                        VALUES (%s, %s, %s, %s);
                    """, (
                        transportation['title'],
                        transportation['description'],
                        transportation['url'],
                        transportation['time']
                    ))
        
        conn.commit()
        cursor.close()

    raw = extract_transportation_info()
    transformed_data = transform_transportation_data(raw)
    load_transportation_info(transformed_data)