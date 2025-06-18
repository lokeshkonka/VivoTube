import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema  = new Schema({
    videofile:{
    type:String,
    required:true,},
    thumbnail:{
        
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    ispublished:{
    type: Boolean,
    default: true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },


},{timestamp:true})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)