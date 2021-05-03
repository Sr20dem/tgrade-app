import { Button, Typography } from "antd";
import cosmWasmLogo from "App/assets/cosmWasmLogo.svg";
import { OldPageLayout, Stack } from "App/components/layout";
import { RedirectLocation } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { isChrome, isDesktop } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { initSdk, setInitialLayoutState, setLoading, useError, useLayout, useSdkInit } from "service";
import {
  getWallet,
  isWalletEncrypted,
  loadKeplrWallet,
  loadLedgerWallet,
  loadOrCreateWallet,
  WalletLoader,
} from "utils/sdk";
import { runAfterLoad } from "utils/ui";
import { LightText, Logo } from "./style";

const { Title } = Typography;

function disableLedgerLogin() {
  const anyNavigator: any = navigator;
  return !anyNavigator?.usb || !isChrome || !isDesktop;
}

function disableKeplrLogin() {
  const anyWindow: any = window;
  return !(anyWindow.getOfflineSigner && anyWindow.keplr.experimentalSuggestChain);
}

export default function Menu(): JSX.Element {
  const { t } = useTranslation("login");
  const history = useHistory();
  const state = history.location.state as RedirectLocation;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { menuState: "hidden" }), [layoutDispatch]);

  const { handleError } = useError();
  const {
    sdkState: { config },
    sdkDispatch,
  } = useSdkInit();

  async function init(loadWallet: WalletLoader) {
    setLoading(layoutDispatch, `${t("initializing")}`);

    runAfterLoad(async () => {
      try {
        const signer = await loadWallet(config);
        initSdk(sdkDispatch, signer);
      } catch (error) {
        handleError(error);
        setLoading(layoutDispatch, false);
      }
    });
  }

  async function initBrowser() {
    const storedWallet = getWallet();
    if (!storedWallet || !isWalletEncrypted(storedWallet)) await init(loadOrCreateWallet);
    else history.push(`${paths.login.prefix}${paths.login.unlock}`, state);
  }

  async function initLedger() {
    await init(loadLedgerWallet);
  }

  async function initKeplr() {
    await init(loadKeplrWallet);
  }

  function goToImportAccount() {
    history.push(`${paths.login.prefix}${paths.login.import}`);
  }

  return (
    <OldPageLayout>
      <Stack gap="s5">
        <Logo src={cosmWasmLogo} alt="CosmWasm logo" />
        <Stack gap="s3">
          <Stack gap="s-1">
            <Title level={1}>{t("hello")}</Title>
            <LightText>{t("welcome")}</LightText>
            <LightText>{t("select")}</LightText>
          </Stack>
          <Stack>
            <Button data-size="large" type="primary" onClick={initBrowser}>
              {t("browserButton")}
            </Button>
            <Button data-size="large" type="primary" onClick={goToImportAccount}>
              {t("importButton")}
            </Button>
            <Button data-size="large" type="primary" disabled={disableLedgerLogin()} onClick={initLedger}>
              {t("ledgerButton")}
            </Button>
            <Button data-size="large" type="primary" disabled={disableKeplrLogin()} onClick={initKeplr}>
              {t("keplrButton")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </OldPageLayout>
  );
}