const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const Product = require('../models/Product');
require('dotenv').config();

const inspectProviders = async () => {
  try {
    console.log('🔍 Inspecting provider configurations...');
    
    // Connect to database if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    }
    
    // Get all providers with their products
    const providers = await Provider.find({}).populate('products');
    console.log(`📊 Found ${providers.length} providers in database\n`);
    
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      console.log(`${i + 1}. Provider: ${provider.businessName}`);
      console.log(`   📧 Email: ${provider.email}`);
      console.log(`   📅 Available Days: [${provider.availableDays?.join(', ') || 'NOT SET'}]`);
      console.log(`   🎯 Per Day Slots: ${provider.perDaySlot || 'NOT SET'}`);
      console.log(`   📦 Products: ${provider.products?.length || 0}`);
      
      // Show associated products
      if (provider.products && provider.products.length > 0) {
        provider.products.forEach((product, idx) => {
          console.log(`      ${idx + 1}. ${product.title} (ID: ${product._id})`);
        });
      }
      
      console.log(''); // Empty line for readability
    }
    
    // Also check products that might not have providers assigned
    const productsWithoutProvider = await Product.find({ 
      $or: [
        { providerId: { $exists: false } },
        { providerId: null }
      ]
    });
    
    if (productsWithoutProvider.length > 0) {
      console.log(`⚠️  Found ${productsWithoutProvider.length} products without assigned providers:`);
      productsWithoutProvider.forEach((product, idx) => {
        console.log(`   ${idx + 1}. ${product.title} (ID: ${product._id})`);
      });
    }
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`Total Providers: ${providers.length}`);
    
    const providersWithoutDays = providers.filter(p => !p.availableDays || p.availableDays.length === 0);
    console.log(`Providers missing availableDays: ${providersWithoutDays.length}`);
    
    const providersWithoutSlots = providers.filter(p => !p.perDaySlot || p.perDaySlot <= 0);
    console.log(`Providers missing perDaySlot: ${providersWithoutSlots.length}`);
    
    const providersNeedingFix = providers.filter(p => 
      (!p.availableDays || p.availableDays.length === 0) || 
      (!p.perDaySlot || p.perDaySlot <= 0)
    );
    console.log(`Providers needing configuration fix: ${providersNeedingFix.length}`);
    
  } catch (error) {
    console.error('❌ Error inspecting providers:', error);
    throw error;
  }
};

// Run the inspection if called directly
if (require.main === module) {
  inspectProviders()
    .then(() => {
      console.log('\n✅ Provider inspection completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Provider inspection failed:', error);
      process.exit(1);
    });
}

module.exports = { inspectProviders };