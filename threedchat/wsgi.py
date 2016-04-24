"""
WSGI config for threedchat project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "threedchat.settings")

# application = get_wsgi_application()
if 'ONHEROKU' in os.environ:
    from dj_static import Cling
    application = Cling(get_wsgi_application())
else:
	application = get_wsgi_application()