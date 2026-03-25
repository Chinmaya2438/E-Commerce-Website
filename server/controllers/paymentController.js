import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-checkout-session
export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    // Build line items from verified DB data (never trust frontend prices)
    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects paise
      },
      quantity: item.quantity,
    }));

    // If there's a discount, show it as a separate discounted line item
    // by creating a single line item for the total with discount applied
    if (order.discountAmount > 0) {
      // Add a discount display line (negative amount shown as a 0-cost info line)
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: `🎟️ Coupon Discount (${order.couponCode || "Applied"})`,
          },
          unit_amount: 0, // Free line item just for display
        },
        quantity: 1,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Build session config
    const sessionConfig = {
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${frontendUrl}/orders?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${frontendUrl}/checkout?cancelled=true`,
    };

    // Apply discount as an automatic Stripe coupon if applicable
    if (order.discountAmount > 0) {
      try {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(order.discountAmount * 100),
          currency: "inr",
          duration: "once",
          name: order.couponCode || "Discount",
        });
        sessionConfig.discounts = [{ coupon: coupon.id }];
      } catch (couponError) {
        console.error("Stripe coupon creation failed, proceeding without discount display:", couponError.message);
        // Fallback: adjust the line items to reflect the discounted total directly
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ message: "Failed to create payment session: " + error.message });
  }
};

// POST /api/payment/verify-session
export const verifyCheckoutSession = async (req, res) => {
  try {
    const { session_id, orderId } = req.body;

    if (!session_id || !orderId) {
      return res.status(400).json({ message: "Session ID and Order ID are required" });
    }

    // Retrieve the session from Stripe API
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (stripeError) {
      console.error("Stripe retrieve error:", stripeError.message);
      return res.status(400).json({ message: "Invalid or expired session" });
    }

    console.log("Stripe session status:", session.payment_status, "for order:", orderId);

    // Verify the session belongs to this order via metadata
    if (session.metadata?.orderId !== orderId) {
      return res.status(400).json({ message: "Session does not match order" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Accept "paid" status — for card payments this is immediate
    if (session.payment_status === "paid") {
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          stripe_session_id: session.id,
          payment_intent: session.payment_intent,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
        };
        await order.save();
      }
      return res.json({ message: "Payment verified successfully", isPaid: true });
    }

    // If payment is still processing (rare for cards but possible)
    if (session.payment_status === "unpaid" && session.status === "complete") {
      // Session completed but payment still processing (async payment methods)
      return res.json({ message: "Payment is being processed", isPaid: false, processing: true });
    }

    return res.status(400).json({ message: "Payment was not completed. Status: " + session.payment_status });
  } catch (error) {
    console.error("Stripe verification error:", error.message);
    res.status(500).json({ message: "Payment verification failed: " + error.message });
  }
};
