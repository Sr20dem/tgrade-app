import { coins, StdFee } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { codec } from "@cosmjs/stargate";
import { NetworkConfig } from "config/network";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";

export type StakingValidator = codec.cosmos.staking.v1beta1.IValidator;
export interface EncodeObject<T, V> {
  readonly typeUrl: T;
  readonly value: V;
}
export type EncodeMsgDelegate = EncodeObject<
  "/cosmos.staking.v1beta1.MsgDelegate",
  codec.cosmos.staking.v1beta1.IMsgDelegate
>;
export type EncodeMsgUndelegate = EncodeObject<
  "/cosmos.staking.v1beta1.MsgUndelegate",
  codec.cosmos.staking.v1beta1.IMsgUndelegate
>;
export type EncodeMsgWithdrawDelegatorReward = EncodeObject<
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
  codec.cosmos.distribution.v1beta1.IMsgWithdrawDelegatorReward
>;

export function useStakingValidator(validatorAddress: string): StakingValidator | undefined {
  const { handleError } = useError();
  const { getQueryClient } = useSdk();
  const [validator, setValidator] = useState<StakingValidator>();

  useEffect(() => {
    (async function updateValidator() {
      try {
        const { validator } = await getQueryClient().staking.unverified.validator(validatorAddress);
        if (!validator) {
          throw new Error(`No validator found with address: ${validatorAddress}`);
        }
        setValidator(validator);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [getQueryClient, handleError, validatorAddress]);

  return validator;
}

export function getDelegationFee({ gasPrice, feeToken }: NetworkConfig): StdFee {
  const gas = 200_000;
  return { amount: coins(gasPrice * gas, feeToken), gas: gas.toString() };
}

export function formatShares(shares: string): string {
  return Decimal.fromUserInput(shares, 18).toString();
}

export function formatUpdateTime(updateTime: string): string {
  return new Date(updateTime).toLocaleString(undefined, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}