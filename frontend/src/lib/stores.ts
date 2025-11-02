const API_URL = 'http://localhost:3000'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`)
  return res.json()
}

export async function sendChatMessage(message: string, sessionId: string) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message, 
      sessionId 
    })
  })
  
  if (!res.ok) throw new Error(`Chat error: ${res.status}`)
  return res.json()
}

export async function getRestaurantConfig(restaurantId: string = 'woody-andover') {
  const res = await fetch(`${API_URL}/api/config/${restaurantId}`)
  if (!res.ok) throw new Error(`Config error: ${res.status}`)
  return res.json()
}
