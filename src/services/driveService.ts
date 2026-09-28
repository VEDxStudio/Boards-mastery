import { getAccessToken } from './auth';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

/**
 * List files from the user's Google Drive.
 * Scopes: drive.file, drive.readonly
 */
export async function listDriveFiles(queryText?: string, mimeTypeFilter?: string): Promise<GoogleDriveFile[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in with Google first.');
  }

  let q = "trashed = false";
  if (queryText && queryText.trim()) {
    // Sanitize query string
    const escaped = queryText.replace(/'/g, "\\'");
    q += ` and name contains '${escaped}'`;
  }
  if (mimeTypeFilter && mimeTypeFilter !== 'all') {
    if (mimeTypeFilter === 'pdf') {
      q += " and mimeType = 'application/pdf'";
    } else if (mimeTypeFilter === 'image') {
      q += " and mimeType contains 'image/'";
    } else if (mimeTypeFilter === 'document') {
      q += " and (mimeType contains 'document' or mimeType contains 'sheet' or mimeType contains 'presentation' or mimeType = 'text/plain')";
    }
  }

  const params = new URLSearchParams({
    q,
    pageSize: '30',
    fields: 'files(id, name, mimeType, size, webViewLink, iconLink, thumbnailLink, createdTime, modifiedTime)',
    orderBy: 'modifiedTime desc',
  });

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to fetch files from Google Drive: ${response.status}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Upload a syllabus note or study summary text file directly to the user's Google Drive
 */
export async function createDriveTextFile(name: string, content: string): Promise<GoogleDriveFile> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in with Google first.');
  }

  const metadata = {
    name: name.endsWith('.txt') ? name : `${name}.txt`,
    mimeType: 'text/plain',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    content +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create file in Google Drive');
  }

  return response.json();
}
