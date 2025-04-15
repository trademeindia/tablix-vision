import type { NextApiRequest, NextApiResponse } from 'next';
import { createMenuItemWithUpload } from '@/services/menu/createMenuItemWithUpload';
import { getErrorMessage } from '@/utils/api-helpers';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const restaurantId = req.headers['x-restaurant-id'] as string;

    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }


    const formData = await new Promise<FormData>((resolve, reject) => {
      const form = new FormData();
      const busboy = require('busboy');

      const bb = busboy({ headers: req.headers });

      bb.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
        // Handle file upload
        let fileBuffer = Buffer.alloc(0);

        file.on('data', (data: Buffer) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
        });

        file.on('end', () => {
          const file = new File([fileBuffer], filename, { type: mimetype });
          form.append('file', file);
        });
      });

      bb.on('field', (fieldname: string, val: any) => {
        form.append(fieldname, val);
      });

      bb.on('finish', () => {
        resolve(form);
      });

      bb.on('error', (error: any) => {
        reject(error);
      });

      req.pipe(bb);
    });

    const menuItem = await createMenuItemWithUpload(formData, restaurantId);
    res.status(200).json(menuItem);
  } catch (error) {
    console.error('Error in /api/menu-items/createWithUpload:', getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
}