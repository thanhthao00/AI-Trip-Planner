from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.db import connection
import json

genai.configure(api_key="")  

class ItineraryGenerationView(APIView):
    def post(self, request, *args, **kwargs):
        destination = request.data.get("destination", "Unknown")
        startdate = request.data.get("startdate", "Unknown")
        preferences = request.data.get("preferences", "None")
        days = request.data.get("days", 3)
        budget = request.data.get("budget", 1000)
        companion = request.data.get("companion", "Unknown")


        prompt = (
            f"Suggest {days*2}  tourist places in {destination} for {days} day(s) go with {companion},"
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
            "startdate": startdate,
            "days": days,
            "budget": budget,
            "locations": locations,
            "suggested_budget": budget,
            "center": center,
            "companion": companion
        }

        return Response({"itinerary": itinerary}, status=status.HTTP_200_OK)

class HotelRecommendationView(APIView):
    def post(self, request, *args, **kwargs):
        destination = request.data.get("destination", "Unknown")
        budget = request.data.get("budget", 100)
        companion = request.data.get("companion", "solo")

        prompt = (
            f"Recommend 5 hotels in {destination} suitable for {companion} travelers "
            f"with a nightly budget around ${budget/3}. "
            "Return the result as a JSON array with this exact format: "
            '[{"name": "Hotel Name", "price_per_night": 120, "rating": 4.5, "url": https://theboweryhotel.com/}]. '
            "Only return valid JSON with no explanation or extra text."
        )

        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            raw_text = response.text.strip()

            start = raw_text.find("[")
            end = raw_text.rfind("]") + 1
            array_str = raw_text[start:end]

            hotels = json.loads(array_str)
            return Response({"hotels": hotels}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Hotel generation error:", e)
            return Response(
                {"error": "Failed to generate hotel recommendations."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RestaurantRecommendationView(APIView):
    def post(self, request, *args, **kwargs):
        destination = request.data.get("destination", "Unknown")

        prompt = (
            f"Suggest 8 good restaurants in {destination}. "
            "Return only a JSON array in this format: "
            '[{"name": "Restaurant Name", "rating": 4.5, "url": https://theboweryhotel.com/}]'
        )

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        json_start = text.find("[")
        json_end = text.rfind("]") + 1
        restaurant_data = json.loads(text[json_start:json_end])

        return Response({"restaurants": restaurant_data}, status=200)


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