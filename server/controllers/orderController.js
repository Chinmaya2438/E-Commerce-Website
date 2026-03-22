import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import PDFDocument from "pdfkit";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image?.url || "",
    }));

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id/invoice
export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Security: Only the owner or an admin can access the receipt
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized to download this invoice" });
    }

    // Create the PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice_${order._id.toString().slice(-8).toUpperCase()}.pdf`
    );

    doc.pipe(res);

    // --- HELPER FOR PAGE WRAP ---
    const checkPageWrap = (heightRequired) => {
      if (doc.y + heightRequired > doc.page.height - 100) {
        doc.addPage();
        return true;
      }
      return false;
    };

    // --- HEADER (MINIMALIST & PROFESSIONAL) ---
    doc.fillColor("#000000").fontSize(28).text("INVOICE", { align: "right" });
    
    // Brand Logo/Name
    doc.fontSize(20).text("ShopVerse Inc.", 50, 50, { bold: true });
    doc.fontSize(10).fillColor("#555555").text("Junagarh, Kalahandi, Odisha", 50, 75);
    doc.text("support@shopverse.com | +91 9876543210", 50, 90);

    doc.moveTo(50, 115).lineTo(545, 115).strokeColor("#cccccc").lineWidth(1).stroke();

    // --- BILLING INFO ---
    doc.fontSize(10).fillColor("#888888").text("BILL TO:", 50, 135);
    doc.fillColor("#000000").fontSize(12).text(order.shippingAddress.fullName, 50, 150, { bold: true });
    doc.fontSize(10).fillColor("#333333").text(order.shippingAddress.address, 50, 165);
    
    // Using correct database schema fields
    const cityStateZip = `${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} ${order.shippingAddress.zipCode || ""}`;
    doc.text(cityStateZip.trim());
    if (order.shippingAddress.phone) {
      doc.text(`Phone: ${order.shippingAddress.phone}`);
    }

    // --- INVOICE DETAILS ---
    const invoiceDetailsX = 400;
    doc.fontSize(10).fillColor("#888888").text("INVOICE NO:", invoiceDetailsX, 135);
    doc.fillColor("#000000").text(`#${order._id.toString().slice(-8).toUpperCase()}`, invoiceDetailsX + 70, 135);

    doc.fillColor("#888888").text("DATE:", invoiceDetailsX, 155);
    doc.fillColor("#000000").text(new Date(order.createdAt).toLocaleDateString("en-IN"), invoiceDetailsX + 70, 155);

    doc.fillColor("#888888").text("STATUS:", invoiceDetailsX, 175);
    const isPaid = order.isPaid || order.status !== "pending";
    const statusText = isPaid ? "PAID" : "PENDING";
    doc.fillColor(isPaid ? "#16a34a" : "#ca8a04").text(statusText, invoiceDetailsX + 70, 175, { bold: true });

    // --- TABLE HEADERS ---
    let yPos = 240;
    doc.fillColor("#000000").fontSize(10);
    doc.rect(50, yPos, 495, 20).fill("#f9fafb");
    doc.fillColor("#888888");
    doc.text("ITEM", 60, yPos + 5, { bold: true });
    doc.text("QTY", 330, yPos + 5, { bold: true });
    doc.text("RATE", 400, yPos + 5, { bold: true });
    doc.text("AMOUNT", 480, yPos + 5, { bold: true });
    
    yPos += 30;

    // --- LINE ITEMS ---
    doc.fillColor("#333333");
    order.items.forEach((item, index) => {
      checkPageWrap(30);
      
      const pName = item.product ? item.product.name : "Deleted Product";
      const shortName = pName.length > 45 ? pName.substring(0, 42) + "..." : pName;
      
      doc.text(shortName, 60, yPos);
      doc.text(item.quantity.toString(), 330, yPos);
      doc.text(`Rs. ${item.price.toLocaleString("en-IN")}`, 400, yPos);
      doc.text(`Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}`, 480, yPos);
      
      yPos += 20;
      doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor("#eeeeee").lineWidth(1).stroke();
      yPos += 10;
    });

    // --- TOTALS SECTION ---
    checkPageWrap(100);
    yPos += 10;
    
    doc.fontSize(10).fillColor("#888888").text("SUBTOTAL", 380, yPos);
    doc.fillColor("#333333").text(`Rs. ${order.totalPrice.toLocaleString("en-IN")}`, 480, yPos);
    
    yPos += 20;
    doc.fillColor("#888888").text("TAX/SHIPPING", 380, yPos);
    doc.fillColor("#333333").text("Rs. 0.00", 480, yPos);

    yPos += 20;
    doc.moveTo(380, yPos).lineTo(545, yPos).strokeColor("#000000").lineWidth(2).stroke();
    
    yPos += 10;
    doc.fontSize(12).fillColor("#000000").text("GRAND TOTAL", 350, yPos, { bold: true });
    doc.fontSize(14).text(`Rs. ${order.totalPrice.toLocaleString("en-IN")}`, 460, yPos - 2, { bold: true });

    // --- FOOTER ---
    const footerY = doc.page.height - 70;
    doc.fontSize(9).fillColor("#888888").text(
      "This is an electronically generated document and does not require a signature.",
      50,
      footerY,
      { align: "center" }
    );
    doc.text(
      "If you have any questions concerning this invoice, contact support@shopverse.com",
      50,
      footerY + 15,
      { align: "center" }
    );

    doc.end();

  } catch (error) {
    res.status(500).json({ message: "Failed to mathematically draw PDF invoice" });
  }
};
