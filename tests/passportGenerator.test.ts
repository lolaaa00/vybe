import { describe, expect, it } from "vitest"
import { generatePassportSectionsFromAccounts } from "@/features/passport/passportGenerator"
import { StoredConnectedAccount } from "@/features/passport/passportTypes"

const baseAccount = {
  id: "account-1",
  user_id: "user-1",
  platform_user_id: "platform-user",
  username: "alex",
  display_name: "Alex River",
  avatar_url: null,
  scopes: [],
  connected_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}

describe("passport generation", () => {
  it("generates proof of builder from GitHub account data", () => {
    const accounts: StoredConnectedAccount[] = [
      {
        ...baseAccount,
        platform: "github",
        raw_profile_json: {
          profile: {
            id: 1,
            login: "alexriver",
            name: "Alex River",
            html_url: "https://github.com/alexriver",
            public_repos: 12,
            followers: 80,
            following: 4,
          },
          repos: [
            { name: "vybe", html_url: "https://github.com/a/vybe", language: "TypeScript", stargazers_count: 42, forks_count: 3 },
            { name: "cli", html_url: "https://github.com/a/cli", language: "Rust", stargazers_count: 10, forks_count: 1 },
          ],
          languages: ["TypeScript", "Rust"],
          recentActivity: [{ type: "PushEvent" }],
        },
      },
    ]

    const sections = generatePassportSectionsFromAccounts(accounts)
    expect(sections).toHaveLength(1)
    expect(sections[0].section_type).toBe("proof_of_builder")
    expect(sections[0].source_platforms).toEqual(["github"])
    expect(sections[0].data_json.stats).toMatchObject({ publicRepos: 12, followers: 80 })
  })

  it("generates proof of taste from Spotify account data", () => {
    const accounts: StoredConnectedAccount[] = [
      {
        ...baseAccount,
        platform: "spotify",
        raw_profile_json: {
          profile: {
            id: "spotify-user",
            display_name: "Alex River",
            external_urls: { spotify: "https://open.spotify.com/user/alex" },
          },
          topArtists: [
            { id: "artist-1", name: "FKA Twigs", genres: ["art pop", "electronic"], popularity: 77 },
          ],
          topTracks: [
            { id: "track-1", name: "Cellophane", artists: [{ id: "artist-1", name: "FKA Twigs" }], popularity: 70 },
          ],
          genres: ["art pop", "electronic"],
        },
      },
    ]

    const sections = generatePassportSectionsFromAccounts(accounts)
    expect(sections).toHaveLength(1)
    expect(sections[0].section_type).toBe("proof_of_taste")
    expect(sections[0].source_platforms).toEqual(["spotify"])
    expect(sections[0].data_json.tasteTags).toEqual(["art pop", "electronic"])
  })

  it("generates proof of presence from X account data", () => {
    const accounts: StoredConnectedAccount[] = [
      {
        ...baseAccount,
        platform: "x",
        raw_profile_json: {
          profile: {
            id: "x-user",
            username: "alexriver",
            name: "Alex River",
            description: "Building on the open internet",
            verified: true,
            public_metrics: {
              followers_count: 1250,
              following_count: 300,
              tweet_count: 2200,
              listed_count: 18,
            },
          },
          recentTweets: [
            {
              id: "tweet-1",
              text: "shipping vybe",
              public_metrics: { like_count: 12, retweet_count: 3, reply_count: 2, quote_count: 1 },
            },
          ],
        },
      },
    ]

    const sections = generatePassportSectionsFromAccounts(accounts)
    expect(sections).toHaveLength(1)
    expect(sections[0].section_type).toBe("proof_of_presence")
    expect(sections[0].source_platforms).toEqual(["x"])
    expect(sections[0].data_json.stats).toMatchObject({ followers: 1250, posts: 2200 })
  })

  it("generates proof of social from Discord account data", () => {
    const accounts: StoredConnectedAccount[] = [
      {
        ...baseAccount,
        platform: "discord",
        raw_profile_json: {
          profile: {
            id: "discord-user",
            username: "alexriver",
            global_name: "Alex River",
          },
          guilds: [
            { id: "guild-1", name: "Vybe Builders", owner: true, approximate_member_count: 120 },
          ],
          connections: [
            { id: "github", name: "alexriver", type: "github", verified: true },
          ],
        },
      },
    ]

    const sections = generatePassportSectionsFromAccounts(accounts)
    expect(sections).toHaveLength(1)
    expect(sections[0].section_type).toBe("proof_of_social")
    expect(sections[0].source_platforms).toEqual(["discord"])
    expect(sections[0].data_json.stats).toMatchObject({ communities: 1, linkedAccounts: 1 })
  })

  it("does not generate unrelated sections without connected account data", () => {
    const sections = generatePassportSectionsFromAccounts([])
    expect(sections).toHaveLength(0)
  })
})
