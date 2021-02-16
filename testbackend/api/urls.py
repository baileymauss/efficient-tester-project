from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
from api.views import *
urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='users_list'),
    path('user/<uuid:pk>/',  UserDetailView.as_view(), name='user_detail'),
    path('', include(router.urls))
]
