
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ImageData {
  id: string;
  user_id: string;
  original_url: string;
  transformed_url: string | null;
  style: string;
  title: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useImages = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchImages();
    } else {
      setImages([]);
      setLoading(false);
    }
  }, [user]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
      } else {
        setImages(data || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const addImage = async (imageData: Omit<ImageData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('images')
        .insert([{
          ...imageData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding image:', error);
        return null;
      } else {
        setImages(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error adding image:', error);
      return null;
    }
  };

  return { images, loading, refetch: fetchImages, addImage };
};
