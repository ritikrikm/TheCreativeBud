import React, { useState } from 'react';

const RazorpayTest = () => {
  const [orderId] = useState('order_NKOQ0EdAJw0vhi'); // Hard-coded orderId
  const [amount] = useState(10000); // Hard-coded amount (in paise)

  const handlePayment = () => {
    const options = {
      key: 'rzp_test_0Q6QFfzO9h8Gtp', // Your Razorpay test key
      amount: amount, // Use the hard-coded amount
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Test Transaction',
      order_id: orderId, // Use the hard-coded orderId
      handler: function (response) {
        // Handle the payment success
        console.log('Payment successful:', response);
      },
      prefill: {
        name: 'Your Name',
        email: 'youremail@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <h2>Razorpay Test Page</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default RazorpayTest;
