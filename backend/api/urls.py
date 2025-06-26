from django.urls import path
from .views import ItineraryGenerationView, BlogListView, HotelListView, TransportationListView

urlpatterns = [
    path('generate-itinerary/', ItineraryGenerationView.as_view(), name='generate-itinerary'),
    path('api/blogs/', BlogListView.as_view(), name='blog-list'),
    path('api/hotels/', HotelListView.as_view(), name='hotel-list'),
    path('api/transportations/', TransportationListView.as_view(), name='transportation-list'),
]

