import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function POST(req) {
  try {
    const { image, landmark } = await req.json()


    const mimeType = image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
const base64 = image.replace(/^data:image\/\w+;base64,/, '')

    
    const result = await model.generateContent([
  { text: `Look at this image. Does it show "${landmark}"? Be generous. Reply with only "true" or "false".` },
  { inlineData: { mimeType: 'image/jpeg', data: base64 } }
]).catch(err => {
  console.error('Gemini error details:', JSON.stringify(err.errorDetails, null, 2))
  throw err
})
    const answer = result.response.text().trim().toLowerCase()
    const verified = answer.includes('true')

    return Response.json({ verified })
  } catch (err) {
    console.error('Route error:', err)
    return Response.json({ verified: false, error: err.message }, { status: 500 })
  }
}