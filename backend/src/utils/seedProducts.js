const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    provider_Name: "Adventure Tours",
    company_Name: "Adventure",
    title: "Desert Safari Experience",
    price: 2999,
    mrp: 3999,
    openTime: "09:00",
    closeTime: "18:00",
    whatsIncluded: ["Transportation", "Camel Ride", "Dinner", "Cultural Show"],
    rating: 4.8,
    description: "Experience the thrill of desert safari with camel riding, dune bashing, and traditional dinner under the stars.",
    img1: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop",
    img2: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
    img3: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    img4: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
    location: {
      state: "Rajasthan",
      city: "Jaisalmer",
      address: "Sam Sand Dunes, Jaisalmer",
      mapLink: "https://maps.google.com/?q=Sam+Sand+Dunes+Jaisalmer",
      pincode: "345001"
    }
  },
  {
    provider_Name: "Mountain Adventures",
    company_Name: "Nature",
    title: "Himalayan Trekking Adventure",
    price: 8999,
    mrp: 12999,
    openTime: "06:00",
    closeTime: "20:00",
    whatsIncluded: ["Guide", "Equipment", "Meals", "Accommodation"],
    rating: 4.9,
    description: "Trek through the majestic Himalayas with experienced guides and enjoy breathtaking mountain views.",
    img1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    img2: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=300&fit=crop",
    img3: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    img4: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    location: {
      state: "Himachal Pradesh",
      city: "Manali",
      address: "Old Manali, Himachal Pradesh",
      mapLink: "https://maps.google.com/?q=Old+Manali+Himachal+Pradesh",
      pincode: "175131"
    }
  },
  {
    provider_Name: "Beach Resorts",
    company_Name: "Luxury",
    title: "Tropical Beach Paradise",
    price: 15999,
    mrp: 19999,
    openTime: "00:00",
    closeTime: "23:59",
    whatsIncluded: ["Luxury Stay", "All Meals", "Water Sports", "Spa Access"],
    rating: 4.7,
    description: "Relax in luxury at our tropical beach resort with pristine beaches and world-class amenities.",
    img1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    img2: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    img3: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    img4: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
    location: {
      state: "Goa",
      city: "Panaji",
      address: "Calangute Beach, North Goa",
      mapLink: "https://maps.google.com/?q=Calangute+Beach+North+Goa",
      pincode: "403516"
    }
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();