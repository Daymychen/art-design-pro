import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from app.core.config import settings

# 模板目录
TEMPLATE_DIR = Path(__file__).parent.parent / "templates"


def _load_template(name: str) -> str:
    """加载邮件 HTML 模板"""
    return (TEMPLATE_DIR / name).read_text(encoding="utf-8")


def _send_email(to_email: str, subject: str, html_body: str) -> None:
    """通过 SMTP 发送邮件"""
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    if settings.SMTP_USE_SSL:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
    else:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())


def send_verify_code_email(to_email: str, code: str, purpose: str) -> None:
    """发送验证码邮件（由 RQ worker 调用）"""
    expire_minutes = settings.VERIFY_CODE_EXPIRE_SECONDS // 60

    if purpose == "register":
        template = _load_template("verify_code_register.html")
        subject = "[Art Design Pro] 注册验证码"
    else:
        template = _load_template("verify_code_reset.html")
        subject = "[Art Design Pro] 密码重置验证码"

    html_body = template.replace("{code}", code).replace("{expire_minutes}", str(expire_minutes))
    _send_email(to_email, subject, html_body)
