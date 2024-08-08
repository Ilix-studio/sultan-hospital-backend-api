import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//Login Admin
//POST Request - /api/admin/login
//Generate token and store cookie based

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const admin = await User.findOne({ email })
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const matchPassword = await bcrypt.compare(password, admin.password)
  if (!matchPassword) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  //generate accessToken and refreshToken
  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: admin.email,
        role: admin.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' },
  )
  const refreshToken = jwt.sign(
    {
      email: admin.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  )
  //create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    //7 Days
  })
  //send accessToken containing email and role
  res.json({ accessToken })
})

//Token Refresh - to login admin to extended period
//GET Request - /api/admin/refresh

const refresh = (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Cookies not found' })
  }
  const refreshToken = cookies.jwt
  console.log(refreshToken)
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const adminDecode = await User.findOne({ email: decoded.email })
      if (!adminDecode) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      //generate new access token
      const newAccessToken = jwt.sign(
        {
          UserInfo: {
            email: adminDecode.email,
            role: adminDecode.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '10s',
        },
      )
      res.json({ newAccessToken })
    }),
  )
}

//GET Request - /api/admin/adminDashboard
//Private

const adminDasHboard = asyncHandler(async (req, res) => {
  // console.log(res);
  res.status(200).json({ message: "Admin Dashboard" });
});

//Logout Admin
//POST Request - /api/admin/logout
//destroy cookie

const logout = (req, res) => {
  const cookieJar = req.cookies
  if (!cookieJar?.jwt) {
    return res.sendStatus(204)
  }
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
  res.json({ message: 'cookie clear' })
}

export { loginAdmin, refresh, adminDasHboard, logout }
