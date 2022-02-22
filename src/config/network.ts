import { GasPrice } from "@cosmjs/stargate";
import { CoinMap } from "utils/currency";

export interface NetworkConfig {
  readonly chainId: string;
  readonly chainName: string;
  readonly addressPrefix: string;
  readonly rpcUrl: string;
  readonly httpUrl: string;
  readonly faucetUrl: string;
  readonly feeToken: string;
  readonly faucetTokens?: readonly [string, ...string[]];
  readonly stakingToken: string;
  readonly coinMap: CoinMap;
  readonly gasPrice: GasPrice;
  readonly factoryAddress: string;
  readonly codeIds?: {
    readonly tgradeDso?: readonly [number, ...number[]];
    readonly cw20Tokens?: readonly [number, ...number[]];
    readonly tgradeCw20?: readonly [number, ...number[]];
    readonly tgradeFactory?: readonly [number, ...number[]];
    readonly tgradePair?: readonly [number, ...number[]];
  };
}

export interface NetworkConfigs {
  readonly local: NetworkConfig;
  readonly [key: string]: NetworkConfig;
}

export function getAppConfig(configs: NetworkConfigs): NetworkConfig {
  const network = process.env.REACT_APP_NETWORK;
  if (!network) return configs.local;

  const config = configs[network];
  if (!config) {
    throw new Error(`No configuration found for network ${network}`);
  }

  return config;
}

// local docker deployment
const local: NetworkConfig = {
  chainId: "chain-JAynv8",
  chainName: "Local Testing",
  addressPrefix: "tgrade",
  rpcUrl: "http://localhost:26657",
  httpUrl: "http://localhost:1317",
  faucetUrl: "http://localhost:8000",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sd9g4hg",
  codeIds: {
    // The first 8 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [9],
    tgradeCw20: [10],
    tgradeFactory: [11],
    tgradePair: [12],
  },
};

const tgradeInternal: NetworkConfig = {
  chainId: "tgrade-internal-9",
  chainName: "Tgrade-internal-9",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-9.tgrade.io",
  httpUrl: "https://lcd.internal-9.tgrade.io",
  faucetUrl: "https://faucet.internal-9.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sd9g4hg",
  codeIds: {
    // The first 8 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [9],
    tgradeCw20: [10],
    tgradeFactory: [11],
    tgradePair: [12],
  },
};

const tgradeTestnet: NetworkConfig = {
  chainId: "tgrade-patchnet-1",
  chainName: "Tgrade-patchnet-1",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.patchnet-1.tgrade.io",
  httpUrl: "https://lcd.patchnet-1.tgrade.io",
  faucetUrl: "https://faucet.patchnet-1.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sd9g4hg",
  codeIds: {
    // The first 8 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [9],
    tgradeCw20: [10],
    tgradeFactory: [11],
    tgradePair: [12],
  },
};

const configs: NetworkConfigs = { local, tgradeInternal, tgradeTestnet };
export const config = getAppConfig(configs);
