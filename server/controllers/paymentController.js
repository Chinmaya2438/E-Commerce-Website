import Order from "../models/Order.js";

// POST /api/payment/create-session
export const createStripeSession = async (req, res) => {
  res.json({ message: "Mock session created", success: true });
};

// POST /api/payment/verify-session
export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id, orderId, mock_transaction_id } = req.body;
    
    // Accept our mock transaction IDs
    const txId = mock_transaction_id || session_id;

    if (txId && txId.startsWith("mock_tx_")) {
      const order = await Order.findById(orderId);
      
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = { stripe_session_id: txId };
        await order.save();
      }
      
      return res.json({ message: "Mock payment mathematically verified", isPaid: true });
    } else {
      return res.status(400).json({ message: "Payment was not successfully completed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
