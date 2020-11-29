const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
require("dotenv-safe").config();
const xssFilters = require("xss-filters");
const stripe = require("stripe")(`${process.env.STRIPE_SK}`);

const app = express();
const PORT = 8080;

express.static(".");
app.use(bodyParse.json());

const corsOptions = {
  origin: [
    "https://apps.pfdzm.me",
    "https://apps.fernandezmichel.com",
    "https://doner.now.sh",
    "http://localhost:3000"
  ],
};

app.use(cors(corsOptions));

const YOUR_DOMAIN = "https://apps.pfdzm.me";

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World!");
});

app.get("/hello/:name", (req, res) => {
  console.log(req);
  const { name } = req.params;
  const greet = (name) => ({ name: name });
  const escapedName = xssFilters.uriQueryInHTMLData(name);
  res.send(greet(escapedName));
});

app.post("/create-checkout-session", async (req, res) => {
  const { item, mode } = req.body;
  if (!item || !mode) res.send(500);
  console.log(req.body);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: mode,
    line_items: item,
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/canceled`,
  });
  res.json({ id: session.id });
});

app.listen(PORT, () => {
  console.log(`express server running on port ${PORT}`);
});
