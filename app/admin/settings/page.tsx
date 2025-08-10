'use client'

import { useEffect, useState } from 'react'

type PaymentProvider = 'STRIPE' | 'SQUARE' | 'PAYPAL'
type GiftCardMode = 'INTERNAL' | 'PROVIDER'

export default function AdminSettingsPage() {
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('STRIPE')
  const [giftCardMode, setGiftCardMode] = useState<GiftCardMode>('INTERNAL')
  const [depositAmountCents, setDepositAmountCents] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' })
      if (res.ok) {
        const s = await res.json()
        if (s) {
          setPaymentProvider(s.paymentProvider)
          setGiftCardMode(s.giftCardMode)
          setDepositAmountCents(s.depositAmountCents)
        }
      }
      setLoaded(true)
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentProvider, giftCardMode, depositAmountCents })
    })
    setSaving(false)
    alert('Settings saved')
  }

  if (!loaded) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Business Settings</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Payment Provider</label>
          <select
            className="border px-3 py-2"
            value={paymentProvider}
            onChange={(e) => setPaymentProvider(e.target.value as PaymentProvider)}
          >
            <option value="STRIPE">Stripe</option>
            <option value="SQUARE">Square</option>
            <option value="PAYPAL">PayPal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gift Card Mode</label>
          <select
            className="border px-3 py-2"
            value={giftCardMode}
            onChange={(e) => setGiftCardMode(e.target.value as GiftCardMode)}
          >
            <option value="INTERNAL">Manage in-app (issue/redeem)</option>
            <option value="PROVIDER">Sell via provider (activate via webhook)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Deposit Amount (cents)</label>
          <input
            type="number"
            className="border px-3 py-2 w-52"
            value={depositAmountCents}
            onChange={(e) => setDepositAmountCents(Number(e.target.value) || 0)}
            min={0}
            step={100}
          />
          <div className="text-xs text-gray-500 mt-1">Used when services require a deposit.</div>
        </div>

        <button onClick={save} disabled={saving} className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

