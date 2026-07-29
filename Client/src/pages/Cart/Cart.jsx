import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()
  const tax = Math.round(total * 0.05)
  const deliveryFee = total >= 499 ? 0 : 40

  return (
    <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
      <div className="flex justify-between"><div><h1 className="text-3xl font-semibold">Your cart</h1><p className="text-sm text-zinc-500">{items.length} dishes</p></div>{items.length > 0 && <button onClick={clearCart} className="text-sm text-[#e23744]">Clear cart</button>}</div>
      {items.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700"><ShoppingBag className="mx-auto size-12 text-zinc-300" /><h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2><Link to="/" className="mt-6 inline-block rounded-lg bg-[#e23744] px-6 py-3 text-white">Explore food</Link></section>
      ) : (
        <div className="mt-8 grid gap-7 md:grid-cols-[1fr_300px]">
          <section className="space-y-3">{items.map((item) => <article key={item.id} className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"><div><h2 className="font-medium">{item.name}</h2><p className="mt-1 font-semibold">₹{item.price * item.quantity}</p></div><div className="flex items-center gap-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded border p-1"><Minus className="size-4" /></button><span className="w-6 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded border p-1"><Plus className="size-4" /></button><button onClick={() => removeItem(item.id)} className="ml-2 text-[#e23744]"><Trash2 className="size-5" /></button></div></article>)}</section>
          <aside className="h-fit rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900"><h2 className="font-semibold">Bill details</h2><div className="mt-4 space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></p><p className="flex justify-between"><span>Tax (5%)</span><span>₹{tax}</span></p><p className="flex justify-between"><span>Delivery</span><span>{deliveryFee ? `₹${deliveryFee}` : 'FREE'}</span></p><p className="flex justify-between border-t pt-3 text-base font-semibold"><span>Total</span><span>₹{total + tax + deliveryFee}</span></p></div><Link to="/checkout" className="mt-5 block rounded-lg bg-[#e23744] py-3 text-center font-semibold text-white">Proceed to Checkout</Link></aside>
        </div>
      )}
    </main>
  )
}
export default Cart
