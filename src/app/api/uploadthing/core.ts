import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '32MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Authenticate user
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new Error('Unauthorized');
      }

      // Pass userId to onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This runs on the server after upload completes
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);
      console.log('File Key:', file.key);

      // Return data to the client
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key,
      };
    }),
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Authenticate user
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new Error('Unauthorized');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Thumbnail upload complete for userId:', metadata.userId);
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
