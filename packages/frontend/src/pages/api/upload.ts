
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
// Temporarily disable this endpoint until payload is properly configured
// import { getPayload } from '@payloadcms/next';

// Temporarily disabled due to payload configuration issues
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(503).json({ error: 'Upload endpoint temporarily disabled.' });

  /*
  if (req.method === 'POST') {
    const { files } = req.body;

    if (!files) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const file = files[0];
    const filePath = path.join(process.cwd(), 'public', 'media', file.name);

    // For simplicity, this example assumes the file is base64 encoded
    const base64Data = file.data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    fs.writeFile(filePath, buffer, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error uploading file.' });
      }

      // const payload = await getPayload();

      try {
        await payload.create({
          collection: 'media',
          data: {
            file: `/media/${file.name}`,
            alt: file.name,
          },
        });

        res.status(200).json({ message: 'File uploaded successfully.', filePath: `/media/${file.name}` });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating media document.' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
  */
}
