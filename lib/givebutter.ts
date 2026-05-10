const GIVEBUTTER_BASE = 'https://api.givebutter.com/v1'

interface GivebutterCampaign {
  id: number
  raised: number
  goal: number
  donors: number
  status: string
}

export interface ProgressData {
  amountRaised: number
  goal: number
  percentComplete: number
  donors?: number
  source: 'live' | 'fallback'
  asOf?: string | null
}

interface FallbackData {
  amount: number
  goal: number
  lastUpdated?: string | null
}

async function getCampaignProgress(campaignId: string): Promise<GivebutterCampaign | null> {
  const res = await fetch(`${GIVEBUTTER_BASE}/campaigns/${campaignId}`, {
    headers: {
      Authorization: `Bearer ${process.env.GIVEBUTTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) return null

  const json = await res.json()
  // Handle both direct response and data-enveloped response
  return (json.data ?? json) as GivebutterCampaign
}

export async function getProgressWithFallback(
  campaignId: string,
  fallback: FallbackData,
): Promise<ProgressData> {
  try {
    const campaign = await getCampaignProgress(campaignId)
    if (campaign) {
      return {
        amountRaised: campaign.raised,
        goal: campaign.goal,
        percentComplete: Math.min((campaign.raised / campaign.goal) * 100, 100),
        donors: campaign.donors,
        source: 'live',
        asOf: null,
      }
    }
  } catch (err) {
    console.error('[Givebutter] API error, using CMS fallback:', err)
  }

  return {
    amountRaised: fallback.amount,
    goal: fallback.goal,
    percentComplete: Math.min((fallback.amount / fallback.goal) * 100, 100),
    source: 'fallback',
    asOf: fallback.lastUpdated ?? null,
  }
}
