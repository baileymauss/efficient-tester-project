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
        

class Protocol(models.Model):
	PLATE_TYPES = [
		(96),
		(384), 
	]
	name = models.CharField('Protocol Name', max_length=120)
	date_created = models.DateField()
	date_used = models.DateTimeField('Date Last Used')
	creator_ID = models.UUIDField()
	plate_type = models.PositiveSmallIntegerField(choices=PLATE_TYPES)
	num_samples = models.PositiveSmallIntegerField()
	#TODO: num_plates needs to be calculated based on plate_type and num_samples
    #num_plates = 
	suspected_pos_rate = models.DecimalField(max_digits=4, decimal_places=2)
    #need model linkage
	#experiments_used_in = 
	active_status = models.BooleanField(('active'), default=True)
    #need model linkage
	#lab_group = 
	
class Experiment(models.Model):
	#need model linkage
    #protocol_used = 
	associated_images = models.ImageField()
	completed_status = models.BooleanField(('completed'), default=False) 
	user_notes = models.TextField()
	step_num = models.PositiveSmallIntegerField()
	plaintext_data = models.FileField()
	
class LabGroup(models.Model):
	name = models.CharField('Lab Group Name', max_length=120)
	group_id = models.UUIDField()
    #need model linkage
	#member_list = 
    #need to get token
	#token = 
    #need model linkage
	#admin_user = 
    #need model linkage
	#protocols = 
