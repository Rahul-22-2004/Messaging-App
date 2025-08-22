// import jwt from "jsonwebtoken";

// export const generateToken= (UserId, res) =>{

//     const token = jwt.sign({UserId}, process.env.JWT_SECRET , {
//         expiresIn: "7d"
//     });

//     res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production" ? true : false,
//     sameSite: "lax",   // ✅ important for localhost cross-origin
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });

//     return token;
// }

// utils.js
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, // ✅ Important
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ Important for localhost
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
