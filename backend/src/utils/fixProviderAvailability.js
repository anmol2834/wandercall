const mongoose = require('mongoose');
const Provider = require('../models/Provider');
require('dotenv').config();

const fixProviderAvailability = async () => {
  try {
    console.log('🔄 Starting provider availability data fix...');
    
    // Connect to database if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    }
    
    // Get all providers
    const providers = await Provider.find({});
    console.log(`📊 Found ${providers.length} providers to check`);
    
    let updatedCount = 0;
    
    for (const provider of providers) {
      let needsUpdate = false;
      const updates = {};
      
      // Check availableDays field
      if (!provider.availableDays || provider.availableDays.length === 0) {
        // Set default availability to all days if not set
        updates.availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        needsUpdate = true;
        console.log(`📅 Provider ${provider.businessName}: Setting default availableDays (all week)`);
      } else {
        console.log(`📅 Provider ${provider.businessName}: Current availableDays = [${provider.availableDays.join(', ')}]`);
      }
      
      // Check perDaySlot field
      if (!provider.perDaySlot || provider.perDaySlot <= 0) {
        // Set default slot capacity if not set or invalid
        updates.perDaySlot = 5; // Default to 5 slots per day
        needsUpdate = true;
        console.log(`🎯 Provider ${provider.businessName}: Setting default perDaySlot = 5`);
      } else {
        console.log(`🎯 Provider ${provider.businessName}: Current perDaySlot = ${provider.perDaySlot}`);
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        await Provider.findByIdAndUpdate(provider._id, updates);
        updatedCount++;
        console.log(`✅ Updated provider: ${provider.businessName}`);
      } else {
        console.log(`✓ Provider ${provider.businessName}: No updates needed`);
      }
    }
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Total providers checked: ${providers.length}`);
    console.log(`🔄 Providers updated: ${updatedCount}`);
    console.log(`✅ Providers already correct: ${providers.length - updatedCount}`);
    
    // Verify the updates
    console.log('\n🔍 Verification - Current provider configurations:');
    const updatedProviders = await Provider.find({}, 'businessName availableDays perDaySlot');
    
    updatedProviders.forEach(provider => {
      console.log(`📋 ${provider.businessName}:`);
      console.log(`   📅 Available Days: [${provider.availableDays?.join(', ') || 'None'}]`);
      console.log(`   🎯 Per Day Slots: ${provider.perDaySlot || 'Not set'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing provider availability:', error);
    throw error;
  }
};

// Run the migration if called directly
if (require.main === module) {
  fixProviderAvailability()
    .then(() => {
      console.log('\n✅ Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { fixProviderAvailability };