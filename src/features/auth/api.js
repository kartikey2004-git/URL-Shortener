import supabase, { supabaseUrl } from "@/lib/supabase";
import { raiseApiError } from "@/lib/api-error";
import { STORAGE_BUCKETS } from "@/lib/constants";

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) raiseApiError(error);
  return data;
}

/** Returns the signed-in user from the persisted session, or null. */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();

  if (error) raiseApiError(error);
  return data.session?.user ?? null;
}

export async function signup({ name, email, password, profile_pic }) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKETS.profilePics)
    .upload(fileName, profile_pic);

  if (storageError) raiseApiError(storageError);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKETS.profilePics}/${fileName}`,
      },
    },
  });

  if (error) raiseApiError(error);
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) raiseApiError(error);
}
