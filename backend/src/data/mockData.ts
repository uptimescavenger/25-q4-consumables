export interface Facility {
  id: string;
  name: string;
  address: string;
  type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  facilityId: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  paymentTerms: string;
}

export interface ConsumableItem {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  category: string;
  unitSize: number;
  sku: string;
}

export interface InventoryRecord {
  id: string;
  itemId: string;
  facilityId: string;
  quantityOnHand: number;
  reorderThreshold: number;
  maxStockLevel: number;
  price: number;
  status: "out_of_stock" | "low_quantity" | "in_stock" | "active_orders";
  reminderEnabled: boolean;
  lastRestockDate: string;
  vendorIds: string[];
}

export interface Order {
  id: string;
  facilityId: string;
  createdBy: string;
  vendorId: string;
  status: "draft" | "pending_approval" | "approved" | "ordered" | "shipped" | "delivered" | "cancelled";
  shippingMethod: string;
  trackingNumber: string | null;
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
  approvedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AutomationRule {
  id: string;
  facilityId: string;
  itemId: string;
  ruleType: "threshold" | "recurring";
  isActive: boolean;
  createdBy: string;
  triggerQuantity?: number;
  reorderQuantity?: number;
  preferredVendorId?: string;
  autoApprove?: boolean;
  maxUnitPrice?: number;
  frequency?: "daily" | "weekly" | "biweekly" | "monthly";
  nextRunDate?: string;
  quantity?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  facilityId: string;
  assignedTo: string;
  status: "todo" | "in_progress" | "overdue" | "completed";
  dueDate: string;
  category: string;
  frequency: string;
  subtaskCount: number;
  subtaskCompleted: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "low_stock" | "order_status" | "approval_needed" | "auto_order_triggered" | "budget_alert";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedOrderId?: string;
  relatedItemId?: string;
}

export interface Budget {
  id: string;
  facilityId: string;
  periodStart: string;
  periodEnd: string;
  allocatedAmount: number;
  spentAmount: number;
  category: string;
}

// --- Mock Data ---

export const facilities: Facility[] = [
  { id: "f1", name: "Uptime Business - Main", address: "123 Dental Ave, Munich", type: "Dental Clinic" },
  { id: "f2", name: "Facility at Laurel", address: "456 Laurel St, Portland", type: "Dental Clinic" },
  { id: "f3", name: "Dental clinic", address: "789 Oak Rd, Austin", type: "Dental Lab" },
];

export const users: User[] = [
  { id: "u1", name: "Iryna", email: "iryna@uptimebusiness.com", role: "admin", avatarUrl: "", facilityId: "f1" },
  { id: "u2", name: "Alex Chen", email: "alex@uptimebusiness.com", role: "manager", avatarUrl: "", facilityId: "f2" },
  { id: "u3", name: "Sam Rivera", email: "sam@uptimebusiness.com", role: "technician", avatarUrl: "", facilityId: "f1" },
];

export const vendors: Vendor[] = [
  { id: "v1", name: "Henry Schein", contactEmail: "orders@henryschein.com", phone: "800-555-0101", paymentTerms: "Net 30" },
  { id: "v2", name: "Patterson", contactEmail: "orders@patterson.com", phone: "800-555-0102", paymentTerms: "Net 30" },
  { id: "v3", name: "Benco", contactEmail: "orders@benco.com", phone: "800-555-0103", paymentTerms: "Net 45" },
  { id: "v4", name: "Darby", contactEmail: "orders@darby.com", phone: "800-555-0104", paymentTerms: "Net 30" },
  { id: "v5", name: "Midwest Dental", contactEmail: "orders@midwest.com", phone: "800-555-0105", paymentTerms: "Net 15" },
];

export const consumableItems: ConsumableItem[] = [
  { id: "i1", name: "Nitrile Gloves (Disposable)", description: "Powder-free protective gloves for hygiene and infection control. (100)", photoUrl: "/images/gloves.jpg", category: "PPE", unitSize: 100, sku: "NG-100" },
  { id: "i2", name: "Surgical / Procedural Masks", description: "Disposable masks to protect staff and patients. (50)", photoUrl: "/images/masks.jpg", category: "PPE", unitSize: 50, sku: "SM-50" },
  { id: "i3", name: "Cotton Rolls", description: "Absorb saliva and moisture during procedures. (100)", photoUrl: "/images/cotton.jpg", category: "Dental Supplies", unitSize: 100, sku: "CR-100" },
  { id: "i4", name: "Sterile Gauze Pads", description: "For bleeding control and wound care. (100)", photoUrl: "/images/gauze.jpg", category: "Dental Supplies", unitSize: 100, sku: "SGP-100" },
  { id: "i5", name: "Saliva Ejector & Suction Tips", description: "Disposable suction tips to remove fluids. (100)", photoUrl: "/images/suction.jpg", category: "Dental Supplies", unitSize: 100, sku: "SE-100" },
  { id: "i6", name: "Alginate Impression Material", description: "Powder for making preliminary dental impressions.", photoUrl: "/images/alginate.jpg", category: "Impression Materials", unitSize: 1, sku: "AIM-1" },
  { id: "i7", name: "Mixing Tips & Dispensing Tips", description: "Used for accurate material delivery (impression, composite).", photoUrl: "/images/tips.jpg", category: "Dental Supplies", unitSize: 1, sku: "MT-1" },
  { id: "i8", name: "Syringes & Needles (Disposable)", description: "Single-use syringes and anesthetic needles.", photoUrl: "/images/syringes.jpg", category: "Anesthesia", unitSize: 1, sku: "SN-1" },
  { id: "i9", name: "Sterilization Pouches", description: "Keeps sterilized instruments sterile until use. (100)", photoUrl: "/images/pouches.jpg", category: "Sterilization", unitSize: 100, sku: "SP-100" },
  { id: "i10", name: "Dental Bibs & Clips", description: "Patient protective bibs with clips or chain. (100)", photoUrl: "/images/bibs.jpg", category: "Patient Care", unitSize: 100, sku: "DBC-100" },
  { id: "i11", name: "Prophy Paste", description: "Prophylaxis paste for teeth cleaning and polishing.", photoUrl: "/images/prophy.jpg", category: "Preventive", unitSize: 200, sku: "PP-200" },
];

export const inventory: InventoryRecord[] = [
  { id: "inv1", itemId: "i1", facilityId: "f1", quantityOnHand: 0, reorderThreshold: 5, maxStockLevel: 50, price: 30.00, status: "out_of_stock", reminderEnabled: true, lastRestockDate: "2025-11-01", vendorIds: ["v1", "v2"] },
  { id: "inv2", itemId: "i2", facilityId: "f1", quantityOnHand: 0, reorderThreshold: 5, maxStockLevel: 40, price: 25.00, status: "out_of_stock", reminderEnabled: true, lastRestockDate: "2025-10-28", vendorIds: ["v2", "v3"] },
  { id: "inv3", itemId: "i3", facilityId: "f1", quantityOnHand: 0, reorderThreshold: 10, maxStockLevel: 100, price: 12.00, status: "out_of_stock", reminderEnabled: false, lastRestockDate: "2025-11-05", vendorIds: ["v1", "v5"] },
  { id: "inv4", itemId: "i4", facilityId: "f1", quantityOnHand: 2, reorderThreshold: 5, maxStockLevel: 50, price: 15.00, status: "low_quantity", reminderEnabled: false, lastRestockDate: "2025-11-10", vendorIds: ["v2", "v4"] },
  { id: "inv5", itemId: "i5", facilityId: "f1", quantityOnHand: 3, reorderThreshold: 5, maxStockLevel: 60, price: 20.00, status: "low_quantity", reminderEnabled: false, lastRestockDate: "2025-11-08", vendorIds: ["v3", "v2"] },
  { id: "inv6", itemId: "i6", facilityId: "f1", quantityOnHand: 4, reorderThreshold: 3, maxStockLevel: 20, price: 40.00, status: "low_quantity", reminderEnabled: false, lastRestockDate: "2025-10-20", vendorIds: ["v1", "v2"] },
  { id: "inv7", itemId: "i7", facilityId: "f1", quantityOnHand: 23, reorderThreshold: 5, maxStockLevel: 50, price: 25.00, status: "in_stock", reminderEnabled: false, lastRestockDate: "2025-11-15", vendorIds: ["v4", "v2"] },
  { id: "inv8", itemId: "i8", facilityId: "f1", quantityOnHand: 15, reorderThreshold: 5, maxStockLevel: 40, price: 35.00, status: "in_stock", reminderEnabled: false, lastRestockDate: "2025-11-12", vendorIds: ["v1", "v3"] },
  { id: "inv9", itemId: "i9", facilityId: "f1", quantityOnHand: 40, reorderThreshold: 10, maxStockLevel: 80, price: 30.00, status: "active_orders", reminderEnabled: false, lastRestockDate: "2025-11-18", vendorIds: ["v4", "v2"] },
  { id: "inv10", itemId: "i10", facilityId: "f1", quantityOnHand: 23, reorderThreshold: 5, maxStockLevel: 50, price: 25.00, status: "active_orders", reminderEnabled: false, lastRestockDate: "2025-11-20", vendorIds: ["v1", "v3"] },
  { id: "inv11", itemId: "i11", facilityId: "f1", quantityOnHand: 12, reorderThreshold: 5, maxStockLevel: 30, price: 18.00, status: "in_stock", reminderEnabled: false, lastRestockDate: "2025-11-22", vendorIds: ["v1", "v2"] },
];

export const orders: Order[] = [
  {
    id: "o1", facilityId: "f1", createdBy: "u1", vendorId: "v1",
    status: "shipped", shippingMethod: "Standard", trackingNumber: "1Z999AA10123456784",
    subtotal: 180.00, tax: 14.40, total: 194.40, notes: "Urgent restock",
    createdAt: "2025-12-01T10:00:00Z", approvedAt: "2025-12-01T11:00:00Z", deliveredAt: null,
    items: [
      { id: "oi1", orderId: "o1", itemId: "i1", vendorId: "v1", quantity: 3, unitPrice: 30.00, totalPrice: 90.00 },
      { id: "oi2", orderId: "o1", itemId: "i2", vendorId: "v1", quantity: 2, unitPrice: 25.00, totalPrice: 50.00 },
      { id: "oi3", orderId: "o1", itemId: "i3", vendorId: "v1", quantity: 5, unitPrice: 12.00, totalPrice: 60.00 },
    ],
  },
  {
    id: "o2", facilityId: "f1", createdBy: "u1", vendorId: "v2",
    status: "pending_approval", shippingMethod: "Express", trackingNumber: null,
    subtotal: 120.00, tax: 9.60, total: 129.60, notes: "Monthly restocking",
    createdAt: "2025-12-15T09:00:00Z", approvedAt: null, deliveredAt: null,
    items: [
      { id: "oi4", orderId: "o2", itemId: "i4", vendorId: "v2", quantity: 4, unitPrice: 15.00, totalPrice: 60.00 },
      { id: "oi5", orderId: "o2", itemId: "i5", vendorId: "v2", quantity: 3, unitPrice: 20.00, totalPrice: 60.00 },
    ],
  },
  {
    id: "o3", facilityId: "f1", createdBy: "u2", vendorId: "v3",
    status: "delivered", shippingMethod: "Standard", trackingNumber: "1Z999BB20123456785",
    subtotal: 250.00, tax: 20.00, total: 270.00, notes: "",
    createdAt: "2025-11-20T14:00:00Z", approvedAt: "2025-11-20T15:00:00Z", deliveredAt: "2025-11-25T10:00:00Z",
    items: [
      { id: "oi6", orderId: "o3", itemId: "i6", vendorId: "v3", quantity: 5, unitPrice: 40.00, totalPrice: 200.00 },
      { id: "oi7", orderId: "o3", itemId: "i7", vendorId: "v3", quantity: 2, unitPrice: 25.00, totalPrice: 50.00 },
    ],
  },
];

export const automationRules: AutomationRule[] = [
  { id: "ar1", facilityId: "f1", itemId: "i1", ruleType: "threshold", isActive: true, createdBy: "u1", triggerQuantity: 5, reorderQuantity: 20, preferredVendorId: "v1", autoApprove: true, maxUnitPrice: 35.00 },
  { id: "ar2", facilityId: "f1", itemId: "i2", ruleType: "threshold", isActive: true, createdBy: "u1", triggerQuantity: 5, reorderQuantity: 15, preferredVendorId: "v2", autoApprove: false, maxUnitPrice: 30.00 },
  { id: "ar3", facilityId: "f1", itemId: "i3", ruleType: "recurring", isActive: true, createdBy: "u1", frequency: "monthly", nextRunDate: "2026-01-01", quantity: 10, preferredVendorId: "v1", dayOfMonth: 1 },
  { id: "ar4", facilityId: "f1", itemId: "i9", ruleType: "recurring", isActive: false, createdBy: "u2", frequency: "biweekly", nextRunDate: "2026-01-15", quantity: 5, preferredVendorId: "v4" },
];

export const tasks: Task[] = [
  { id: "t1", title: "Copy Daily tasks", description: "Review and duplicate daily task list", facilityId: "f1", assignedTo: "u1", status: "todo", dueDate: "2025-12-29T17:49:00Z", category: "Other", frequency: "Daily", subtaskCount: 0, subtaskCompleted: 0 },
  { id: "t2", title: "Check sterilizer logs", description: "Verify all sterilizer cycle logs are complete", facilityId: "f1", assignedTo: "u3", status: "todo", dueDate: "2025-12-29T09:00:00Z", category: "Compliance", frequency: "Daily", subtaskCount: 3, subtaskCompleted: 1 },
  { id: "t3", title: "Restock operatory rooms", description: "Refill supplies in all operatory rooms", facilityId: "f1", assignedTo: "u3", status: "todo", dueDate: "2025-12-29T12:00:00Z", category: "Inventory", frequency: "Daily", subtaskCount: 5, subtaskCompleted: 0 },
  { id: "t4", title: "Inventory audit - PPE", description: "Full audit of PPE inventory counts", facilityId: "f1", assignedTo: "u1", status: "todo", dueDate: "2025-12-30T17:00:00Z", category: "Inventory", frequency: "Weekly", subtaskCount: 4, subtaskCompleted: 2 },
  { id: "t5", title: "Submit weekly order", description: "Review and submit the weekly consumables order", facilityId: "f1", assignedTo: "u1", status: "todo", dueDate: "2025-12-31T12:00:00Z", category: "Procurement", frequency: "Weekly", subtaskCount: 0, subtaskCompleted: 0 },
  { id: "t6", title: "6pm Daily task as regression. With sub tasks notes required. new time on10/3", description: "Daily regression task", facilityId: "f3", assignedTo: "u2", status: "overdue", dueDate: "2025-12-28T13:00:00Z", category: "Other", frequency: "Daily", subtaskCount: 2, subtaskCompleted: 0 },
  { id: "t7", title: "Review expired supplies", description: "Check and dispose of expired consumables", facilityId: "f1", assignedTo: "u3", status: "overdue", dueDate: "2025-12-27T09:00:00Z", category: "Compliance", frequency: "Weekly", subtaskCount: 0, subtaskCompleted: 0 },
  { id: "t8", title: "Update vendor contracts", description: "Review and update vendor pricing agreements", facilityId: "f1", assignedTo: "u1", status: "overdue", dueDate: "2025-12-26T17:00:00Z", category: "Procurement", frequency: "Monthly", subtaskCount: 0, subtaskCompleted: 0 },
  { id: "t9", title: "Calibrate autoclaves", description: "Monthly autoclave calibration check", facilityId: "f2", assignedTo: "u2", status: "overdue", dueDate: "2025-12-25T10:00:00Z", category: "Equipment", frequency: "Monthly", subtaskCount: 3, subtaskCompleted: 1 },
  { id: "t10", title: "Order approval backlog", description: "Clear pending order approvals", facilityId: "f1", assignedTo: "u1", status: "overdue", dueDate: "2025-12-24T15:00:00Z", category: "Procurement", frequency: "Daily", subtaskCount: 0, subtaskCompleted: 0 },
];

export const notifications: Notification[] = [
  { id: "n1", userId: "u1", type: "low_stock", title: "Low Stock Alert", message: "Nitrile Gloves (Disposable) is out of stock.", isRead: false, createdAt: "2025-12-20T08:00:00Z", relatedItemId: "i1" },
  { id: "n2", userId: "u1", type: "low_stock", title: "Low Stock Alert", message: "Surgical / Procedural Masks is out of stock.", isRead: false, createdAt: "2025-12-20T08:01:00Z", relatedItemId: "i2" },
  { id: "n3", userId: "u1", type: "auto_order_triggered", title: "Auto-Order Triggered", message: "Threshold rule triggered for Nitrile Gloves. Order #o1 created.", isRead: true, createdAt: "2025-12-01T10:00:00Z", relatedOrderId: "o1", relatedItemId: "i1" },
  { id: "n4", userId: "u1", type: "approval_needed", title: "Approval Needed", message: "Order #o2 requires your approval ($129.60).", isRead: false, createdAt: "2025-12-15T09:01:00Z", relatedOrderId: "o2" },
  { id: "n5", userId: "u1", type: "order_status", title: "Order Shipped", message: "Order #o1 has been shipped. Tracking: 1Z999AA10123456784", isRead: true, createdAt: "2025-12-05T14:00:00Z", relatedOrderId: "o1" },
  { id: "n6", userId: "u1", type: "budget_alert", title: "Budget Warning", message: "Q4 consumables budget is 85% spent ($4,250 of $5,000).", isRead: false, createdAt: "2025-12-18T09:00:00Z" },
];

export const budgets: Budget[] = [
  { id: "b1", facilityId: "f1", periodStart: "2025-10-01", periodEnd: "2025-12-31", allocatedAmount: 5000, spentAmount: 4250, category: "Consumables" },
  { id: "b2", facilityId: "f1", periodStart: "2025-10-01", periodEnd: "2025-12-31", allocatedAmount: 2000, spentAmount: 800, category: "Equipment Maintenance" },
  { id: "b3", facilityId: "f2", periodStart: "2025-10-01", periodEnd: "2025-12-31", allocatedAmount: 3500, spentAmount: 2100, category: "Consumables" },
];
