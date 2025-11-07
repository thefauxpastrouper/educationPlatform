import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    coin_id: string;
    coin_price: number;
    quantity: number;
    total: number;
    timestamp: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    coin_id: string;
    coin_price: number;
    quantity: number;
    total: number;
    timestamp: NativeDate;
}, {}, mongoose.DefaultSchemaOptions> & {
    coin_id: string;
    coin_price: number;
    quantity: number;
    total: number;
    timestamp: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    coin_id: string;
    coin_price: number;
    quantity: number;
    total: number;
    timestamp: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    coin_id: string;
    coin_price: number;
    quantity: number;
    total: number;
    timestamp: NativeDate;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    coin_id: string;
    coin_price: number;
    quantity: number;
    total: number;
    timestamp: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=db.d.ts.map