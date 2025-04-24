
-- Create menu-media bucket if it doesn't exist
DO $$
BEGIN
    BEGIN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'menu-media',
            'menu-media',
            true,
            52428800, -- 50MB
            ARRAY[
                'image/jpeg',
                'image/png',
                'image/gif',
                'model/gltf-binary',
                'model/gltf+json',
                'application/octet-stream',
                'application/gltf-binary'
            ]
        );
    EXCEPTION
        WHEN unique_violation THEN
        -- Bucket already exists, update it
        UPDATE storage.buckets 
        SET 
            public = true,
            file_size_limit = 52428800,
            allowed_mime_types = ARRAY[
                'image/jpeg',
                'image/png',
                'image/gif',
                'model/gltf-binary',
                'model/gltf+json',
                'application/octet-stream',
                'application/gltf-binary'
            ]
        WHERE id = 'menu-media';
    END;
END $$;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for menu-media bucket
-- Allow anyone to select from the bucket (public read)
DROP POLICY IF EXISTS "Public SELECT for menu-media" ON storage.objects;
CREATE POLICY "Public SELECT for menu-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-media');

-- Allow authenticated and anonymous users to insert
DROP POLICY IF EXISTS "Auth INSERT for menu-media" ON storage.objects;
CREATE POLICY "Auth INSERT for menu-media"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'menu-media' AND
    (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Allow owner or anonymous users to update their objects
DROP POLICY IF EXISTS "Owner UPDATE for menu-media" ON storage.objects;
CREATE POLICY "Owner UPDATE for menu-media"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'menu-media' AND
    (auth.uid() = owner OR auth.role() = 'anon')
)
WITH CHECK (
    bucket_id = 'menu-media' AND
    (auth.uid() = owner OR auth.role() = 'anon')
);

-- Allow owner or anonymous users to delete their objects
DROP POLICY IF EXISTS "Owner DELETE for menu-media" ON storage.objects;
CREATE POLICY "Owner DELETE for menu-media"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'menu-media' AND
    (auth.uid() = owner OR auth.role() = 'anon')
);
