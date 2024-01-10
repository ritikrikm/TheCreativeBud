import React, { useEffect, useState, useContext } from "react";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { UserContext } from './UserContext';
import '../styling/orderprofile.css';

const OrderProfile = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const { currentUser,additionalUserInfo } = useContext(UserContext);
  const userId = currentUser ? currentUser.uid : null;
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  console.log("CHECKME"+additionalUserInfo);
  console.log(JSON.stringify(additionalUserInfo, null, 2));
  const handleStatusClick = () => {
    setShowStatusPopup(!showStatusPopup);
  };
  useEffect(() => {
    const role = additionalUserInfo?.role;
    setIsAdmin(role === 'admin');
    if (isAdmin) {
      // Fetch users who have placed orders
      const usersRef = ref(database, 'users');
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        let fetchedUsers = [];
        if (usersData) {
          Object.keys(usersData).forEach((key) => {
            if (usersData[key].hasOwnProperty('name')) {
              fetchedUsers.push({ uid: key, name: usersData[key].name
               });
            }
          });
          setUsers(fetchedUsers);
        }
      });
    }

    // Fetch orders
    const ordersRef = isAdmin ? ref(database, 'orders') : ref(database, `orders/${userId}`);
    console.log(database);
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      let fetchedOrders = [];
      if(isAdmin){
        if (data) {
          Object.keys(data).forEach((userKey) => {
            Object.keys(data[userKey]).forEach((orderKey) => {
              fetchedOrders.push({
                ...data[userKey][orderKey],
                orderId: orderKey,
                userId: userKey
              });
            });
          });
          setOrders(fetchedOrders);
        }
      }else{
        if (data) {
          Object.keys(data).forEach((orderKey) => {
            fetchedOrders.push({
              ...data[orderKey],
              orderId: orderKey
            });
          });
          setOrders(fetchedOrders);
        }
      }
     
    });

  }, [additionalUserInfo,userId, isAdmin]);
// Function to fetch address and pincode from UserContext
  const fetchUserAddressDetails = () => {
    return {
      address: additionalUserInfo?.address1 || 'Not available',
      pincode: additionalUserInfo?.pinCode || 'Not available',
      street:  additionalUserInfo?.state    || 'Not availabe'
    };
  };
  // Use the function to get the address and pincode
  const userAddressDetails = fetchUserAddressDetails();
  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
    setSelectedOrderId('');
    setUserDetails({}); 
  };

  const handleOrderChange = (event) => {
    setSelectedOrderId(event.target.value);
  };
  const handleDetailsClick = () => {
    if(selectedUserId){
      const userDetailRef = ref(database, `users/${selectedUserId}/address`);
      onValue(userDetailRef, (snapshot) => {
        setUserDetails(snapshot.val() || {});
        setShowPopup(true);
      });
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const selectedOrder = orders.find(order => order.userId === selectedUserId && order.orderId === selectedOrderId);
  if (!currentUser) {
    return (
      <div>
        <p>Please log in to view your profile.</p>
        {/* Optionally, include a link or button to redirect to the login page */}
      </div>
    );
  }
  return (
    <div className="user-profile">
      <h2>{isAdmin ? "Admin View - All Orders" : "My Orders"}</h2>

      {isAdmin && (
        <>
          <select onChange={handleUserChange} value={selectedUserId}>
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.name}
              </option>
            ))}
          </select>

          <select onChange={handleOrderChange} value={selectedOrderId}>
            <option value="">Select an Order</option>
            {orders.filter(order => order.userId === selectedUserId).map((order) => (
              <option key={order.orderId} value={order.orderId}>
                {order.orderId}
              </option>
            ))}
          </select>
          <button onClick={handleDetailsClick}>Details</button>
          {showPopup && (
            <div className="user-details-popup">
              <h3>User Details</h3>
              <p>Address: {userAddressDetails.address}</p>
              <p>Street: {userAddressDetails.street}</p>
              <p>Pincode: {userAddressDetails.pincode}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          )}
          {/* Order details display */}
        </>
      )}

      {!isAdmin && (
        <>
          <select onChange={handleOrderChange}>
            <option value="">Select an Order</option>
            {orders.map((order) => (
              <option key={order.orderId} value={order.orderId}>
                Order ID: {order.orderId}
              </option>
            ))}
          </select>
          {/* Order details display */}
        </>
      )}

{selectedOrderId && (
  <div>
    {orders.find(order => order.orderId === selectedOrderId).products.map((product, index) => (
      <div key={index} className="product-item">
        {product.photos && product.photos.length > 0 && (
          <img src={product.photos[0]} alt={product.name} className="product-image" />
        )}
        <div className="product-details">
          <h3>{product.name}</h3>
          <p>Description: {product.desc}</p>
          <p>Quantity: {product.quantity}</p>
          <p className="product-price">Price: {product.price}</p>
        </div>
      </div>
    ))}
    <p className="subtotal">Subtotal: {orders.find(order => order.orderId === selectedOrderId).total}</p>
    <button onClick={handleStatusClick}>Get Status</button>
  </div>
)}
       {showStatusPopup && (
        <div className={`popup-overlay ${showStatusPopup ? 'popup-show' : ''}`}>
          <div className="popup-content">
            <h2 id="csH2">Coming Soon</h2>
            <button className="popup-button" onClick={handleStatusClick}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProfile;
