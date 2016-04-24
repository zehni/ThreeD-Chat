from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect

from django.http import JsonResponse
from django.shortcuts import render_to_response

import string
import random
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import requires_csrf_token

from django.core import serializers


from django.core.urlresolvers import reverse
import json
import os

from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login

from django.contrib.auth import logout

from django.contrib.auth.models import User

from chat.forms import UserForm

from django.template import RequestContext, Template

from .models import ChatRoom


# Create your views here.

# http://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits-in-python
#generates a random number for peer js
def peerIDGenerator(size=12, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))


#Rendering the index page
def index(request):
	return render(request, 'chat/index.html', {})

@login_required
def chatRoom(request,id):
	data = {}
	try:
		data['peer1ID'] = request.GET['peerJoinerID']
		data['peer2ID'] = request.GET['peerCreatorID']
	except:
		data['peer1ID'] = request.GET['peerCreatorID']

	return render(request, 'chat/chat.html', data)


def getChatsPerPage():   # function to return the required number of chats to appear in one page
	return 6

@login_required
#Rendering the active chat rooms in chatrooms.html
def getChatRoomsInPage(request, pageNo):
	data = {}
	dataRoom = {}   #dictionary holding the information rk : user

	chatPerPage = getChatsPerPage()

	pageIndex = int(pageNo) - 1

	pageStart = pageIndex * chatPerPage
	numOfEntries = ChatRoom.objects.filter(joinerID=None).count()
	numOfpages = numOfEntries / chatPerPage   # to get the number of available rooms to show the number of pages
	
	if (numOfEntries % chatPerPage != 0):   # to increment number of pages if not multiple of num of rooms per page
		numOfpages += 1

	pages = range(1, numOfpages + 1) # get the list of pages

	if (pageStart > numOfEntries):
		rl = ChatRoom.objects.filter(joinerID=None)[:chatPerPage] # get first 6 chat rooms
	else:
		rl = ChatRoom.objects.filter(joinerID=None)[pageStart : pageStart + chatPerPage] # get only 6 chat rooms

	for i in range(len(rl)):
		creatorID = rl[i].creatorID_id
		user = User.objects.get(pk=creatorID)
		dataRoom[rl[i].pk] = user

	data['dataRoom'] = dataRoom   #put the dictionary in the passed data
	data['pages'] = pages

	return render(request, 'chat/chatrooms.html', data)


#Get Request to get the created chat room ID when clicking on create chat room to redirect the user to the created chat room
def getCreatedChatRoomID(request):
	e = ChatRoom.objects.filter(creatorID_id=request.user).order_by('pk').reverse()[:1]
	data = serializers.serialize('json', e)
	return HttpResponse(data, content_type='application/json')


@login_required
#Post request to create a chatroom based on the logged in user
def createRoom(request):

	e = ChatRoom(creatorID = request.user,\
				joinerID = None,\
				peerCreatorID = peerIDGenerator(),\
				peerJoinerID = None)

	e.save()

	return HttpResponse(json.dumps({"Room ID": e.pk}), content_type="application/json")


@login_required
#Post request to join a created chatroom based on the selected chat room
def joinRoom(request, id):
	roomID = int(id)
	error = 0
	try:
		chatRoom = ChatRoom.objects.get(pk=roomID)
	except:
		error = 1

	if (error == 1 or chatRoom.peerJoinerID != None or chatRoom.creatorID == request.user):
		result = {'state' : 'fail', 'error' : 'sorry, there is an error joining room'}
		return HttpResponse(json.dumps(result), content_type="application/json")
		# return render(request, 'chat/chatrooms.html', result)

	chatRoom.joinerID = request.user
	chatRoom.peerJoinerID = peerIDGenerator()
	chatRoom.save()
	result = {'state' : 'success', 'username' : request.user.username, 'room' : roomID, 'peerCreatorID' : chatRoom.peerCreatorID, 'peerJoinerID' : chatRoom.peerJoinerID}

	# return render(request, 'chat/chat.html', result)
	return HttpResponse(json.dumps(result), content_type="application/json")

@login_required
def leaveRoom(request, id):
	roomID = int(id)
	error = 0
	try: 
		chatRoom = ChatRoom.objects.get(pk=roomID)
	except: 
		error = 1

	if (error == 1):
		result = {'state' : 'fail', 'error' : 'sorry, there is an error joining room'}
		return HttpResponse(json.dumps(result), content_type="application/json")

	isCreator = request.POST['isCreator'] == '1'
	if (isCreator == 1):
		chatRoom.delete()
		a = {'success' : 'true'}
		return HttpResponse(json.dumps(a), content_type = "application/json")

	chatRoom.joinerID = None
	chatRoom.peerJoinerID = None
	chatRoom.save()
	a = {'success' : 'true'}
	return HttpResponse(json.dumps(a), content_type = "application/json")


def register(request):
	# Like before, get the request's context.
	context = RequestContext(request)

	# A boolean value for telling the template whether the registration was successful.
	# Set to False initially. Code changes value to True when registration succeeds.
	registered = False
	firstTime = True

	# If it's a HTTP POST, we're interested in processing form data.
	if request.method == 'POST':
		firstTime = False
		# Attempt to grab information from the raw form information.
		# Note that we make use of both UserForm 
		user_form = UserForm(data=request.POST)

		# If the two forms are valid...
		if user_form.is_valid():
		    # Save the user's form data to the database.
		    user = user_form.save()

		    # Now we hash the password with the set_password method.
		    # Once hashed, we can update the user object.
		    user.set_password(user.password)
		    user.save()
		    new_user = authenticate(username=user_form.cleaned_data['username'],
		                            password=user_form.cleaned_data['password'],
		                            )
		    login(request, new_user)
		    registered = True

	# Not a HTTP POST, so we render our form using two ModelForm instances.
	# These forms will be blank, ready for user input.
	else:
	    user_form = UserForm()

	if (registered):
		return redirect("/chatrooms/1")
	else:
		print firstTime
		# Render the template depending on the context.
		return render_to_response(
		    'chat/register.html',
		    {'user_form': user_form,'registered': registered, 'firstTime' : firstTime, 'error_msg':"Username already taken"},
		    context)

def logout_view(request):
	logout(request)
	return redirect("/")
