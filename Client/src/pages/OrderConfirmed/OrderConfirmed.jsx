import { Check, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'

function OrderConfirmed() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const order = state?.order

  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
        <div className="relative mx-auto grid size-24 place-items-center rounded-full bg-green-100 text-green-600">
          <span className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-60" />
          <Check className="relative size-12 stroke-[3]" />
        </div>
        <h1 className="mt-7 text-3xl font-semibold">Order Confirmed!</h1>
        <p className="mt-3 text-zinc-500">Your order has been received and the restaurant will start preparing it.</p>
        <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-left text-sm dark:bg-zinc-800">
          <p><span className="text-zinc-500">Order ID:</span> {orderId}</p>
          {order && <><p className="mt-2"><span className="text-zinc-500">Payment:</span> Cash on Delivery</p><p className="mt-2"><span className="text-zinc-500">Total:</span> ₹{order.total}</p></>}
        </div>
        <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#e23744] px-6 py-3 font-semibold text-white"><ShoppingBag className="size-4" /> Continue shopping</Link>
      </section>
    </main>
  )
}

export default OrderConfirmed
