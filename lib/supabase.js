import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://krvspojfdvmhbkjfecbq.supabase.co"
const supabaseKey = "sb_publishable_vc-iOMaOcN-5bUl8cuk1Qg_7YlcKTmI"

export const supabase = createClient(supabaseUrl, supabaseKey)