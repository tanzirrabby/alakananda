const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// ========== bKash Payment ==========
// bKash tokenized checkout integration
router.post('/bkash/grant-token', protect, async (req, res) => {
  try {
    const response = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'username': process.env.BKASH_USERNAME,
        'password': process.env.BKASH_PASSWORD
      },
      body: JSON.stringify({
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bkash/create-payment', protect, async (req, res) => {
  try {
    const { amount, orderId, idToken } = req.body;
    const response = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': idToken,
        'x-app-key': process.env.BKASH_APP_KEY
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: req.user._id.toString(),
        callbackURL: `${process.env.CLIENT_URL}/payment/bkash/callback`,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: orderId
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bkash/execute', protect, async (req, res) => {
  try {
    const { paymentID, idToken, orderId } = req.body;
    const response = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': idToken,
        'x-app-key': process.env.BKASH_APP_KEY
      },
      body: JSON.stringify({ paymentID })
    });
    const data = await response.json();

    if (data.statusCode === '0000') {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentDetails: {
          transactionId: data.trxID,
          paidAt: new Date(),
          gateway: 'bkash'
        }
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== SSLCommerz (Nagad + Card) ==========
router.post('/sslcommerz/init', protect, async (req, res) => {
  try {
    const { orderId, amount, name, email, phone, address } = req.body;
    const SSLCommerzPayment = require('sslcommerz-lts');

    const store_id = process.env.SSLCZ_STORE_ID;
    const store_passwd = process.env.SSLCZ_STORE_PASSWD;
    const is_live = process.env.SSLCZ_IS_LIVE === 'true';

    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: orderId,
      success_url: `${process.env.CLIENT_URL}/payment/success?orderId=${orderId}`,
      fail_url: `${process.env.CLIENT_URL}/payment/fail?orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel?orderId=${orderId}`,
      ipn_url: `${process.env.CLIENT_URL}/api/payment/sslcommerz/ipn`,
      shipping_method: 'Courier',
      product_name: 'Handmade Churi - অলকানন্দা',
      product_category: 'Jewellery',
      product_profile: 'general',
      cus_name: name,
      cus_email: email,
      cus_add1: address,
      cus_phone: phone,
      ship_name: name,
      ship_add1: address,
      ship_city: 'Dhaka',
      ship_country: 'Bangladesh'
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL });
    } else {
      res.status(400).json({ message: 'Failed to initiate payment' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sslcommerz/ipn', async (req, res) => {
  try {
    const { tran_id, status, val_id } = req.body;
    if (status === 'VALID') {
      await Order.findByIdAndUpdate(tran_id, {
        paymentStatus: 'paid',
        paymentDetails: {
          transactionId: val_id,
          paidAt: new Date(),
          gateway: 'sslcommerz'
        }
      });
    }
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COD confirmation
router.post('/cod/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'COD order confirmed' });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
