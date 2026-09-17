"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FolderClosed,
  Globe,
  HandCoins,
  HeartHandshake,
  ImagePlus,
  Inbox,
  LayoutGrid,
  MessageSquareText,
  MoreHorizontal,
  Package2,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { name: "Mon", orders: 12, sales: 420 },
  { name: "Tue", orders: 18, sales: 580 },
  { name: "Wed", orders: 14, sales: 530 },
  { name: "Thu", orders: 23, sales: 650 },
  { name: "Fri", orders: 29, sales: 900 },
  { name: "Sat", orders: 34, sales: 1100 },
  { name: "Sun", orders: 26, sales: 960 },
];

const categoryOptions = [
  { name: "Fashion", icon: Sparkles },
  { name: "Beauty", icon: HeartHandshake },
  { name: "Electronics", icon: Smartphone },
  { name: "Food", icon: ShoppingBag },
  { name: "Shoes", icon: Star },
  { name: "Cosmetics", icon: BriefcaseBusiness },
  { name: "Home", icon: FolderClosed },
  { name: "Other", icon: MoreHorizontal },
];

const productRows = [
  { name: "Black Dress", price: 350, cost: 220, stock: 14, category: "Fashion", sku: "FAS-BD-001", lowStockThreshold: 5, imageName: "" },
  { name: "White Shirt", price: 180, cost: 120, stock: 8, category: "Fashion", sku: "FAS-WS-002", lowStockThreshold: 5, imageName: "" },
  { name: "Blue Jeans", price: 250, cost: 170, stock: 5, category: "Fashion", sku: "FAS-BJ-003", lowStockThreshold: 5, imageName: "" },
  { name: "Sneakers", price: 420, cost: 270, stock: 12, category: "Shoes", sku: "SHO-SN-004", lowStockThreshold: 5, imageName: "" },
  { name: "Handbag", price: 420, cost: 260, stock: 3, category: "Beauty", sku: "BAG-HB-005", lowStockThreshold: 5, imageName: "" },
];

const productCategories = [
  { name: "Fashion", count: 42 },
  { name: "Shoes", count: 18 },
  { name: "Bags", count: 12 },
  { name: "Accessories", count: 9 },
];

const customers = [
  { name: "Michael", phone: "+233 24 XXX XXXX", orders: 8, spent: 3420 },
  { name: "Sandra", phone: "+233 24 XXX XXXX", orders: 5, spent: 1980 },
  { name: "Kwame", phone: "+233 55 XXX XXXX", orders: 3, spent: 1250 },
];

const recentOrders = [
  { id: "#1047", customer: "Michael", total: 380, status: "PAID" },
  { id: "#1046", customer: "Sandra", total: 520, status: "PAID" },
  { id: "#1045", customer: "Kwame", total: 250, status: "PENDING" },
];

const lowStockItems = [
  { name: "Blue Jeans", qty: 5 },
  { name: "Handbag", qty: 3 },
  { name: "Hoodie", qty: 2 },
];

const profitData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 700 },
  { name: "Mar", value: 520 },
  { name: "Apr", value: 900 },
  { name: "May", value: 760 },
  { name: "Jun", value: 1200 },
];

const productMix = [
  { name: "Fashion", value: 46 },
  { name: "Beauty", value: 27 },
  { name: "Home", value: 17 },
  { name: "Electronics", value: 10 },
];

const navItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Products", icon: Package2 },
  { label: "Customers", icon: Users },
  { label: "Orders", icon: ShoppingBag },
  { label: "Inventory", icon: Inbox },
  { label: "Payments", icon: CreditCard },
  { label: "Expenses", icon: Wallet },
  { label: "Analytics", icon: TrendingUp },
  { label: "Settings", icon: Settings },
];

const featureList = [
  "Know what is on the shelf",
  "Keep WhatsApp orders together",
  "Record MoMo and cash payments",
  "See which customers come back",
  "Close the day with confidence",
];

const statCards = [
  { label: "Today's Sales", value: "GH₵4,850", change: "+12%" },
  { label: "Orders", value: "23", change: "+8%" },
  { label: "Pending Payments", value: "GH₵730", change: "-5%" },
  { label: "Estimated Profit", value: "GH₵1,430", change: "+15%" },
];

const inventoryRows = [
  { name: "Black Dress", stock: 14, status: "In Stock" },
  { name: "White Shirt", stock: 8, status: "In Stock" },
  { name: "Blue Jeans", stock: 5, status: "Low Stock" },
  { name: "Sneakers", stock: 12, status: "In Stock" },
  { name: "Handbag", stock: 3, status: "Low Stock" },
];

const expenseRows = [
  { category: "Packaging", amount: 130 },
  { category: "Transport", amount: 50 },
  { category: "Advertising", amount: 200 },
  { category: "Rent", amount: 500 },
];

const paymentRows = [
  { reference: "#1047", customer: "Michael", method: "MoMo", amount: 380, status: "Paid" },
  { reference: "#1046", customer: "Sandra", method: "Card", amount: 520, status: "Paid" },
  { reference: "#1045", customer: "Kwame", method: "MoMo", amount: 250, status: "Pending" },
];

const initialNotifications = [
  { id: 1, title: "Payment received", detail: "Michael paid GH₵380 for order #1047.", time: "12 min ago", read: false },
  { id: 2, title: "Stock is running low", detail: "Handbag has only 3 items left.", time: "1 hour ago", read: false },
  { id: 3, title: "New WhatsApp order", detail: "Sandra started a new conversation.", time: "Yesterday", read: true },
];

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DELIVERED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELED: "bg-red-100 text-red-700",
    "PAYMENT UNSUCCESSFUL": "bg-red-100 text-red-700",
    REFUNDED: "bg-purple-100 text-purple-700",
    PAID: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function Currency({ amount }: { amount: number }) {
  return <>{`GH₵${amount.toLocaleString()}`}</>;
}

function LogoMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 shadow-sm shadow-teal-900/20">
      <BriefcaseBusiness className="h-5 w-5 text-white" />
    </div>
  );
}

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-6 flex items-center gap-2">
    {Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        className={`h-2 flex-1 rounded-full ${index + 1 <= current ? "bg-blue-600" : "bg-slate-200"}`}
      />
    ))}
  </div>
);

type Screen =
  | "welcome"
  | "login"
  | "register"
  | "business"
  | "category"
  | "product"
  | "dashboard"
  | "products"
  | "inventory"
  | "customers"
  | "analytics"
  | "expenses"
  | "payments"
  | "settings"
  | "orders";

type ProductFilter = "All" | "In Stock" | "Low Stock" | "Out of Stock";
type ProductView = "all" | "catalogs" | "import";

type SettingsState = {
  businessName: string;
  category: string;
  region: string;
  city: string;
  openingTime: string;
  closingTime: string;
  daysOpen: string;
  logoName: string;
  fullName: string;
  phone: string;
  defaultOrderStatus: string;
  receiptPreference: string;
  orderSource: string;
  currency: string;
  settlementAccount: string;
  paymentReference: string;
  momo: string;
  card: string;
  bankTransfer: string;
  newOrderAlerts: string;
  orderStatusChanges: string;
  paymentReceived: string;
  pendingPaymentReminders: string;
  alertThreshold: string;
  alertFrequency: string;
};

const initialSettings: SettingsState = {
  businessName: "Ama Fashion",
  category: "Fashion",
  region: "Greater Accra",
  city: "Accra",
  openingTime: "8:00 AM",
  closingTime: "6:00 PM",
  daysOpen: "Monday to Saturday",
  logoName: "Ama Fashion logo",
  fullName: "Ama",
  phone: "+233 24 000 0000",
  defaultOrderStatus: "Pending",
  receiptPreference: "WhatsApp receipt",
  orderSource: "WhatsApp and shop",
  currency: "GHS",
  settlementAccount: "MoMo wallet",
  paymentReference: "Order number",
  momo: "Enabled",
  card: "Enabled",
  bankTransfer: "Setup",
  newOrderAlerts: "On",
  orderStatusChanges: "On",
  paymentReceived: "On",
  pendingPaymentReminders: "On",
  alertThreshold: "5 items",
  alertFrequency: "Daily",
};

const salesTooltipFormatter = (value: number | string | ReadonlyArray<number | string> | undefined) => {
  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
  return [`GH₵${numericValue}`, "Sales"] as [string, string];
};

function SearchSortBar({
  placeholder,
  value,
  onChange,
  sort,
  onSortChange,
  sortOptions = ["Newest", "Oldest", "Name A-Z"],
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions?: string[];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          placeholder={placeholder}
        />
        {value ? (
          <button type="button" onClick={() => onChange("")} className="absolute right-2 top-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Clear ${placeholder.toLowerCase()}`}>
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500">
        <span>Sort by</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="bg-transparent py-2.5 font-medium text-slate-800 outline-none">
          {sortOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
    </div>
  );
}

type ActionPanelState = {
  title: string;
  description: string;
  primaryLabel: string;
  fields?: string[];
  selectOptions?: Record<string, string[]>;
  initialValues?: Record<string, string>;
  onSubmit?: (values: Record<string, string>) => void;
};

function ActionPanel({
  action,
  onClose,
  customerRows,
  products,
  catalogs,
}: {
  action: ActionPanelState;
  onClose: () => void;
  customerRows: typeof customers;
  products: typeof productRows;
  catalogs: { id: string; name: string; description: string }[];
}) {
  const [values, setValues] = useState<Record<string, string>>(action.initialValues ?? {});
  const optionsFor = (field: string) => {
    if (field === "Category") {
      return catalogs.map((catalog) => catalog.name);
}
    if (field === "Product category") {
  return ["All", ...catalogs.map((catalog) => catalog.name)];
}
    if (field === "Product") {
      return products.map((product) => product.name);
}
    if (field === "Customer") {
  return customerRows.map((customer) => customer.name);
}
    if (field === "Payment status") {
      return ["Paid", "Pending", "Unpaid"];
    }
    if (field === "Reason") {
      return ["Stock received", "Sale correction", "Damaged item", "Count adjustment"];
    }
    if (field === "Expense category") {
      return ["Packaging", "Transport", "Advertising", "Rent", "Utilities", "Other"];
    }
    if (field === "Region") {
      return ["Greater Accra", "Ashanti", "Eastern", "Western", "Central", "Northern"];
    }
    if (["Opening time", "Closing time"].includes(field)) {
      return ["7:00 AM", "8:00 AM", "9:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"];
    }
    if (field === "Days open") {
      return ["Monday to Friday", "Monday to Saturday", "Every day"];
    }
    if (["MoMo", "Card", "Bank transfer"].includes(field)) {
      return ["Enabled", "Disabled", "Setup"];
    }
    if (["New order alerts", "Order status changes", "Payment received", "Pending payment reminders"].includes(field)) {
      return ["On", "Off"];
    }
    if (field === "Default order status") {
      return ["Pending", "Paid", "Processing"];
    }
    if (field === "Receipt preference") {
      return ["WhatsApp receipt", "Printed receipt", "No receipt"];
    }
    if (field === "Order source") {
      return ["WhatsApp and shop", "WhatsApp only", "Shop only"];
    }
    if (field === "Currency") {
      return ["GHS", "USD", "NGN"];
    }
    if (field === "Payment reference") {
      return ["Order number", "Customer name", "Manual reference"];
    }
    if (field === "Alert threshold") {
      return ["1 item", "5 items", "10 items", "20 items"];
    }
    if (field === "Alert frequency") {
      return ["Immediately", "Daily", "Weekly"];
    }
    return null;
  };

  const isProductImage = ["Add a product", "Quick add", "Edit product"].includes(action.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" role="presentation" onMouseDown={onClose} onTouchStart={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="action-panel-title" onMouseDown={(event) => event.stopPropagation()} onTouchStart={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="action-panel-title" className="text-xl font-bold text-slate-900">{action.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{action.description}</p>
          </div>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close dialog">
            X
          </button>
        </div>

        {action.fields ? (
          <div className="mt-5 space-y-3">
            {isProductImage ? (
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 hover:border-teal-600 hover:bg-teal-50">
                <ImagePlus className="h-6 w-6 text-teal-700" />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{values.imageName || "Choose product image"}</span>
                  <span className="block text-xs text-slate-500">PNG or JPG</span>
                </span>
                <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setValues((current) => ({ ...current, imageName: event.target.files?.[0]?.name ?? "" }))} />
              </label>
            ) : null}
            {action.fields.map((field) => (
              <label key={field} className="block text-sm font-medium text-slate-700">
                {field}
                {field === "Products" ? (
                  <textarea value={values[field] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-1.5 min-h-32 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" placeholder="Product name, category, selling price, cost price, stock, SKU, threshold\nExample: Red Shirt, Fashion, 200, 120, 10, FAS-RS-001, 3" />
                ) : (action.selectOptions?.[field] ?? optionsFor(field)) ? (
                    <select value={values[field] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
                    <option value="" disabled>Select {field.toLowerCase()}</option>
                    {(action.selectOptions?.[field] ?? optionsFor(field))?.map((option) => <option key={option}>{option}</option>)}
                  </select>
                ) : (
                  <input value={values[field] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" placeholder={field} />
                )}
              </label>
            ))}
          </div>
        ) : null}

        {action.title === "Business logo" ? (
          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center hover:border-teal-600 hover:bg-teal-50">
            <ImagePlus className="h-8 w-8 text-teal-700" />
            <span className="mt-2 text-sm font-semibold text-slate-800">Choose a logo image</span>
            <span className="mt-1 text-xs text-slate-500">PNG or JPG</span>
            <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setValues((current) => ({ ...current, logoName: event.target.files?.[0]?.name ?? "" }))} />
          </label>
        ) : null}

        {action.title === "Create an order" ? (() => {
          const selectedProduct = productRows.find((product) => product.name === values.Product);
          const orderTotal = (selectedProduct?.price ?? 0) * Math.max(1, Number(values.Quantity || 1)) + Number(values["Delivery fee"] || 0);
          return <div className="mt-5 flex items-center justify-between rounded-lg bg-teal-50 px-4 py-3"><span className="text-sm font-medium text-teal-800">Order total</span><strong className="text-lg text-teal-900">GH₵{orderTotal.toLocaleString()}</strong></div>;
        })() : null}

        {action.title === "Delete product" ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <div className="font-semibold text-rose-900">{action.description}</div>
            <div className="mt-1 text-sm text-rose-700">This action cannot be undone.</div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={() => { action.onSubmit?.(values); onClose(); }} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
            {action.primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BusinessOsApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Fashion");
  const [selectedNav, setSelectedNav] = useState("Dashboard");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [actionPanel, setActionPanel] = useState<ActionPanelState | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productFilter, setProductFilter] = useState<ProductFilter>("All");
  const [productCategory, setProductCategory] = useState("All");
  const [productView, setProductView] = useState<ProductView>("all");
  const [salesRange, setSalesRange] = useState("This Month");
  const [selectedImage, setSelectedImage] = useState("");
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [workspaceSort, setWorkspaceSort] = useState("Newest");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [products, setProducts] = useState(productRows);
  const [customerRows, setCustomerRows] = useState(customers);
  const [orderRows, setOrderRows] = useState(recentOrders);
  const [expenseItems, setExpenseItems] = useState(expenseRows);
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const productMenuRef = useRef<HTMLDivElement>(null);
const [selectedOrder, setSelectedOrder] = useState<typeof orderRows[number] | null>(null);
const [catalogs, setCatalogs] = useState([
  { id: "catalog-1", name: "Fashion", description: "" },
  { id: "catalog-2", name: "Shoes", description: "" },
]);


  useEffect(() => {
    const closeMenusOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!notificationMenuRef.current?.contains(target)) {
        setShowNotifications(false);
      }
      if (!productMenuRef.current?.contains(target)) {
        setShowProductMenu(false);
      }
    };

    document.addEventListener("pointerdown", closeMenusOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeMenusOnOutsidePointer);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date());
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const goToDashboard = () => {
    setSelectedNav("Dashboard");
    setScreen("dashboard");
  };

  const navigateTo = (target: Screen, label: string) => {
    setSelectedNav(label);
    setScreen(target);
    setWorkspaceSearch("");
  };

  const handleActionSubmit = (action: ActionPanelState, values: Record<string, string>) => {
    if (action.title === "Business profile") {
      setSettings((current) => ({ ...current, businessName: values["Business name"] || current.businessName, category: values.Category || current.category, region: values.Region || current.region, city: values.City || current.city }));
    }
    if (action.title === "Business hours") {
      setSettings((current) => ({ ...current, openingTime: values["Opening time"] || current.openingTime, closingTime: values["Closing time"] || current.closingTime, daysOpen: values["Days open"] || current.daysOpen }));
    }
    if (action.title === "Your profile") {
      setSettings((current) => ({ ...current, fullName: values["Full name"] || current.fullName, phone: values["Phone or email"] || current.phone }));
    }
    if (action.title === "Order settings") {
      setSettings((current) => ({ ...current, defaultOrderStatus: values["Default order status"] || current.defaultOrderStatus, receiptPreference: values["Receipt preference"] || current.receiptPreference, orderSource: values["Order source"] || current.orderSource }));
    }
    if (action.title === "Payment methods") {
      setSettings((current) => ({ ...current, momo: values.MoMo || current.momo, card: values.Card || current.card, bankTransfer: values["Bank transfer"] || current.bankTransfer }));
    }
    if (action.title === "Payment configuration") {
      setSettings((current) => ({ ...current, currency: values.Currency || current.currency, settlementAccount: values["Settlement account"] || current.settlementAccount, paymentReference: values["Payment reference"] || current.paymentReference }));
    }
    if (action.title === "Order notifications") {
      setSettings((current) => ({ ...current, newOrderAlerts: values["New order alerts"] || current.newOrderAlerts, orderStatusChanges: values["Order status changes"] || current.orderStatusChanges }));
    }
    if (action.title === "Payment notifications") {
      setSettings((current) => ({ ...current, paymentReceived: values["Payment received"] || current.paymentReceived, pendingPaymentReminders: values["Pending payment reminders"] || current.pendingPaymentReminders }));
    }
    if (action.title === "Low stock alerts") {
      setSettings((current) => ({ ...current, alertThreshold: values["Alert threshold"] || current.alertThreshold, alertFrequency: values["Alert frequency"] || current.alertFrequency }));
    }
    if (action.title === "Business logo" && values.logoName) {
      setSettings((current) => ({ ...current, logoName: values.logoName }));
    }
    if (action.title === "Add a catalog") {
  const catalogName = values["Catalog name"]?.trim();

  if (catalogName) {
    setCatalogs((items) => [
      ...items,
      {
        id: `catalog-${Date.now()}`,
        name: catalogName,
        description: values.Description?.trim() || "",
      },
    ]);
  }
}
    if (action.title === "Add a product" || action.title === "Quick add") {
      const price = Number(values["Selling price"]?.replace(/[^0-9.]/g, "") || 0);
      setProducts((items) => [...items, {
        name: values["Product name"] || "New product",
        price,
        cost: Number(values["Cost price"]?.replace(/[^0-9.]/g, "") || 0),
        stock: Number(values.Stock || 0),
        category: values.Category || "Other",
        sku: values.SKU || `SKU-${items.length + 1}`,
        lowStockThreshold: Number(values["Low-stock threshold"] || 5),
        imageName: values.imageName || "",
      }]);
    }
    if (action.title === "Bulk add") {
      const imported = (values.Products || "").split(/\r?\n/).map((row) => row.split(",").map((value) => value.trim())).filter((row) => row[0]).map(([name, category, price, cost, stock, sku, threshold], index) => ({
        name,
        category: category || "Other",
        price: Number(price || 0),
        cost: Number(cost || 0),
        stock: Number(stock || 0),
        sku: sku || `BULK-${index + 1}`,
        lowStockThreshold: Number(threshold || 5),
        imageName: "",
      }));
      setProducts((items) => [...items, ...imported]);
    }
    if (action.title === "Duplicate product") {
      const source = products.find((product) => product.name === values.Product);
      if (source) setProducts((items) => [...items, {
        ...source,
        name: values["Product name"] || `${source.name} Copy`,
        price: Number(values["Selling price"] || source.price),
        cost: Number(values["Cost price"] || source.cost),
        stock: Number(values.Stock || source.stock),
        category: values.Category || source.category,
        sku: values.SKU || `${source.sku}-COPY`,
        lowStockThreshold: Number(values["Low-stock threshold"] || source.lowStockThreshold),
      }]);
    }
    if (action.title === "Delete product") {
      const productName = action.description.replace(/^Delete /, "").replace(/\?$/, "");
      setProducts((items) => items.filter((product) => product.name !== productName));
    }
    if (action.title === "Edit product") {
      const productName = action.description.replace(" is selected.", "");
      setProducts((items) => items.map((item) => item.name === productName ? {
        ...item,
        name: values["Product name"] || item.name,
        category: values.Category || item.category,
        price: Number(values["Selling price"] || item.price),
        cost: Number(values["Cost price"] || item.cost),
        stock: Number(values.Stock || item.stock),
        sku: values.SKU || item.sku,
        lowStockThreshold: Number(values["Low-stock threshold"] || item.lowStockThreshold),
        imageName: values.imageName || item.imageName,
      } : item));
    }
    if (action.title === "Add a customer") {
      setCustomerRows((items) => [...items, { name: values.Name || "New customer", phone: values["Phone number"] || "", orders: 0, spent: 0 }]);
    }
    if (action.title === "Edit customer") {
      const customerName = action.description.replace(" is selected.", "");
      setCustomerRows((items) => items.map((item) => item.name === customerName ? { ...item, name: values.Name || item.name, phone: values["Phone number"] || item.phone } : item));
    }
    if (action.title === "Add an expense") {
      setExpenseItems((items) => [...items, { category: values["Expense category"] || "Other", amount: Number(values.Amount || 0) }]);
    }
    if (action.title === "Edit expense") {
      const category = action.description.replace(" is selected.", "");
      setExpenseItems((items) => items.map((item) => item.category === category ? { ...item, category: values["Expense category"] || item.category, amount: Number(values.Amount || item.amount) } : item));
    }
    if (action.title === "Delete expense") {
      const category = action.description.replace(" is selected.", "");
      setExpenseItems((items) => items.filter((item) => item.category !== category));
    }
    if (action.title === "Create an order") {
      const product = products.find((item) => item.name === values.Product);
      const quantity = Math.max(1, Number(values.Quantity || 1));
      const deliveryFee = Number(values["Delivery fee"] || 0);
      const total = (product?.price ?? 0) * quantity + deliveryFee;
      const status = values["Payment status"] === "Paid" ? "PAID" : "PENDING";
      setOrderRows((items) => [...items, { id: `#${1048 + items.length}`, customer: values.Customer || "New customer", total, status }]);
      if (product && status === "PAID") {
        setProducts((items) => items.map((item) => item.name === product.name ? { ...item, stock: Math.max(0, item.stock - quantity) } : item));
      }
    }
    if (action.title === "Adjust stock") {
      const adjustment = Number(values["Quantity change"] || 0);
      setProducts((items) => items.map((item) => item.name === values.Product ? { ...item, stock: Math.max(0, item.stock + adjustment) } : item));
    }
    if (action.title === "Change order status") {
  const orderId = action.description.replace(" is selected.", "");
  const nextStatus = values["Order status"];

  setOrderRows((items) =>
    items.map((item) =>
      item.id === orderId
        ? { ...item, status: nextStatus }
        : item));
    }
  };

  const openActionPanel = (action: ActionPanelState) => {
    const selectedProductName = action.description.replace(" is selected.", "");
    const selectedProduct = products.find((product) => product.name === selectedProductName);
    const initialValuesByTitle: Record<string, Record<string, string>> = {
      "Edit product": selectedProduct ? {
        imageName: selectedProduct.imageName,
        "Product name": selectedProduct.name,
        Category: selectedProduct.category,
        "Selling price": String(selectedProduct.price),
        "Cost price": String(selectedProduct.cost),
        Stock: String(selectedProduct.stock),
        SKU: selectedProduct.sku,
        "Low-stock threshold": String(selectedProduct.lowStockThreshold),
      } : {},
      "Business profile": { "Business name": settings.businessName, Category: settings.category, Region: settings.region, City: settings.city },
      "Business hours": { "Opening time": settings.openingTime, "Closing time": settings.closingTime, "Days open": settings.daysOpen },
      "Your profile": { "Full name": settings.fullName, "Phone or email": settings.phone },
      "Order settings": { "Default order status": settings.defaultOrderStatus, "Receipt preference": settings.receiptPreference, "Order source": settings.orderSource },
      "Payment methods": { MoMo: settings.momo, Card: settings.card, "Bank transfer": settings.bankTransfer },
      "Payment configuration": { Currency: settings.currency, "Settlement account": settings.settlementAccount, "Payment reference": settings.paymentReference },
      "Order notifications": { "New order alerts": settings.newOrderAlerts, "Order status changes": settings.orderStatusChanges },
      "Payment notifications": { "Payment received": settings.paymentReceived, "Pending payment reminders": settings.pendingPaymentReminders },
      "Low stock alerts": { "Alert threshold": settings.alertThreshold, "Alert frequency": settings.alertFrequency },
    };
    setActionPanel({ ...action, initialValues: initialValuesByTitle[action.title], onSubmit: (values) => handleActionSubmit(action, values) });
  };

  const importProductsFromCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const rows = (await file.text()).trim().split(/\r?\n/).slice(1);
    const imported = rows.map((row) => row.split(",")).map(([name, price, cost, stock, category]) => ({
      name: name?.trim(),
      price: Number(price?.replace(/[^0-9.]/g, "") || 0),
      cost: Number(cost?.replace(/[^0-9.]/g, "") || 0),
      stock: Number(stock || 0),
      category: category?.trim() || "Other",
      sku: `IMP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      lowStockThreshold: 5,
      imageName: "",
    })).filter((product) => product.name);
    setProducts((items) => [...items, ...imported]);
    setSelectedImage(file.name);
  };

  const visibleProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategory === "All" || product.category === productCategory;
    const matchesFilter =
      productFilter === "All" ||
      (productFilter === "In Stock" && product.stock > product.lowStockThreshold) ||
      (productFilter === "Low Stock" && product.stock <= product.lowStockThreshold) ||
      (productFilter === "Out of Stock" && product.stock === 0);
    return matchesSearch && matchesCategory && matchesFilter;
  });
  const paidOrders = orderRows.filter((order) => order.status === "PAID");
  const pendingOrders = orderRows.filter((order) => order.status !== "PAID");
  const totalSales = paidOrders.reduce((total, order) => total + order.total, 0);
  const pendingPayments = pendingOrders.reduce((total, order) => total + order.total, 0);
  const totalExpenses = expenseItems.reduce((total, expense) => total + expense.amount, 0);
  const estimatedProfit = totalSales - totalExpenses;
  const dashboardStats = [
    { label: "Today's Sales", value: `GH₵${totalSales.toLocaleString()}`, change: "+12%" },
    { label: "Orders", value: String(orderRows.length), change: "+8%" },
    { label: "Pending Payments", value: `GH₵${pendingPayments.toLocaleString()}`, change: "-5%" },
    { label: "Estimated Profit", value: `GH₵${estimatedProfit.toLocaleString()}`, change: "+15%" },
  ];
  const liveLowStockItems = products.filter((product) => product.stock <= product.lowStockThreshold).map((product) => ({ name: product.name, qty: product.stock }));
  const liveSalesData = salesData.map((day) => ({ ...day, sales: totalSales ? Math.round((day.sales / 5040) * totalSales) : 0 }));
  const filteredCustomers = customerRows.filter((customer) => `${customer.name} ${customer.phone}`.toLowerCase().includes(workspaceSearch.toLowerCase()));
  const filteredExpenses = expenseItems.filter((expense) => expense.category.toLowerCase().includes(workspaceSearch.toLowerCase()));
  const filteredOrders = orderRows.filter((order) => `${order.id} ${order.customer} ${order.status}`.toLowerCase().includes(workspaceSearch.toLowerCase()));

  const appContent = (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px]">
        {screen !== "welcome" && screen !== "login" && screen !== "register" && screen !== "business" && screen !== "category" && screen !== "product" ? (
          <div className="flex min-h-screen">
            <aside className="flex w-64 shrink-0 border-r border-slate-200 bg-white">
              <div className="flex min-h-screen w-full flex-col">
              <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                <LogoMark />
                <div>
                  <div className="text-lg font-semibold text-slate-900">Business OS</div>
                  <div className="text-xs text-slate-500">A calmer way to run the shop.</div>
                </div>
              </div>

              <nav className="flex-1 space-y-6 px-4 py-5">
                {[
                  { heading: "MAIN", items: navItems.slice(0, 5) },
                  { heading: "BUSINESS", items: navItems.slice(5, 8) },
                  { heading: "SYSTEM", items: navItems.slice(8, 9) },
                ].map(({ heading, items }) => (
                  <div key={heading}>
                    <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">{heading}</div>
                    <div className="space-y-1">
                      {items.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          onClick={() => {
                            setSelectedNav(label);
                            setScreen(
                              label === "Dashboard"
                                ? "dashboard"
                                : label === "Products"
                                  ? "products"
                                  : label === "Orders"
                                    ? "orders"
                                    : label === "Customers"
                                      ? "customers"
                                      : label === "Inventory"
                                        ? "inventory"
                                        : label === "Analytics"
                                            ? "analytics"
                                            : label === "Payments"
                                              ? "payments"
                                              : label === "Expenses"
                                                ? "expenses"
                                                : "settings"
                            );
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                            selectedNav === label
                              ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div ref={productMenuRef} className="relative border-t border-slate-200 pt-5">
                  <button
                    onClick={() => setShowProductMenu((value) => !value)}
                    className="flex w-full items-center justify-between rounded-xl bg-teal-700 px-3 py-2.5 text-left text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                    aria-expanded={showProductMenu}
                  >
                    <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add Products</span>
                    <ChevronDown className={`h-4 w-4 transition ${showProductMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showProductMenu ? (
                    <div className="mt-2 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <button onClick={() => {
  setSelectedCatalog(null);

  openActionPanel({
    title: "Quick add",
    description: "Add a new product to your catalog.",
    primaryLabel: "Save product",
    fields: [
      "Product name",
      "Catalog",
      "Selling price",
      "Cost price",
      "Stock",
      "SKU",
      "Low-stock threshold",
    ],
  });
}} className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-white">Quick Add</button>
                      <button onClick={() => { setSelectedNav("Products"); setScreen("products"); setProductView("import"); setShowProductMenu(false); }} className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-white">Import CSV / Excel</button>
                      <button onClick={() => openActionPanel({ title: "Add from photos", description: "Choose product photos to prepare a new listing.", primaryLabel: "Choose photos" })} className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-white">Add from Photos</button>
                      <button onClick={() => openActionPanel({ title: "Duplicate product", description: "Create a copy of an existing product and give it a new name.", primaryLabel: "Duplicate product", fields: ["Product", "New product name"], selectOptions: { Product: products.map((product) => product.name) } })} className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-white">Duplicate Product</button>
                    </div>
                  ) : null}
                </div>
              </nav>

              <div className="border-t border-slate-200 p-4">
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                    <DollarSign className="h-4 w-4" />
                    Revenue
                  </div>
                  <div className="mt-3 text-2xl font-bold">GH₵ 132.4K</div>
                  <div className="mt-2 text-xs text-emerald-300">+18.2% this month</div>
                </div>
              </div>
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Today at</div>
                      <div className="text-lg font-semibold text-slate-900">Ama Fashion</div>
                    </div>
                  </div>

                  <div className="hidden items-center gap-3 md:flex">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-900">WhatsApp</span> ready
                    </div>
                    <div ref={notificationMenuRef} className="relative">
                      <button onClick={() => setShowNotifications((value) => !value)} className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600" aria-label="Notifications" aria-expanded={showNotifications}>
                        <Bell className="h-4 w-4" />
                        {notifications.some((notification) => !notification.read) ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /> : null}
                      </button>
                      {showNotifications ? (
                        <div className="absolute right-0 top-full z-40 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                            <div>
                              <div className="font-semibold text-slate-900">Notifications</div>
                              <div className="text-xs text-slate-500">{notifications.filter((notification) => !notification.read).length} unread</div>
                            </div>
                            <button onClick={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))} className="text-xs font-semibold text-teal-700 hover:text-teal-900">Mark all read</button>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length ? notifications.map((notification) => (
                              <div key={notification.id} className={`flex gap-3 border-b border-slate-100 px-4 py-3 ${notification.read ? "bg-white" : "bg-teal-50/60"}`}>
                                <button onClick={() => setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read: !item.read } : item))} className="min-w-0 flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    {!notification.read ? <span className="h-2 w-2 rounded-full bg-teal-600" /> : null}
                                    <span className="text-sm font-semibold text-slate-900">{notification.title}</span>
                                  </div>
                                  <div className="mt-1 text-xs leading-5 text-slate-600">{notification.detail}</div>
                                  <div className="mt-1 text-[11px] text-slate-400">{notification.time} · {notification.read ? "Mark unread" : "Mark read"}</div>
                                </button>
                                <button onClick={() => setNotifications((items) => items.filter((item) => item.id !== notification.id))} className="h-fit rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Remove ${notification.title}`}>
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )) : <div className="px-4 py-8 text-center text-sm text-slate-500">You are all caught up.</div>}
                          </div>
                          <div className="border-t border-slate-200 p-3">
                            <button onClick={() => openActionPanel({ title: "Notification settings", description: "Choose which updates you want to receive from BizOs.", primaryLabel: "Save settings", fields: ["Order updates", "Payment updates", "Stock alerts"] })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Notification settings</button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d97757] text-sm font-semibold text-white">
                        A
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Ama</div>
                        <div className="text-xs text-slate-500">Merchant</div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <main className="p-4 sm:p-6 lg:p-8">
                {screen === "dashboard" && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-slate-500">
  {currentTime
    ? currentTime.toLocaleDateString("en-GH", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Accra",
      })
    : "Loading..."}
</div>

<div className="mt-1 text-sm font-medium text-slate-500">
  {currentTime
    ? currentTime.toLocaleTimeString("en-GH", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Africa/Accra",
      })
    : "--:--:--"}
</div>
                      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        A clear view of the work waiting for you today.
                      </h1>
                      <button
  onClick={() =>
    openActionPanel({
      title: "Create an order",
      description:
        "Select a customer, product, quantity, and delivery fee. The total is calculated when you save.",
      primaryLabel: "Save order",
      fields: [
        "Customer",
        "Product",
        "Quantity",
        "Delivery fee",
        "Payment status",
      ],
    })
  }
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
>
  <Plus className="h-5 w-5" />
  New Order
</button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {dashboardStats.map((card) => (
                        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="text-sm text-slate-500">{card.label}</div>
                          <div className="mt-4 flex items-end justify-between">
                            <div className="text-3xl font-bold text-slate-900">{card.value}</div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                card.change.startsWith("+") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {card.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-slate-500">Sales this month</div>
                            <div className="mt-1 text-2xl font-bold text-slate-900">GH₵ 18,420</div>
                          </div>
                          <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                            {[
                              { label: "7D" },
                              { label: "30D" },
                              { label: "This Month", active: true },
                            ].map((item) => (
                              <button
                                key={item.label}
                                onClick={() => setSalesRange(item.label)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                  salesRange === item.label ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={liveSalesData}>
                              <defs>
                                <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                              <Tooltip formatter={salesTooltipFormatter} />
                              <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fill="url(#salesFill)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-slate-500">Recent Orders</div>
                            <div className="mt-1 text-xl font-bold text-slate-900">What just came in</div>
                          </div>
                          <button onClick={() => navigateTo("orders", "Orders")} className="text-sm font-medium text-blue-600">View all</button>
                        </div>

                        <div className="mt-5 space-y-4">
                          {filteredOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                              <div>
                                <div className="font-semibold text-slate-900">{order.id} {order.customer}</div>
                                <div className="text-xs text-slate-500">GH₵{order.total}</div>
                              </div>
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                  order.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-slate-900">Low Stock</div>
                          <button onClick={() => navigateTo("inventory", "Inventory")} className="text-sm font-medium text-blue-600">Manage</button>
                        </div>
                        <div className="mt-5 space-y-4">
                          {liveLowStockItems.map((item) => (
                            <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                              <div>
                                <div className="font-medium text-slate-900">{item.name}</div>
                                <div className="text-sm text-slate-500">Only {item.qty} left in stock</div>
                              </div>
                              <button onClick={() => navigateTo("inventory", "Inventory")} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                Restock
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-slate-900">WhatsApp sales</div>
                          <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Live
                          </div>
                        </div>
                        <div className="mt-6 space-y-4">
                          <div className="rounded-2xl bg-emerald-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                              <MessageSquareText className="h-4 w-4" />
                              18 conversations today
                            </div>
                            <div className="mt-3 text-2xl font-bold text-slate-900">GH₵2,640</div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="text-sm text-slate-500">Average order value</div>
                            <div className="mt-2 text-2xl font-bold text-slate-900">GH₵328</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === "products" && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-500">Products</div>
                        <h1 className="text-3xl font-bold text-slate-900">
                          {productView === "all" ? "All products" : productView === "catalogs" ? "Catalogs" : "Import products"}
                        </h1>
                      </div>
                      {productView === "all" ? <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative min-w-[220px]">
                          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input
                            value={productSearch}
                            onChange={(event) => setProductSearch(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none ring-0 placeholder:text-slate-400"
                            placeholder="Search products..."
                          />
                          {productSearch ? (
                            <button type="button" onClick={() => setProductSearch("")} className="absolute right-2 top-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear product search">
                              <X className="h-4 w-4" />
                            </button>
                          ) : null}
                          {productSearch.trim() ? (
                            <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                              {products
                                .filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase()))
                                .slice(0, 5)
                                .map((product) => (
                                  <button
                                    key={product.name}
                                    onClick={() => setProductSearch(product.name)}
                                    className="flex w-full items-center justify-between border-b border-slate-100 px-3 py-2.5 text-left last:border-b-0 hover:bg-slate-50"
                                  >
                                    <span>
                                      <span className="block text-sm font-semibold text-slate-900">{product.name}</span>
                                      <span className="block text-xs text-slate-500">{product.category}</span>
                                    </span>
                                    <span className="text-xs text-slate-500">{product.stock} in stock</span>
                                  </button>
                                ))}
                              {!products.some((product) => `${product.name} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase())) ? (
                                <div className="px-3 py-3 text-sm text-slate-500">No products found</div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500">
                          <span>Sort by</span>
                          <select value={workspaceSort} onChange={(event) => setWorkspaceSort(event.target.value)} className="bg-transparent py-2.5 font-medium text-slate-800 outline-none">
                            <option>Newest</option><option>Oldest</option><option>Name A-Z</option>
                          </select>
                        </label>
                        <button onClick={() => {
  setSelectedCatalog(null);

  openActionPanel({
    title: "Add a product",
    description: "Add a new product to your catalog.",
    primaryLabel: "Save product",
    fields: [
      "Product name",
      "Catalog",
      "Selling price",
      "Cost price",
      "Stock",
      "SKU",
      "Low-stock threshold",
    ],
  });
}} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800">
                          + Add Product
                        </button>
                      </div> : null}
                    </div>

                    <div className="flex flex-wrap gap-1 border-b border-slate-200">
                      {[
                        { key: "all" as const, label: "All products" },
                        { key: "catalogs" as const, label: "Catalogs" },
                        { key: "import" as const, label: "Import products" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setProductView(item.key)}
                          className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${productView === item.key ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {productView === "catalogs" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            
                            <p className="mt-1 text-sm text-slate-500">Create simple catalogs that match what you actually sell.</p>
                          </div>
                          <button
  onClick={() =>
    openActionPanel({
      title: "Add a catalog",
      description: "Create a catalog that matches what you sell.",
      primaryLabel: "Save catalog",
      fields: ["Catalog name", "Description"],
    })
  }
  className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
>
  + Add Catalog
</button>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                          {catalogs.map((catalog) => (
                            <button key={catalog.id} onClick={() => {
  setSelectedCatalog(catalog.name);
}} className="flex w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left last:border-b-0 hover:bg-slate-50">
                              <span className="font-semibold text-slate-900">{catalog.name}</span>
                              <span className="text-sm text-slate-500">{products.filter((product) => product.category === catalog.name).length} products products</span>
                            </button>
                          ))}
                        </div>
                      </div>
                                      )}

                  {selectedCatalog && (
                    <div className="space-y-6">
                      <div>
                        

                        <h2 className="text-2xl font-bold text-slate-900">
                          {selectedCatalog}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Products in this catalog.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {products
                          .filter(
                            (product) =>
                              product.category === selectedCatalog
                          )
                          .map((product) => (
                            <div
                              key={product.name}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex h-32 items-center justify-center rounded-xl bg-[#f0eee8]">
                                {product.imageName ? (
                                  <div className="text-center text-xs font-medium text-slate-500">
                                    {product.imageName}
                                  </div>
                                ) : (
                                  <Package2 className="h-12 w-12 text-slate-400" />
                                )}
                              </div>

                              <div className="mt-4">
                                <div className="text-xl font-semibold text-slate-900">
                                  {product.name}
                                </div>

                                <div className="mt-1 text-sm text-slate-500">
                                  {product.stock} units in stock
                                </div>

                                <div className="mt-4">
                                  <Currency amount={product.price} />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {productView === "import" && (
                      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900">Import products</h2>
                        <p className="mt-1 text-sm text-slate-500">Upload a CSV with product name, price, cost, stock, and category columns.</p>
                        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center hover:border-teal-600 hover:bg-teal-50">
                          <FileSpreadsheet className="h-8 w-8 text-teal-700" />
                          <span className="mt-3 font-semibold text-slate-800">Choose a CSV file</span>
                          <span className="mt-1 text-sm text-slate-500">or drag it here</span>
                          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={importProductsFromCsv} />
                        </label>
                        {selectedImage ? <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Ready to import: {selectedImage}</div> : null}
                      </div>
                    )}

                    {productView === "all" && <><div className="flex flex-wrap gap-2">
                      <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500">
                        <span>Category</span>
                        <select value={productCategory} onChange={(event) => setProductCategory(event.target.value)} className="bg-transparent font-medium text-slate-800 outline-none">
                          {["All", ...catalogs.map((catalog) => catalog.name)].map((category) => (
  <option key={category}>{category}</option>
))}
                        </select>
                      </label>
                      {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setProductFilter(filter as ProductFilter)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            productFilter === filter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {visibleProducts.map((product) => (
                        <div key={product.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex h-32 items-center justify-center rounded-xl bg-[#f0eee8]">
                            {product.imageName ? <div className="text-center text-xs font-medium text-slate-500">{product.imageName}</div> : <Package2 className="h-12 w-12 text-slate-400" />}
                          </div>
                          <div className="mt-4 flex items-start justify-between gap-4">
                            <div>
                              <div className="text-xl font-semibold text-slate-900">{product.name}</div>
                              <div className="mt-1 text-sm text-slate-500">{product.category}</div>
                            </div>
                            <div className={`rounded-full px-2 py-1 text-[10px] font-semibold ${product.stock <= product.lowStockThreshold ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {product.stock <= product.lowStockThreshold ? 'LOW STOCK' : 'IN STOCK'}
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
                            <div>
                              <div className="text-xs text-slate-500">Selling price</div>
                              <div className="mt-1 font-bold text-slate-900"><Currency amount={product.price} /></div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">Cost price</div>
                              <div className="mt-1 font-semibold text-slate-700"><Currency amount={product.cost} /></div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                            <span>Stock</span>
                            <span className="font-semibold text-slate-900">{product.stock} units</span>
                          </div>
                          <div className="mt-5 flex items-center gap-2">
                            {["View", "Edit", "Duplicate", "Delete"].map((action) => (
                              <button key={action} onClick={() => openActionPanel(
                                action === "Delete"
                                  ? { title: "Delete product", description: `Delete ${product.name}?`, primaryLabel: "Delete product" }
                                  : { title: action === "View" ? "Edit product" : `${action} product`, description: `${product.name} is selected.`, primaryLabel: action === "View" ? "Save product" : action, fields: action === "Edit" || action === "View" ? ["Product name", "Category", "Selling price", "Cost price", "Stock", "SKU", "Low-stock threshold"] : undefined }
                              )} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div></>}
                  </div>
                )}

                {screen === "inventory" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-500">Inventory</div>
                        <h1 className="text-3xl font-bold text-slate-900">Stock overview</h1>
                      </div>
                      <button onClick={() => openActionPanel({ title: "Adjust stock", description: "Record stock received, sold, or corrected.", primaryLabel: "Save adjustment", fields: ["Product", "Quantity change", "Reason"] })} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
                        + Stock adjustment
                      </button>
                    </div>
                    <SearchSortBar placeholder="Search inventory" value={workspaceSearch} onChange={setWorkspaceSearch} sort={workspaceSort} onSortChange={setWorkspaceSort} />

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200 text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Product</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Quantity</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Activity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {products.filter((product) => product.name.toLowerCase().includes(workspaceSearch.toLowerCase())).map((row) => (
                            <tr key={row.name}>
                              <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                              <td className="px-4 py-3 text-slate-600">{row.stock}</td>
                              <td className="px-4 py-3">
                                <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${row.stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                  {row.stock <= 5 ? "Low Stock" : "In Stock"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-500">{row.stock <= 5 ? "Restock soon" : "Available"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {screen === "customers" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-500">Customers</div>
                        <h1 className="text-3xl font-bold text-slate-900">Customer list</h1>
                      </div>
                      <button onClick={() => openActionPanel({ title: "Add a customer", description: "Save the people who keep coming back.", primaryLabel: "Save customer", fields: ["Name", "Phone number", "Notes"] })} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">+ Add Customer</button>
                    </div>
                    <SearchSortBar placeholder="Search customers" value={workspaceSearch} onChange={setWorkspaceSearch} sort={workspaceSort} onSortChange={setWorkspaceSort} />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredCustomers.map((customer) => (
                        <div key={customer.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d97757] text-lg font-bold text-white">
                              {customer.name.slice(0, 1)}
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-slate-900">{customer.name}</div>
                              <div className="text-sm text-slate-500">{customer.phone}</div>
                            </div>
                          </div>
                          <div className="mt-5 space-y-2 text-sm text-slate-600">
                            <div className="flex items-center justify-between">
                              <span>Orders</span>
                              <strong className="text-slate-900">{customer.orders}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Spent</span>
                              <strong className="text-slate-900"><Currency amount={customer.spent} /></strong>
                            </div>
                          </div>
                          <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                            <button onClick={() => openActionPanel({ title: "Customer details", description: `${customer.name} has ${customer.orders} orders and has spent GH₵${customer.spent}.`, primaryLabel: "Close" })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Details</button>
                            <button onClick={() => openActionPanel({ title: "Edit customer", description: `${customer.name} is selected.`, primaryLabel: "Save customer", fields: ["Name", "Phone number", "Notes"] })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                            <button onClick={() => openActionPanel({ title: "Order history", description: `${customer.name} has ${customer.orders} orders.`, primaryLabel: "Close" })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Order history</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {screen === "analytics" && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Analytics</div>
                      <h1 className="text-3xl font-bold text-slate-900">Business performance</h1>
                    </div>
                    <SearchSortBar placeholder="Search reports" value={workspaceSearch} onChange={setWorkspaceSearch} sort={workspaceSort} onSortChange={setWorkspaceSort} sortOptions={["Newest", "Oldest", "Highest sales"]} />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Total Sales", `GH₵${totalSales.toLocaleString()}`],
                        ["Orders", String(orderRows.length)],
                        ["Profit", `GH₵${estimatedProfit.toLocaleString()}`],
                        ["Conversion", "6.8%"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="text-sm text-slate-500">{label}</div>
                          <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 text-xl font-bold text-slate-900">Sales trend</div>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={liveSalesData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <Tooltip formatter={salesTooltipFormatter} />
                              <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} fill="#ddd6fe" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 text-xl font-bold text-slate-900">Top products</div>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: 'Black Dress', sales: 12 },
                              { name: 'White Shirt', sales: 8 },
                              { name: 'Blue Jeans', sales: 6 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="sales" fill="#2563eb" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === "expenses" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-500">Expenses</div>
                        <h1 className="text-3xl font-bold text-slate-900">Track business costs</h1>
                      </div>
                      <button onClick={() => openActionPanel({ title: "Add an expense", description: "Keep track of what it costs to run the shop.", primaryLabel: "Save expense", fields: ["Expense category", "Amount", "Date"] })} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">+ Add Expense</button>
                    </div>
                    <SearchSortBar placeholder="Search expenses" value={workspaceSearch} onChange={setWorkspaceSearch} sort={workspaceSort} onSortChange={setWorkspaceSort} sortOptions={["Newest", "Oldest", "Highest amount"]} />

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="text-sm text-slate-500">Total expenses</div>
                      <div className="mt-1 text-3xl font-bold text-slate-900"><Currency amount={expenseItems.reduce((total, expense) => total + expense.amount, 0)} /></div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredExpenses.map((expense) => (
                        <div key={expense.category} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="text-sm text-slate-500">{expense.category}</div>
                          <div className="mt-4 text-3xl font-bold text-slate-900"><Currency amount={expense.amount} /></div>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => openActionPanel({ title: "Edit expense", description: `${expense.category} is selected.`, primaryLabel: "Save expense", fields: ["Expense category", "Amount", "Date"] })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                            <button onClick={() => openActionPanel({ title: "Delete expense", description: `${expense.category} is selected.`, primaryLabel: "Delete expense" })} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {screen === "payments" && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Payments</div>
                      <h1 className="text-3xl font-bold text-slate-900">Payment records</h1>
                    </div>
                    <SearchSortBar
                      placeholder="Search payments"
                      value={workspaceSearch}
                      onChange={setWorkspaceSearch}
                      sort={workspaceSort}
                      onSortChange={setWorkspaceSort}
                      sortOptions={["Newest", "Oldest", "Highest amount"]}
                    />
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200 text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Reference</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Customer</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Method</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Amount</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {paymentRows
                            .filter((payment) => `${payment.reference} ${payment.customer} ${payment.method}`.toLowerCase().includes(workspaceSearch.toLowerCase()))
                            .map((payment) => (
                              <tr key={payment.reference}>
                                <td className="px-4 py-3 font-medium text-slate-900">{payment.reference}</td>
                                <td className="px-4 py-3 text-slate-600">{payment.customer}</td>
                                <td className="px-4 py-3 text-slate-600">{payment.method}</td>
                                <td className="px-4 py-3 text-slate-900"><Currency amount={payment.amount} /></td>
                                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${payment.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{payment.status}</span></td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {screen === "settings" && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Settings</div>
                      <h1 className="text-3xl font-bold text-slate-900">Make BizOs work your way</h1>
                      <p className="mt-2 max-w-2xl text-sm text-slate-500">Update your shop details, how orders are handled, and the alerts you want to receive.</p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      {[
                        {
                          title: "Business",
                          items: [
                            { label: "Business profile", detail: `${settings.businessName} · ${settings.category} · ${settings.region}`, action: { title: "Business profile", description: "Keep the details customers see up to date.", primaryLabel: "Save profile", fields: ["Business name", "Category", "Region", "City"] } },
                            { label: "Business hours", detail: `${settings.daysOpen} · ${settings.openingTime} to ${settings.closingTime}`, action: { title: "Business hours", description: "Let customers know when you are open.", primaryLabel: "Save hours", fields: ["Opening time", "Closing time", "Days open"] } },
                            { label: "Logo", detail: settings.logoName, action: { title: "Business logo", description: "Add a logo that appears on your receipts and shop profile.", primaryLabel: "Choose logo" } },
                            { label: "Profile", detail: `${settings.fullName} · ${settings.phone}`, action: { title: "Your profile", description: "Update the name and contact details for your account.", primaryLabel: "Save profile", fields: ["Full name", "Phone or email"] } },
                          ],
                        },
                        {
                          title: "Account & orders",
                          items: [
                            { label: "Security", detail: "Password and account access", action: { title: "Security", description: "Change your password or review account access.", primaryLabel: "Save security", fields: ["Current password", "New password", "Confirm password"] } },
                            { label: "Order settings", detail: `${settings.defaultOrderStatus} · ${settings.receiptPreference}`, action: { title: "Order settings", description: "Choose how new orders are recorded and completed.", primaryLabel: "Save order settings", fields: ["Default order status", "Receipt preference", "Order source"] } },
                          ],
                        },
                        {
                          title: "Payments",
                          items: [
                            { label: "Payment methods", detail: `MoMo ${settings.momo} · Card ${settings.card} · Bank ${settings.bankTransfer}`, action: { title: "Payment methods", description: "Choose how customers can pay you.", primaryLabel: "Save methods", fields: ["MoMo", "Card", "Bank transfer"] } },
                            { label: "Payment configuration", detail: `${settings.currency} · ${settings.settlementAccount} · ${settings.paymentReference}`, action: { title: "Payment configuration", description: "Set the details used when recording and receiving payments.", primaryLabel: "Save configuration", fields: ["Currency", "Settlement account", "Payment reference"] } },
                          ],
                        },
                        {
                          title: "Notifications",
                          items: [
                            { label: "Order notifications", detail: `${settings.newOrderAlerts} for new orders · ${settings.orderStatusChanges} for status changes`, action: { title: "Order notifications", description: "Choose how you hear about order activity.", primaryLabel: "Save notifications", fields: ["New order alerts", "Order status changes"] } },
                            { label: "Payment notifications", detail: `${settings.paymentReceived} for received payments · ${settings.pendingPaymentReminders} for reminders`, action: { title: "Payment notifications", description: "Choose which payment updates reach you.", primaryLabel: "Save notifications", fields: ["Payment received", "Pending payment reminders"] } },
                            { label: "Low stock alerts", detail: `${settings.alertThreshold} · ${settings.alertFrequency}`, action: { title: "Low stock alerts", description: "Set when BizOs should remind you to restock.", primaryLabel: "Save alert settings", fields: ["Alert threshold", "Alert frequency"] } },
                          ],
                        },
                        {
                          title: "Help",
                          items: [
                            { label: "FAQs", detail: "Answers to common questions", action: { title: "FAQs", description: "Browse quick answers about products, orders, and payments.", primaryLabel: "View FAQs" } },
                            { label: "Contact support", detail: "Talk to the BizOs support team", action: { title: "Contact support", description: "Tell us what you need help with and we will get back to you.", primaryLabel: "Send message", fields: ["Subject", "Message"] } },
                          ],
                        },
                      ].map((section) => (
                        <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <h2 className="mb-3 text-lg font-bold text-slate-900">{section.title}</h2>
                          <div className="divide-y divide-slate-100">
                            {section.items.map((item) => (
                              <button key={item.label} onClick={() => openActionPanel(item.action)} className="flex w-full items-center justify-between gap-4 py-3 text-left hover:bg-slate-50">
                                <span>
                                  <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                                  <span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span>
                                </span>
                                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                )}

                {screen === "orders" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-500">Orders</div>
                        <h1 className="text-3xl font-bold text-slate-900">Order flow</h1>
                      </div>
                      <button onClick={() => openActionPanel({ title: "Create an order", description: "Select a customer, product, quantity, and delivery fee. The total is calculated when you save.", primaryLabel: "Save order", fields: ["Customer", "Product", "Quantity", "Delivery fee", "Payment status"] })} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">+ Create Order</button>
                    </div>
                    <SearchSortBar placeholder="Search orders" value={workspaceSearch} onChange={setWorkspaceSearch} sort={workspaceSort} onSortChange={setWorkspaceSort} />

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200 text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Order</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Customer</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Amount</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                          </tr>
                        </thead>
                          <tbody className="divide-y divide-slate-200">
                             {filteredOrders.map((order) => (
                           <tr
                                  key={order.id}
                                  onClick={() => setSelectedOrder(order)}
                                  className="cursor-pointer transition hover:bg-slate-50"
       >
            <td className="px-4 py-3 font-medium text-slate-900">
        {order.id}
      </td>

      <td className="px-4 py-3 text-slate-600">
        {order.customer}
      </td>

      <td className="px-4 py-3 text-slate-900">
        GH₵{order.total}
      </td>

      <td className="px-4 py-3">
  <button
  onClick={(event) => {
    event.stopPropagation();

    openActionPanel({
      title: "Change order status",
      description: `${order.id} is selected.`,
      primaryLabel: "Save status",
      fields: ["Order status"],
      selectOptions: {
        "Order status": [
          "DELIVERED",
          "PENDING",
          "CANCELED",
          "PAYMENT UNSUCCESSFUL",
          "REFUNDED",
          "PAID",
          "PROCESSING",
        ],
      },
    });
  }}
  className="transition hover:scale-[1.02]"
>
  <OrderStatusBadge status={order.status} />
</button>
</td>
    </tr>
  ))}
</tbody>
                      </table>
                    </div>
                  </div>
                )}
              </main>

                 {selectedOrder && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    onClick={() => setSelectedOrder(null)}
  >
    <div
      className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <div className="text-sm font-medium text-slate-500">
            Order details
          </div>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {selectedOrder.id}
          </h2>
        </div>

        <button
          onClick={() => setSelectedOrder(null)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-5 p-6">

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Status
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedOrder.status === "PAID"
                ? "bg-emerald-100 text-emerald-700"
                : selectedOrder.status === "DELIVERED"
                ? "bg-blue-100 text-blue-700"
                : selectedOrder.status === "CANCELED"
                ? "bg-red-100 text-red-700"
                : selectedOrder.status === "REFUNDED"
                ? "bg-purple-100 text-purple-700"
                : selectedOrder.status === "PAYMENT UNSUCCESSFUL"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {selectedOrder.status}
          </span>
        </div>

        {/* Customer */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Customer
          </div>

          <div className="mt-1 font-semibold text-slate-900">
            {selectedOrder.customer}
          </div>
        </div>

        {/* Order */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Order
          </div>

          <div className="mt-1 text-slate-700">
            {selectedOrder.id}
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <span className="font-medium text-slate-700">
            Total
          </span>

          <span className="text-xl font-bold text-slate-900">
            GH₵{selectedOrder.total}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-6 py-4">
        <button
          onClick={() => setSelectedOrder(null)}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

            </div>
          </div>
        ) : null}
      </div>

      {screen === "welcome" && (
        <main className="relative min-h-screen overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[#f7f5f0]" />
          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoMark />
                <div>
                  <div className="text-xl font-semibold text-slate-900">Business OS</div>
                  <div className="text-xs text-slate-500">A calmer way to run the shop.</div>
                </div>
              </div>
              <button
                onClick={() => setScreen("login")}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Log In
              </button>
            </header>

            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2 border-l-2 border-[#d97757] pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  Made for busy shops
                </div>
                <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Orders from WhatsApp. Stock on the shelf. Cash you can see.
                </h1>
                <p className="mt-5 max-w-lg text-lg text-slate-600">
                  BizOs keeps the everyday details in one place, so you can spend less time searching through chats and notebooks and more time serving customers.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setScreen("register")}
                    className="rounded-lg bg-teal-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800"
                  >
                    Open your shop
                  </button>
                  <button
                    onClick={() => setScreen("login")}
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                  >
                    Log In
                  </button>
                </div>

                <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
                  {featureList.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[560px]">
                <div className="relative rounded-2xl border border-slate-300 bg-[#17211f] p-4 shadow-[0_24px_60px_rgba(23,33,31,0.16)]">
                  <div className="absolute left-1/2 top-3 h-1.5 w-24 -translate-x-1/2 rounded-full bg-slate-600" />
                  <div className="rounded-[28px] bg-slate-50 p-4 shadow-inner">
                    <div className="rounded-[22px] bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><ShoppingBag className="h-4 w-4" /></div>
                          <div>
                            <div className="font-semibold text-slate-900">Ama Fashion</div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Business</div>
                          </div>
                        </div>
                        <div className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">LIVE</div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Orders today</div>
                          <div className="mt-2 text-2xl font-bold text-slate-900">GH₵4,850</div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-3">
                          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>Orders</span>
                            <span>23</span>
                          </div>
                          <div className="space-y-2">
                            {orderRows.map((order) => (
                              <div key={order.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-2 text-sm">
                                <div>
                                  <div className="font-medium text-slate-800">{order.customer}</div>
                                  <div className="text-slate-500">{order.id}</div>
                                </div>
                                <div className="font-semibold text-slate-900">GH₵{order.total}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><MessageSquareText className="h-5 w-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500">WhatsApp order</div>
                      <div className="text-sm font-semibold text-slate-900">New order from Michael</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {(screen === "login" || screen === "register" || screen === "business" || screen === "category" || screen === "product") && (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
          <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mb-7 flex items-center justify-center gap-3">
              <LogoMark />
              <div>
                <div className="text-xl font-semibold text-slate-900">Business OS</div>
                  <div className="text-xs text-slate-500">A calmer way to run the shop.</div>
              </div>
            </div>

            {screen === "login" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                  <p className="mt-2 text-sm text-slate-500">Pick up where you left off.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email or phone number</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-400" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                        {showPassword ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <button onClick={() => openActionPanel({ title: "Reset your password", description: "Enter your email or phone number and we will send reset instructions.", primaryLabel: "Send instructions", fields: ["Email or phone number"] })} className="font-medium text-blue-600">Forgot password?</button>
                  </div>
                  <button onClick={goToDashboard} className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
                    Log In
                  </button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span className="bg-white px-2">or</span>
                    </div>
                  </div>
                  <button onClick={() => setScreen("register")} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
                    Create Account
                  </button>
                </div>
              </>
            )}

            {screen === "register" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
                  <p className="mt-2 text-sm text-slate-500">Start managing your business in minutes</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" placeholder="Ama Mensah" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Phone or email</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" placeholder="+233 24 000 0000" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" placeholder="Create password" />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 flex items-center text-slate-400"><Eye className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" placeholder="Confirm password" />
                      <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute inset-y-0 right-3 flex items-center text-slate-400"><Eye className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <button onClick={() => setScreen("business")} className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
                    Create Account
                  </button>
                  <div className="text-center text-sm text-slate-500">
                    Already have an account? <button onClick={() => setScreen("login")} className="font-medium text-blue-600">Log in</button>
                  </div>
                </div>
              </>
            )}

            {screen === "business" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Tell us about your business</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Business name</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" defaultValue="Ama Fashion" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Business category</label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-400" defaultValue="Fashion">
                      {categoryOptions.map(({ name }) => <option key={name}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Region</label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-400" defaultValue="Greater Accra">
                      {['Greater Accra', 'Ashanti', 'Eastern', 'Western', 'Central', 'Northern'].map((region) => <option key={region}>{region}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" defaultValue="Accra" />
                  </div>
                  <button onClick={() => setScreen("category")} className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
                    Next
                  </button>
                </div>
              </>
            )}

            {screen === "category" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Choose your category</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categoryOptions.map(({ name, icon: Icon }) => {
                    const active = selectedCategory === name;
                    return (
                      <button
                        key={name}
                        onClick={() => setSelectedCategory(name)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="font-semibold">{name}</div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setScreen("product")} className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
                  Continue
                </button>
              </>
            )}

            {screen === "product" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Add your first product</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      <ImagePlus className="h-4 w-4" />
                      {selectedImage || "Upload product image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => setSelectedImage(event.target.files?.[0]?.name ?? "")}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Product name</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" defaultValue="Black Dress" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Selling price</label>
                      <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" defaultValue="GH₵350" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Cost price</label>
                      <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" defaultValue="GH₵220" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Stock quantity</label>
                      <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400" defaultValue="10" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                      <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-400" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                        {categoryOptions.map(({ name }) => <option key={name}>{name}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={goToDashboard} className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
                    Save Product
                  </button>
                  <button onClick={goToDashboard} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    Skip for now
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {actionPanel ? <ActionPanel
  action={actionPanel}
  onClose={() => setActionPanel(null)}
  customerRows={customerRows}
  products={products}
  catalogs={catalogs}
/> : null}

    </div>
  );

  return appContent;
}
