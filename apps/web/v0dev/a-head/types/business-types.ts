export interface Business {
  id: string
  name: string
  category: "food" | "ai"
  description: string
  image: string
  rating: number
  votes: number
  monthlyPayment: number
  isWinner: boolean
  contact: {
    phone: string
    email: string
    website: string
  }
  stats: {
    responseTime: string
    satisfaction: number
    orders: number
  }
}

export interface FeativalEvent {
  id: string
  title: string
  date: string
  location: string
  price: number
  headliner: string
  supportingActs: string[]
  description: string
  image: string
  duration: string
}
