const express = require("express");
const cors = require("cors");
const Mailgun = require("mailgun.js");
const formData = require("form-data");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MAIL GUN CONFIG
const mailGun = new Mailgun(formData);
const client = mailGun.client({
  username: "Martin ROUY",
  key: process.env.API_KEY,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Coucou!" });
});

app.post("/form", async (req, res) => {
  try {
    // 1. req.body destructuring
    const { firstName, lastName, email, subject, message } = req.body;
    console.log(req.body);

    // 2. Create messageData = {from, to, subject, text}
    const messageData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: "dkl.media@dhagpo.org",
      subject: subject,
      text: message,
    };

    // 3. SEND messageData to Mailgun: resp = await client.messages.create("sandbox_domain", messageData)
    const resp = await client.messages.create(process.env.DOMAIN, messageData);

    // 4. configure response
    // console.log(res);
    res.json(resp);
    // res.status().json({ message: "Mail successfully sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not Found." });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started 🚀");
});
