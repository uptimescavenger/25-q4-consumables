"""
25-Q4 Consumables — Stakeholder Prototype Portal
=================================================
Self-contained Streamlit app for investor/stakeholder demos.
All data is embedded — no backend required.

Run locally: streamlit run demo/prototype_portal.py
Deploy: Connect GitHub repo to Streamlit Community Cloud
"""

import streamlit as st
import pandas as pd
from datetime import datetime

st.set_page_config(
    page_title="UptimeHealth — Procurement & Inventory",
    page_icon="🏥",
    layout="wide",
)

# ── Embedded Data ───────────────────────────────────────────────

VENDORS = {
    "v1": "Henry Schein",
    "v2": "Patterson",
    "v3": "Benco",
    "v4": "Darby",
    "v5": "Midwest Dental",
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
    {
        "id": "ORD-001", "vendor": "Henry Schein", "status": "Shipped",
        "shipping": "Standard", "tracking": "1Z999AA10123456784",
        "subtotal": 180.00, "tax": 14.40, "total": 194.40,
        "notes": "Urgent restock", "created": "2025-12-01",
        "items": [
            {"name": "Nitrile Gloves (Disposable)", "qty": 3, "price": 30.00, "total": 90.00},
            {"name": "Surgical / Procedural Masks", "qty": 2, "price": 25.00, "total": 50.00},
            {"name": "Cotton Rolls", "qty": 5, "price": 12.00, "total": 60.00},
        ],
    },
    {
        "id": "ORD-002", "vendor": "Patterson", "status": "Pending Approval",
        "shipping": "Express", "tracking": None,
        "subtotal": 120.00, "tax": 9.60, "total": 129.60,
        "notes": "Monthly restocking", "created": "2025-12-15",
        "items": [
            {"name": "Sterile Gauze Pads", "qty": 4, "price": 15.00, "total": 60.00},
            {"name": "Saliva Ejector & Suction Tips", "qty": 3, "price": 20.00, "total": 60.00},
        ],
    },
    {
        "id": "ORD-003", "vendor": "Benco", "status": "Delivered",
        "shipping": "Standard", "tracking": "1Z999BB20123456785",
        "subtotal": 250.00, "tax": 20.00, "total": 270.00,
        "notes": "", "created": "2025-11-20",
        "items": [
            {"name": "Alginate Impression Material", "qty": 5, "price": 40.00, "total": 200.00},
            {"name": "Mixing Tips & Dispensing Tips", "qty": 2, "price": 25.00, "total": 50.00},
        ],
    },
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


# ── Helpers ─────────────────────────────────────────────────────

def status_color(status):
    return {
        "Out of Stock": "red", "Low Quantity": "orange",
        "In Stock": "green", "Active Orders": "violet",
    }.get(status, "gray")


def order_status_color(status):
    return {
        "Draft": "gray", "Pending Approval": "orange", "Approved": "blue",
        "Shipped": "violet", "Delivered": "green", "Cancelled": "red",
    }.get(status, "gray")


# ── Custom CSS ──────────────────────────────────────────────────

st.markdown("""
<style>
    .block-container { padding-top: 2rem; }
    [data-testid="stMetric"] {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 10px;
        padding: 12px 16px;
    }
    [data-testid="stMetricLabel"] { font-size: 12px; }
</style>
""", unsafe_allow_html=True)


# ── Sidebar ─────────────────────────────────────────────────────

st.sidebar.markdown("## 🏥 UptimeHealth")
st.sidebar.markdown("**Procurement & Inventory**")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Navigate",
    ["Dashboard", "Inventory", "Orders", "Automations", "Budget"],
    index=0,
)

st.sidebar.markdown("---")
st.sidebar.markdown("### About This Demo")
st.sidebar.markdown(
    "Self-contained prototype of a procurement & inventory management "
    "system for healthcare practices. All data is representative."
)
st.sidebar.markdown(f"_Built with Streamlit_")


# ── Dashboard ───────────────────────────────────────────────────

if page == "Dashboard":
    st.title("Dashboard")
    st.markdown("Welcome back, **Iryna** — here's what needs your attention today.")
    st.markdown("---")

    # KPI row
    out_of_stock = sum(1 for i in INVENTORY if i["status"] == "Out of Stock")
    low_qty = sum(1 for i in INVENTORY if i["status"] == "Low Quantity")
    pending_orders = sum(1 for o in ORDERS if o["status"] == "Pending Approval")
    active_auto = sum(1 for a in AUTOMATIONS if a["active"])
    total_value = sum(i["qty"] * i["price"] for i in INVENTORY)
    budget_util = round(BUDGETS[0]["spent"] / BUDGETS[0]["allocated"] * 100)

    c1, c2, c3, c4, c5, c6 = st.columns(6)
    c1.metric("Total Items", len(INVENTORY))
    c2.metric("Out of Stock", out_of_stock)
    c3.metric("Low Quantity", low_qty)
    c4.metric("Pending Orders", pending_orders)
    c5.metric("Automations", active_auto)
    c6.metric("Budget Used", f"{budget_util}%")

    st.markdown("---")

    # Critical items + quick stats
    col_left, col_right = st.columns([2, 1])

    with col_left:
        st.subheader("Items Needing Attention")
        critical = [i for i in INVENTORY if i["status"] in ("Out of Stock", "Low Quantity")]
        for inv in critical:
            item = ITEMS[inv["itemId"]]
            vendor_names = ", ".join(VENDORS[v] for v in inv["vendors"])
            cols = st.columns([3, 2, 1, 1])
            cols[0].markdown(f"**{item['name']}**  \n{item['description'][:50]}...")
            cols[1].markdown(f"{vendor_names}")
            cols[2].markdown(f":{status_color(inv['status'])}[{inv['status']}] ({inv['qty']})")
            cols[3].markdown(f"**${inv['price']:.2f}**")

    with col_right:
        st.subheader("Q4 Budget")
        for b in BUDGETS:
            util = round(b["spent"] / b["allocated"] * 100)
            st.markdown(f"**{b['category']}** — {b['facility']}")
            st.progress(util / 100, text=f"${b['spent']:,} / ${b['allocated']:,} ({util}%)")

        st.markdown("---")
        st.subheader("Pending Approval")
        for o in ORDERS:
            if o["status"] == "Pending Approval":
                st.warning(f"**{o['id']}** — ${o['total']:.2f} from {o['vendor']}")


# ── Inventory ───────────────────────────────────────────────────

elif page == "Inventory":
    st.title("Inventory")

    # Filters
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        search = st.text_input("Search items", placeholder="Search by name, SKU, or description...")
    with col2:
        status_filter = st.selectbox("Status", ["All", "Out of Stock", "Low Quantity", "In Stock", "Active Orders"])
    with col3:
        vendor_options = ["All Vendors"] + list(VENDORS.values())
        vendor_filter = st.selectbox("Vendor", vendor_options)

    # Filter data
    filtered = INVENTORY.copy()
    if status_filter != "All":
        filtered = [i for i in filtered if i["status"] == status_filter]
    if vendor_filter != "All Vendors":
        vid = [k for k, v in VENDORS.items() if v == vendor_filter][0]
        filtered = [i for i in filtered if vid in i["vendors"]]
    if search:
        search_lower = search.lower()
        filtered = [i for i in filtered if
                    search_lower in ITEMS[i["itemId"]]["name"].lower() or
                    search_lower in ITEMS[i["itemId"]]["sku"].lower() or
                    search_lower in ITEMS[i["itemId"]]["description"].lower()]

    # Status summary chips
    counts = {
        "All": len(INVENTORY),
        "Out of Stock": sum(1 for i in INVENTORY if i["status"] == "Out of Stock"),
        "Low Quantity": sum(1 for i in INVENTORY if i["status"] == "Low Quantity"),
        "In Stock": sum(1 for i in INVENTORY if i["status"] == "In Stock"),
        "Active Orders": sum(1 for i in INVENTORY if i["status"] == "Active Orders"),
    }
    chip_cols = st.columns(5)
    for idx, (label, count) in enumerate(counts.items()):
        chip_cols[idx].markdown(f"**{label}** ({count})")

    st.markdown("---")

    # Table
    table_data = []
    for inv in filtered:
        item = ITEMS[inv["itemId"]]
        vendor_names = ", ".join(VENDORS[v] for v in inv["vendors"])
        table_data.append({
            "Item": item["name"],
            "SKU": item["sku"],
            "Category": item["category"],
            "Status": inv["status"],
            "Qty on Hand": inv["qty"],
            "Reorder At": inv["threshold"],
            "Price": f"${inv['price']:.2f}",
            "Vendors": vendor_names,
            "Reminder": "On" if inv["reminder"] else "Off",
        })

    if table_data:
        df = pd.DataFrame(table_data)
        st.dataframe(
            df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "Status": st.column_config.TextColumn(width="small"),
                "Qty on Hand": st.column_config.NumberColumn(width="small"),
                "Reorder At": st.column_config.NumberColumn(width="small"),
            },
        )
    else:
        st.info("No items match your filters.")

    st.caption(f"Showing {len(filtered)} of {len(INVENTORY)} items")


# ── Orders ──────────────────────────────────────────────────────

elif page == "Orders":
    st.title("Orders")

    # Status filter
    status_opts = ["All"] + list(set(o["status"] for o in ORDERS))
    order_filter = st.selectbox("Filter by Status", status_opts)

    filtered_orders = ORDERS if order_filter == "All" else [o for o in ORDERS if o["status"] == order_filter]

    for order in filtered_orders:
        color = order_status_color(order["status"])
        with st.expander(f"**{order['id']}** — :{color}[{order['status']}] — {order['vendor']} — **${order['total']:.2f}**"):
            col1, col2, col3 = st.columns(3)
            col1.markdown(f"**Vendor:** {order['vendor']}")
            col2.markdown(f"**Shipping:** {order['shipping']}")
            col3.markdown(f"**Created:** {order['created']}")

            if order["tracking"]:
                st.info(f"Tracking: {order['tracking']}")
            if order["notes"]:
                st.caption(f"Notes: {order['notes']}")

            st.markdown("**Line Items:**")
            items_df = pd.DataFrame(order["items"])
            items_df.columns = ["Item", "Qty", "Unit Price", "Total"]
            items_df["Unit Price"] = items_df["Unit Price"].apply(lambda x: f"${x:.2f}")
            items_df["Total"] = items_df["Total"].apply(lambda x: f"${x:.2f}")
            st.dataframe(items_df, use_container_width=True, hide_index=True)

            c1, c2, c3 = st.columns(3)
            c1.metric("Subtotal", f"${order['subtotal']:.2f}")
            c2.metric("Tax", f"${order['tax']:.2f}")
            c3.metric("Total", f"${order['total']:.2f}")

            # Action buttons for demo
            if order["status"] == "Pending Approval":
                bcol1, bcol2, _ = st.columns([1, 1, 4])
                if bcol1.button("Approve", key=f"approve_{order['id']}"):
                    st.success(f"Order {order['id']} approved!")
                if bcol2.button("Reject", key=f"reject_{order['id']}"):
                    st.error(f"Order {order['id']} rejected.")

    st.markdown("---")
    st.subheader("Order Summary")
    total_value = sum(o["total"] for o in ORDERS)
    c1, c2, c3 = st.columns(3)
    c1.metric("Total Orders", len(ORDERS))
    c2.metric("Total Value", f"${total_value:,.2f}")
    c3.metric("Pending Approval", sum(1 for o in ORDERS if o["status"] == "Pending Approval"))


# ── Automations ─────────────────────────────────────────────────

elif page == "Automations":
    st.title("Automations")
    st.markdown("Automate procurement with threshold-based reordering and recurring scheduled orders.")
    st.markdown("---")

    # Stats
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Rules", len(AUTOMATIONS))
    c2.metric("Threshold Rules", sum(1 for a in AUTOMATIONS if a["type"] == "Threshold"))
    c3.metric("Recurring Orders", sum(1 for a in AUTOMATIONS if a["type"] == "Recurring"))
    c4.metric("Active", sum(1 for a in AUTOMATIONS if a["active"]))

    st.markdown("---")

    # Filter
    type_filter = st.selectbox("Filter by Type", ["All", "Threshold", "Recurring"])
    filtered_auto = AUTOMATIONS if type_filter == "All" else [a for a in AUTOMATIONS if a["type"] == type_filter]

    for rule in filtered_auto:
        status_icon = "🟢" if rule["active"] else "🔴"
        type_icon = "📉" if rule["type"] == "Threshold" else "🔄"

        with st.expander(f"{status_icon} {type_icon} **{rule['item']}** — {rule['type']} {'(Paused)' if not rule['active'] else ''}"):
            if rule["type"] == "Threshold":
                col1, col2, col3 = st.columns(3)
                col1.markdown(f"**Trigger Below:** {rule['trigger_qty']} units")
                col2.markdown(f"**Reorder Qty:** {rule['reorder_qty']} units")
                col3.markdown(f"**Max Price:** ${rule['max_price']:.2f}")

                col4, col5 = st.columns(2)
                col4.markdown(f"**Preferred Vendor:** {rule['vendor']}")
                col5.markdown(f"**Auto-approve:** {'Yes' if rule['auto_approve'] else 'No'}")
            else:
                col1, col2, col3 = st.columns(3)
                col1.markdown(f"**Frequency:** {rule['frequency']}")
                col2.markdown(f"**Order Qty:** {rule['qty']} units")
                col3.markdown(f"**Next Run:** {rule['next_run']}")

                st.markdown(f"**Preferred Vendor:** {rule['vendor']}")


# ── Budget ──────────────────────────────────────────────────────

elif page == "Budget":
    st.title("Budget Overview")
    st.markdown("Track spending across facilities and categories for Q4 2025.")
    st.markdown("---")

    for b in BUDGETS:
        util = round(b["spent"] / b["allocated"] * 100)
        remaining = b["allocated"] - b["spent"]

        st.subheader(f"{b['facility']} — {b['category']}")
        c1, c2, c3 = st.columns(3)
        c1.metric("Allocated", f"${b['allocated']:,}")
        c2.metric("Spent", f"${b['spent']:,}")
        c3.metric("Remaining", f"${remaining:,}",
                  delta=f"-{util}% used" if util > 80 else f"{100 - util}% remaining")
        st.progress(util / 100, text=f"{util}% utilized")
        st.markdown("---")

    # Total summary
    total_allocated = sum(b["allocated"] for b in BUDGETS)
    total_spent = sum(b["spent"] for b in BUDGETS)
    total_util = round(total_spent / total_allocated * 100)

    st.subheader("Total Across All Facilities")
    c1, c2, c3 = st.columns(3)
    c1.metric("Total Allocated", f"${total_allocated:,}")
    c2.metric("Total Spent", f"${total_spent:,}")
    c3.metric("Overall Utilization", f"{total_util}%")
