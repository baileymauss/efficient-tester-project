from django.db import models
from django.core.files import File
from django.contrib.auth.models import User
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
#from django.contrib.gis.db import models
#from django.contrib.gis.geos import Point
from backendspace.UserManager import UserManager
from django.contrib.auth.hashers import get_hasher, identify_hasher
import uuid

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True,db_index=True)
    firstName = models.CharField(max_length=30, null=True, blank=True)
    lastName = models.CharField(max_length=30, null=True, blank=True)
    date_joined = models.DateTimeField(('date joined'), auto_now_add=True)
    is_staff = models.BooleanField(('staff'), default=True)
    username = models.CharField(max_length=100, null=True, blank=True)
    #acceptPush = models.BooleanField(default=False)
    #pushToken = models.CharField(max_length=100, null=True, blank=True,db_index=True)
    is_active = models.BooleanField(('active'), default=True)
    #valid = models.BooleanField(default=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    class Meta:
        verbose_name = ('User')
        verbose_name_plural = ('Users')
