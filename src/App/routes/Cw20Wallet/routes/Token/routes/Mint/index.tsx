import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormMintTokens, { FormMintTokensFields } from "./FormMintTokens";

const { Title, Text } = Typography;

interface MintParams {
  readonly contractAddress: string;
}

export default function Mint(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");
  const history = useHistory();
  const { contractAddress }: MintParams = useParams();
  const { url: pathMintMatched } = useRouteMatch();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`;
  const backButtonProps = useMemo(() => ({ path: pathTokenDetail }), [pathTokenDetail]);
  const { setLoading } = useLayout({ backButtonProps });

  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [mintCap, setMintCap] = useState<string>();

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20TokenAndMintCap() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(t("error.noCw20Found", { contractAddress })));
        return;
      }
      if (mounted) setCw20Token(cw20Token);

      const { cap: mintCap } = await cw20Contract.minter(address);
      if (mounted) setMintCap(mintCap);
    })();

    return () => {
      mounted = false;
    };
  }, [address, client, contractAddress, handleError, t]);

  async function mintTokensAction(values: FormMintTokensFields) {
    if (!cw20Token) return;
    setLoading(`Minting ${cw20Token.symbol}...`);

    const { address: recipientAddress, amount } = values;
    const cw20Contract = CW20(client).use(contractAddress);

    try {
      const mintAmount = Decimal.fromUserInput(amount, cw20Token.decimals).atomics;
      await cw20Contract.mint(address, recipientAddress, mintAmount);

      setLoading(false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("mintSuccess", { amount, symbol: cw20Token.symbol, recipientAddress }),
          customButtonText: t("tokenDetail"),
          customButtonActionPath: pathTokenDetail,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("mintFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathMintMatched,
        } as OperationResultState,
      });
    }
  }

  const amountToDisplay = mintCap ? Decimal.fromAtomics(mintCap, cw20Token?.decimals ?? 0).toString() : "No";
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const maxAmount = mintCap ? Decimal.fromAtomics(mintCap, cw20Token?.decimals ?? 0) : undefined;

  return (
    <Stack gap="s4">
      <Title>{cw20Token?.symbol || ""}</Title>
      <TokenAmount>
        <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
        {amountDecimal && <Text>{amountDecimal}</Text>}
        <Text>{` ${t("cap")}`}</Text>
      </TokenAmount>
      <FormMintTokens
        tokenName={cw20Token?.symbol || ""}
        maxAmount={maxAmount}
        mintTokensAction={mintTokensAction}
      />
    </Stack>
  );
}
