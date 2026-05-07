import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";
import CinemaWallet from "../models/cinemaWalletModel.js";

const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment)
      return res.status(404).json({ message: "Payment record not found" });
    if (payment.status === "paid")
      return res.status(400).json({ message: "Already paid" });

    const booking = await Booking.findById(bookingId);
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      clientSecret: "fake_client_secret_" + payment._id,
      paymentId: payment._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment)
      return res.status(404).json({ message: "Payment record not found" });

    payment.status = "paid";
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.status = "confirmed";
      await booking.save();
    }

    // Increase amount of money of the cinema
    let wallet = await CinemaWallet.findOne();
    if (!wallet) {
      wallet = new CinemaWallet({ totalRevenue: 0 });
    }
    wallet.totalRevenue += payment.amount;
    wallet.lastUpdated = Date.now();
    await wallet.save();

    res.json({ message: "Payment confirmed (Fake API)", booking, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).select("_id");
    const bookingIds = bookings.map(b => b._id);
    
    const payments = await Payment.find({ booking: { $in: bookingIds } })
      .populate({
        path: "booking",
        populate: { path: "showtime" }
      });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  createPaymentIntent,
  confirmPayment,
  getUserPayments
};
