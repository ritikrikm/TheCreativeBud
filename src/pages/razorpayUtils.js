import { getFunctions, httpsCallable } from 'firebase/functions';

const createOrder = async (amount) => {
  try {
    const functionsInstance = getFunctions(); // Initialize Firebase Functions
    const createOrderCallable = httpsCallable(functionsInstance, 'createRazorpayOrder');
    const result = await createOrderCallable({ amount });
    console.log("Response from Firebase Function:", result);

    if (result.data && result.data.orderId) {
      return result.data.orderId;
    } else {
      console.error("Error creating order: Invalid response from Firebase Function");
      return null;
    }
  } catch (error) {
    console.error("Error creating order: ", error);
    return null;
  }
};

export default createOrder;
