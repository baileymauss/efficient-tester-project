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
    labgroup = models.ManyToManyField('LabGroup')

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    class Meta:
        verbose_name = ('User')
        verbose_name_plural = ('Users')


class Protocols(models.Model):
    PLATE_TYPES = [
        (1, '96'),
        (2, '384'),
    ]
    name = models.CharField('Protocol Name', max_length=120)
    date_created = models.DateField()
    date_used = models.DateTimeField('Date Last Used')
    creator_ID = models.UUIDField()
    plate_type = models.PositiveSmallIntegerField(choices=PLATE_TYPES)
    num_samples = models.PositiveSmallIntegerField()
    suspected_pos_rate = models.DecimalField(max_digits=4, decimal_places=2)
    active_status = models.BooleanField(('active'), default=True)
    lab_group = models.ForeignKey('LabGroup', on_delete=models.CASCADE)

class Experiment(models.Model):
    protocol_used = models.ForeignKey('Protocols', on_delete=models.CASCADE)
    associated_images = models.ImageField()
    completed_status = models.BooleanField(('completed'), default=False)
    user_notes = models.TextField()
    step_num = models.PositiveSmallIntegerField()
    plaintext_data = models.FileField()

class LabGroup(models.Model):
    name = models.CharField('Lab Group Name', max_length=120)
    group_id = models.UUIDField()
    member_list = models.ManyToManyField(User, through='GroupMembership', related_name='labgroups')
    #admin_user = models.ManyToManyField('self')

class GroupMembership(models.Model):
    ROLE_CHOICE = (
    ('1', 'Admin'),
    ('2', 'Member'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(LabGroup, on_delete=models.CASCADE)
    role = models.CharField(choices=ROLE_CHOICE, default='2', max_length=1)
