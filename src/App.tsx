import { ConnectButton, useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "./thirdweb.svg";
import { client } from "./client";
import { CampModal,   
  useSocials,
  useAuthState,
  useAuth, } from "@campnetwork/sdk/react";

import { useConnect } from "wagmi";  
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Roast from "./components/Roast";

// TODO: Add CampModal with defaultProvider as Thirdweb

export function App() {
  // sets provider
  const [provider, setProvider] = useState<any | null>(null);
  const [connector, setConnector] = useState<any | null>(null);
  const activeAccount = useActiveAccount();
  const { connectors } = useConnect();
  useEffect(() => {
    setConnector(connectors.find((x) => x.id === "in-app-wallet"));
  }, [connectors]);
  useEffect(() => {
    if (activeAccount && connector) {
      connector?.getProvider().then((provider: any) => {
        setProvider({
          request: async (method: any) => {
            if (method.method === "eth_requestAccounts") {
              return [activeAccount.address];
            } else {
              return await provider.request(method);
            }
          },
        });
      });
    } else {
      setProvider(null);
    }
  }, [activeAccount]);

  const auth = useAuth();
  const { data: socials, isLoading: socialsLoading } = useSocials();
  const { authenticated, loading: authLoading } = useAuthState();
  const [isRoastLoading, setIsRoastLoading] = useState(false);
  const [roast, setRoast] = useState(null);

  useEffect(() => {
    const fetchSpotify = async () => {
      setIsRoastLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/roast/${auth.walletAddress}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!response.error) setRoast(data);
        setIsRoastLoading(false);
      } catch (e) {
        console.error(e);
        setIsRoastLoading(false);
      }
    };

    if (authenticated && socials?.spotify) {
      fetchSpotify();
    }
  }, [socials]);

  
  return (
    <div className="container">
      < Header />
      <main className="main">
      <img src="src/assets/buff.jpeg" alt="Buff mascot" className="logo-buff" />
        <h2 className="title">Spotify Roast</h2>
        <p className="subtitle">What does AI think about your last 20 played tracks ?</p>
          <div className="flex justify-center mb-20">

           <ConnectButton
            client={client}
            appMetadata={{
              name: "Camp SDK Example",
              url: "https://campnetwork.xyz",
            }}
          />
        </div>

        <p className="description">Come and bring your Social vibes!</p>

        <CampModal
          defaultProvider={{
            provider: provider || null,
            info: {
              name: "thirdweb",
              icon: thirdwebIcon,
              chainId: 1,
            },
            exclusive: true,
          }}
        />



        
        {authenticated && socials?.spotify && roast && (
        <div>
          <Roast data={roast} />
        </div>
        )}
      </main>
      
    </div>

  );
}




