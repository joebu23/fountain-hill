import type { GlobalConfig } from 'payload'

export const CampaignSettings: GlobalConfig = {
  slug: 'campaign-settings',
  label: 'Campaign Settings',
  fields: [
    {
      name: 'campaignSlug',
      type: 'text',
      required: true,
      defaultValue: 'campaign',
      admin: {
        description:
          'URL path for the campaign page. Example: "campaign" renders at /campaign. Change with caution — this changes the live URL.',
      },
    },
    {
      name: 'campaignGoal',
      type: 'number',
      required: true,
      defaultValue: 1000000,
      admin: { description: 'Total campaign goal in dollars. Used for progress bar math.' },
    },
    {
      name: 'givebutterCampaignId',
      type: 'text',
      required: true,
      admin: { description: 'Givebutter campaign ID or slug. Found in the Givebutter dashboard URL.' },
    },
    {
      name: 'donateUrl',
      type: 'text',
      required: true,
      admin: { description: 'Full Givebutter donate URL. Example: https://givebutter.com/XXXXXX' },
    },
    {
      name: 'fallbackAmountRaised',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description:
          'Amount raised to display if the Givebutter API is unavailable. Update this manually as a backup.',
      },
    },
    {
      name: 'fallbackLastUpdated',
      type: 'date',
      admin: {
        description:
          'Date the fallback amount was last manually updated. Shown to visitors when fallback data is active.',
      },
    },
    {
      name: 'isLive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'When unchecked, the campaign page shows a Coming Soon message. Check this when ready to launch.',
      },
    },
  ],
}
