import { createRoot } from "react-dom/client";
import {App} from './App.tsx'
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CampProvider } from "@campnetwork/sdk/react"
import { http, createConfig, WagmiProvider } from "wagmi";
import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
import { sepolia } from "wagmi/chains";
import { client } from "./client.ts";

import { StrictMode } from 'react'
import './App.css'

const queryClient = new QueryClient();
const connector = inAppWalletConnector({
  client,
});

export const config = createConfig({
  chains: [sepolia],
  connectors: [connector],
  transports: {
    [sepolia.id]: http(),
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <CampProvider clientId={import.meta.env.VITE_CAMP_CLIENT_ID}>
            <App />
          </CampProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  </StrictMode>,
)
