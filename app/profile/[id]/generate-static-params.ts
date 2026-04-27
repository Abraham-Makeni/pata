import { PROVIDERS } from '@/lib/data'

export async function generateStaticParams() {
  return PROVIDERS.map((provider) => ({
    id: provider.id,
  }))
}
