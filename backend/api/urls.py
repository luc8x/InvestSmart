from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('accounts/', include('accounts.urls')),
    path('banks/', include('banks.urls')),
    path('token/obtain/pair', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh-cookie/', RefreshTokenView.as_view(), name='token_refresh_cookie'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),
]