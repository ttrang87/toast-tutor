@echo off
echo Installing Daphne...
pip install daphne

echo Starting server with ASGI support...
cd backend
daphne -p 8000 backend.asgi:application
