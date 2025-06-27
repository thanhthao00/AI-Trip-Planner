from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.db import connection
import json

genai.configure(api_key="AIzaSyBjSCYJScIZgtfKUMYL-e5FCwKwfA-Z910")  

class ItineraryGenerationView(APIView):
    def post(self, request, *args, **kwargs):
        destination = request.data.get("destination", "Unknown")
        startdate = request.data.get("start_date", "Unknown")
        preferences = request.data.get("preferences", "None")
        days = request.data.get("days", 3)
        budget = request.data.get("budget", 1000)
        companion = request.data.get("companion", "Unknown")


        prompt = (
            f"Suggest 5 tourist places in {destination} for {days} day(s) go with {companion},"
            f"within a budget of {budget} USD, and matching preferences: {preferences}. "
            "Return only a JSON array in this format: "
            '[{"name": "Place", "lat": 12.34, "lng": 56.78}] with no explanation.'
        )


        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        start = raw_text.find("[")
        end = raw_text.rfind("]") + 1
        array_str = raw_text[start:end]
        locations = json.loads(array_str)
        center = locations[0]

        itinerary = {
            "destination": destination,
            "preferences": preferences,
            "days": days,
            "budget": budget,
            "activities": [
                "Visit a famous landmark",
                "Try local cuisine",
                "Explore a museum",
                "Relax at a park"
            ],
            "locations": locations,
            "suggested_budget": budget,
            "center": center,
            "companion": companion
        }

        return Response({"itinerary": itinerary}, status=status.HTTP_200_OK)

class BlogListView(APIView):
    def get(self, request, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT title, description, url, time
                FROM travel_blogs
                ORDER BY time DESC
                LIMIT 10
            """)
            rows = cursor.fetchall()

        blogs = [
            {
                "title": row[0],
                "description": row[1],
                "url": row[2],
                "time": row[3],
            }
            for row in rows
        ]
        return Response({"blogs": blogs})
    
class HotelListView(APIView):
    def get(self, request, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT title, description, url, time
                FROM hotels
                ORDER BY time DESC
                LIMIT 10
            """)
            rows = cursor.fetchall()

        hotels = [
            {
                "title": row[0],
                "description": row[1],
                "url": row[2],
                "time": row[3],
            }
            for row in rows
        ]
        return Response({"hotels": hotels})
    
class TransportationListView(APIView):
    def get(self, request, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT title, description, url, time
                FROM transportations
                ORDER BY time DESC
                LIMIT 10
            """)
            rows = cursor.fetchall()

        transportations = [
            {
                "title": row[0],
                "description": row[1],
                "url": row[2],
                "time": row[3],
            }
            for row in rows
        ]
        return Response({"transportations": transportations})