import { createConfig } from '@lifi/sdk';

export const lifiConfig = createConfig({
  integrator: 'BrunelOnChain',
  providers: [], // We can add custom providers here if needed, but defaults are usually fine
});
