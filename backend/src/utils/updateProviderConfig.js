const mongoose = require('mongoose');
const Provider = require('../models/Provider');
require('dotenv').config();

// Configuration for specific providers
const PROVIDER_CONFIGS = [
  {
    // Update this with actual provider business names or IDs
    businessName: 'Adventure Tours', // Replace with actual business name
    availableDays: ['Saturday', 'Sunday'], // Weekend availability
    perDaySlot: 10
  },
  {
    businessName: 'City Explorer', // Replace with actual business name  
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], // Weekday availability
    perDaySlot: 8
  },
  {
    businessName: 'Nature Walks', // Replace with actual business name
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // All week
    perDaySlot: 5
  }
  // Add more provider configurations as needed
];

const updateProviderConfigurations = async () => {
  try {
    console.log('🔄 Starting targeted provider configuration update...');
    
    // Connect to database if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    }
    
    console.log(`📋 Updating ${PROVIDER_CONFIGS.length} provider configurations`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const config of PROVIDER_CONFIGS) {
      try {
        // Find provider by business name
        const provider = await Provider.findOne({ businessName: config.businessName });
        
        if (!provider) {
          console.log(`❌ Provider not found: ${config.businessName}`);
          notFoundCount++;
          continue;
        }
        
        // Update the provider
        await Provider.findByIdAndUpdate(provider._id, {
          availableDays: config.availableDays,
          perDaySlot: config.perDaySlot
        });
        
        console.log(`✅ Updated ${config.businessName}:`);
        console.log(`   📅 Available Days: [${config.availableDays.join(', ')}]`);
        console.log(`   🎯 Per Day Slots: ${config.perDaySlot}`);
        
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Error updating ${config.businessName}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Configuration update completed!`);
    console.log(`✅ Providers updated: ${updatedCount}`);
    console.log(`❌ Providers not found: ${notFoundCount}`);
    
    // Show all current providers for reference
    console.log('\n📋 All providers in database:');
    const allProviders = await Provider.find({}, 'businessName availableDays perDaySlot');
    
    allProviders.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.businessName}:`);
      console.log(`   📅 Available Days: [${provider.availableDays?.join(', ') || 'None'}]`);
      console.log(`   🎯 Per Day Slots: ${provider.perDaySlot || 'Not set'}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating provider configurations:', error);
    throw error;
  }
};

// Run the update if called directly
if (require.main === module) {
  updateProviderConfigurations()
    .then(() => {
      console.log('\n✅ Provider configuration update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Provider configuration update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateProviderConfigurations, PROVIDER_CONFIGS };