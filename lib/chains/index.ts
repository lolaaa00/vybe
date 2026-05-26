import { BASE_SEPOLIA_CHAIN } from "@/lib/chains/baseSepolia"

export function getConfiguredChain() {
  return {
    name: process.env.NEXT_PUBLIC_CHAIN_NAME || BASE_SEPOLIA_CHAIN.name,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || BASE_SEPOLIA_CHAIN.chainId),
    hexChainId:
      process.env.NEXT_PUBLIC_CHAIN_ID
        ? `0x${Number(process.env.NEXT_PUBLIC_CHAIN_ID).toString(16)}`
        : BASE_SEPOLIA_CHAIN.hexChainId,
    rpcUrl: process.env.NEXT_PUBLIC_CHAIN_RPC_URL || BASE_SEPOLIA_CHAIN.rpcUrl,
    blockExplorerUrl:
      process.env.NEXT_PUBLIC_CHAIN_EXPLORER_URL || BASE_SEPOLIA_CHAIN.blockExplorerUrl,
    nativeCurrency: BASE_SEPOLIA_CHAIN.nativeCurrency,
  }
}
