import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
const __dirname = import.meta.dirname

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const database_key = process.env.DATABASE_KEY
const project_url = process.env.DATABASE_URL

const supabase = createClient(project_url, database_key)

export { supabase as sp }
