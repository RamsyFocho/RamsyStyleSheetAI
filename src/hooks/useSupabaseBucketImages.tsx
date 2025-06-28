import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type SupabaseFile = {
  name: string;
  fullPath: string;
};

const listUserFiles = async (bucket: string, path: string, signal?: AbortSignal): Promise<SupabaseFile[]> => {
  const files: SupabaseFile[] = [];
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit: 100,
    });

    if (error || !data) {
      console.error('Error listing files:', error);
      return files;
    }

    for (const item of data) {
      // Skip folders and hidden files
      if (item.name && !item.metadata?.isDir && !item.name.startsWith('.')) {
        files.push({
          name: item.name,
          fullPath: `${path}${item.name}`,
        });
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('Fetch aborted:', err);
    } else {
      console.error('Unexpected error listing files:', err);
    }
  }

  return files;
};

const useSupabaseBucketImages = (userId: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const bucket = 'user-images'; // Fixed bucket name

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchImages = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        // Debug: log bucket and path
        console.log('Supabase bucket:', bucket);
        console.log('Supabase userId:', userId);
        const userFolder = `${userId}/`;
        console.log('Supabase list path:', userFolder);
        // List user files
        const userFiles = await listUserFiles(bucket, userFolder, signal);
        console.log('Supabase userFiles:', userFiles);
        // Also try listing the parent folder
        const parentFolder = `${userId}/`;
        const parentFiles = await listUserFiles(bucket, parentFolder, signal);
        console.log('Supabase parent folder list:', parentFiles);

        // Collect all transformed images
        const urls = userFiles
          .filter((item) => 
            item.name.startsWith('transform-') && 
            item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
          )
          .map((item) => {
            const url = supabase.storage
              .from(bucket)
              .getPublicUrl(item.fullPath).data.publicUrl;
            console.log('Supabase image URL:', url);
            return url;
          });

        setImages(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return { images, loading };
};

export default useSupabaseBucketImages;