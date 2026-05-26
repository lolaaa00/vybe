export interface XPublicMetrics {
  followers_count?: number
  following_count?: number
  tweet_count?: number
  listed_count?: number
}

export interface XProfile {
  id: string
  name: string
  username: string
  description?: string
  created_at?: string
  profile_image_url?: string
  protected?: boolean
  url?: string
  verified?: boolean
  public_metrics?: XPublicMetrics
}

export interface XTweetMetrics {
  retweet_count?: number
  reply_count?: number
  like_count?: number
  quote_count?: number
  bookmark_count?: number
  impression_count?: number
}

export interface XTweet {
  id: string
  text: string
  created_at?: string
  public_metrics?: XTweetMetrics
}

export interface XAccountData {
  profile: XProfile
  recentTweets: XTweet[]
}

async function xFetch<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`https://api.x.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error(payload.detail || payload.title || payload.error || `X API request failed: ${response.status}`)
  }

  return payload
}

export async function fetchXAccountData(token: string): Promise<XAccountData> {
  const profileResponse = await xFetch<{ data: XProfile }>(
    "/2/users/me?user.fields=created_at,description,verified,public_metrics,profile_image_url,url,protected",
    token
  )
  const profile = profileResponse.data

  let recentTweets: XTweet[] = []
  try {
    const tweetsResponse = await xFetch<{ data?: XTweet[] }>(
      `/2/users/${encodeURIComponent(profile.id)}/tweets?max_results=10&tweet.fields=created_at,public_metrics`,
      token
    )
    recentTweets = tweetsResponse.data || []
  } catch {
    recentTweets = []
  }

  return { profile, recentTweets }
}
