import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscribers:{
        type:Schema.Types.ObjectId,  // one who is Subscribing
        ref:"User",
    },
    channel:{
        type:Schema.Types.ObjectId , //one to whom 'subscriber' is SUBSCIEBING
        ref:"User"
    },

},{timestamps:true})
export const Subcription  = mongoose.model("Subscription",subscriptionSchema)