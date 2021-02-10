import { CosmWasmFeeTable } from "@cosmjs/cosmwasm-launchpad";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { GasLimits, GasPrice, makeCosmoshubPath, OfflineSigner, Secp256k1HdWallet } from "@cosmjs/launchpad";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import {
  DistributionExtension,
  QueryClient,
  setupDistributionExtension,
  setupStakingExtension,
  StakingExtension,
} from "@cosmjs/stargate";
import { adaptor34, Client as TendermintClient } from "@cosmjs/tendermint-rpc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { NetworkConfig } from "config/network";

// generateMnemonic will give you a fresh mnemonic
// it is up to the app to store this somewhere
export function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

// some code that will only work in a browser...
export function loadOrCreateMnemonic(): string {
  const key = "burner-wallet";
  const loaded = localStorage.getItem(key);
  if (loaded) {
    return loaded;
  }
  const generated = generateMnemonic();
  localStorage.setItem(key, generated);
  return generated;
}

export type WalletLoader = (chainId: string, addressPrefix?: string) => Promise<OfflineSigner>;

export async function loadOrCreateWallet(_chainId: string, addressPrefix?: string): Promise<OfflineSigner> {
  const mnemonic = loadOrCreateMnemonic();
  const hdPath = makeCosmoshubPath(0);
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, hdPath, addressPrefix);
  return wallet;
}

export async function loadLedgerWallet(_chainId: string, addressPrefix?: string): Promise<OfflineSigner> {
  const interactiveTimeout = 120_000;
  const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);

  return new LedgerSigner(ledgerTransport, { hdPaths: [makeCosmoshubPath(0)], prefix: addressPrefix });
}

export async function loadKeplrWallet(chainId: string): Promise<OfflineSigner> {
  const anyWindow: any = window;
  if (!anyWindow.getOfflineSigner) {
    throw new Error("Keplr extension is not available");
  }

  const signer = anyWindow.getOfflineSigner(chainId);
  signer.signAmino = signer.signAmino ?? signer.sign;

  return Promise.resolve(signer);
}

// this creates a new connection to a server at URL,
// using a signing keyring generated from the given mnemonic
export async function createSigningClient(
  config: NetworkConfig,
  signer: OfflineSigner,
): Promise<SigningCosmWasmClient> {
  const gasLimits: GasLimits<CosmWasmFeeTable> = {
    upload: 1500000,
    init: 600000,
    exec: 400000,
    migrate: 600000,
    send: 80000,
    changeAdmin: 80000,
  };

  return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
    prefix: config.addressPrefix,
    gasPrice: GasPrice.fromString(`${config.gasPrice}${config.feeToken}`),
    gasLimits: gasLimits,
  });
}

export async function createQueryClient(
  apiUrl: string,
): Promise<QueryClient & StakingExtension & DistributionExtension> {
  const tmClient = await TendermintClient.connect(apiUrl, adaptor34);
  return QueryClient.withExtensions(tmClient, setupStakingExtension, setupDistributionExtension);
}
