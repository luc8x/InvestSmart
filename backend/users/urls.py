from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Router para ViewSets
router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]