import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImageToCloud } from '@/lib/azure-storage';

// Log environment variables for debugging
console.log('Environment Variables:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'
});

const handleError = (error: Error) => {
  console.error('Hesap işlemi sırasında hata:', error);
  return NextResponse.json(
    { error: 'İşlem sırasında bir hata oluştu' },
    { status: 500 }
  );
};

// Get all accounts (admin view)
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON strings for response
    const parsedAccounts = accounts.map((account) => {
      try {
        return {
          ...account,
          images: account.images ? JSON.parse(account.images) : [],
          contactInfo: account.contactInfo ? JSON.parse(account.contactInfo) : {}
        };
      } catch (error) {
        console.error(`Error parsing JSON for account ${account.id}:`, error);
        return {
          ...account,
          images: [],
          contactInfo: {}
        };
      }
    });

    return NextResponse.json(parsedAccounts);
  } catch (error) {
    return handleError(error);
  }
}

// Add new account
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Log all form data for debugging
    console.log('Form Data:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}, Type: ${typeof value}`);
    }

    // Convert formData to a plain object
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') {
        data[key] = value.toString();
        console.log(`Processed ${key}: ${data[key]}, Type: ${typeof data[key]}, Raw Value: ${value}`);
      }
    }

    // Upload images to blob storage
    const images: string[] = [];
    const imageFiles = formData.getAll('images');
    
    console.log('Image files:', imageFiles.length); // Debugging log

    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        console.log('Uploading image:', imageFile.name, 'Size:', imageFile.size); // Debugging log
        const blobUrl = await uploadImageToCloud(imageFile);
        images.push(blobUrl);
      }
    }

    console.log('Uploaded images:', images); // Debugging log

    // Validate required fields with more lenient checks
    const price = data.price && data.price.trim() !== '' 
      ? parseFloat(data.price) 
      : 0.0; // Eğer price boş veya undefined ise 0.0 yap
    const description = data.description || 'No description provided';

    console.log('Price processing:', {
      rawPrice: data.price,
      processedPrice: price,
      rawPriceType: typeof data.price
    });

    // Create account with blob image URLs
    const account = await prisma.account.create({
      data: {
        rank: data.rank || '',
        rankImage: data.rankImage || '',
        price: price,  
        currency: data.currency || 'AZN',
        description: description,
        status: data.status || 'available',
        images: JSON.stringify(images),
        contactInfo: JSON.stringify(data.contactInfo || {}),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}