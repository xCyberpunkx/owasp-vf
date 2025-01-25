require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const bodyParser = require("body-parser")
const authRoutes = require("./routes/authRoutes")
const { authenticateToken, authorize } = require("./middleware/auth")

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Routes
app.use("/auth", authRoutes)

// Protected routes
app.get("/admin", authenticateToken, authorize(["SUPER_ADMIN"]), (req, res) => {
  res.json({ message: "Welcome, Super Admin!" })
})

app.get("/clinic", authenticateToken, authorize(["CLINIC_ADMIN", "SUPER_ADMIN"]), (req, res) => {
  res.json({ message: "Welcome to the Clinic Dashboard!" })
})

app.get("/dentist", authenticateToken, authorize(["DENTIST", "CLINIC_ADMIN", "SUPER_ADMIN"]), (req, res) => {
  res.json({ message: "Welcome, Dentist!" })
})

app.get("/receptionist", authenticateToken, authorize(["RECEPTIONIST", "CLINIC_ADMIN", "SUPER_ADMIN"]), (req, res) => {
  res.json({ message: "Welcome, Receptionist!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

