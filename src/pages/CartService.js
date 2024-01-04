import { ref, set, get, child } from 'firebase/database';
import { database } from './firebase';

export const addToCart = async (userId, product) => {
  // Define path
  const cartRef = ref(database, 'carts/' + userId);
  
  // Get current cart
  const snapshot = await get(child(cartRef, '/'));
  const cart = (snapshot.exists() ? snapshot.val() : {});

  // Update or add product
  if (cart[product.id]) {
    cart[product.id].quantity += 1;
  } else {
    cart[product.id] = {...product, quantity: 1};
  }

  // Set updated cart
  await set(cartRef, cart);
};

export const getCart = async (userId) => {
  const cartRef = ref(database, 'carts/' + userId);
  const snapshot = await get(cartRef);
  return snapshot.exists() ? snapshot.val() : {};
};
