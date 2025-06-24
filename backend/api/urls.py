from django.urls import path
from .views import ItineraryGenerationView, BlogListView

urlpatterns = [
    path('generate-itinerary/', ItineraryGenerationView.as_view(), name='generate-itinerary'),
    path('api/blogs/', BlogListView.as_view(), name='blog-list'),
]

