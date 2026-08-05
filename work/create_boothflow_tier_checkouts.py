#!/usr/bin/env python3
"""create_boothflow_tier_checkouts.py — create BoothFlow Business TEST Stripe checkout.
Same mechanism as create_checkout.py (STRIPE_TEST_SECRET_KEY). Writes stripe-business.json,
leaving stripe.json (Pro) intact. Test mode only — safe. Idempotent.
"""
import os, json, base64, urllib.request, urllib.parse

def load_env():
    p = os.path.expanduser("~/.hermes/secrets/stripe.env")
    env = {}
    if os.path.isfile(p):
        for line in open(p):
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def stripe_post(path, key, data):
    body = urllib.parse.urlencode(data).encode()
    auth = base64.b64encode(f"{key}:".encode()).decode()
    req = urllib.request.Request("https://api.stripe.com/v1/" + path, data=body,
        headers={"Authorization": f"Basic {auth}", "Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)

env = load_env()
key = env.get("STRIPE_TEST_SECRET_KEY", "")
if not key:
    print(json.dumps({"ok": False, "artifact": "", "detail": "no STRIPE_TEST_SECRET_KEY"}))
    raise SystemExit(1)

base = os.path.expanduser("~/businesses/boothflow")
sj = os.path.join(base, "stripe-business.json")
if os.path.isfile(sj):
    try:
        ex = json.load(open(sj))
        if ex.get("payment_link_url") and ex.get("amount") == 5900 and ex.get("mode") == "test":
            print(json.dumps({"ok": True, "artifact": ex["payment_link_url"], "detail": "existing Business checkout — no action"}))
            raise SystemExit(0)
    except SystemExit:
        raise
    except Exception:
        pass

prod = stripe_post("products", key, {"name": "BoothFlow Business", "description": "BoothFlow Business — everything in Pro plus multi-operator setup, multiple booth packages, and rebooking engine based on original event dates.",
                                      "metadata[slug]": "boothflow", "metadata[hermes]": "1"})
price = stripe_post("prices", key, {"product": prod["id"], "unit_amount": 5900, "currency": "usd", "recurring[interval]": "month"})
link = stripe_post("payment_links", key, {"line_items[0][price]": price["id"], "line_items[0][quantity]": "1"})
rec = {"mode": "test", "product": prod["id"], "price": price["id"],
       "payment_link_url": link["url"], "amount": 5900, "recurring": "month"}
json.dump(rec, open(sj, "w"), indent=2)
print(json.dumps({"ok": True, "artifact": link["url"], "detail": "created TEST checkout $59.00/month"}))
