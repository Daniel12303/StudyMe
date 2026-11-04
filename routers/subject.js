import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'

import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const database_key = process.env.DATABASE_KEY
const project_url = process.env.DATABASE_URL
const supabase = createClient(project_url, database_key)
const __dirname = import.meta.dirname

router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static(path.join(__dirname, '../static')))
router.use(express.json())

router.get('/:name/description', async (req, res) => {
     res.sendFile(path.join(__dirname, '../static/subject_overview.html'))
})

router.get('/:name/getDescription', async (req, res) => {
     const name = req.params.name
     const { data, error } = await supabase
          .from('subject_description')
          .select()
          .eq('subject_name', name)

     if (error) console.log(error.message)

     console.log(data)
     res.send(data)
})

router.post('/:name/update', async (req, res) => {
     console.log(req.body)
     const { note, list } = req.body
     const name = req.params.name

     const { error } = await supabase
          .from('subject_description')
          .update({ note: note, task_list: list })
          .eq('subject_name', name)

     if (error) res.send(error.message)
     res.send('OK')
})

export { router as subject }
