// Cart utility — localStorage based shared cart

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("swiggy_cart") || "[]");
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem("swiggy_cart", JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const addToCart = (food, qty = 1) => {
  const cart = getCart();
  const existing = cart.find((i) => i._id === food._id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...food, qty });
  }
  saveCart(cart);
};

export const updateQtyInCart = (id, delta) => {
  const cart = getCart()
    .map((i) => (i._id === id ? { ...i, qty: i.qty + delta } : i))
    .filter((i) => i.qty > 0);
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem("swiggy_cart");
  window.dispatchEvent(new Event("cartUpdated"));
};