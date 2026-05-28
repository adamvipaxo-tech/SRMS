import { useEffect, useState } from "react";
import Card from "../components/Card";
import http from "../api/http";

export default function ProductPage() {
  const [form, setForm] = useState({ productName: "", quantitySold: 0, unitPrice: "" });
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const { data } = await http.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await http.post("/products", { ...form, quantitySold: Number(form.quantitySold), unitPrice: Number(form.unitPrice) });
    setForm({ productName: "", quantitySold: 0, unitPrice: "" });
    loadProducts();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card title="Create Product">
        <form onSubmit={submit} className="grid gap-3">
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" placeholder="Product Name" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" type="number" placeholder="Quantity Sold" value={form.quantitySold} onChange={(e) => setForm({ ...form, quantitySold: e.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" type="number" step="0.01" placeholder="Unit Price" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
          <button className="rounded-lg bg-brand-600 p-2.5 font-semibold text-white hover:bg-brand-700">Save Product</button>
        </form>
      </Card>
      <div className="lg:col-span-4">
        <Card title="Available Products">
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Product #</th>
                  <th className="px-3 py-2">Product Name</th>
                  <th className="px-3 py-2">Initial Stock</th>
                  <th className="px-3 py-2">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productCode} className="border-b border-slate-100">
                    <td className="px-3 py-2 whitespace-nowrap">{product.productCode}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{product.productName}</td>
                    <td className="px-3 py-2">{product.quantitySold}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{Number(product.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
