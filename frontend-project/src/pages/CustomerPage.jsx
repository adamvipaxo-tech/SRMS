import { useEffect, useState } from "react";
import Card from "../components/Card";
import http from "../api/http";

export default function CustomerPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", telephone: "", address: "" });
  const [customers, setCustomers] = useState([]);

  const loadCustomers = async () => {
    const { data } = await http.get("/customers");
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await http.post("/customers", form);
    setForm({ firstName: "", lastName: "", telephone: "", address: "" });
    loadCustomers();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card title="Create Customer">
        <form onSubmit={submit} className="grid gap-3">
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" placeholder="Telephone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <button className="rounded-lg bg-brand-600 p-2.5 font-semibold text-white hover:bg-brand-700">Save Customer</button>
        </form>
      </Card>
      <div className="lg:col-span-4">
        <Card title="Available Customers">
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Customer #</th>
                  <th className="px-3 py-2">Full Name</th>
                  <th className="px-3 py-2">Telephone</th>
                  <th className="px-3 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerNumber} className="border-b border-slate-100">
                    <td className="px-3 py-2 whitespace-nowrap">{customer.customerNumber}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{customer.telephone}</td>
                    <td className="px-3 py-2">{customer.address}</td>
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
