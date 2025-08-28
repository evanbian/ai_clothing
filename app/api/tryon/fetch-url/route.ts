import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { url } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    try {
      console.log('Fetching image from URL:', url);
      
      // Fetch the image
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: "URL does not point to an image" },
          { status: 400 }
        );
      }

      // Get image data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (buffer.length > maxSize) {
        return NextResponse.json(
          { success: false, error: "Image size exceeds 10MB limit" },
          { status: 400 }
        );
      }

      // Convert to base64 data URL
      const base64 = buffer.toString('base64');
      const mimeType = contentType.split(';')[0]; // Remove any charset info
      const dataUrl = `data:${mimeType};base64,${base64}`;

      // Validate image dimensions if needed
      // Note: This would require additional processing on the client side
      
      return NextResponse.json({
        success: true,
        image: dataUrl,
        mimeType: mimeType,
        size: buffer.length
      });

    } catch (fetchError) {
      console.error('Error fetching image:', fetchError);
      
      // Handle CORS errors
      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
      if (errorMessage.includes('CORS')) {
        return NextResponse.json(
          { 
            success: false, 
            error: "CORS error: Cannot fetch image from this domain",
            suggestion: "Try downloading the image and uploading it directly"
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to fetch image from URL",
          details: fetchError.message
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing fetch request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "This is the fetch-url endpoint for the AI Try-On platform",
    usage: "POST a JSON body with { url: 'image-url' } to fetch and convert an image"
  });
}