from django.urls import path
from .views import ItineraryGenerationView

urlpatterns = [
    path('generate-itinerary/', ItineraryGenerationView.as_view(), name='generate-itinerary'),
]
