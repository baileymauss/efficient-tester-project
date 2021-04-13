# *coding: utf-8*
from backendspace.models import User
from backendspace.models import Experiment
from api.serializers import *
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend

class UserListCreateView(generics.ListCreateAPIView):
    """
            create:
                add users
            get:
                Search or get users
    """
    queryset = User.objects.get_queryset().order_by('id')
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('email', 'username','password')

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
            get:
                get a specific user
            delete:
                Remove an existing user.
            patch:
                Update one or more fields on an existing user.
            put:
                Update a user.
    """
    queryset = User.objects.get_queryset().order_by('id')
    serializer_class = UserSerializer

class ExperimentListCreateView(generics.ListCreateAPIView):
    """
            create:
                add Experiments
            get:
                Search or get Experiments
    """
    queryset = Experiment.objects.get_queryset().order_by('step_num')
    serializer_class = ExperimentSerializer

class ExperimentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
            get:
                get a specific Experiment
            delete:
                Remove an existing Experiment.
            patch:
                Update one or more fields on an existing Experiment.
            put:
                Update a Experiment.
    """
    queryset = Experiment.objects.get_queryset().order_by('id')
    serializer_class = ExperimentSerializer

class ProtocolsListCreateView(generics.ListCreateAPIView):
    """
            create:
                add protocols
            get:
                Search or get protocols
    """
    queryset = Protocols.objects.get_queryset().order_by('name')
    serializer_class = ProtocolsSerializer



class LabGroupListCreateView(generics.ListCreateAPIView):
    """
            create:
                add Lab Group
            get:
                Search or get LabGroups
    """
    queryset = LabGroup.objects.get_queryset().order_by('name')
    serializer_class = LabGroupSerializer
	
class GroupMembershipListCreateView(generics.ListCreateAPIView):
   """
            create:
		       add GroupMembership
			get:
			   Search or get GroupMembership
	"""
	queryset = GroupMembership.objects.get_queryset().order_by('group')
	serializer_class = GroupMembershipSerializer
