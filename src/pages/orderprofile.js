import React, { useEffect, useState, useContext } from "react";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { UserContext } from './UserContext';
import '../styling/orderprofile.css'
const OrderProfile = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useContext(UserContext);
  const userId = currentUser ? currentUser.uid : null;
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIfAdmin = () => {
    // Placeholder function to check admin status
    // Implement your own logic here based on your authentication system
    return false; // This should be replaced with actual check
  };

  useEffect(() => {
    const isAdminUser = checkIfAdmin();
    setIsAdmin(isAdminUser);

    let ordersRef = ref(database, `orders/${userId}`);
    if (isAdminUser) {
      ordersRef = ref(database, 'orders');
    }

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      let fetchedOrders = [];
      if (data) {
        if (isAdminUser) {
          Object.keys(data).forEach((userId) => {
            Object.keys(data[userId]).forEach((orderId) => {
              fetchedOrders.push({
                ...data[userId][orderId],
                orderId
              });
            });
          });
        } else {
          Object.keys(data).forEach((orderId) => {
            fetchedOrders.push({
              ...data[orderId],
              orderId
            });
          });
        }
        setOrders(fetchedOrders);
      }
    }, {
      onlyOnce: true
    });
  }, [userId]);

  return (
    <div className="user-profile">
      <h2>My Orders</h2>
      {isAdmin ? (
        // Admin view: List all orders
        orders.map((order) => (
          <div key={order.orderId} className="order-item">
            <p>Order ID: {order.orderId}</p>
            {/* Map through all products in the order */}
            {order.products.map((product, index) => (
              <div key={index} className="product-item">
                <img src={product.photo} alt={product.name} className="product-image" />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>Description: {product.desc}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p className="product-price">Price: {product.price}</p>
                  
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        // Regular user view: List their orders
        orders.map((order) => (
          <div key={order.orderId} className="order-item">
            <p>Order ID: {order.orderId}</p>
            {order.products.map((product, index) => (
              <div key={index} className="product-item">
                <img src={product.photo} alt={product.name} className="product-image" />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.desc}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p className="product-price">Price: {product.price}</p>
               
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderProfile;
