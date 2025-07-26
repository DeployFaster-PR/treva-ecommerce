// bulkDeleteBracelets.js

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

// Function to get all bracelets
async function getAllBracelets() {
  try {
    const query = `*[_type == "bracelet"] {
      _id,
      name,
      slug,
      mainImageUrl,
      imageUrls,
      category,
      price,
      featured,
      active,
      material,
      stone,
      color,
      size
    }`;

    const bracelets = await client.fetch(query);
    return bracelets;
  } catch (error) {
    console.error('Error fetching bracelets:', error);
    return [];
  }
}

// Function to get all reviews
async function getAllReviews() {
  try {
    const query = `*[_type == "braceletReview"] {
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

// Note: Image asset deletion is not needed since bracelets use external URLs
// If you ever switch to Sanity-hosted images, you can add the deleteImageAssets function back

// Function to delete bracelets by category
async function deleteBraceletsByCategory(category) {
  console.log(`🔍 Searching for bracelets in category: ${category}`);

  try {
    const query = `*[_type == "bracelet" && category == "${category}"] {
      _id,
      name,
      mainImageUrl,
      imageUrls
    }`;

    const bracelets = await client.fetch(query);

    if (bracelets.length === 0) {
      console.log(`📭 No bracelets found in category: ${category}`);
      return;
    }

    console.log(
      `📦 Found ${bracelets.length} bracelets in category: ${category}`
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${bracelets.length} bracelets from category "${category}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const bracelet of bracelets) {
      try {
        // Delete the bracelet document
        await client.delete(bracelet._id);
        console.log(`✅ Deleted bracelet: ${bracelet.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting bracelet ${bracelet.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} bracelets from category: ${category}`
    );
  } catch (error) {
    console.error('Error deleting bracelets by category:', error);
  }
}

// Function to delete specific bracelets by slugs
async function deleteBraceletsBySlugs(slugs) {
  console.log(`🔍 Searching for bracelets with slugs: ${slugs.join(', ')}`);

  try {
    const query = `*[_type == "bracelet" && slug.current in [${slugs.map((s) => `"${s}"`).join(', ')}]] {
      _id,
      name,
      slug,
      mainImageUrl,
      imageUrls
    }`;

    const bracelets = await client.fetch(query);

    if (bracelets.length === 0) {
      console.log(`📭 No bracelets found with the provided slugs`);
      return;
    }

    console.log(`📦 Found ${bracelets.length} bracelets to delete:`);
    bracelets.forEach((bracelet) =>
      console.log(`  - ${bracelet.name} (${bracelet.slug.current})`)
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete these ${bracelets.length} bracelets? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const bracelet of bracelets) {
      try {
        // Delete the bracelet document
        await client.delete(bracelet._id);
        console.log(`✅ Deleted bracelet: ${bracelet.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting bracelet ${bracelet.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully deleted ${deletedCount} bracelets`);
  } catch (error) {
    console.error('Error deleting bracelets by slugs:', error);
  }
}

// Function to delete bracelets by material
async function deleteBraceletsByMaterial(material) {
  console.log(`🔍 Searching for bracelets with material: ${material}`);

  try {
    const query = `*[_type == "bracelet" && material == "${material}"] {
      _id,
      name,
      material,
      mainImageUrl,
      imageUrls
    }`;

    const bracelets = await client.fetch(query);

    if (bracelets.length === 0) {
      console.log(`📭 No bracelets found with material: ${material}`);
      return;
    }

    console.log(
      `📦 Found ${bracelets.length} bracelets with material: ${material}`
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${bracelets.length} bracelets with material "${material}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const bracelet of bracelets) {
      try {
        // Delete the bracelet document
        await client.delete(bracelet._id);
        console.log(`✅ Deleted bracelet: ${bracelet.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting bracelet ${bracelet.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} bracelets with material: ${material}`
    );
  } catch (error) {
    console.error('Error deleting bracelets by material:', error);
  }
}

// Function to delete bracelets by stone type
async function deleteBraceletsByStone(stone) {
  console.log(`🔍 Searching for bracelets with stone: ${stone}`);

  try {
    const query = `*[_type == "bracelet" && stone == "${stone}"] {
      _id,
      name,
      stone,
      mainImageUrl,
      imageUrls
    }`;

    const bracelets = await client.fetch(query);

    if (bracelets.length === 0) {
      console.log(`📭 No bracelets found with stone: ${stone}`);
      return;
    }

    console.log(`📦 Found ${bracelets.length} bracelets with stone: ${stone}`);

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${bracelets.length} bracelets with stone "${stone}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const bracelet of bracelets) {
      try {
        // Delete the bracelet document
        await client.delete(bracelet._id);
        console.log(`✅ Deleted bracelet: ${bracelet.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting bracelet ${bracelet.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} bracelets with stone: ${stone}`
    );
  } catch (error) {
    console.error('Error deleting bracelets by stone:', error);
  }
}

// Function to delete ALL bracelets (with extra confirmation)
async function deleteAllBracelets() {
  console.log('🔍 Fetching all bracelets...');

  const bracelets = await getAllBracelets();

  if (bracelets.length === 0) {
    console.log('📭 No bracelets found in the database');
    return;
  }

  console.log(`📦 Found ${bracelets.length} bracelets in total`);

  // First confirmation
  const confirm1 = await askConfirmation(
    `⚠️ WARNING: This will delete ALL ${bracelets.length} bracelets from your database. Are you sure? (y/n): `
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

  for (const bracelet of bracelets) {
    try {
      // Delete the bracelet document
      await client.delete(bracelet._id);
      console.log(`✅ Deleted bracelet: ${bracelet.name}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error deleting bracelet ${bracelet.name}:`, error);
      failedCount++;
    }
  }

  console.log(`\n🎉 Bulk deletion complete!`);
  console.log(`✅ Successfully deleted: ${deletedCount} bracelets`);
  console.log(`❌ Failed to delete: ${failedCount} bracelets`);
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
  console.log('\n🗑️ BRACELETS BULK DELETION TOOL');
  console.log('=================================');
  console.log('1. Delete bracelets by category');
  console.log('2. Delete bracelets by material');
  console.log('3. Delete bracelets by stone type');
  console.log('4. Delete specific bracelets by slugs');
  console.log('5. Delete ALL bracelets (⚠️ DANGEROUS)');
  console.log('6. Delete ALL reviews');
  console.log('7. Show all bracelets (preview)');
  console.log('8. Exit');

  const choice = await askInput('Enter your choice (1-8): ');

  switch (choice) {
    case '1':
      const category = await askInput('Enter category to delete: ');
      await deleteBraceletsByCategory(category);
      break;
    case '2':
      const material = await askInput('Enter material to delete: ');
      await deleteBraceletsByMaterial(material);
      break;
    case '3':
      const stone = await askInput('Enter stone type to delete: ');
      await deleteBraceletsByStone(stone);
      break;
    case '4':
      const slugsInput = await askInput('Enter slugs separated by commas: ');
      const slugs = slugsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      await deleteBraceletsBySlugs(slugs);
      break;
    case '5':
      await deleteAllBracelets();
      break;
    case '6':
      await deleteAllReviews();
      break;
    case '7':
      await showAllBracelets();
      break;
    case '8':
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

// Function to show all bracelets (preview)
async function showAllBracelets() {
  console.log('🔍 Fetching all bracelets...');

  const bracelets = await getAllBracelets();

  if (bracelets.length === 0) {
    console.log('📭 No bracelets found in the database');
    return;
  }

  console.log(`\n📦 Found ${bracelets.length} bracelets:`);
  console.log('==================================');

  bracelets.forEach((bracelet, index) => {
    console.log(`${index + 1}. ${bracelet.name}`);
    console.log(`   Slug: ${bracelet.slug?.current || 'N/A'}`);
    console.log(`   Category: ${bracelet.category || 'N/A'}`);
    console.log(`   Material: ${bracelet.material || 'N/A'}`);
    console.log(`   Stone: ${bracelet.stone || 'N/A'}`);
    console.log(`   Color: ${bracelet.color || 'N/A'}`);
    console.log(`   Size: ${bracelet.size || 'N/A'}`);
    console.log(`   Price: £${bracelet.price || 'N/A'}`);
    console.log(`   Featured: ${bracelet.featured ? 'Yes' : 'No'}`);
    console.log(`   Active: ${bracelet.active ? 'Yes' : 'No'}`);
    console.log('   ---');
  });

  console.log(`\nTotal: ${bracelets.length} bracelets`);
}

// Main function to run the deletion tool
async function runDeletionTool() {
  console.log('🚀 Starting Bracelets Bulk Deletion Tool...');
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
  deleteAllBracelets,
  deleteBraceletsByCategory,
  deleteBraceletsByMaterial,
  deleteBraceletsByStone,
  deleteBraceletsBySlugs,
  deleteAllReviews,
  getAllBracelets,
  getAllReviews,
  client,
};
