# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for the Task Tracker System to store and manage uploaded images.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Task Tracker System"
4. Click "Create"

## Step 2: Enable Google Drive API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on "Google Drive API" and click "Enable"

## Step 3: Create Credentials

### Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Click "Restrict Key" to add restrictions:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `https://your-domain.com/*`)
   - API restrictions: Select "Google Drive API"
5. Save the restrictions

### Create OAuth 2.0 Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "Task Tracker System"
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `../auth/drive.file`
4. Application type: Web application
5. Name: "Task Tracker Web Client"
6. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production)
7. Authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production)
8. Click "Create"
9. Copy the Client ID

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
\`\`\`

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the operator dashboard
3. Navigate to Customization → Branding
4. Try uploading an image
5. You should be prompted to sign in to Google Drive
6. After authorization, images should upload successfully

## Step 6: Folder Structure

The system will automatically create a folder structure in your Google Drive:

\`\`\`
Google Drive/
└── Task Tracker Images/
    ├── Logos/
    ├── Profiles/
    ├── Illustrations/
    └── System Images/
\`\`\`

## Security Considerations

1. **API Key Restrictions**: Always restrict your API key to specific domains
2. **OAuth Scopes**: Use minimal scopes (`drive.file` only allows access to files created by the app)
3. **Public Access**: Uploaded images are made publicly viewable for web display
4. **File Permissions**: Only the uploader and app have edit access to files

## Troubleshooting

### Common Issues

1. **"API key not valid"**
   - Check if the API key is correctly set in `.env.local`
   - Verify API restrictions in Google Cloud Console

2. **"OAuth client ID not found"**
   - Ensure the client ID is correctly formatted
   - Check authorized origins in Google Cloud Console

3. **"Access denied"**
   - User needs to grant permission to access Google Drive
   - Check OAuth consent screen configuration

4. **"Quota exceeded"**
   - Google Drive API has usage limits
   - Consider implementing retry logic for production

### Testing Checklist

- [ ] API key is set and restricted
- [ ] OAuth client ID is configured
- [ ] Environment variables are loaded
- [ ] User can sign in to Google Drive
- [ ] Images upload successfully
- [ ] Uploaded images are publicly accessible
- [ ] Folder structure is created automatically

## Production Deployment

When deploying to production:

1. Update OAuth authorized origins with your production domain
2. Update API key restrictions with your production domain
3. Set environment variables in your hosting platform
4. Test the complete upload flow in production

## File Management

### Viewing Files
- Access uploaded files at: https://drive.google.com
- Files are organized in the "Task Tracker Images" folder

### Manual Management
- You can manually organize files in Google Drive
- Deleting files from Drive will break image links in the app
- Consider implementing a file management interface in the admin panel

## API Limits

Google Drive API has the following limits:
- 1,000 requests per 100 seconds per user
- 10,000 requests per 100 seconds

For high-volume usage, consider:
- Implementing request queuing
- Adding retry logic with exponential backoff
- Caching file URLs to reduce API calls
