"""
WSGI config for SocialFlow AI on PythonAnywhere
"""

import os
import sys

# Add the backend directory to the path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.insert(0, path)

# Set the environment variables
os.environ['FLASK_ENV'] = 'production'

# Import the FastAPI app
from main import app as application

# For ASGI to WSGI conversion (if using a compatibility layer)
# PythonAnywhere supports ASGI apps directly
application = app
