const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const newsRoutes = require("./routes/news.routes");
const News = require("./models/news.model")
const app = express();
const employeeRoutes = require("./routes/employee.routes");
const contactRoutes = require("./routes/contact.routes");

require("dotenv").config();
 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "बहुत ज्यादा requests भेजी गई हैं। कृपया कुछ देर बाद कोशिश करें।",
  },
});

app.use("/api/", apiLimiter);
app.use(
  cors({
     origin: "https://asv-news-frontend.onrender.com/",
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/news", newsRoutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});



module.exports = app;
