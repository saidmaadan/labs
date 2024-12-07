import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCampaignEmail({
  campaign,
  subscriber,
  fromName,
  fromEmail,
  replyTo,
}) {
  const trackingEnabled = campaign.metadata?.trackOpens || campaign.metadata?.trackClicks

  let html = campaign.content

  // Add open tracking pixel if enabled
  if (campaign.metadata?.trackOpens) {
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/track?type=OPEN&cid=${campaign.id}&sid=${subscriber.id}" width="1" height="1" alt="" style="display:none;" />`
    html = html + trackingPixel
  }

  // Add click tracking if enabled
  if (campaign.metadata?.trackClicks) {
    // Replace all links with tracking links
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/g
    html = html.replace(linkRegex, (match, url, rest) => {
      const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/track?type=CLICK&cid=${campaign.id}&sid=${subscriber.id}&url=${encodeURIComponent(url)}`
      return `<a href="${trackingUrl}"${rest}>`
    })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
      reply_to: replyTo || fromEmail,
      to: subscriber.email,
      subject: campaign.subject,
      html: html,
      headers: {
        "X-Campaign-ID": campaign.id,
        "X-Subscriber-ID": subscriber.id,
      },
      tags: [
        {
          name: "campaign_id",
          value: campaign.id,
        },
        {
          name: "subscriber_id",
          value: subscriber.id,
        },
      ],
    })

    if (error) {
      throw error
    }

    return { success: true, messageId: data.id }
  } catch (error) {
    // Record bounce event if the email fails to send
    await prisma.campaignEmailEvent.create({
      data: {
        type: "BOUNCE",
        campaignId: campaign.id,
        subscriberId: subscriber.id,
        metadata: {
          error: error.message,
        },
      },
    })

    return { success: false, error: error.message }
  }
}

export async function sendTestEmail({
  campaign,
  toEmail,
  fromName,
  fromEmail,
  replyTo,
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
      reply_to: replyTo || fromEmail,
      to: toEmail,
      subject: `[TEST] ${campaign.subject}`,
      html: campaign.content,
      headers: {
        "X-Campaign-Test": "true",
      },
    })

    if (error) {
      throw error
    }

    return { success: true, messageId: data.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
