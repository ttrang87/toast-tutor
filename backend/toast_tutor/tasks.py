from celery import shared_task
from django.core.mail import EmailMultiAlternatives

@shared_task
def send_reminder(userEmail, date, url):
    subject = "Reminder: Upcoming Booking"
    text_content = f"Hello, this is a reminder for your upcoming booking on {date}."
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
                                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                        <tr>
                                                            <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
                                                                <div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:700;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                                                                    <p style="margin: 0;">Hello, this is a reminder for your upcoming booking on {date}. Please click the link below to join your class:</p>
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
                                                                    <a href="{url}" style="text-decoration: none;">
  <div class="button" style="background-color:#ffc744;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:4px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:700;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;">
    <span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;">
      <span style="word-break: break-word; line-height: 32px;">Join Class</span>
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
                </td>
            </tr>
        </tbody>
    </table><!-- End -->
</body>
</html>
"""

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,  # Fallback plain text
        from_email="noreply@toasttutor.com",
        to=[userEmail],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    
    return "Done"