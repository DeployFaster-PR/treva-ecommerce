// bulkDeleteNecklaces.js

import { createClient } from '@sanity/client';
import readline from 'readline';

// Initialize Sanity client with direct values
const client = createClient({
  projectId: 'raxxjas2',
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

// Function to get all necklaces
async function getAllNecklaces() {
  try {
    const query = `*[_type == "necklace"] {
      _id,
      name,
      slug,
      mainImageUrl,
      imageUrls,
      category,
      price,
      featured,
      active
    }`;

    const necklaces = await client.fetch(query);
    return necklaces;
  } catch (error) {
    console.error('Error fetching necklaces:', error);
    return [];
  }
}

// Function to get all reviews
async function getAllReviews() {
  try {
    const query = `*[_type == "necklaceReview"] {
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

// Note: Image asset deletion is not needed since necklaces use external URLs
// If you ever switch to Sanity-hosted images, you can add the deleteImageAssets function back

// Function to delete necklaces by category
async function deleteNecklacesByCategory(category) {
  console.log(`🔍 Searching for necklaces in category: ${category}`);

  try {
    const query = `*[_type == "necklace" && category == "${category}"] {
      _id,
      name,
      mainImageUrl,
      imageUrls
    }`;

    const necklaces = await client.fetch(query);

    if (necklaces.length === 0) {
      console.log(`📭 No necklaces found in category: ${category}`);
      return;
    }

    console.log(
      `📦 Found ${necklaces.length} necklaces in category: ${category}`
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${necklaces.length} necklaces from category "${category}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const necklace of necklaces) {
      try {
        // Delete the necklace document
        await client.delete(necklace._id);
        console.log(`✅ Deleted necklace: ${necklace.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting necklace ${necklace.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} necklaces from category: ${category}`
    );
  } catch (error) {
    console.error('Error deleting necklaces by category:', error);
  }
}

// Function to delete specific necklaces by slugs
async function deleteNecklacesBySlugs(slugs) {
  console.log(`🔍 Searching for necklaces with slugs: ${slugs.join(', ')}`);

  try {
    const query = `*[_type == "necklace" && slug.current in [${slugs.map((s) => `"${s}"`).join(', ')}]] {
      _id,
      name,
      slug,
      mainImageUrl,
      imageUrls
    }`;

    const necklaces = await client.fetch(query);

    if (necklaces.length === 0) {
      console.log(`📭 No necklaces found with the provided slugs`);
      return;
    }

    console.log(`📦 Found ${necklaces.length} necklaces to delete:`);
    necklaces.forEach((necklace) =>
      console.log(`  - ${necklace.name} (${necklace.slug.current})`)
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete these ${necklaces.length} necklaces? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const necklace of necklaces) {
      try {
        // Delete the necklace document
        await client.delete(necklace._id);
        console.log(`✅ Deleted necklace: ${necklace.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting necklace ${necklace.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully deleted ${deletedCount} necklaces`);
  } catch (error) {
    console.error('Error deleting necklaces by slugs:', error);
  }
}

// Function to delete ALL necklaces (with extra confirmation)
async function deleteAllNecklaces() {
  console.log('🔍 Fetching all necklaces...');

  const necklaces = await getAllNecklaces();

  if (necklaces.length === 0) {
    console.log('📭 No necklaces found in the database');
    return;
  }

  console.log(`📦 Found ${necklaces.length} necklaces in total`);

  // First confirmation
  const confirm1 = await askConfirmation(
    `⚠️ WARNING: This will delete ALL ${necklaces.length} necklaces from your database. Are you sure? (y/n): `
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

  for (const necklace of necklaces) {
    try {
      // Delete the necklace document
      await client.delete(necklace._id);
      console.log(`✅ Deleted necklace: ${necklace.name}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error deleting necklace ${necklace.name}:`, error);
      failedCount++;
    }
  }

  console.log(`\n🎉 Bulk deletion complete!`);
  console.log(`✅ Successfully deleted: ${deletedCount} necklaces`);
  console.log(`❌ Failed to delete: ${failedCount} necklaces`);
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
  console.log('\n🗑️ NECKLACES BULK DELETION TOOL');
  console.log('=================================');
  console.log('1. Delete necklaces by category');
  console.log('2. Delete specific necklaces by slugs');
  console.log('3. Delete ALL necklaces (⚠️ DANGEROUS)');
  console.log('4. Delete ALL reviews');
  console.log('5. Show all necklaces (preview)');
  console.log('6. Exit');

  const choice = await askInput('Enter your choice (1-6): ');

  switch (choice) {
    case '1':
      const category = await askInput('Enter category to delete: ');
      await deleteNecklacesByCategory(category);
      break;
    case '2':
      const slugsInput = await askInput('Enter slugs separated by commas: ');
      const slugs = slugsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      await deleteNecklacesBySlugs(slugs);
      break;
    case '3':
      await deleteAllNecklaces();
      break;
    case '4':
      await deleteAllReviews();
      break;
    case '5':
      await showAllNecklaces();
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

// Function to show all necklaces (preview)
async function showAllNecklaces() {
  console.log('🔍 Fetching all necklaces...');

  const necklaces = await getAllNecklaces();

  if (necklaces.length === 0) {
    console.log('📭 No necklaces found in the database');
    return;
  }

  console.log(`\n📦 Found ${necklaces.length} necklaces:`);
  console.log('==================================');

  necklaces.forEach((necklace, index) => {
    console.log(`${index + 1}. ${necklace.name}`);
    console.log(`   Slug: ${necklace.slug?.current || 'N/A'}`);
    console.log(`   Category: ${necklace.category || 'N/A'}`);
    console.log(`   Price: £${necklace.price || 'N/A'}`);
    console.log(`   Featured: ${necklace.featured ? 'Yes' : 'No'}`);
    console.log(`   Active: ${necklace.active ? 'Yes' : 'No'}`);
    console.log('   ---');
  });

  console.log(`\nTotal: ${necklaces.length} necklaces`);
}

// Main function to run the deletion tool
async function runDeletionTool() {
  console.log('🚀 Starting Necklaces Bulk Deletion Tool...');
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
  deleteAllNecklaces,
  deleteNecklacesByCategory,
  deleteNecklacesBySlugs,
  deleteAllReviews,
  getAllNecklaces,
  getAllReviews,
  client,
};
