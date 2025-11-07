import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    coin_id: { type: String, required: true },
    coin_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model("Order", orderSchema);
