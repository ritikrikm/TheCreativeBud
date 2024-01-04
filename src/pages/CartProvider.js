import React, { useContext, useEffect, useState, createContext } from 'react';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Adjust the path as necessary

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const cartRef = ref(db, 'carts/' + user.uid);
      get(cartRef).then((snapshot) => {
        if (snapshot.exists()) {
          setCartItems(Object.values(snapshot.val()));
        } else {
          setCartItems([]);
        }
      });
    }
  }, [user]);

  const updateCartInDatabase = (updatedCartItems) => {
    if (user) {
      const db = getDatabase();
      set(ref(db, 'carts/' + user.uid), updatedCartItems.reduce((cartObj, item) => {
        cartObj[item.id] = item;
        return cartObj;
      }, {}));
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProductIndex = prevItems.findIndex(item => item.id === product.id);
      let newCartItems;

      if (existingProductIndex > -1) {
        newCartItems = [...prevItems];
        newCartItems[existingProductIndex] = {
          ...newCartItems[existingProductIndex],
          quantity: newCartItems[existingProductIndex].quantity + 1
        };
      } else {
        newCartItems = [...prevItems, { ...product, quantity: 1 }];
      }

      updateCartInDatabase(newCartItems);
      return newCartItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const productIndex = prevItems.findIndex(item => item.id === productId);
      if (productIndex > -1) {
        const newCartItems = [...prevItems];
        newCartItems[productIndex] = {
          ...newCartItems[productIndex],
          quantity: quantity
        };
        updateCartInDatabase(newCartItems);
        return newCartItems;
      }
      return prevItems;
    });
  };

  const removeItem = (productId) => {
    setCartItems((prevItems) => {
      const newCartItems = prevItems.filter(item => item.id !== productId);
      updateCartInDatabase(newCartItems);
      return newCartItems;
    });
  };

  const saveForLater = (productId) => {
    // This function should be implemented to handle saving for later logic.
    // Currently, it will just remove the item from the cart.
    removeItem(productId);
    // You need to implement the logic to add this item to the 'saved for later' list.
  };
  const clearCart = () => {
    setCartItems([]); // Assuming `setCartItems` is your state updater function for cart items
  };
  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem,clearCart, saveForLater, user }}>
      {children}
    </CartContext.Provider>
  );
};
