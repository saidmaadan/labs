import { use } from "react"
import { CampaignPageContent } from "@/components/newsletter/campaign-page-content"

export default function CampaignPage({ params }) {
  const resolvedParams = use(Promise.resolve(params))
  return <CampaignPageContent params={resolvedParams} />
}
