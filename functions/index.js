/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_0Q6QFfzO9h8Gtp', // Replace with your Razorpay Key ID
  key_secret: 'hmJbWbOnINSQP2JHWUVpP5nF' // Replace with your Razorpay Secret
});

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
    try {
      const options = {
        amount: data.amount * 100, // Convert amount to the smallest currency unit
        currency: 'INR',
        receipt: generateReceiptNumber(),
      };
  
      const order = await razorpay.orders.create(options);
  
      if (order && order.id) {
        return { orderId: order.id };
      } else {
        console.error('Error creating Razorpay order: Invalid order response', order);
        throw new functions.https.HttpsError('internal', 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new functions.https.HttpsError('internal', 'Failed to create order');
    }
  });
  
function generateReceiptNumber() {
    // Get the current date and time
    const currentDate = new Date();
  
    // Extract relevant date components
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1 and pad with zero if needed
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    // Create a formatted date and time string (e.g., "20240103123456")
    const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;
  
    // You can also implement a logic to generate a unique sequential number or fetch it from a database
    // For now, we'll use a placeholder value "1000" as a sequential number
    const sequentialNumber = "1000"; // Replace this with your logic to generate or fetch a sequential number
  
    // Combine the date and sequential number to create a unique receipt number
    const receiptNumber = `${dateTimeString}-${sequentialNumber}`;
  
    return receiptNumber;
  }

