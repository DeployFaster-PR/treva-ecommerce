// bulkDeleteRings.js

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

// Function to get all rings
async function getAllRings() {
  try {
    const query = `*[_type == "ring"] {
      _id,
      name,
      slug,
      mainImageUrl,
      imageUrls,
      category,
      price,
      material,
      stone,
      color,
      featured,
      active
    }`;

    const rings = await client.fetch(query);
    return rings;
  } catch (error) {
    console.error('Error fetching rings:', error);
    return [];
  }
}

// Function to get all ring reviews
async function getAllRingReviews() {
  try {
    const query = `*[_type == "ringReview"] {
      _id,
      customerName,
      rating
    }`;

    const reviews = await client.fetch(query);
    return reviews;
  } catch (error) {
    console.error('Error fetching ring reviews:', error);
    return [];
  }
}

// Note: Image asset deletion is not needed since rings use external URLs
// If you ever switch to Sanity-hosted images, you can add the deleteImageAssets function back

// Function to delete rings by category
async function deleteRingsByCategory(category) {
  console.log(`🔍 Searching for rings in category: ${category}`);

  try {
    const query = `*[_type == "ring" && category == "${category}"] {
      _id,
      name,
      mainImageUrl,
      imageUrls
    }`;

    const rings = await client.fetch(query);

    if (rings.length === 0) {
      console.log(`📭 No rings found in category: ${category}`);
      return;
    }

    console.log(`📦 Found ${rings.length} rings in category: ${category}`);

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${rings.length} rings from category "${category}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const ring of rings) {
      try {
        // Delete the ring document
        await client.delete(ring._id);
        console.log(`✅ Deleted ring: ${ring.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting ring ${ring.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} rings from category: ${category}`
    );
  } catch (error) {
    console.error('Error deleting rings by category:', error);
  }
}

// Function to delete rings by material
async function deleteRingsByMaterial(material) {
  console.log(`🔍 Searching for rings in material: ${material}`);

  try {
    const query = `*[_type == "ring" && material == "${material}"] {
      _id,
      name,
      material,
      mainImageUrl,
      imageUrls
    }`;

    const rings = await client.fetch(query);

    if (rings.length === 0) {
      console.log(`📭 No rings found in material: ${material}`);
      return;
    }

    console.log(`📦 Found ${rings.length} rings in material: ${material}`);

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete ${rings.length} rings made of "${material}"? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const ring of rings) {
      try {
        // Delete the ring document
        await client.delete(ring._id);
        console.log(`✅ Deleted ring: ${ring.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting ring ${ring.name}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully deleted ${deletedCount} rings made of: ${material}`
    );
  } catch (error) {
    console.error('Error deleting rings by material:', error);
  }
}

// Function to delete specific rings by slugs
async function deleteRingsBySlugs(slugs) {
  console.log(`🔍 Searching for rings with slugs: ${slugs.join(', ')}`);

  try {
    const query = `*[_type == "ring" && slug.current in [${slugs.map((s) => `"${s}"`).join(', ')}]] {
      _id,
      name,
      slug,
      mainImageUrl,
      imageUrls
    }`;

    const rings = await client.fetch(query);

    if (rings.length === 0) {
      console.log(`📭 No rings found with the provided slugs`);
      return;
    }

    console.log(`📦 Found ${rings.length} rings to delete:`);
    rings.forEach((ring) =>
      console.log(`  - ${ring.name} (${ring.slug.current})`)
    );

    // Ask for confirmation
    const confirm = await askConfirmation(
      `⚠️ Are you sure you want to delete these ${rings.length} rings? (y/n): `
    );

    if (!confirm) {
      console.log('❌ Operation cancelled');
      return;
    }

    let deletedCount = 0;

    for (const ring of rings) {
      try {
        // Delete the ring document
        await client.delete(ring._id);
        console.log(`✅ Deleted ring: ${ring.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error deleting ring ${ring.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully deleted ${deletedCount} rings`);
  } catch (error) {
    console.error('Error deleting rings by slugs:', error);
  }
}

// Function to delete ALL rings (with extra confirmation)
async function deleteAllRings() {
  console.log('🔍 Fetching all rings...');

  const rings = await getAllRings();

  if (rings.length === 0) {
    console.log('📭 No rings found in the database');
    return;
  }

  console.log(`📦 Found ${rings.length} rings in total`);

  // First confirmation
  const confirm1 = await askConfirmation(
    `⚠️ WARNING: This will delete ALL ${rings.length} rings from your database. Are you sure? (y/n): `
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

  for (const ring of rings) {
    try {
      // Delete the ring document
      await client.delete(ring._id);
      console.log(`✅ Deleted ring: ${ring.name}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error deleting ring ${ring.name}:`, error);
      failedCount++;
    }
  }

  console.log(`\n🎉 Bulk deletion complete!`);
  console.log(`✅ Successfully deleted: ${deletedCount} rings`);
  console.log(`❌ Failed to delete: ${failedCount} rings`);
  console.log(`📊 Total processed: ${deletedCount + failedCount}`);
}

// Function to delete all ring reviews
async function deleteAllRingReviews() {
  console.log('🔍 Fetching all ring reviews...');

  const reviews = await getAllRingReviews();

  if (reviews.length === 0) {
    console.log('📭 No ring reviews found in the database');
    return;
  }

  console.log(`📦 Found ${reviews.length} ring reviews in total`);

  const confirm = await askConfirmation(
    `⚠️ Are you sure you want to delete ALL ${reviews.length} ring reviews? (y/n): `
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
  console.log('\n🗑️ RINGS BULK DELETION TOOL');
  console.log('==============================');
  console.log('1. Delete rings by category');
  console.log('2. Delete rings by material');
  console.log('3. Delete specific rings by slugs');
  console.log('4. Delete ALL rings (⚠️ DANGEROUS)');
  console.log('5. Delete ALL ring reviews');
  console.log('6. Show all rings (preview)');
  console.log('7. Exit');

  const choice = await askInput('Enter your choice (1-7): ');

  switch (choice) {
    case '1':
      const category = await askInput(
        'Enter category to delete (Engagement/Wedding/Statement/Cocktail/Eternity/Signet): '
      );
      await deleteRingsByCategory(category);
      break;
    case '2':
      const material = await askInput(
        'Enter material to delete (e.g., 18k White Gold, Sterling Silver, Platinum): '
      );
      await deleteRingsByMaterial(material);
      break;
    case '3':
      const slugsInput = await askInput('Enter slugs separated by commas: ');
      const slugs = slugsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      await deleteRingsBySlugs(slugs);
      break;
    case '4':
      await deleteAllRings();
      break;
    case '5':
      await deleteAllRingReviews();
      break;
    case '6':
      await showAllRings();
      break;
    case '7':
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

// Function to show all rings (preview)
async function showAllRings() {
  console.log('🔍 Fetching all rings...');

  const rings = await getAllRings();

  if (rings.length === 0) {
    console.log('📭 No rings found in the database');
    return;
  }

  console.log(`\n📦 Found ${rings.length} rings:`);
  console.log('===============================');

  rings.forEach((ring, index) => {
    console.log(`${index + 1}. ${ring.name}`);
    console.log(`   Slug: ${ring.slug?.current || 'N/A'}`);
    console.log(`   Category: ${ring.category || 'N/A'}`);
    console.log(`   Material: ${ring.material || 'N/A'}`);
    console.log(`   Stone: ${ring.stone || 'N/A'}`);
    console.log(`   Price: £${ring.price || 'N/A'}`);
    console.log(`   Featured: ${ring.featured ? 'Yes' : 'No'}`);
    console.log(`   Active: ${ring.active ? 'Yes' : 'No'}`);
    console.log('   ---');
  });

  console.log(`\nTotal: ${rings.length} rings`);
}

// Main function to run the deletion tool
async function runDeletionTool() {
  console.log('🚀 Starting Rings Bulk Deletion Tool...');
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
  deleteAllRings,
  deleteRingsByCategory,
  deleteRingsByMaterial,
  deleteRingsBySlugs,
  deleteAllRingReviews,
  getAllRings,
  getAllRingReviews,
  client,
};
