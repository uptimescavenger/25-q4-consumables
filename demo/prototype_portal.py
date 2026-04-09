"""
25-Q4 Consumables — Stakeholder Prototype Portal
=================================================
A Streamlit app that serves as the entry point for stakeholders to
preview the procurement & inventory management prototype.

Run: streamlit run demo/prototype_portal.py
Backend must be running on http://localhost:4000
"""

import streamlit as st
import requests
import json
from datetime import datetime

API_BASE = "http://localhost:4000/api"

st.set_page_config(
    page_title="25-Q4 Consumables — Prototype Portal",
    page_icon="📦",
    layout="wide",
)


def fetch(endpoint: str):
    try:
        r = requests.get(f"{API_BASE}{endpoint}", timeout=5)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return None


# ── Sidebar ──────────────────────────────────────────────────────
st.sidebar.title("🏥 Prototype Portal")
st.sidebar.markdown("**25-Q4 Consumables**")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Navigate",
    ["Overview", "Live Metrics", "Inventory Status", "Orders", "Automations", "Budget"],
    index=0,
)

st.sidebar.markdown("---")
st.sidebar.markdown("### Quick Links")
st.sidebar.markdown("[🖥️ Open React App](http://localhost:5173)")
st.sidebar.markdown("[⚙️ API Health Check](http://localhost:4000/api/health)")
st.sidebar.markdown("---")

# Demo Controls
st.sidebar.markdown("### Demo Controls")
if st.sidebar.button("🔄 Refresh Data"):
    st.rerun()

st.sidebar.markdown(f"_Last refreshed: {datetime.now().strftime('%H:%M:%S')}_")


# ── Pages ────────────────────────────────────────────────────────

if page == "Overview":
    st.title("25-Q4 Consumables Prototype")
    st.markdown("""
    ### Project Overview

    This prototype demonstrates a **procurement and inventory management system**
    for dental practices and healthcare facilities. It enables staff to:

    - **Track consumable inventory** in real-time across multiple facilities
    - **Place orders** with a click — individual or bulk ordering
    - **Automate procurement** with threshold-based and recurring order rules
    - **Manage approvals** with configurable workflows by spend amount
    - **Monitor budgets** with per-facility, per-period spend tracking
    - **Receive smart alerts** for low stock, order status, and budget limits

    ---
    ### Architecture
    """)

    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("""
        **Frontend (React + Vite)**
        - TypeScript + Tailwind CSS
        - Figma-matched design tokens
        - Two main views: Home Dashboard & Inventory/Orders
        - Port: `5173`
        """)
    with col2:
        st.markdown("""
        **Backend (Node.js + Express)**
        - TypeScript REST API
        - Mock data layer (11 consumable items, 3 orders, automation rules)
        - CRUD for inventory, orders, automations
        - Port: `4000`
        """)
    with col3:
        st.markdown("""
        **This Portal (Streamlit)**
        - Stakeholder presentation layer
        - Real-time metrics from the API
        - Interactive demo controls
        - Port: `8501`
        """)

    st.markdown("---")
    st.markdown("### Feature Readiness")
    features = {
        "Inventory Table (search, filter, sort)": 95,
        "Status Badges (Out of Stock / Low / In Stock / Active Orders)": 100,
        "Quantity Counter + Add to Order": 90,
        "Create Order Flow": 85,
        "Order Management (approve, track)": 80,
        "Threshold-based Auto-Reorder": 75,
        "Recurring Scheduled Orders": 70,
        "Approval Workflow": 65,
        "Budget Tracking": 60,
        "Notification System": 55,
    }
    for feature, pct in features.items():
        st.progress(pct / 100, text=f"{feature} — {pct}%")


elif page == "Live Metrics":
    st.title("📊 Live Metrics from API")
    metrics = fetch("/dashboard/metrics")

    if not metrics:
        st.error("⚠️ Backend is not running. Start it with: `cd backend && npm run dev`")
        st.stop()

    # KPI Row
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Inventory Value", f"${metrics['totalInventoryValue']:,.2f}")
    col2.metric("Items in Stock", metrics["totalItemsInStock"])
    col3.metric("Unique Products", metrics["uniqueProducts"])
    col4.metric("Active Vendors", metrics["activeVendors"])

    col5, col6, col7, col8 = st.columns(4)
    col5.metric("Open Orders", metrics["openOrders"])
    col6.metric("Total Order Value", f"${metrics['totalOrderValue']:,.2f}")
    col7.metric("Active Automation Rules", metrics["automationRulesActive"])
    col8.metric("Facilities", metrics["facilitiesCount"])

    st.markdown("---")
    st.subheader("Inventory by Status")
    status_data = metrics["inventoryByStatus"]
    cols = st.columns(4)
    cols[0].metric("🔴 Out of Stock", status_data["outOfStock"])
    cols[1].metric("🟠 Low Quantity", status_data["lowQuantity"])
    cols[2].metric("🟢 In Stock", status_data["inStock"])
    cols[3].metric("🟣 Active Orders", status_data["activeOrders"])

    st.markdown("---")
    st.subheader("Budget Utilization")
    for b in metrics.get("budgets", []):
        st.markdown(f"**{b['facility']}** — {b['category']}")
        st.progress(b["utilization"] / 100, text=f"${b['spent']:,.0f} / ${b['allocated']:,.0f} ({b['utilization']}%)")


elif page == "Inventory Status":
    st.title("📦 Current Inventory")
    data = fetch("/inventory?facilityId=f1")

    if not data:
        st.error("⚠️ Backend is not running.")
        st.stop()

    status_filter = st.selectbox(
        "Filter by Status",
        ["All", "Out of Stock", "Low Quantity", "In Stock", "Active Orders"],
    )
    status_map = {
        "Out of Stock": "out_of_stock",
        "Low Quantity": "low_quantity",
        "In Stock": "in_stock",
        "Active Orders": "active_orders",
    }

    items = data["data"]
    if status_filter != "All":
        items = [i for i in items if i["status"] == status_map[status_filter]]

    table_data = []
    for inv in items:
        table_data.append({
            "Item": inv["item"]["name"],
            "Description": inv["item"]["description"],
            "Status": inv["status"].replace("_", " ").title(),
            "Qty": inv["quantityOnHand"],
            "Threshold": inv["reorderThreshold"],
            "Price": f"${inv['price']:.2f}",
            "Vendors": ", ".join(v["name"] for v in inv["vendors"]),
            "Auto-Rule": "✅" if inv.get("automationRule") else "—",
        })

    st.dataframe(table_data, use_container_width=True, hide_index=True)
    st.caption(f"Showing {len(table_data)} of {data['statusCounts']['all']} items")


elif page == "Orders":
    st.title("🛒 Orders")
    data = fetch("/orders?facilityId=f1")

    if not data:
        st.error("⚠️ Backend is not running.")
        st.stop()

    for order in data["data"]:
        with st.expander(
            f"Order {order['id'][:8]} — {order['status'].replace('_', ' ').title()} — ${order['total']:.2f}"
        ):
            col1, col2, col3 = st.columns(3)
            col1.markdown(f"**Vendor:** {order.get('vendor', {}).get('name', 'N/A')}")
            col2.markdown(f"**Shipping:** {order['shippingMethod']}")
            col3.markdown(f"**Created:** {order['createdAt'][:10]}")

            if order["trackingNumber"]:
                st.info(f"📍 Tracking: {order['trackingNumber']}")

            st.markdown("**Items:**")
            for item in order["items"]:
                item_name = item.get("item", {}).get("name", item["itemId"])
                st.markdown(f"- {item_name} × {item['quantity']} @ ${item['unitPrice']:.2f} = ${item['totalPrice']:.2f}")

            st.markdown(f"**Subtotal:** ${order['subtotal']:.2f} | **Tax:** ${order['tax']:.2f} | **Total:** ${order['total']:.2f}")


elif page == "Automations":
    st.title("⚡ Automation Rules")
    data = fetch("/automations?facilityId=f1")

    if not data:
        st.error("⚠️ Backend is not running.")
        st.stop()

    for rule in data["data"]:
        status = "🟢 Active" if rule["isActive"] else "🔴 Inactive"
        item_name = rule.get("item", {}).get("name", rule["itemId"])
        vendor_name = rule.get("vendor", {}).get("name", "Any") if rule.get("vendor") else "Any"

        with st.expander(f"{status} | {item_name} — {rule['ruleType'].title()}"):
            if rule["ruleType"] == "threshold":
                st.markdown(f"""
                - **Trigger when quantity ≤** {rule.get('triggerQuantity', 'N/A')}
                - **Reorder quantity:** {rule.get('reorderQuantity', 'N/A')}
                - **Preferred vendor:** {vendor_name}
                - **Auto-approve:** {'Yes' if rule.get('autoApprove') else 'No'}
                - **Max unit price:** ${rule.get('maxUnitPrice', 0):.2f}
                """)
            else:
                st.markdown(f"""
                - **Frequency:** {rule.get('frequency', 'N/A')}
                - **Next run:** {rule.get('nextRunDate', 'N/A')}
                - **Quantity:** {rule.get('quantity', 'N/A')}
                - **Preferred vendor:** {vendor_name}
                """)


elif page == "Budget":
    st.title("💰 Budget Overview")
    metrics = fetch("/dashboard/metrics")

    if not metrics:
        st.error("⚠️ Backend is not running.")
        st.stop()

    for b in metrics.get("budgets", []):
        st.subheader(f"{b['facility']} — {b['category']}")
        remaining = b["allocated"] - b["spent"]
        col1, col2, col3 = st.columns(3)
        col1.metric("Allocated", f"${b['allocated']:,.0f}")
        col2.metric("Spent", f"${b['spent']:,.0f}")
        col3.metric("Remaining", f"${remaining:,.0f}", delta=f"{-b['utilization']}%" if b["utilization"] > 80 else f"{100 - b['utilization']}% left")
        st.progress(b["utilization"] / 100)
        st.markdown("---")
