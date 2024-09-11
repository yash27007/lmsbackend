import express from "express";
import router from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import passport from "passport";
const PORT = 5000;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(router);
app.listen(PORT,()=>{
  console.log(`Server running on port http://localhost:${PORT}`);
})