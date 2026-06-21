require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Email Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Item Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image_url: String,
  is_available: { type: Boolean, default: true },
  reserved_by: {
    name: String,
    email: String,
    message: String
  }
});

const Item = mongoose.model('Item', ItemSchema);

// API Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create Item
app.post('/api/items', async (req, res) => {
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update Item
app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete Item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/api/items/:id/reserve', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        is_available: false,
        reserved_by: { name, email, message }
      },
      { new: true }
    );
    
    // Send email to Donor
    const donorMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Votre contribution pour : ${item.name}`,
      text: `Bonjour ${name},

Nous vous remercions pour votre contribution à l'achat de ${item.name} d'un montant de ${item.price}€. 
Vous pouvez contribuer directement à ce cadeau par un simple virement au compte suivant:

Nom: Aurelie Champagne
IBAN: BE98103027337193
BIC: NICABEBBXXX
Communication: Cadeau naissance du petit oursin

Si besoin, vous pouvez répondre à cette adresse email.

Aurelie & Francesco`,
    };

    // Send email to Owners
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'aurechampagne@gmail.com, frankyricci@gmail.com',
      subject: `Nouveau cadeau offert: ${item.name}`,
      text: `Bonjour,

Un nouveau cadeau vient d'être offert !

Détails:
- Donateur: ${name} (${email})
- Cadeau: ${item.name}
- Montant: ${item.price}€
- Message: ${message}

Aurelie & Francesco`,
    };

    await transporter.sendMail(donorMailOptions);
    await transporter.sendMail(ownerMailOptions);
    
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Temporary Email Test Route
app.get('/api/test-email', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Render',
      text: 'If you see this, email is working!',
    });
    res.json({ success: true, info: info.response });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
