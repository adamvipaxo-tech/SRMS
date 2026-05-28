import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import http from "../api/http";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    const response = await http.get("/dashboard");
    setData(response.data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const lowStock = useMemo(
    () => (data?.inventory || []).filter((item) => item.remainingItems <= 5),
    [data]
  );

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Customers">
          <p className="text-3xl font-bold text-brand-700">{data?.summary?.totalCustomers ?? 0}</p>
        </Card>
        <Card title="Total Products">
          <p className="text-3xl font-bold text-brand-700">{data?.summary?.totalProducts ?? 0}</p>
        </Card>
        <Card title="Total Sales">
          <p className="text-3xl font-bold text-brand-700">{data?.summary?.totalSales ?? 0}</p>
        </Card>
        <Card title="Total Revenue">
          <p className="text-3xl font-bold text-brand-700">{Number(data?.summary?.totalRevenue || 0).toLocaleString()}</p>
        </Card>
      </div>

      <Card title="Inventory Status (Remaining Items After Sales)">
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Initial Stock</th>
                <th className="px-3 py-2">Sold Units</th>
                <th className="px-3 py-2">Remaining Items</th>
                <th className="px-3 py-2">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {(data?.inventory || []).map((row) => (
                <tr key={row.productCode} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-800">{row.productName}</td>
                  <td className="px-3 py-2">{row.initialStock}</td>
                  <td className="px-3 py-2">{row.soldUnits}</td>
                  <td className={`px-3 py-2 font-semibold ${row.remainingItems <= 5 ? "text-red-600" : "text-emerald-600"}`}>
                    {row.remainingItems}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{Number(row.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Low Stock Alerts">
        {lowStock.length ? (
          <div className="space-y-2">
            {lowStock.map((item) => (
              <div key={item.productCode} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {item.productName}: only {item.remainingItems} item(s) remaining.
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No low stock products right now.</p>
        )}
      </Card>
    </div>
  );
}
