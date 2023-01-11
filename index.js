import express from 'express'
import { google } from 'googleapis'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import creds from './service_key.json' assert { type: "json" }

const app = express();

app.use(cors());
dotenv.config()
app.use(express.json())


app.route('/api/google')
   .post(async (req, res) => {

      const data = req.body

      const auth = new google.auth.GoogleAuth({
         credentials: {
            client_email: process.env.G_CLIENT_EMAIL,
            private_key: process.env.G_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
         },
         scopes: 'https://www.googleapis.com/auth/spreadsheets'
      })

      const client = await auth.getClient()

      const googleSheets = google.sheets({ version: 'v4', auth: client })

      const spreadsheetId = '1se4kiee1MIukwsnizpuUI4QtyFkA2Kjgg95RsbEcbMQ'

      googleSheets.spreadsheets.values.append({
         auth,
         spreadsheetId,
         range: 'Лист1',
         valueInputOption: 'USER_ENTERED',
         resource: {
            values: [
               [new Date().toLocaleString().replace(/\./g, '/'), data?.name, data?.email, data?.phone, data?.tarif, data?.telegram]
            ]
         }
      })


   })


const port = 7777

app.listen(port, () => {
   console.log(`збс на ${port} порту`)
})
