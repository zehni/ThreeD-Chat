from __future__ import unicode_literals

from django.db import models

#importing Djang User Model
from django.contrib.auth.models import User

# Create your models here.

#Chatroom model
################
#1- Both creatorID and joinerID are Foreign keys for Users
#2- Both peercreatorID and peerjoinerID are IDs for PeerJS chat
class ChatRoom(models.Model):
	creatorID = models.ForeignKey(User, related_name='creatorID', on_delete=models.CASCADE)
	joinerID = models.ForeignKey(User, related_name='joinerID', on_delete=models.CASCADE, null=True)
	peerCreatorID = models.CharField(max_length=200)
	peerJoinerID = models.CharField(max_length=200, null=True)
