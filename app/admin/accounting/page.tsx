'use client'

import { useEffect, useState } from 'react'

export default function AccountingPage() {
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [summary, setSummary] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const qp = new URLSearchParams()
    if (from) qp.set('from', from)
    if (to) qp.set('to', to)
    const [s, l] = await Promise.all([
      fetch(`/api/admin/accounting/summary?${qp}`).then(r => r.json()),
      fetch(`/api/admin/accounting/sales?${qp}`).then(r => r.json()),
    ])
    setSummary(s)
    setSales(l.rows || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Accounting</h1>
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block text-sm mb-1">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border px-3 py-2" />
        </div>
        <button onClick={load} className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white">Apply</button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Revenue" value={currency(summary.revenue)} />
          <Stat label="Tax" value={currency(summary.tax)} />
          <Stat label="COGS" value={currency(summary.cogs)} />
          <Stat label="Gross Margin" value={currency(summary.grossMargin)} />
          <Stat label="Gift Card Liability" value={currency(summary.giftCardLiability)} />
          <Stat label="Orders" value={summary.ordersCount} />
        </div>
      )}

      <div className="border rounded">
        <div className="p-3 font-semibold border-b bg-gray-50">Recent Sales</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Total</Th>
                <Th>Tax</Th>
                <Th>Tender</Th>
              </tr>
            </thead>
            <tbody>
              {sales.map((row) => (
                <tr key={row.id} className="border-t">
                  <Td>{row.orderNumber}</Td>
                  <Td>{new Date(row.createdAt).toLocaleString()}</Td>
                  <Td>{currency(row.total)}</Td>
                  <Td>{currency(row.tax)}</Td>
                  <Td>{row.paymentMethod || '-'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && <div className="mt-3 text-sm">Loading…</div>}
    </div>
  )
}

function Stat({ label, value }: { label: string, value: any }) {
  return (
    <div className="border p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function Th({ children }: { children: any }) {
  return <th className="text-left px-3 py-2 border-r last:border-r-0">{children}</th>
}
function Td({ children }: { children: any }) {
  return <td className="px-3 py-2 border-r last:border-r-0">{children}</td>
}

function currency(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n || 0)
}


