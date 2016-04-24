from django.contrib.auth.models import User
from django import forms

class UserForm(forms.ModelForm):
    # password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'password')
        widgets = {
        	'username': forms.TextInput(attrs={'class': 'form-control input', 'placeholder': 'Choose a username'}),
        	'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Choose a password'}),}