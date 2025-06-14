import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { RSVPSubmissionData, RSVPApiResponse } from '@/types/wedding';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';

// Environment variables
const RSVP_SHEET_ID = process.env.RSVP_SHEET_ID;

export async function POST(request: NextRequest): Promise<NextResponse<RSVPApiResponse>> {
  try {
    const data: RSVPSubmissionData = await request.json();
    
    // Log the RSVP data (server-side only)
    if (isDevelopment) {
      console.log('🔧 [DEV] Server received RSVP:', data);
    } else {
      console.log('🚀 [PROD] Server received RSVP for:', data.name);
    }
    
    // Here you can add your server-side logic:
    // - Integrate with Google Sheets
    // - etc.
  
    try {
      // Extract form data from request body
      const { name, email, phone, rsvp, guestCount, dietaryRestrictions, message, wedding } = data;
  
      // Check if we have the required environment variables
      if (!process.env.GOOGLE_SHEETS_ACCESS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_ACCESS_PRIVATE_KEY) {
        if (isDevelopment) {
          console.warn('⚠️ [DEV] Missing Google Sheets credentials - RSVP logged only');
        } else {
          throw new Error('Missing Google Sheets credentials');
        }
      } else {
        // Authenticate with Google using service account credentials
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SHEETS_ACCESS_CLIENT_EMAIL,
            // Convert escaped newlines to real newlines in the private key
            private_key: process.env.GOOGLE_SHEETS_ACCESS_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
    
        // Determine which sheet to use based on wedding type
        const sheetName = wedding === 'romania' ? 'Romania' : 'Vietnam';
        
        // Append the data as a new row at the end of the sheet
        await sheets.spreadsheets.values.append({
          spreadsheetId: RSVP_SHEET_ID,
          range: `${sheetName}!A:H`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[name, email, phone, rsvp, guestCount, dietaryRestrictions, message]],
          },
        });
        
        if (isDevelopment) {
          console.log('✅ [DEV] RSVP saved to Google Sheets');
        } else {
          console.log('✅ [PROD] RSVP saved successfully');
        }
      }

      // Return success response
      return NextResponse.json<RSVPApiResponse>(
        { 
          success: true, 
          message: 'RSVP received successfully'
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Server error:', error);
      
      return NextResponse.json<RSVPApiResponse>(
        { 
          success: false, 
          message: 'Failed to process RSVP',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Main error:', error);
    
    return NextResponse.json<RSVPApiResponse>(
      { 
        success: false, 
        message: 'Failed to process RSVP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// // Optional: Handle GET requests
// export async function GET() {
//   return NextResponse.json(
//     { 
//       message: 'Wedding RSVP API endpoint',
//       endpoints: {
//         POST: 'Submit RSVP data'
//       }
//     },
//     { status: 200 }
//   );
// }