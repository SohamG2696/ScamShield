FREE_EMAIL_DOMAINS = {
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "aol.com",
    "proton.me",
    "protonmail.com"
}


def extract_email_domain(email):
    if not email or "@" not in email:
        return ""
    return email.lower().split("@")[-1]


def is_free_email(email):
    domain = extract_email_domain(email)
    return int(domain in FREE_EMAIL_DOMAINS)


def has_website(url):
    if url is None:
        return 0
    return int(str(url).strip() != "")
