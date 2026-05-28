import { useEffect, useState } from "react";
import Card from "../components/Card";
import http from "../api/http";

const defaultForm = {
  customerNumber: "",
  productCode: "",
  quantitySold: 1,
  salesDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "Cash"
};

export default function SalesPage() {
  const [form, setForm] = useState(defaultForm);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const loadAll = async () => {
    const [salesRes, customersRes, productsRes] = await Promise.all([
      http.get("/sales"),
      http.get("/customers"),
      http.get("/products")
    ]);
    setSales(salesRes.data);
    setCustomers(customersRes.data);
    setProducts(productsRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, customerNumber: Number(form.customerNumber), productCode: Number(form.productCode), quantitySold: Number(form.quantitySold) };
    if (editingId) await http.put(`/sales/${editingId}`, payload);
    else await http.post("/sales", payload);
    setForm(defaultForm);
    setEditingId(null);
    loadAll();
  };

  const editSale = (sale) => {
    setEditingId(sale.invoiceNumber);
    setForm({
      customerNumber: String(sale.customerNumber),
      productCode: String(sale.productCode),
      quantitySold: sale.quantitySold,
      salesDate: sale.salesDate.slice(0, 10),
      paymentMethod: sale.paymentMethod
    });
  };

  const removeSale = async (id) => {
    await http.delete(`/sales/${id}`);
    loadAll();
  };

  return (
    <div className="grid gap-5">
      <Card title={editingId ? "Update Sale" : "Create Sale"}>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <select className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" value={form.customerNumber} onChange={(e) => setForm({ ...form, customerNumber: e.target.value })} required>
            <option value="">Select Customer</option>
            {customers.map((c) => <option key={c.customerNumber} value={c.customerNumber}>{c.firstName} {c.lastName}</option>)}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" value={form.productCode} onChange={(e) => setForm({ ...form, productCode: e.target.value })} required>
            <option value="">Select Product</option>
            {products.map((p) => <option key={p.productCode} value={p.productCode}>{p.productName}</option>)}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" type="number" value={form.quantitySold} onChange={(e) => setForm({ ...form, quantitySold: e.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" type="date" value={form.salesDate} onChange={(e) => setForm({ ...form, salesDate: e.target.value })} required />
          <select className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option>Cash</option><option>Card</option><option>Mobile Money</option><option>Bank Transfer</option>
          </select>
          <button className="rounded-lg bg-brand-600 p-2.5 font-semibold text-white hover:bg-brand-700 sm:col-span-2">{editingId ? "Update Sale" : "Save Sale"}</button>
        </form>
      </Card>
      <Card title="Sales List (Retrieve / Update / Delete)">
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="min-w-[760px] text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Invoice</th><th>Customer</th><th>Product</th><th>Date</th><th>Total</th><th>Action</th></tr></thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.invoiceNumber} className="border-b border-slate-100">
                  <td className="whitespace-nowrap">{sale.invoiceNumber}</td><td>{sale.customerName}</td><td>{sale.productName}</td><td className="whitespace-nowrap">{sale.salesDate.slice(0, 10)}</td><td className="whitespace-nowrap">{Number(sale.totalAmountPaid).toLocaleString()}</td>
                  <td className="space-x-2 py-2 whitespace-nowrap">
                    <button onClick={() => editSale(sale)} className="rounded-lg bg-amber-500 px-3 py-1.5 text-white">Edit</button>
                    <button onClick={() => removeSale(sale.invoiceNumber)} className="rounded-lg bg-red-600 px-3 py-1.5 text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
