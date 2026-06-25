require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const brevo = require('@getbrevo/brevo');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Brevo API Configuration
const apiInstance = new brevo.Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

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
    let donorEmail = new brevo.Brevo.SendSmtpEmail();
    donorEmail.sender = { name: "Aurelie & Francesco", email: process.env.EMAIL_USER };
    donorEmail.to = [{ email: email }];
    donorEmail.subject = `Votre contribution pour : ${item.name}`;
    donorEmail.htmlContent = `
      <h1>Bonjour ${name},</h1>
      <p>Nous vous remercions pour votre contribution à l'achat de <strong>${item.name}</strong> d'un montant de ${item.price}€.</p>
      <p>Vous pouvez contribuer directement à ce cadeau par un simple virement au compte suivant:</p>
      <ul>
        <li><strong>Nom:</strong> Aurelie Champagne</li>
        <li><strong>IBAN:</strong> BE98103027337193</li>
        <li><strong>BIC:</strong> NICABEBBXXX</li>
        <li><strong>Communication:</strong> Cadeau naissance du petit oursin</li>
      </ul>
      <p>Si besoin, vous pouvez répondre à cette adresse email.</p>
      <p>Aurelie & Francesco</p>
    `;

    // Send email to Owners
    let ownerEmail = new brevo.Brevo.SendSmtpEmail();
    ownerEmail.sender = { name: "Registry App", email: process.env.EMAIL_USER };
    ownerEmail.to = [{ email: 'aurechampagne@gmail.com' }, { email: 'frankyricci@gmail.com' }];
    ownerEmail.subject = `Nouveau cadeau offert: ${item.name}`;
    ownerEmail.htmlContent = `
      <h1>Bonjour,</h1>
      <p>Un nouveau cadeau vient d'être offert !</p>
      <ul>
        <li><strong>Donateur:</strong> ${name} (${email})</li>
        <li><strong>Cadeau:</strong> ${item.name}</li>
        <li><strong>Montant:</strong> ${item.price}€</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>
      <p>Aurelie & Francesco</p>
    `;

    apiInstance.sendTransacEmail(donorEmail);
    apiInstance.sendTransacEmail(ownerEmail);
    
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Temporary Email Test Route
app.get('/api/test-email', async (req, res) => {
  try {
    let email = new brevo.Brevo.SendSmtpEmail();
    email.sender = { name: "Test App", email: process.env.EMAIL_USER };
    email.to = [{ email: process.env.EMAIL_USER }];
    email.subject = 'Test Email from Render';
    email.htmlContent = '<h1>If you see this, email is working!</h1>';
    
    const info = await apiInstance.sendTransacEmail(email);
    res.json({ success: true, info: info.response });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
