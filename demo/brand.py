"""
UptimeHealth Brand & Design Tokens
====================================
Shared design system constants for Streamlit pages and any Python-based UI.
All colors, typography, and component styles should reference this file.

Usage:
    from brand import *
    st.markdown(card_metric("Label", "42", PURPLE), unsafe_allow_html=True)

These tokens match the React frontend (frontend/tailwind.config.js and frontend/src/index.css).
"""

# ── Primary Brand ───────────────────────────────────────────────
PURPLE = "#695EE4"
PURPLE_LIGHT = "#EFEEFC"
PURPLE_HOVER = "#8B83F0"

# ── Text ────────────────────────────────────────────────────────
TEXT_PRIMARY = "#1B1B1B"
TEXT_SECONDARY = "#666666"
TEXT_MUTED = "#999999"

# ── Surfaces ────────────────────────────────────────────────────
BG = "#F8F8FA"
CARD_BG = "#FFFFFF"
BORDER = "#EEEEEE"

# ── Status Colors ───────────────────────────────────────────────
RED = "#EF5350"
RED_BG = "#FFEBEE"
ORANGE = "#FF9800"
ORANGE_BG = "#FFF3E0"
GREEN = "#4CAF50"
GREEN_BG = "#E8F5E9"

# ── Status Mappings ─────────────────────────────────────────────
STATUS_STYLES = {
    "Out of Stock":    {"bg": RED_BG,         "color": RED},
    "Low Quantity":    {"bg": ORANGE_BG,      "color": ORANGE},
    "In Stock":        {"bg": GREEN_BG,       "color": GREEN},
    "Active Orders":   {"bg": PURPLE_LIGHT,   "color": PURPLE},
}

ORDER_STATUS_STYLES = {
    "Draft":              {"bg": "#F5F5F5",     "color": TEXT_MUTED},
    "Pending Approval":   {"bg": ORANGE_BG,     "color": ORANGE},
    "Approved":           {"bg": "#E3F2FD",     "color": "#1976D2"},
    "Ordered":            {"bg": PURPLE_LIGHT,  "color": PURPLE},
    "Shipped":            {"bg": PURPLE_LIGHT,  "color": PURPLE},
    "Delivered":          {"bg": GREEN_BG,      "color": GREEN},
    "Cancelled":          {"bg": RED_BG,        "color": RED},
}

AUTOMATION_TYPE_STYLES = {
    "Threshold":  {"bg": ORANGE_BG, "color": ORANGE},
    "Recurring":  {"bg": GREEN_BG,  "color": GREEN},
}


# ── Reusable HTML Components ───────────────────────────────────

def badge(text: str, bg: str, color: str) -> str:
    """Inline pill badge matching the React app's .badge class."""
    return (
        f'<span style="display:inline-block;padding:3px 10px;border-radius:20px;'
        f'font-size:12px;font-weight:600;background:{bg};color:{color};'
        f'border:1px solid {color}20;">{text}</span>'
    )


def status_badge(status: str, qty: int | None = None) -> str:
    """Inventory status badge with optional quantity."""
    s = STATUS_STYLES.get(status, {"bg": "#f5f5f5", "color": TEXT_MUTED})
    label = f"{status} ({qty})" if qty is not None else status
    return badge(label, s["bg"], s["color"])


def order_badge(status: str) -> str:
    """Order status badge."""
    s = ORDER_STATUS_STYLES.get(status, {"bg": "#f5f5f5", "color": TEXT_MUTED})
    return badge(status, s["bg"], s["color"])


def card_metric(label: str, value: str, color: str = PURPLE) -> str:
    """KPI metric card matching the React dashboard stat cards."""
    return f'''
    <div style="background:{CARD_BG};border:1px solid {BORDER};border-radius:10px;
                padding:16px 20px;text-align:left;">
        <div style="font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;
                    letter-spacing:0.5px;margin-bottom:8px;">{label}</div>
        <div style="font-size:28px;font-weight:700;color:{color};">{value}</div>
    </div>'''


def welcome_banner(name: str, subtitle: str) -> str:
    """Purple gradient welcome banner matching the React dashboard."""
    return f'''
    <div style="background:linear-gradient(135deg, {PURPLE}, {PURPLE_HOVER});
                padding:24px 32px;border-radius:12px;margin-bottom:24px;">
        <h2 style="color:white;margin:0;font-size:22px;font-weight:600;">Welcome back, {name}</h2>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0 0;font-size:14px;">{subtitle}</p>
    </div>'''


def table_header(*columns: str) -> str:
    """Styled table header row matching the React data-table."""
    cols = "".join(f"<span>{c}</span>" for c in columns)
    n = len(columns)
    return f'''
    <div style="display:grid;grid-template-columns:repeat({n}, 1fr);padding:10px 20px;
                background:#fafafa;font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;
                letter-spacing:0.5px;font-weight:600;">
        {cols}
    </div>'''


def summary_bar(label: str, spent: float, allocated: float) -> str:
    """Budget progress bar matching the React budget component."""
    util = round(spent / allocated * 100) if allocated > 0 else 0
    bar_color = RED if util > 80 else PURPLE
    return f'''
    <div style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span style="color:{TEXT_SECONDARY};">{label}</span>
            <span style="font-weight:500;">${spent:,.0f} / ${allocated:,.0f}</span>
        </div>
        <div style="background:#F5F5F5;border-radius:4px;height:8px;overflow:hidden;">
            <div style="background:{bar_color};height:100%;width:{min(100, util)}%;
                        border-radius:4px;transition:width 0.3s;"></div>
        </div>
    </div>'''


# ── Global Streamlit CSS ────────────────────────────────────────

GLOBAL_CSS = f"""
<style>
    .stApp {{ background: {BG}; }}
    .block-container {{ padding-top: 1rem; max-width: 1200px; }}

    [data-testid="stSidebar"] {{
        background: {CARD_BG};
        border-right: 1px solid {BORDER};
    }}

    [data-testid="stMetric"] {{
        background: {CARD_BG};
        border: 1px solid {BORDER};
        border-radius: 10px;
        padding: 16px 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }}
    [data-testid="stMetricValue"] {{ font-size: 24px; font-weight: 700; }}
    [data-testid="stMetricLabel"] {{
        font-size: 11px; color: {TEXT_MUTED};
        text-transform: uppercase; letter-spacing: 0.5px;
    }}

    .stProgress > div > div > div {{ background: {PURPLE}; }}

    .stButton > button {{
        border-radius: 8px; font-weight: 500; font-size: 13px;
        border: 1px solid {BORDER}; transition: all 0.2s;
    }}
    .stButton > button:hover {{ border-color: {PURPLE}; color: {PURPLE}; }}

    .stSelectbox > div > div, .stTextInput > div > div > input {{
        border-radius: 8px; border-color: {BORDER}; font-size: 13px;
    }}

    #MainMenu {{ visibility: hidden; }}
    footer {{ visibility: hidden; }}
    header {{ visibility: hidden; }}
    hr {{ border: none; border-top: 1px solid {BORDER}; margin: 1rem 0; }}
</style>
"""


def sidebar_brand() -> str:
    """Sidebar brand header matching the React Sidebar component."""
    return f"""
    <div style="padding: 8px 0 16px 0;">
        <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;background:{PURPLE};border-radius:8px;
                        display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-weight:700;font-size:14px;">U</span>
            </div>
            <span style="font-size:15px;font-weight:600;color:{TEXT_PRIMARY};">
                <span style="color:{PURPLE};">uptime</span>health
            </span>
        </div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:12px;
                background:{PURPLE_LIGHT};border-radius:10px;margin-bottom:12px;">
        <div style="width:36px;height:36px;background:white;border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    color:{PURPLE};font-weight:700;font-size:12px;">UB</div>
        <div>
            <div style="font-size:13px;font-weight:600;color:{TEXT_PRIMARY};">Uptime Business</div>
            <div style="font-size:11px;color:{TEXT_MUTED};">Dental Clinic</div>
        </div>
    </div>
    """
