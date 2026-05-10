import { getPayload as getPayloadSDK } from 'payload'
import config from '@payload-config'

export async function getPayload() {
  return getPayloadSDK({ config })
}
