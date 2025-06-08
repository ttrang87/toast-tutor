from celery import shared_task
from django.utils import timezone
from ..models import Meeting

@shared_task
def expire_pending_payments():
    """Check for expired pending payments and revert to scheduled status."""
    expired_meetings = Meeting.objects.filter(
        status=Meeting.STATUS_PENDING,
        payment_expires_at__lt=timezone.now()
    )
    
    count = 0
    for meeting in expired_meetings:
        meeting.status = Meeting.STATUS_SCHEDULED
        meeting.student = None
        meeting.payment_expires_at = None
        meeting.save(update_fields=["status", "student", "payment_expires_at"])
        count += 1
    
    return f"Expired {count} pending payments"