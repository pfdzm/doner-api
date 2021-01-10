const routes = require('express').Router()
const xssFilters = require('xss-filters')
const stripe = require('stripe')(`${process.env.STRIPE_SK}`)
require('dotenv-safe').config()

const YOUR_DOMAIN = 'https://apps.pfdzm.me'

routes.get('/', (req, res) => {
  console.log(req)
  res.send('Hello World!')
})

routes.get('/hello/:name', (req, res) => {
  console.log(req)
  const { name } = req.params
  const greet = (name) => ({ name: name })
  const escapedName = xssFilters.uriQueryInHTMLData(name)
  res.send(greet(escapedName))
})

routes.post('/create-checkout-session', async (req, res) => {
  const { item, mode } = req.body
  if (!item || !mode) res.send(500)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: mode,
    line_items: item,
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/canceled`,
  })
  res.json({ id: session.id })
})

routes.post('/token', (req, res) => {
  let token = req.body.token
  console.log(token)

  if (token === 'secret-auth-string') {
    res.status(200).send(JSON.stringify({ token: 'top-secret-token' }))
  } else {
    res.status(401).send()
  }
})

module.exports = routes
