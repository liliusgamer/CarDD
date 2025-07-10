from django.urls import path, include
from .views import RegisterView, UserAdminViewSet, MyTokenObtainPairView, PostViewSet, MeView, TagViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'admin/users', UserAdminViewSet, basename='admin-users')
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'tags', TagViewSet, basename='tags')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='login'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('', include(router.urls)),
] 