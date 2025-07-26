// bulkDeleteEarrings.js

import { createClient } from '@sanity/client';
import readline from 'readline';

// Initialize Sanity client with direct values
const client = createClient({
  projectId: 'projectid',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'tokenvalue',
  useCdn: false,
});

console.log('Sanity client created successfully!');

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask user for confirmation
function askConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Function to ask user for input (returns the actual answer)
function askInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Function to get all earrings
async function getAllEarrings() {
  try {
    const query = `*[_type == "earring"] {
      _id,
      name,
      slug,
      mainImage,
      images,
      category,
      price,
      featured,
      active
    }`;

    const earrings = await client.fetch(query);
    return earrings;
  } catch (error) {
    console.error('Error fetching earrings:', error);
    return [];
  }
}

// Function to get all reviews
async function getAllReviews() {
  try {
    const query = `*[_type == "earringReview"] {
      _id,
      customerName,
      rating
    }`;

    const reviews = await client.fetch(query);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Function to delete image assets
async function deleteImageAssets(imageRefs) {
  const deletedAssets = [];

  for (const imageRef of imageRefs) {
    try {
      if (imageRef && imageRef.asset && imageRef.asset._ref) {
        await client.delete(imageRef.asset._ref);
        deletedAssets.push(imageRef.asset._ref);
        console.log(`🗑️ Deleted image asset: ${imageRef.asset._ref}`);
      }
    } catch (error) {
      console.error(
        `❌ Error deleting image asset ${imageRef.asset._ref}:`,
        error
      );
    }
  }

  return deletedAssets;
}

// Function to delete earrings by category
async function deleteEarringsByCategory(category) {
  console.log(`🔍 Searching for earrings in category: ${category}`);

  try {
    const query = `*[_type == "earring" && category == "${category}"] {
      _id,
      name,
      mainImage,
      images
    }`;

    const earrings = await client.fetch(query);

    if (earrings.length === 0) {
      console.log(`📭 No earrings found in category: ${category}`);
      return;
    }

    console.log(
      `📦 Found ${earrings.length} earrings in category: ${category}`
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${earrings.length} earrings from category "${category}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const earring of earrings) {
      try {
        // Delete associated image assets
        const imageRefs = [];
        if (earring.mainImage) imageRefs.push(earring.mainImage);
        if (earring.images) imageRefs.push(...earring.images);

        await deleteImageAssets(imageRefs);

        // Delete the earring document
        await client.delete(earring._id);
        console.log(`✅ Deleted earring: ${earring.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting earring ${earring.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} earrings from category: ${category}`
    );
  } catch (error) {
    console.error('Error deleting earrings by category:', error);
  }
}

// Function to delete specific earrings by slugs
async function deleteEarringsBySlugs(slugs) {
  console.log(`🔍 Searching for earrings with slugs: ${slugs.join(', ')}`);

  try {
    const query = `*[_type == "earring" && slug.current in [${slugs.map((s) => `"${s}"`).join(', ')}]] {
      _id,
      name,
      slug,
      mainImage,
      images
    }`;

    const earrings = await client.fetch(query);

    if (earrings.length === 0) {
      console.log(`📭 No earrings found with the provided slugs`);
      return;
    }

    console.log(`📦 Found ${earrings.length} earrings to delete:`);
    earrings.forEach((earring) =>
      console.log(`  - ${earring.name} (${earring.slug.current})`)
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete these ${earrings.length} earrings? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const earring of earrings) {
      try {
        // Delete associated image assets
        const imageRefs = [];
        if (earring.mainImage) imageRefs.push(earring.mainImage);
        if (earring.images) imageRefs.push(...earring.images);

        await deleteImageAssets(imageRefs);

        // Delete the earring document
        await client.delete(earring._id);
        console.log(`✅ Deleted earring: ${earring.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting earring ${earring.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully deleted ${deletedCount} earrings`);
  } catch (error) {
    console.error('Error deleting earrings by slugs:', error);
  }
}

// Function to delete ALL earrings (with extra confirmation)
async function deleteAllEarrings() {
  console.log('🔍 Fetching all earrings...');

  const earrings = await getAllEarrings();

  if (earrings.length === 0) {
    console.log('📭 No earrings found in the database');
    return;
  }

  console.log(`📦 Found ${earrings.length} earrings in total`);

  // First confirmation
  const confirm1 = await askConfirmation(
    `⚠️ WARNING: This will delete ALL ${earrings.length} earrings from your database. Are you sure? (y/n): `
  );

  if (!confirm1) {
    console.log('❌ Operation cancelled');
    return;
  }

  // Second confirmation
  const confirm2 = await askInput(
    `⚠️ FINAL WARNING: This action cannot be undone. Type 'DELETE ALL' to confirm: `
  );

  if (confirm2 !== 'DELETE ALL') {
    console.log('❌ Operation cancelled - confirmation text did not match');
    return;
  }

  console.log('🗑️ Starting bulk deletion...');

  let deletedCount = 0;
  let failedCount = 0;

  for (const earring of earrings) {
    try {
      // Delete associated image assets
      const imageRefs = [];
      if (earring.mainImage) imageRefs.push(earring.mainImage);
      if (earring.images) imageRefs.push(...earring.images);

      await deleteImageAssets(imageRefs);

      // Delete the earring document
      await client.delete(earring._id);
      console.log(`✅ Deleted earring: ${earring.name}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error deleting earring ${earring.name}:`, error);
      failedCount++;
    }
  }

  console.log(`\n🎉 Bulk deletion complete!`);
  console.log(`✅ Successfully deleted: ${deletedCount} earrings`);
  console.log(`❌ Failed to delete: ${failedCount} earrings`);
  console.log(`📊 Total processed: ${deletedCount + failedCount}`);
}

// Function to delete all reviews
async function deleteAllReviews() {
  console.log('🔍 Fetching all reviews...');

  const reviews = await getAllReviews();

  if (reviews.length === 0) {
    console.log('📭 No reviews found in the database');
    return;
  }

  console.log(`📦 Found ${reviews.length} reviews in total`);

  const confirm = await askConfirmation(
    `⚠️ Are you sure you want to delete ALL ${reviews.length} reviews? (y/n): `
  );

  if (!confirm) {
    console.log('❌ Operation cancelled');
    return;
  }

  console.log('🗑️ Starting review deletion...');

  let deletedCount = 0;
  let failedCount = 0;

  for (const review of reviews) {
    try {
      await client.delete(review._id);
      console.log(`✅ Deleted review from: ${review.customerName}`);
      deletedCount++;
    } catch (error) {
      console.error(
        `❌ Error deleting review from ${review.customerName}:`,
        error
      );
      failedCount++;
    }
  }

  console.log(`\n🎉 Review deletion complete!`);
  console.log(`✅ Successfully deleted: ${deletedCount} reviews`);
  console.log(`❌ Failed to delete: ${failedCount} reviews`);
}

// Function to show deletion options
async function showDeletionOptions() {
  console.log('\n🗑️ EARRINGS BULK DELETION TOOL');
  console.log('================================');
  console.log('1. Delete earrings by category');
  console.log('2. Delete specific earrings by slugs');
  console.log('3. Delete ALL earrings (⚠️ DANGEROUS)');
  console.log('4. Delete ALL reviews');
  console.log('5. Show all earrings (preview)');
  console.log('6. Exit');

  const choice = await askInput('Enter your choice (1-6): ');

  switch (choice) {
    case '1':
      const category = await askInput('Enter category to delete: ');
      await deleteEarringsByCategory(category);
      break;
    case '2':
      const slugsInput = await askInput('Enter slugs separated by commas: ');
      const slugs = slugsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      await deleteEarringsBySlugs(slugs);
      break;
    case '3':
      await deleteAllEarrings();
      break;
    case '4':
      await deleteAllReviews();
      break;
    case '5':
      await showAllEarrings();
      break;
    case '6':
      console.log('👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('❌ Invalid choice. Please try again.');
      await showDeletionOptions();
  }

  // Ask if user wants to continue
  const continueChoice = await askConfirmation(
    '\nDo you want to perform another action? (y/n): '
  );
  if (continueChoice) {
    await showDeletionOptions();
  } else {
    console.log('👋 Goodbye!');
    rl.close();
  }
}

// Function to show all earrings (preview)
async function showAllEarrings() {
  console.log('🔍 Fetching all earrings...');

  const earrings = await getAllEarrings();

  if (earrings.length === 0) {
    console.log('📭 No earrings found in the database');
    return;
  }

  console.log(`\n📦 Found ${earrings.length} earrings:`);
  console.log('================================');

  earrings.forEach((earring, index) => {
    console.log(`${index + 1}. ${earring.name}`);
    console.log(`   Slug: ${earring.slug?.current || 'N/A'}`);
    console.log(`   Category: ${earring.category || 'N/A'}`);
    console.log(`   Price: £${earring.price || 'N/A'}`);
    console.log(`   Featured: ${earring.featured ? 'Yes' : 'No'}`);
    console.log(`   Active: ${earring.active ? 'Yes' : 'No'}`);
    console.log('   ---');
  });

  console.log(`\nTotal: ${earrings.length} earrings`);
}

// Main function to run the deletion tool
async function runDeletionTool() {
  console.log('🚀 Starting Earrings Bulk Deletion Tool...');
  await showDeletionOptions();
}

// Add debugging
console.log('🔍 About to start deletion tool...');

// Start the deletion tool immediately
runDeletionTool().catch((error) => {
  console.error('❌ Deletion tool failed:', error);
  rl.close();
  process.exit(1);
});

// Export functions for use in other scripts
export {
  deleteAllEarrings,
  deleteEarringsByCategory,
  deleteEarringsBySlugs,
  deleteAllReviews,
  getAllEarrings,
  getAllReviews,
  client,
};
