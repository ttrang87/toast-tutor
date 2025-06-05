import json
import stripe
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from decimal import Decimal

# Import your models
from ..models import Customer, Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


@csrf_exempt
@api_view(["POST"])
def create_setup_intent(request):
    if request.method == "POST":
        intent = stripe.SetupIntent.create()
        return JsonResponse({"clientSecret": intent.client_secret})
    return JsonResponse({"error": "Invalid method"}, status=400)


@csrf_exempt
@api_view(["POST"])
def get_card_info(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            payment_method_id = body.get("paymentMethodId")

            if not payment_method_id:
                return JsonResponse({"error": "Missing paymentMethodId"}, status=400)

            payment_method = stripe.PaymentMethod.retrieve(payment_method_id)

            if payment_method["type"] == "card":
                card = payment_method["card"]
                return JsonResponse(
                    {
                        "last4": card["last4"],
                        "exp_month": card["exp_month"],
                        "exp_year": card["exp_year"],
                    }
                )
            else:
                return JsonResponse({"error": "Not a card payment method"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
@api_view(["POST"])
def confirm_payment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            payment_method_id = data["paymentMethodId"]
            amount = int(data["amount"]) * 100  # Stripe uses cents
            billing_details = data.get("billingDetails", {})

            # 1. Create customer in Stripe
            stripe_customer = stripe.Customer.create(
                name=f"{
                    billing_details.get('firstName', '')} {
                    billing_details.get('lastName', '')}".strip(),
                email=billing_details.get("email", ""),
                phone=billing_details.get("phone", ""),
                address={
                    "line1": billing_details.get("address", ""),
                    "city": billing_details.get("city", ""),
                    "state": billing_details.get("state", ""),
                    "country": billing_details.get("country", ""),
                },
            )

            # 2. Create customer in your database
            customer, created = Customer.objects.get_or_create(
                stripe_customer_id=stripe_customer.id,
                defaults={
                    "email": billing_details.get("email", ""),
                    "first_name": billing_details.get("firstName", ""),
                    "last_name": billing_details.get("lastName", ""),
                    "phone": billing_details.get("phone", ""),
                },
            )

            # 3. Attach payment method to customer
            stripe.PaymentMethod.attach(
                payment_method_id,
                customer=stripe_customer.id,
            )

            # 4. Create PaymentIntent with customer and attached payment method
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="usd",
                customer=stripe_customer.id,
                payment_method=payment_method_id,
                automatic_payment_methods={"enabled": True, "allow_redirects": "always"},
                description="Tutoring session",
                receipt_email=billing_details.get("email", ""),
            )

            # 5. Create payment record in your database (initial status)
            payment = Payment.objects.create(
                customer=customer,
                stripe_payment_intent_id=intent.id,
                amount=Decimal(str(amount / 100)),  # Convert back to dollars
                status=intent.status,
                description="Tutoring session",
            )

            return JsonResponse(
                {
                    "status": intent.status,
                    "clientSecret": intent.client_secret,
                    "paymentId": payment.id,  # Optional: return your payment ID
                }
            )

        except stripe.error.CardError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# Webhook handler to update payment status when payment succeeds
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET  # Add this to your settings

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]

        try:
            # Update payment status in your database
            payment = Payment.objects.get(stripe_payment_intent_id=payment_intent["id"])
            payment.status = payment_intent["status"]
            payment.save()

            print(f"Payment {payment_intent['id']} succeeded!")

        except Payment.DoesNotExist:
            print(f"Payment with intent ID {payment_intent['id']} not found in database")

    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]

        try:
            # Update payment status in your database
            payment = Payment.objects.get(stripe_payment_intent_id=payment_intent["id"])
            payment.status = "failed"
            payment.save()

            print(f"Payment {payment_intent['id']} failed!")

        except Payment.DoesNotExist:
            print(f"Payment with intent ID {payment_intent['id']} not found in database")

    else:
        print(f'Unhandled event type: {event["type"]}')

    return HttpResponse(status=200)
