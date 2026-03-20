// OP1: insertMany() — insert all 3 documents from sample_documents.json
db.product.insertMany([
  {
    "name": "IFB 8kg 5 Star AI Front Load Washing Machine",
    "category": "Electronics",
    "brand": "IFB",
    "price": 38490.00,
    "specifications": {
      "model": "Senator Neo VX",
      "voltage": "220-240V",
      "energy_rating": "5 Star",
      "warranty": "4 years comprehensive",
      "key_features": [
        "AI Powered",
        "Steam Wash",
        "Aqua Energie",
        "Cradle Wash"
      ],
      "max_spin_speed": "1200 RPM"
    },
    "is_in_stock": true
  },
  {
    "name": "Fabindia Cotton Silk Ethnic Co-ord Set",
    "category": "Clothing",
    "brand": "Fabindia",
    "price": 4599.00,
    "materials": [
      "80% Cotton",
      "20% Silk"
    ],
    "available_sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "details": {
      "color": "Indigo Blue",
      "fit": "Regular Fit",
      "occasion": "Festive",
      "wash_care": "Dry Clean Only"
    }
  },
  {
    "name": "Raw Pressery Cold Pressed Apple Juice",
    "category": "Groceries",
    "brand": "Raw Pressery",
    "price": 150.00,
    "expiry_date": "2026-05-10",
    "dietary_labels": [
      "No Added Sugar",
      "No Preservatives",
      "Vegan"
    ],
    "nutrition": {
      "size": "250ml",
      "calories": 110,
      "shelf_life": "21 Days"
    },
    "storage": "Must be refrigerated at 0-4°C"
  }
])

// OP2: find() — retrieve all Electronics products with price > 20000
db.product.find(
  {
  category:'Electronics',
  price: {$gte: 20000}
  }
)

// OP3: find() — retrieve all Groceries expiring before 2025-01-01
db.product.find({
  category:'Groceries',
  expiry_date: {$lt: "2025-01-01"}
})

// OP4: updateOne() — add a "discount_percent" field to a specific product
db.product.updateOne(
  {
    category: "Clothing"
  },
  {
    $set: {discount_percent: "5%"}
  }
)

// OP5: createIndex() — create an index on category field and explain why
db.product.createIndex({Category:1})
//MongoDB uses index lookup. It makes filtering and sorting faster 