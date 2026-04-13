"""
25-Q4 Consumables — UptimeHealth Procurement & Inventory
========================================================
Self-contained Streamlit app for investor/stakeholder demos.
All data is embedded — no backend required.

Run locally: streamlit run demo/prototype_portal.py
Deploy: Connect GitHub repo to Streamlit Community Cloud
"""

import streamlit as st
import pandas as pd
from brand import (
    PURPLE, PURPLE_LIGHT, PURPLE_HOVER,
    TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
    BORDER, BG, RED, RED_BG, ORANGE, ORANGE_BG, GREEN, GREEN_BG,
    badge, status_badge, order_badge, card_metric, welcome_banner,
    GLOBAL_CSS, sidebar_brand,
)

st.set_page_config(
    page_title="UptimeHealth — Procurement & Inventory",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Embedded Data ───────────────────────────────────────────────

VENDORS = {
    "v1": "Henry Schein", "v2": "Patterson", "v3": "Benco",
    "v4": "Darby", "v5": "Midwest Dental",
}

ITEMS = {
    "i1":  {"name": "Nitrile Gloves (Disposable)", "description": "Powder-free protective gloves for hygiene and infection control", "category": "PPE", "sku": "NG-100"},
    "i2":  {"name": "Surgical / Procedural Masks", "description": "Disposable masks to protect staff and patients", "category": "PPE", "sku": "SM-50"},
    "i3":  {"name": "Cotton Rolls", "description": "Absorb saliva and moisture during procedures", "category": "Dental Supplies", "sku": "CR-100"},
    "i4":  {"name": "Sterile Gauze Pads", "description": "For bleeding control and wound care", "category": "Dental Supplies", "sku": "SGP-100"},
    "i5":  {"name": "Saliva Ejector & Suction Tips", "description": "Disposable suction tips to remove fluids", "category": "Dental Supplies", "sku": "SE-100"},
    "i6":  {"name": "Alginate Impression Material", "description": "Powder for making preliminary dental impressions", "category": "Impression Materials", "sku": "AIM-1"},
    "i7":  {"name": "Mixing Tips & Dispensing Tips", "description": "Used for accurate material delivery", "category": "Dental Supplies", "sku": "MT-1"},
    "i8":  {"name": "Syringes & Needles (Disposable)", "description": "Single-use syringes and anesthetic needles", "category": "Anesthesia", "sku": "SN-1"},
    "i9":  {"name": "Sterilization Pouches", "description": "Keeps sterilized instruments sterile until use", "category": "Sterilization", "sku": "SP-100"},
    "i10": {"name": "Dental Bibs & Clips", "description": "Patient protective bibs with clips or chain", "category": "Patient Care", "sku": "DBC-100"},
    "i11": {"name": "Prophy Paste", "description": "Prophylaxis paste for teeth cleaning and polishing", "category": "Preventive", "sku": "PP-200"},
}

INVENTORY = [
    {"id": "inv1",  "itemId": "i1",  "qty": 0,  "threshold": 5,  "maxStock": 50,  "price": 30.00, "status": "Out of Stock",   "reminder": True,  "vendors": ["v1", "v2"]},
    {"id": "inv2",  "itemId": "i2",  "qty": 0,  "threshold": 5,  "maxStock": 40,  "price": 25.00, "status": "Out of Stock",   "reminder": True,  "vendors": ["v2", "v3"]},
    {"id": "inv3",  "itemId": "i3",  "qty": 0,  "threshold": 10, "maxStock": 100, "price": 12.00, "status": "Out of Stock",   "reminder": False, "vendors": ["v1", "v5"]},
    {"id": "inv4",  "itemId": "i4",  "qty": 2,  "threshold": 5,  "maxStock": 50,  "price": 15.00, "status": "Low Quantity",   "reminder": False, "vendors": ["v2", "v4"]},
    {"id": "inv5",  "itemId": "i5",  "qty": 3,  "threshold": 5,  "maxStock": 60,  "price": 20.00, "status": "Low Quantity",   "reminder": False, "vendors": ["v3", "v2"]},
    {"id": "inv6",  "itemId": "i6",  "qty": 4,  "threshold": 3,  "maxStock": 20,  "price": 40.00, "status": "Low Quantity",   "reminder": False, "vendors": ["v1", "v2"]},
    {"id": "inv7",  "itemId": "i7",  "qty": 23, "threshold": 5,  "maxStock": 50,  "price": 25.00, "status": "In Stock",       "reminder": False, "vendors": ["v4", "v2"]},
    {"id": "inv8",  "itemId": "i8",  "qty": 15, "threshold": 5,  "maxStock": 40,  "price": 35.00, "status": "In Stock",       "reminder": False, "vendors": ["v1", "v3"]},
    {"id": "inv9",  "itemId": "i9",  "qty": 40, "threshold": 10, "maxStock": 80,  "price": 30.00, "status": "Active Orders",  "reminder": False, "vendors": ["v4", "v2"]},
    {"id": "inv10", "itemId": "i10", "qty": 23, "threshold": 5,  "maxStock": 50,  "price": 25.00, "status": "Active Orders",  "reminder": False, "vendors": ["v1", "v3"]},
    {"id": "inv11", "itemId": "i11", "qty": 12, "threshold": 5,  "maxStock": 30,  "price": 18.00, "status": "In Stock",       "reminder": False, "vendors": ["v1", "v2"]},
]

ORDERS = [
    {"id": "ORD-001", "vendor": "Henry Schein", "status": "Shipped", "shipping": "Standard", "tracking": "1Z999AA10123456784", "subtotal": 180.00, "tax": 14.40, "total": 194.40, "notes": "Urgent restock", "created": "2025-12-01",
     "items": [{"name": "Nitrile Gloves (Disposable)", "qty": 3, "price": 30.00, "total": 90.00}, {"name": "Surgical / Procedural Masks", "qty": 2, "price": 25.00, "total": 50.00}, {"name": "Cotton Rolls", "qty": 5, "price": 12.00, "total": 60.00}]},
    {"id": "ORD-002", "vendor": "Patterson", "status": "Pending Approval", "shipping": "Express", "tracking": None, "subtotal": 120.00, "tax": 9.60, "total": 129.60, "notes": "Monthly restocking", "created": "2025-12-15",
     "items": [{"name": "Sterile Gauze Pads", "qty": 4, "price": 15.00, "total": 60.00}, {"name": "Saliva Ejector & Suction Tips", "qty": 3, "price": 20.00, "total": 60.00}]},
    {"id": "ORD-003", "vendor": "Benco", "status": "Delivered", "shipping": "Standard", "tracking": "1Z999BB20123456785", "subtotal": 250.00, "tax": 20.00, "total": 270.00, "notes": "", "created": "2025-11-20",
     "items": [{"name": "Alginate Impression Material", "qty": 5, "price": 40.00, "total": 200.00}, {"name": "Mixing Tips & Dispensing Tips", "qty": 2, "price": 25.00, "total": 50.00}]},
]

AUTOMATIONS = [
    {"item": "Nitrile Gloves (Disposable)", "type": "Threshold", "active": True, "trigger_qty": 5, "reorder_qty": 20, "vendor": "Henry Schein", "auto_approve": True, "max_price": 35.00},
    {"item": "Surgical / Procedural Masks", "type": "Threshold", "active": True, "trigger_qty": 5, "reorder_qty": 15, "vendor": "Patterson", "auto_approve": False, "max_price": 30.00},
    {"item": "Cotton Rolls", "type": "Recurring", "active": True, "frequency": "Monthly", "qty": 10, "vendor": "Henry Schein", "next_run": "2026-01-01"},
    {"item": "Sterilization Pouches", "type": "Recurring", "active": False, "frequency": "Biweekly", "qty": 5, "vendor": "Darby", "next_run": "2026-01-15"},
]

BUDGETS = [
    {"facility": "Uptime Business - Main", "category": "Consumables", "allocated": 5000, "spent": 4250},
    {"facility": "Uptime Business - Main", "category": "Equipment Maintenance", "allocated": 2000, "spent": 800},
    {"facility": "Facility at Laurel", "category": "Consumables", "allocated": 3500, "spent": 2100},
]


# ── Apply Global CSS ────────────────────────────────────────────

st.markdown(GLOBAL_CSS, unsafe_allow_html=True)


# ── Sidebar ─────────────────────────────────────────────────────

st.sidebar.markdown(sidebar_brand(), unsafe_allow_html=True)

page = st.sidebar.radio(
    "MAIN MENU",
    ["Dashboard", "Inventory", "Orders", "Automations", "Budget"],
    index=0,
)

st.sidebar.markdown("---")
st.sidebar.markdown(f"""
<div style="padding:12px;background:{PURPLE_LIGHT};border-radius:10px;">
    <div style="font-size:12px;font-weight:600;color:{PURPLE};margin-bottom:4px;">Investor Demo</div>
    <div style="font-size:11px;color:{TEXT_SECONDARY};line-height:1.5;">
        Procurement & inventory management for healthcare practices. Fully interactive prototype.
    </div>
</div>
""", unsafe_allow_html=True)


# ── Dashboard ───────────────────────────────────────────────────

if page == "Dashboard":
    # Welcome banner
    st.markdown(welcome_banner("Iryna", "Here's what needs your attention today"), unsafe_allow_html=True)

    # KPI row
    out_of_stock = sum(1 for i in INVENTORY if i["status"] == "Out of Stock")
    low_qty = sum(1 for i in INVENTORY if i["status"] == "Low Quantity")
    pending_orders = sum(1 for o in ORDERS if o["status"] == "Pending Approval")
    active_auto = sum(1 for a in AUTOMATIONS if a["active"])
    budget_util = round(BUDGETS[0]["spent"] / BUDGETS[0]["allocated"] * 100)

    cols = st.columns(6)
    metrics = [
        ("Total Items", str(len(INVENTORY)), PURPLE),
        ("Out of Stock", str(out_of_stock), RED),
        ("Low Quantity", str(low_qty), ORANGE),
        ("Pending Orders", str(pending_orders), PURPLE),
        ("Automations", str(active_auto), GREEN),
        ("Budget Used", f"{budget_util}%", RED if budget_util > 80 else GREEN),
    ]
    for col, (label, value, color) in zip(cols, metrics):
        col.markdown(card_metric(label, value, color), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Critical items + sidebar
    col_left, col_right = st.columns([2, 1])

    with col_left:
        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;overflow:hidden;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid {BORDER};">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="color:{RED};font-size:16px;">&#9888;</span>
                    <span style="font-size:14px;font-weight:600;">Items Needing Attention</span>
                    {badge(str(out_of_stock + low_qty), RED_BG, RED)}
                </div>
            </div>
        """, unsafe_allow_html=True)

        # Table header
        st.markdown(f"""
            <div style="display:grid;grid-template-columns:2fr 1.5fr 1fr 0.8fr;padding:10px 20px;background:#fafafa;font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                <span>Item</span><span>Vendor</span><span>Status</span><span>Price</span>
            </div>
        """, unsafe_allow_html=True)

        critical = [i for i in INVENTORY if i["status"] in ("Out of Stock", "Low Quantity")]
        for inv in critical:
            item = ITEMS[inv["itemId"]]
            vendor_names = ", ".join(VENDORS[v] for v in inv["vendors"])
            st.markdown(f"""
            <div style="display:grid;grid-template-columns:2fr 1.5fr 1fr 0.8fr;padding:12px 20px;border-top:1px solid {BORDER};align-items:center;font-size:13px;">
                <div>
                    <div style="font-weight:500;color:{TEXT_PRIMARY};">{item['name']}</div>
                    <div style="font-size:11px;color:{TEXT_MUTED};margin-top:2px;">{item['description'][:45]}...</div>
                </div>
                <span style="color:{TEXT_SECONDARY};font-size:12px;">{vendor_names}</span>
                <span>{status_badge(inv['status'], inv['qty'])}</span>
                <span style="font-weight:600;">${inv['price']:.2f}</span>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

    with col_right:
        # Budget card
        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;padding:20px;margin-bottom:16px;">
            <h3 style="font-size:14px;font-weight:600;margin:0 0 16px 0;">Q4 Budget</h3>
        """, unsafe_allow_html=True)
        for b in BUDGETS:
            util = round(b["spent"] / b["allocated"] * 100)
            bar_color = RED if util > 80 else PURPLE
            st.markdown(f"""
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                    <span style="color:{TEXT_SECONDARY};">{b['category']}</span>
                    <span style="font-weight:500;">${b['spent']:,} / ${b['allocated']:,}</span>
                </div>
                <div style="background:#F5F5F5;border-radius:4px;height:8px;overflow:hidden;">
                    <div style="background:{bar_color};height:100%;width:{min(100, util)}%;border-radius:4px;transition:width 0.3s;"></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

        # Pending approval card
        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;padding:20px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <span style="color:{ORANGE};font-size:14px;">&#128337;</span>
                <h3 style="font-size:14px;font-weight:600;margin:0;">Pending Approvals</h3>
            </div>
        """, unsafe_allow_html=True)
        for o in ORDERS:
            if o["status"] == "Pending Approval":
                st.markdown(f"""
                <div style="background:{ORANGE_BG};border-radius:8px;padding:12px;margin-bottom:8px;">
                    <div style="font-size:12px;font-weight:500;">{o['id']}</div>
                    <div style="font-size:11px;color:{TEXT_MUTED};">${o['total']:.2f} &middot; {o['vendor']}</div>
                </div>
                """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)


# ── Inventory ───────────────────────────────────────────────────

elif page == "Inventory":
    st.markdown(f"""
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h1 style="font-size:18px;font-weight:600;color:{TEXT_PRIMARY};margin:0;">Inventory</h1>
    </div>
    """, unsafe_allow_html=True)

    # Status chips
    counts = {
        "All": len(INVENTORY),
        "Out of Stock": sum(1 for i in INVENTORY if i["status"] == "Out of Stock"),
        "Low Quantity": sum(1 for i in INVENTORY if i["status"] == "Low Quantity"),
        "In Stock": sum(1 for i in INVENTORY if i["status"] == "In Stock"),
        "Active Orders": sum(1 for i in INVENTORY if i["status"] == "Active Orders"),
    }
    chip_colors = {"All": PURPLE, "Out of Stock": RED, "Low Quantity": ORANGE, "In Stock": GREEN, "Active Orders": PURPLE}
    chip_html = ""
    for label, count in counts.items():
        c = chip_colors[label]
        chip_html += f'<span style="display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:500;background:white;color:{TEXT_SECONDARY};border:1px solid {BORDER};margin-right:8px;margin-bottom:8px;">{label} ({count})</span>'
    st.markdown(chip_html, unsafe_allow_html=True)

    # Filters
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        search = st.text_input("Search", placeholder="Search by name, SKU, or description...", label_visibility="collapsed")
    with col2:
        status_filter = st.selectbox("Status", ["All", "Out of Stock", "Low Quantity", "In Stock", "Active Orders"], label_visibility="collapsed")
    with col3:
        vendor_options = ["All Vendors"] + list(VENDORS.values())
        vendor_filter = st.selectbox("Vendor", vendor_options, label_visibility="collapsed")

    # Filter data
    filtered = INVENTORY.copy()
    if status_filter != "All":
        filtered = [i for i in filtered if i["status"] == status_filter]
    if vendor_filter != "All Vendors":
        vid = [k for k, v in VENDORS.items() if v == vendor_filter][0]
        filtered = [i for i in filtered if vid in i["vendors"]]
    if search:
        sl = search.lower()
        filtered = [i for i in filtered if sl in ITEMS[i["itemId"]]["name"].lower() or sl in ITEMS[i["itemId"]]["sku"].lower() or sl in ITEMS[i["itemId"]]["description"].lower()]

    # Table
    st.markdown(f"""
    <div style="background:white;border:1px solid {BORDER};border-radius:10px;overflow:hidden;">
        <div style="display:grid;grid-template-columns:2.5fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr 1.5fr;padding:12px 20px;background:#fafafa;font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
            <span>Item Name</span><span>Description</span><span>Status</span><span>Qty</span><span>Reorder</span><span>Price</span><span>Vendor</span>
        </div>
    """, unsafe_allow_html=True)

    for inv in filtered:
        item = ITEMS[inv["itemId"]]
        vendor_names = ", ".join(VENDORS[v] for v in inv["vendors"])
        qty_color = RED if inv["qty"] == 0 else ORANGE if inv["qty"] <= inv["threshold"] else TEXT_PRIMARY
        st.markdown(f"""
        <div style="display:grid;grid-template-columns:2.5fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr 1.5fr;padding:12px 20px;border-top:1px solid {BORDER};align-items:center;font-size:13px;">
            <div>
                <div style="font-weight:500;color:{PURPLE};">{item['name']}</div>
                <div style="font-size:11px;color:{TEXT_MUTED};">SKU: {item['sku']}</div>
            </div>
            <div style="color:{TEXT_SECONDARY};font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{item['description'][:40]}...</div>
            <span>{status_badge(inv['status'])}</span>
            <span style="font-weight:600;color:{qty_color};">{inv['qty']}</span>
            <span style="color:{TEXT_MUTED};font-size:12px;">{inv['threshold']}</span>
            <span style="font-weight:500;">${inv['price']:.2f}</span>
            <span style="color:{TEXT_SECONDARY};font-size:12px;">{vendor_names}</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)

    if not filtered:
        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;padding:48px;text-align:center;">
            <div style="color:{TEXT_MUTED};font-size:14px;">No items match your filters</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown(f'<div style="font-size:11px;color:{TEXT_MUTED};margin-top:8px;">Showing {len(filtered)} of {len(INVENTORY)} items</div>', unsafe_allow_html=True)


# ── Orders ──────────────────────────────────────────────────────

elif page == "Orders":
    st.markdown(f"""
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h1 style="font-size:18px;font-weight:600;color:{TEXT_PRIMARY};margin:0;">Orders</h1>
    </div>
    """, unsafe_allow_html=True)

    # Status chips
    order_statuses = ["All Orders", "Pending Approval", "Approved", "Shipped", "Delivered"]
    chip_html = ""
    for s in order_statuses:
        chip_html += f'<span style="display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:500;background:white;color:{TEXT_SECONDARY};border:1px solid {BORDER};margin-right:8px;margin-bottom:8px;">{s}</span>'
    st.markdown(chip_html, unsafe_allow_html=True)

    order_filter = st.selectbox("Filter", ["All"] + list(set(o["status"] for o in ORDERS)), label_visibility="collapsed")
    filtered_orders = ORDERS if order_filter == "All" else [o for o in ORDERS if o["status"] == order_filter]

    for order in filtered_orders:
        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;padding:20px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:15px;font-weight:600;">Order #{order['id']}</span>
                    {order_badge(order['status'])}
                </div>
                <span style="font-size:18px;font-weight:700;color:{TEXT_PRIMARY};">${order['total']:.2f}</span>
            </div>
            <div style="display:flex;gap:20px;font-size:12px;color:{TEXT_SECONDARY};">
                <span>{order['vendor']}</span>
                <span>{len(order['items'])} items</span>
                <span>{order['created']}</span>
                {"<span style='color:" + PURPLE + ";'>Tracking: " + order['tracking'] + "</span>" if order['tracking'] else ""}
            </div>
        </div>
        """, unsafe_allow_html=True)

        with st.expander(f"View details for {order['id']}"):
            items_df = pd.DataFrame(order["items"])
            items_df.columns = ["Item", "Qty", "Unit Price", "Total"]
            items_df["Unit Price"] = items_df["Unit Price"].apply(lambda x: f"${x:.2f}")
            items_df["Total"] = items_df["Total"].apply(lambda x: f"${x:.2f}")
            st.dataframe(items_df, use_container_width=True, hide_index=True)

            c1, c2, c3 = st.columns(3)
            c1.metric("Subtotal", f"${order['subtotal']:.2f}")
            c2.metric("Tax", f"${order['tax']:.2f}")
            c3.metric("Total", f"${order['total']:.2f}")

            if order["status"] == "Pending Approval":
                bcol1, bcol2, _ = st.columns([1, 1, 4])
                if bcol1.button("Approve", key=f"approve_{order['id']}", type="primary"):
                    st.success(f"Order {order['id']} approved!")
                if bcol2.button("Reject", key=f"reject_{order['id']}"):
                    st.error(f"Order {order['id']} rejected.")

    # Summary
    st.markdown("<br>", unsafe_allow_html=True)
    total_value = sum(o["total"] for o in ORDERS)
    c1, c2, c3 = st.columns(3)
    c1.metric("Total Orders", len(ORDERS))
    c2.metric("Total Value", f"${total_value:,.2f}")
    c3.metric("Pending Approval", sum(1 for o in ORDERS if o["status"] == "Pending Approval"))


# ── Automations ─────────────────────────────────────────────────

elif page == "Automations":
    st.markdown(f"""
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h1 style="font-size:18px;font-weight:600;color:{TEXT_PRIMARY};margin:0;">Automations</h1>
    </div>
    """, unsafe_allow_html=True)

    # Stats row
    cols = st.columns(4)
    auto_metrics = [
        ("Total Rules", str(len(AUTOMATIONS)), PURPLE),
        ("Threshold Rules", str(sum(1 for a in AUTOMATIONS if a["type"] == "Threshold")), ORANGE),
        ("Recurring Orders", str(sum(1 for a in AUTOMATIONS if a["type"] == "Recurring")), GREEN),
        ("Active", str(sum(1 for a in AUTOMATIONS if a["active"])), PURPLE),
    ]
    for col, (label, value, color) in zip(cols, auto_metrics):
        col.markdown(card_metric(label, value, color), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Filter chips
    type_filter = st.selectbox("Filter", ["All", "Threshold", "Recurring"], label_visibility="collapsed")
    filtered_auto = AUTOMATIONS if type_filter == "All" else [a for a in AUTOMATIONS if a["type"] == type_filter]

    for rule in filtered_auto:
        type_bg = ORANGE_BG if rule["type"] == "Threshold" else GREEN_BG
        type_color = ORANGE if rule["type"] == "Threshold" else GREEN
        type_icon = "&#128200;" if rule["type"] == "Threshold" else "&#128260;"
        active_dot = f'<span style="color:{GREEN};">&#9679;</span>' if rule["active"] else f'<span style="color:{RED};">&#9679;</span>'

        if rule["type"] == "Threshold":
            desc = f"Reorder {rule['reorder_qty']} units when stock drops below {rule['trigger_qty']}"
        else:
            desc = f"Order {rule['qty']} units {rule['frequency']}"

        paused_badge = "" if rule["active"] else f' {badge("Paused", "#f5f5f5", TEXT_MUTED)}'

        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;padding:20px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                <div style="width:40px;height:40px;background:{type_bg};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;">{type_icon}</div>
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:14px;font-weight:500;">{rule['item']}</span>
                        {badge(rule['type'], type_bg, type_color)}
                        {paused_badge}
                    </div>
                    <div style="font-size:12px;color:{TEXT_MUTED};margin-top:4px;">
                        {desc} &middot; via {rule['vendor']}
                    </div>
                </div>
                <div>{active_dot}</div>
            </div>
        """, unsafe_allow_html=True)

        if rule["type"] == "Threshold":
            st.markdown(f"""
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding-top:12px;border-top:1px solid {BORDER};">
                <div><div style="font-size:11px;color:{TEXT_MUTED};">Trigger Below</div><div style="font-size:14px;font-weight:500;">{rule['trigger_qty']} units</div></div>
                <div><div style="font-size:11px;color:{TEXT_MUTED};">Reorder Qty</div><div style="font-size:14px;font-weight:500;">{rule['reorder_qty']} units</div></div>
                <div><div style="font-size:11px;color:{TEXT_MUTED};">Max Price</div><div style="font-size:14px;font-weight:500;">${rule['max_price']:.2f}</div></div>
            </div>
            <div style="font-size:12px;color:{TEXT_MUTED};margin-top:8px;">Auto-approve: <strong style="color:{TEXT_PRIMARY};">{'Yes' if rule['auto_approve'] else 'No'}</strong></div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding-top:12px;border-top:1px solid {BORDER};">
                <div><div style="font-size:11px;color:{TEXT_MUTED};">Frequency</div><div style="font-size:14px;font-weight:500;">{rule['frequency']}</div></div>
                <div><div style="font-size:11px;color:{TEXT_MUTED};">Order Qty</div><div style="font-size:14px;font-weight:500;">{rule['qty']} units</div></div>
                <div><div style="font-size:11px;color:{TEXT_MUTED};">Next Run</div><div style="font-size:14px;font-weight:500;">{rule['next_run']}</div></div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)


# ── Budget ──────────────────────────────────────────────────────

elif page == "Budget":
    st.markdown(f"""
    <div style="margin-bottom:20px;">
        <h1 style="font-size:18px;font-weight:600;color:{TEXT_PRIMARY};margin:0;">Budget Overview</h1>
        <p style="font-size:13px;color:{TEXT_MUTED};margin:4px 0 0 0;">Track spending across facilities and categories for Q4 2025</p>
    </div>
    """, unsafe_allow_html=True)

    for b in BUDGETS:
        util = round(b["spent"] / b["allocated"] * 100)
        remaining = b["allocated"] - b["spent"]
        bar_color = RED if util > 80 else PURPLE

        st.markdown(f"""
        <div style="background:white;border:1px solid {BORDER};border-radius:10px;padding:20px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;margin-bottom:16px;">{b['facility']} &mdash; {b['category']}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;">
                <div style="text-align:center;">
                    <div style="font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;margin-bottom:4px;">Allocated</div>
                    <div style="font-size:22px;font-weight:700;color:{PURPLE};">${b['allocated']:,}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;margin-bottom:4px;">Spent</div>
                    <div style="font-size:22px;font-weight:700;color:{bar_color};">${b['spent']:,}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:11px;color:{TEXT_MUTED};text-transform:uppercase;margin-bottom:4px;">Remaining</div>
                    <div style="font-size:22px;font-weight:700;color:{GREEN};">${remaining:,}</div>
                </div>
            </div>
            <div style="background:#F5F5F5;border-radius:4px;height:10px;overflow:hidden;">
                <div style="background:{bar_color};height:100%;width:{min(100, util)}%;border-radius:4px;transition:width 0.3s;"></div>
            </div>
            <div style="font-size:11px;color:{TEXT_MUTED};margin-top:6px;text-align:right;">{util}% utilized</div>
        </div>
        """, unsafe_allow_html=True)

    # Total summary
    total_allocated = sum(b["allocated"] for b in BUDGETS)
    total_spent = sum(b["spent"] for b in BUDGETS)
    total_remaining = total_allocated - total_spent
    total_util = round(total_spent / total_allocated * 100)

    st.markdown(f"""
    <div style="background:linear-gradient(135deg, {PURPLE}, {PURPLE_HOVER});border-radius:10px;padding:24px;margin-top:8px;">
        <div style="font-size:14px;font-weight:600;color:white;margin-bottom:16px;">Total Across All Facilities</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;">
            <div style="text-align:center;">
                <div style="font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:4px;">Allocated</div>
                <div style="font-size:22px;font-weight:700;color:white;">${total_allocated:,}</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:4px;">Spent</div>
                <div style="font-size:22px;font-weight:700;color:white;">${total_spent:,}</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:4px;">Remaining</div>
                <div style="font-size:22px;font-weight:700;color:white;">${total_remaining:,}</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:4px;">Utilization</div>
                <div style="font-size:22px;font-weight:700;color:white;">{total_util}%</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
