
const FINILIAR_API = process.env.NEXT_PUBLIC_FINILIAR_API || "https://api-v2.finiliar.com"

export interface FiniliarMetadata {
  background: string,
  image: string,
  latestPrice: number,
  latestDelta: number,
  threeDModel: string,
  attributes?: {
    trait_type: string,
    value: string
  }[]
}

export async function fetchMetaFromFiniliar(tokenId: string): Promise<FiniliarMetadata> {
  const metadata = await (await fetch(FINILIAR_API + "/metadata/" + tokenId + "?key=TQVnOppFUycSU0R")).json()
  return metadata
}