import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadPublicImage(
  supabase: SupabaseClient,
  bucket: string,
  filePath: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { url: data.publicUrl, error: null };
}

export async function uploadPrivateImage(
  supabase: SupabaseClient,
  bucket: string,
  filePath: string,
  file: File,
  options?: { upsert?: boolean }
): Promise<{ path: string | null; error: string | null }> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: options?.upsert ?? false });

  if (uploadError) {
    return { path: null, error: uploadError.message };
  }

  return { path: filePath, error: null };
}

export async function getSignedImageUrl(
  supabase: SupabaseClient,
  bucket: string,
  filePath: string,
  expiresInSeconds: number = 3600
): Promise<{ url: string | null; error: string | null }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresInSeconds);

  if (error) {
    return { url: null, error: error.message };
  }

  return { url: data.signedUrl, error: null };
}
