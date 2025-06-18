from django.urls import path
from .views import UserPerfilView, UserRegistrationView, LoginView, LogoutView, UploadPhotoView

urlpatterns = [
    path('me/', UserPerfilView.as_view(), name='me'),
    path('upload-photo/', UploadPhotoView.as_view(), name='upload-photo'),
    path("register/", UserRegistrationView.as_view(), name="register-user"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
]