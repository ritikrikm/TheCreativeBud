import React, { useContext } from 'react';
import { CartContext } from './CartProvider';
import Header from './Header';
import Footer from './Footer';
import '../styling/mainCart.css';
import  loadRazorpay  from './loadRazorpay'; 
import  createOrder  from './razorpayUtils'; 
import { database } from '../firebase'; // Existing import
import { ref, set, remove } from 'firebase/database';
import { Helmet } from 'react-helmet';


const Cart = () => {
  const { cartItems, removeItem, updateQuantity, saveForLater,user,clearCart } = useContext(CartContext);

  const handleQuantityChange = (item, quantity) => {
    updateQuantity(item.id, quantity);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleSaveForLater = (item) => {
    saveForLater(item.id);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  const backClear = async () => {
    if (user && user.uid) {
      const cartRef = ref(database, `carts/${user.uid}`);
      await remove(cartRef);
    }
  };
  console.log("I am main"+loadRazorpay);
  const handleBuyNow = async () => {
    console.log('Buy Now button clicked.');

    const isLoaded = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

    if (!isLoaded) {
      console.log('Razorpay SDK failed to load. Are you online?');
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // Call your backend function to create an order
    console.log('Calling createOrder function...');
    try {
      const orderResponse = await createOrder(calculateTotal());
      console.log('Order Response:', orderResponse);
      if (!orderResponse) {
        console.error('Error creating Razorpay order: Invalid order response', orderResponse);
        throw new Error('Invalid order data. Are you online?');
      }
      console.log('User:', user);
      const orderId = orderResponse; // Extract the orderId from the response
      console.log('Extracted orderId:', orderId);
      const options = {
        key: 'rzp_test_0Q6QFfzO9h8Gtp',
        amount: calculateTotal() * 100, // Use the total amount directly (ensure it's in the smallest currency unit)
        currency: 'INR',
        name: 'TheCreativeBud',
        description: 'Test Transaction',
        order_id: orderId, // Use the extracted orderId
        handler: async (response) => {
          console.log('Payment Success:', response);
          const orderId = response.razorpay_order_id;
  
          if (user && user.uid) {
            console.log(database);
            const orderRef = ref(database, `orders/${user.uid}/${orderId}`);
            await set(orderRef, {
              products: cartItems,
              total: calculateTotal(),
              paymentDetails: response
            });
            await backClear();
            clearCart();
            alert("Payment Completed")
            // Additional logic post payment success
            // e.g., clearing the cart, showing confirmation, etc.
          } else {
            console.log('User not logged in or UID not available');
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error while processing the order:', error.message);
      alert('Error while processing the order: ' + error.message);
    }
  };
  
  
  return (

    <div className="main-content-container">
      <Helmet>
    <meta name="description" content="View your shopping cart at TheCreativeBud. Easily manage the items you're planning to purchase, update quantities, or proceed to checkout." />
</Helmet>

      <Header />
      <div className="cart">
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
    <div className="cart-item" key={item.id}>
        <div className="item-image">
            {/* Use the first photo from the photos array */}
            <img src={item.photos && item.photos.length > 0 ? item.photos[0] : '/imgna.png'} alt={item.name} />
        </div>
        <div className="item-details">
            <h3>{item.name}</h3>
            <p className="item-price">₹{item.price}</p>
            <div className="item-actions">
                <div className="quantity-selector">
                    Qty:
                    <select
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                    >
                        {[...Array(10).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                                {x + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="delete-btn" onClick={() => handleRemoveItem(item.id)}>Delete</button>
                <button className="save-for-later-btn" onClick={() => handleSaveForLater(item)}>Save for later</button>
            </div>
        </div>
    </div>
))}
            <div className="cart-summary">
              <p>Subtotal ({cartItems.length} item{cartItems.length !== 1 && 's'}): ₹{calculateTotal()}</p>
               <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
