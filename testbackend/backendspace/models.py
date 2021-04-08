from django.db import models
from django.core.files import File
from django.contrib.auth.models import User
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from backendspace.UserManager import UserManager
from django.contrib.auth.hashers import get_hasher, identify_hasher
from jsonfield import JSONField
import uuid

# Models created Here.
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
    #labgroup = models.ManyToManyField(LabGroup)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    class Meta:
        verbose_name = ('User')
        verbose_name_plural = ('Users')

    #def check_password(self, raw_password):
        #def setter(raw_password):
            #self.set_password(raw_password)
            #self.save(update_fields=["password"])

        #if raw_password is None:
            #return False

        #hasher = get_hasher("default")
        #must_update = False
        #if self.password.find('$') > 0:
            #hasher = identify_hasher(self.password)
            #must_update = True

        #is_correct = hasher.verify(raw_password, self.password)
        #logger.info("check pwd is correct %d"%is_correct)
        #if is_correct and must_update:
            #self.set_password(raw_password)
            #self.save(update_fields=["password"])

        #return is_correct

class LabGroup(models.Model):
    name = models.CharField('Lab Group Name', max_length=120)
    group_id = models.UUIDField()
    member_list = models.ManyToManyField(User, through='GroupMembership', related_name='labgroups', blank=True)
    #admin_user = models.ManyToManyField('self')
		
class Protocols(models.Model):
    PLATE_TYPES = [
        (1, '96'),
        (2, '384'),
    ]
    name = models.CharField('Protocol Name', max_length=120)
    date_created = models.DateField(('date created'), auto_now_add=True)
    date_used = models.DateTimeField(('Date Last Used'), auto_now_add=True)
    creator_ID = models.UUIDField()
    plate_type = models.PositiveSmallIntegerField(choices=PLATE_TYPES)
    num_samples = models.PositiveSmallIntegerField()
    suspected_pos_rate = models.DecimalField(max_digits=4, decimal_places=2)
    active_status = models.BooleanField(('active'), default=True)
    lab_group = models.ForeignKey(LabGroup, on_delete=models.CASCADE)

class Experiment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    protocol_used = models.ForeignKey('Protocols', on_delete=models.CASCADE, blank=True)
    completed_status = models.BooleanField(('completed'), default=False)
    user_notes = JSONField(blank=True)
    step_num = models.PositiveSmallIntegerField()
    plaintext_data = models.FileField(blank=True)
    current_interaction = JSONField(blank=True)
    date_last_accessed = models.DateTimeField(auto_now=True)


class GroupMembership(models.Model):
    ROLE_CHOICE = (
    ('1', 'Admin'),
    ('2', 'Member'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(LabGroup, on_delete=models.CASCADE)
    role = models.CharField(choices=ROLE_CHOICE, default='2', max_length=1)
