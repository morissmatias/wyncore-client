import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tsexmdwblxivmxqkyeim.supabase.co'
const supabaseKey = 'sb_publishable_Ky4RGkmR1TQdZGbakMU2xw_lrQ9x9mD'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const uploadProductImage = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}