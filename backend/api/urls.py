from django.urls import path
from .views import ItineraryGenerationView, HotelRecommendationView, RestaurantRecommendationView, BlogListView, HotelListView, TransportationListView

urlpatterns = [
    path('generate-itinerary/', ItineraryGenerationView.as_view(), name='generate-itinerary'),
    path('hotel-recommendation/', HotelRecommendationView.as_view(), name='hotel-recommendation'),
    path('restaurant-recommendation/', RestaurantRecommendationView.as_view(), name='restaurant-recommendation'),
    path('api/blogs/', BlogListView.as_view(), name='blog-list'),
    path('api/hotels/', HotelListView.as_view(), name='hotel-list'),
    path('api/transportations/', TransportationListView.as_view(), name='transportation-list'),
]

