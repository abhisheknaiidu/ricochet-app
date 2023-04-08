import { ConnectKitProvider } from 'connectkit';
import { AlertProvider } from 'contexts/AlertContext';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { optimism, polygon, polygonMumbai } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import '../styles/globals.css';

const { chains, provider, webSocketProvider } = configureChains(
	[polygon, optimism, polygonMumbai],
	[
		infuraProvider({ priority: 0, apiKey: process.env.INFURA_ID! }),
		alchemyProvider({ priority: 1, apiKey: process.env.ALCHEMY_ID! }),
		publicProvider({ priority: 2 }),
	],
	{ stallTimeout: 5000 }
);
const client = createClient({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({ chains }),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: 'Ricochet',
			},
		}),
		new WalletConnectConnector({
			chains,
			options: {
				qrcode: true,
			},
		}),
		new InjectedConnector({
			chains,
			options: {
				name: 'Injected',
				shimDisconnect: true,
			},
		}),
	],
	provider,
	webSocketProvider,
});

function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider theme='midnight'>
				<Provider store={store()}>
					<AlertProvider>
						<Component {...pageProps} />
					</AlertProvider>
				</Provider>
			</ConnectKitProvider>
		</WagmiConfig>
	);
}

export default appWithTranslation(App);
