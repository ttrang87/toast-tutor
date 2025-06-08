import json

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Import your User model instead of Django's default
from toast_tutor.models import ResetToken, User

from ..models import ResetToken, User


@api_view(["POST"])
def request_password_reset(request):
    print("Password reset request received")
    email = request.data.get("email")
    print(f"Email received: {email}")

    # Check if email is provided
    if not email:
        print("Failed: No email provided")
        return Response(
            {"error": "Please provide an email address"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validate email format
    try:
        validate_email(email)
        print("Email format valid")
    except ValidationError:
        print(f"Failed: Invalid email format - {email}")
        return Response(
            {"error": "Invalid email format"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if user exists
    try:
        user = User.objects.get(email=email)
        print(f"User found: {user.username}")
    except User.DoesNotExist:
        print(f"Failed: No user found with email - {email}")
        return Response(
            {"error": "No account found with this email address"},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        print("Attempting to generate/retrieve token")
        # This will now either return existing valid token or generate new one
        token = ResetToken.generate_for_user(user)
        # Print first 10 chars for security
        print(f"Token obtained: {token[:10]}...")

        # Create reset URL without trailing slash for React Router match
        reset_url = f"{settings.FRONTEND_BASE_URL}/reset-password/{token}/"
        print(f"Reset URL generated: {reset_url}")

        # Send email
        print("Preparing to send email")
        subject = "Password Reset Request"

        text_content = f"""
        Hello {user.username},

        You've requested to reset your password. Please click the link below to reset your password:

        {reset_url}

        This link will expire in 15 minutes.

        If you didn't request this, please ignore this email.
        """

        # HTML content
        html_content = f"""

            <!DOCTYPE html>
            <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * {{
                        box-sizing: border-box;
                    }}

                    body {{
                        margin: 0;
                        padding: 0;
                    }}

                    a[x-apple-data-detectors] {{
                        color: inherit !important;
                        text-decoration: inherit !important;
                    }}

                    #MessageViewBody a {{
                        color: inherit;
                        text-decoration: none;
                    }}

                    p {{
                        line-height: inherit;
                    }}

                    .desktop_hide,
                    .desktop_hide table {{
                        mso-hide: all;
                        display: none;
                        max-height: 0px;
                        overflow: hidden;
                    }}

                    .image_block img+div {{
                        display: none;
                    }}

                    sup,
                    sub {{
                        font-size: 75%;
                        line-height: 0;
                    }}

                    @media (max-width:520px) {{
                        .mobile_hide {{
                            display: none;
                        }}

                        .row-content {{
                            width: 100% !important;
                        }}

                        .stack .column {{
                            width: 100%;
                            display: block;
                        }}

                        .mobile_hide {{
                            min-height: 0;
                            max-height: 0;
                            max-width: 0;
                            overflow: hidden;
                            font-size: 0px;
                        }}

                        .desktop_hide,
                        .desktop_hide table {{
                            display: table !important;
                            max-height: none !important;
                        }}
                    }}
                </style>
            </head>
            <body class="body" style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fffeee;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px; margin: 0 auto;" width="500">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 500px;"><img src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/psjxkdn3/war/cz4/wmp/EmailBg.png" style="display: block; height: auto; border: 0; width: 100%;" width="500" alt title height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																<div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:700;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
																	<p style="margin: 0;">Don't worry, you are one step away from toasting your school work - just click the link below!</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="button_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:203px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffc744">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px">
<![endif]-->
																	<a href="{reset_url}" style="text-decoration: none;">
  <div class="button" style="background-color:#ffc744;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:4px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:700;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;">
    <span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;">
      <span style="word-break: break-word; line-height: 32px;">Reset Your Password</span>
    </span>
  </div>
</a>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-4" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
																	<p style="margin: 0; margin-bottom: 16px;">The link above will expire in 15 minutes.&nbsp;</p>
																	<p style="margin: 0; margin-bottom: 16px;">If you didn't request this, please ignore this email.</p>
																	<p style="margin: 0;">©ToastTutor</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px; margin: 0 auto;" width="500">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="empty_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div></div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>
</html>
        """

        # Sending the email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,  # Fallback plain text
            from_email="noreply@toasttutor.com",
            to=[user.email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

        print(f"Email sent successfully to {email}")
        return Response(
            {"message": "Password reset email sent successfully"},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Failed: Error sending email - {str(e)}")
        return Response(
            {"error": "Error sending password reset email"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@csrf_exempt
@api_view(["POST"])
def reset_password(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)

    try:
        # Parse request body
        body = json.loads(request.body)
        new_password = body.get("password")
        token = body.get("token")  # Get token from request body

        if not new_password:
            return JsonResponse(
                {"success": False, "message": "Password is required"},
                status=400,
            )

        if not token:
            return JsonResponse({"success": False, "message": "Token is required"}, status=400)

        # Find the valid reset token
        reset_token = (
            ResetToken.objects.filter(token=token, expiry_at__gte=now())
            .select_related("user")
            .first()
        )

        if not reset_token:
            return JsonResponse(
                {"success": False, "message": "Invalid or expired token"},
                status=403,
            )

        # Get the user associated with the token
        user = reset_token.user

        # Update user's password
        hashed_password = make_password(new_password)
        user.password = hashed_password
        user.save()

        # Delete all reset tokens for this user
        ResetToken.objects.filter(user=user).delete()

        return JsonResponse({"success": True, "message": "Password reset successfully"})

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)
    except Exception as e:
        print(f"Error resetting password: {e}")
        return JsonResponse({"success": False, "message": "An error occurred"}, status=500)
