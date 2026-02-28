const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')

const genAI = new GoogleGenerativeAI('AIzaSyA3mUCvivqRmBcst5jxElQrzU59bMgXqgA')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

async function identifyLandmark() {
  const imageData = fs.readFileSync('./test-image.jpg')
  const base64 = imageData.toString('base64')

  const result = await model.generateContent([
    { text: 'What landmark is in this image? Give the exact name and location.' },
    { inlineData: { mimeType: 'image/jpeg', data: base64 } }
  ])

  console.log(result.response.text())
}

identifyLandmark().catch(console.error)