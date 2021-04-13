import { Coin } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";
import FormDelegateBalance, { FormDelegateBalanceFields } from "./FormDelegateBalance";

const { Title } = Typography;

interface DelegateParams {
  readonly validatorAddress: string;
}

export default function Delegate(): JSX.Element {
  const { t } = useTranslation("staking");

  const history = useHistory();
  const { url: pathDelegateMatched } = useRouteMatch();
  const { validatorAddress } = useParams<DelegateParams>();
  const pathValidator = `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathValidator } }), [
    layoutDispatch,
    pathValidator,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { config, delegateTokens },
  } = useSdk();
  const validator = useStakingValidator(validatorAddress);

  async function submitDelegateBalance({ amount }: FormDelegateBalanceFields) {
    setLoading(layoutDispatch, `${t("delegating")}`);

    try {
      const nativeAmountString = displayAmountToNative(amount, config.coinMap, config.stakingToken);
      const delegateAmount: Coin = { amount: nativeAmountString, denom: config.stakingToken };

      await delegateTokens(validatorAddress, delegateAmount);

      const denom = config.coinMap[config.stakingToken].denom;
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("delegateSuccess", { amount, denom }),
          customButtonText: t("validatorHome"),
          customButtonActionPath: pathValidator,
        },
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("delegateFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathDelegateMatched,
        },
      });
    }
  }

  return (
    <Stack gap="s6">
      <Stack>
        <Title>{t("delegate")}</Title>
        <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
      </Stack>
      <FormDelegateBalance submitDelegateBalance={submitDelegateBalance} />
    </Stack>
  );
}
