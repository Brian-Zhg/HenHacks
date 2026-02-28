require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

async function identifyLandmark() {
  const imageData = fs.readFileSync('./mona.jpg')
  const base64 = imageData.toString('base64')
  const landmark = 'mona lisa'

  const result = await model.generateContent([
    { text: `is this ${landmark} boolean response true or false only` },
    { inlineData: { mimeType: 'image/jpeg', data: base64 } }
  ])

  console.log(result.response.text())
}

identifyLandmark().catch(console.error)