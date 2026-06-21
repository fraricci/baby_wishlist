require('dotenv').config();
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image_url: String,
  is_available: { type: Boolean, default: true },
  reserved_by: { name: String, email: String, message: String }
});

const Item = mongoose.model('Item', ItemSchema);

const items = [
  {"name": "Cododo", "price": 200, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/cododo.png?itok=GuGbu5k4"},
  {"name": "Lit bébé évolutif", "price": 350, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/lit.png?itok=lrq0jrIr"},
  {"name": "Matelas", "price": 100, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/matelas.png?itok=ik3o0cKg"},
  {"name": "Tour de lit - Fait main", "price": 0, "is_available": false, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/WhatsApp%20Image%202026-05-17%20at%2020.53.43.jpeg?itok=t011W9L0"},
  {"name": "Gigoteuse légère", "price": 50, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/26E0AG11TUR_205_1dbb1c233-47b4-4196-8ea5-47a7e6c5340f.jpg.webp?itok=eRHl8QSw"},
  {"name": "Gigoteuse hiver", "price": 50, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/4cde1aa205c3d6bd0735c7e818dbae2f0ef57658_af342071-ae71-460a-b87e-front.jpeg.webp?itok=uiIN3bz-"},
  {"name": "Commode à langer", "price": 350, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/commode.png?itok=1WPW4TxM"},
  {"name": "Matelas à langer et housse", "price": 70, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/matelas-langer_0.png?itok=IjZ5uIHk"},
  {"name": "Vêtements bébé 1", "price": 25, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/1732582811_garde-robe-ancienne-pour-bebe-ou-trouver-des-pieces-authentiques-1024x585.jpg?itok=lQf9sFc5"},
  {"name": "Vêtements bébé 2", "price": 25, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/1732582811_garde-robe-ancienne-pour-bebe-ou-trouver-des-pieces-authentiques-1024x585.jpg?itok=lQf9sFc5"},
  {"name": "Vêtements bébé 3", "price": 25, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/1732582811_garde-robe-ancienne-pour-bebe-ou-trouver-des-pieces-authentiques-1024x585.jpg?itok=lQf9sFc5"},
  {"name": "Vêtements bébé 4", "price": 25, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/1732582811_garde-robe-ancienne-pour-bebe-ou-trouver-des-pieces-authentiques-1024x585.jpg?itok=lQf9sFc5"},
  {"name": "Veilleuse bébé", "price": 15, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/shopping.jpeg?itok=Mv_QId0p"},
  {"name": "Matériel pour faire un mobile au crochet", "price": 25, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/mobile.png?itok=ewQFuP8B"},
  {"name": "Porte-bébé ergonomique", "price": 70, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/packshot01-nature.jpg?itok=tTnkjQgl"},
  {"name": "Poussette", "price": 400, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/pousette.jpg?itok=3JAcOIqP"},
  {"name": "Nacelle", "price": 200, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/nacelle.jpeg?itok=y28W2FOS"},
  {"name": "Maxi Cosi", "price": 200, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/maxicosi.jpeg?itok=rTnpZ7Yq"},
  {"name": "Base isofix", "price": 200, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/isofix.png?itok=vKVKqhMy"},
  {"name": "Sac à langer - Fait main", "price": 0, "is_available": false, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/WhatsApp%20Image%202026-05-15%20at%2020.49.58.jpeg?itok=KjIcbau4"},
  {"name": "Tapis à langer - Fait main", "price": 0, "is_available": false, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/WhatsApp%20Image%202026-05-12%20at%2015.47.00.jpeg?itok=ThmffEYp"},
  {"name": "Nid d'ange", "price": 50, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/nid.png?itok=SRAOwVWy"},
  {"name": "Couverture bébé", "price": 40, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/couverture.png?itok=xyTU-eBw"},
  {"name": "Baignoire pliable bébé", "price": 60, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/71oe4mYuX9L._AC_SL1500_.jpg?itok=YTA208kJ"},
  {"name": "Capes de bain - Faites main", "price": 0, "is_available": false, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/WhatsApp%20Image%202026-05-12%20at%2015.49.22.jpeg?itok=ytEhqgk-"},
  {"name": "Trousse de soin bébé", "price": 30, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/trousse.png?itok=V83EqFht"},
  {"name": "Thermomètre frontal", "price": 35, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/thermospeed--thermometre-infrarouge-auriculaire-et-frontal-beaba_A.jpg?itok=keDnImhi"},
  {"name": "Abonnement langes 1", "price": 50, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/Capture%20d%E2%80%99%C3%A9cran%202023-12-13%20%C3%A0%2011-23-22.png?itok=aABWupVj"},
  {"name": "Abonnement langes 2", "price": 50, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/Capture%20d%E2%80%99%C3%A9cran%202023-12-13%20%C3%A0%2011-23-22.png?itok=aABWupVj"},
  {"name": "Chaise haute évolutive", "price": 250, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/chaise.jpeg?itok=zc_nrLNa"},
  {"name": "Biberons", "price": 40, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/biberons_0.png?itok=LfWxzFHH"},
  {"name": "Egouttoir à biberons", "price": 20, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/egoutoir.jpg?itok=iUo9G7bl"},
  {"name": "Tire-lait", "price": 200, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/momcozy-m6-tire-lait-mobile-double-marron-1-kit.v1.jpg?itok=9wUukvio"},
  {"name": "Chauffe biberon nomade", "price": 80, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/chauffe-biberon-nomade-toogo-20-3626298.jpg.webp?itok=SKGcs_z9"},
  {"name": "Coussin d'allaitement", "price": 60, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/Capture%20d%E2%80%99%C3%A9cran%202026-06-16%20%C3%A0%2016.42.36.png?itok=s_IQ1W8h"},
  {"name": "Set de langes en coton", "price": 25, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/langes.jpg?itok=eqP9p69I"},
  {"name": "Bavoirs - Faits main", "price": 0, "is_available": false, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/WhatsApp%20Image%202026-05-10%20at%2018.53.12.jpeg?itok=iQg1f4OD"},
  {"name": "Tapis de jeux - Fait main", "price": 0, "is_available": false, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/WhatsApp%20Image%202026-05-12%20at%2015.48.13.jpeg?itok=WYR_AT0D"},
  {"name": "Arche d'éveil et petits jeux", "price": 100, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/arche.png?itok=X11X5lIU"},
  {"name": "Séance bien-être - Massage bébé", "price": 90, "is_available": true, "image_url": "https://www.kadolog.com/sites/default/files/styles/medium/public/2026/359822/Illustration-massag-BB.jpg?itok=KG_kn1ws"}
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.useDb('cadolog');
    const ItemModel = db.model('Item', ItemSchema);
    await ItemModel.deleteMany({});
    await ItemModel.insertMany(items);
    console.log('Database seeded with split items');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}
seed();
