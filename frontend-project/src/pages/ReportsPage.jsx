import { useEffect, useState } from "react";
import Card from "../components/Card";
import http from "../api/http";

export default function ReportsPage() {
  const [range, setRange] = useState("daily");
  const [data, setData] = useState(null);

  const loadReports = async (selectedRange = range) => {
    const response = await http.get(`/reports?range=${selectedRange}`);
    setData(response.data);
  };

  useEffect(() => {
    loadReports("daily");
  }, []);

  const printReport = () => {
    if (!data) return;

    const rows = (data.salesDetails || [])
      .map(
        (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.invoiceNumber}</td>
            <td>${new Date(row.salesDate).toISOString().slice(0, 10)}</td>
            <td>${row.customerName}</td>
            <td>${row.productName}</td>
            <td>${row.quantitySold}</td>
            <td>${row.paymentMethod}</td>
            <td>${Number(row.unitPrice).toLocaleString()}</td>
            <td>${Number(row.totalAmountPaid).toLocaleString()}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>SalesPro SRMS Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; }
            h1 { margin: 0; color: #be185d; }
            .meta { margin: 10px 0 18px; color: #6b7280; }
            .pill { display: inline-block; margin-right: 10px; padding: 6px 12px; background: #fce7f3; border-radius: 999px; font-size: 12px; color: #9d174d; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
            th { background: #f9a8d4; color: #831843; text-align: left; }
            tr:nth-child(even) { background: #fdf2f8; }
            .summary { margin-top: 14px; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>SalesPro Ltd - Sales Report</h1>
          <div class="meta">Range: ${data.range.toUpperCase()} | Period: ${data.period.startDate} to ${data.period.endDate}</div>
          <div>
            <span class="pill">Total Sales: ${data.totals.sales}</span>
            <span class="pill">Total Revenue: ${Number(data.totals.revenue).toLocaleString()}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Payment</th>
                <th>Unit Price</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="summary">Generated on: ${new Date().toLocaleString()}</div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="grid gap-5">
      <Card title="Professional Sales Report">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
          {["daily", "weekly", "monthly"].map((r) => (
            <button
              key={r}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                range === r ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => {
                setRange(r);
                loadReports(r);
              }}
            >
              {r}
            </button>
          ))}
          </div>
          <button
            onClick={printReport}
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto"
          >
            Print report
          </button>
        </div>
        {data ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-3">Total Customers: <span className="font-semibold">{data.totals.customers}</span></div>
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-3">Total Products: <span className="font-semibold">{data.totals.products}</span></div>
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-3">Sales In Period: <span className="font-semibold">{data.totals.sales}</span></div>
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-3">Revenue In Period: <span className="font-semibold">{Number(data.totals.revenue).toLocaleString()}</span></div>
          </div>
        ) : null}
      </Card>

      <Card title="Detailed Sales Table">
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="min-w-[1050px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2">Invoice</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Telephone</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit Price</th>
                <th className="px-3 py-2">Payment</th>
                <th className="px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {(data?.salesDetails || []).map((row) => (
                <tr key={row.invoiceNumber} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap">{row.invoiceNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(row.salesDate).toISOString().slice(0, 10)}</td>
                  <td className="px-3 py-2">{row.customerName}</td>
                  <td className="px-3 py-2">{row.telephone}</td>
                  <td className="px-3 py-2">{row.productName}</td>
                  <td className="px-3 py-2">{row.quantitySold}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{Number(row.unitPrice).toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.paymentMethod}</td>
                  <td className="px-3 py-2 font-semibold text-brand-700 whitespace-nowrap">{Number(row.totalAmountPaid).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
