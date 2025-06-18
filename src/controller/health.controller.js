import { apiresponse } from "../utils/apirespnse.js";
import {asynchandle} from "../utils/asynchandler.js";
const healthcheck = asynchandle(async (req,res)=>{
return res
.status(200)
.json(new apiresponse(200,"OK","Health check passed"))
})
export {healthcheck}