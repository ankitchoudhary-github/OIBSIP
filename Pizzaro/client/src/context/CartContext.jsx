import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CartContext = createContext(null);

const CART_STORAGE_KEY = "pizzaro-cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  const [lastAddedItem, setLastAddedItem] = useState(null);

  /* Save cart whenever it changes */
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems),
      );
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  /* Add to cart */
  const addToCart = useCallback((item) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (item.quantity ?? 1),
              }
            : cartItem,
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: item.quantity ?? 1,
        },
      ];
    });

    setLastAddedItem(item);
  }, []);

  /* Clear toast item */
  const clearLastAddedItem = useCallback(() => {
    setLastAddedItem(null);
  }, []);

  /* Remove item */
  const removeFromCart = useCallback((id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }, []);

  /* Update quantity */
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.id !== id),
      );
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }, []);

  /* Clear cart */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /* Total item count */
  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + (item.quantity ?? 0),
      0,
    );
  }, [cartItems]);

  /* Subtotal */
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.price ?? 0) * (item.quantity ?? 0),
      0,
    );
  }, [cartItems]);

  /* Memoize context value to optimize re-renders */
  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      lastAddedItem,
      clearLastAddedItem,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      lastAddedItem,
      clearLastAddedItem,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}