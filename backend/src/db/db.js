import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    coin_id: { type: String, required: true },
    coin_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true }
});
export default mongoose.model("Order", orderSchema);
//# sourceMappingURL=db.js.map