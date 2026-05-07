import mongoose from "mongoose";

const cinemaWalletSchema = new mongoose.Schema({
  totalRevenue: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CinemaWallet", cinemaWalletSchema);
