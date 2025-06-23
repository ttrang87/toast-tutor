FROM python:3.12-alpine

ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install bash and update packages
RUN apk update && apk upgrade && apk add --no-cache bash

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./

RUN echo '#!/bin/bash\n\
  celery -A backend worker --loglevel=info -E &\n\
  stripe listen --forward-to http://127.0.0.1:8000/stripe/webhook/ &\n\
  python manage.py runserver 0.0.0.0:8000' > start.sh && chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]