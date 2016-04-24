from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^createRoom/$', views.createRoom, name='createRoom'),
	url(r'^(?P<id>\w+)/joinRoom/$', views.joinRoom, name='joinRoom'),
	url(r'^(?P<id>\w+)/leaveRoom/$', views.leaveRoom, name='leaveRoom'),
	url(r'^getCreatedChatRoomID/$', views.getCreatedChatRoomID, name='getCreatedChatRoomID'),
	url(r'^register/$', views.register, name='register'),

]