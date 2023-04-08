export const getSubgraphUrl = (network: number) => {
  const dir: { [key: number]: string } = {
    10: '/protocol-v1-optimism-mainnet',
    137: '/protocol-v1-matic',
    80001: '/protocol-v1-mumbai',
  }

  return dir[network];
}