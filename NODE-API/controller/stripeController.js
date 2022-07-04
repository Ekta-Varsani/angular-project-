  const stripe = require('stripe')('sk_test_51LGcrmItXZ8PhVwXc8CnghuVOPiwde0Qlv5LkIWg8aqob1GlfAHLLjchuxAfV4WXUiEvzB8ElFt4NTGRrzsFf3xK00N40tQcUi');
  
  //create custmor in stripe
  const stripeCustomer = async (req, res) => {
    
    const newCustomer = await stripe.customers.create({
     name: req.body.name,
     email: req.body.email,
     source: req.body.token.id
    })
    
    res.send(newCustomer)
  }

  const payment = async(req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 0,
      currency: 'inr',
      payment_method_types: ['card'],
    });
  }
 
  module.exports = {
    stripeCustomer,
    payment
  }