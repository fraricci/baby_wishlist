require('dotenv').config();
const mongoose = require('mongoose');

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

const seedItems = [
  { name: 'Stroller', description: 'Lightweight and compact stroller', price: 299, is_available: true },
  { name: 'Crib', description: 'Sturdy wooden crib', price: 150, is_available: true },
  { name: 'Baby Monitor', description: 'HD camera with night vision', price: 80, is_available: true },
  { name: 'Diaper Bag', description: 'Spacious bag with multiple compartments', price: 50, is_available: true }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Specify the database name 'cadolog'
    const db = mongoose.connection.useDb('cadolog');
    const ItemModel = db.model('Item', ItemSchema);

    await ItemModel.deleteMany({}); // Optional: clear existing
    await ItemModel.insertMany(seedItems);
    console.log('Database seeded with example items');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
