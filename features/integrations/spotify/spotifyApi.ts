export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyProfile {
  id: string
  display_name: string | null
  email?: string
  images?: SpotifyImage[]
  external_urls?: { spotify?: string }
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  external_urls?: { spotify?: string }
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { id: string; name: string }[]
  popularity: number
  external_urls?: { spotify?: string }
}

export interface SpotifyAccountData {
  profile: SpotifyProfile
  topArtists: SpotifyArtist[]
  topTracks: SpotifyTrack[]
  genres: string[]
}

async function spotifyFetch<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`https://api.spotify.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Spotify API request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchSpotifyAccountData(token: string): Promise<SpotifyAccountData> {
  const profile = await spotifyFetch<SpotifyProfile>("/v1/me", token)

  let topArtists: SpotifyArtist[] = []
  let topTracks: SpotifyTrack[] = []

  try {
    const artistsResponse = await spotifyFetch<{ items: SpotifyArtist[] }>(
      "/v1/me/top/artists?time_range=medium_term&limit=10",
      token
    )
    topArtists = artistsResponse.items || []
  } catch {
    topArtists = []
  }

  try {
    const tracksResponse = await spotifyFetch<{ items: SpotifyTrack[] }>(
      "/v1/me/top/tracks?time_range=medium_term&limit=10",
      token
    )
    topTracks = tracksResponse.items || []
  } catch {
    topTracks = []
  }

  const genres = Array.from(new Set(topArtists.flatMap((artist) => artist.genres))).slice(0, 10)

  return { profile, topArtists, topTracks, genres }
}
