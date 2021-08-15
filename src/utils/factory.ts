import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { PairProps, SwapFormValues } from "./tokens";

export class Factory {
  readonly #signingClient: SigningCosmWasmClient;

  constructor(address: string, signingClient: SigningCosmWasmClient) {
    this.#signingClient = signingClient;
  }

  static async createFactory(
    signingClient: SigningCosmWasmClient,
    codeId: number,
    creatorAddress: string,
    pairId: number,
    tokenId: number,
  ): Promise<any> {
    const initMsg: Record<string, unknown> = {
      pair_code_id: pairId,
      token_code_id: tokenId,
    };

    const { contractAddress } = await signingClient.instantiate(
      creatorAddress,
      codeId,
      initMsg,
      "factory instance",
    );
    return contractAddress;
  }

  static async createPair(
    signingClient: SigningCosmWasmClient,
    creatorAddress: string,
    factoryAddress: string,
    form: SwapFormValues,
  ): Promise<any> {
    if (!form.selectFrom || !form.selectTo) return;

    const keyFrom = form.selectFrom.address === "utgd" ? "native" : "token";
    const keyTo = form.selectTo.address === "utgd" ? "native" : "token";

    const response = await signingClient.execute(
      creatorAddress,
      factoryAddress,
      {
        create_pair: {
          asset_infos: [{ [keyFrom]: form.selectFrom?.address }, { [keyTo]: form.selectTo?.address }],
        },
      },
      "Creating Pair",
    );

    return response;
  }

  static async getPairs(
    client: CosmWasmClient,
    factoryAddress: string,
  ): Promise<{ [key: string]: PairProps }> {
    const { pairs } = await client.queryContractSmart(factoryAddress, {
      pairs: {},
    });
    const pairsMap: { [key: string]: PairProps } = {};
    pairs.forEach((pair: PairProps) => {
      if (pair.asset_infos.length < 2) return;
      const a = pair.asset_infos[0].native || pair.asset_infos[0].token;
      const b = pair.asset_infos[1].native || pair.asset_infos[1].token;

      pairsMap[`${a}-${b}`] = pair;
    });

    return pairsMap;
  }
}
