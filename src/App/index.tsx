import { config } from "config/network";
import { i18n } from "i18n/config";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ContractsProvider, ErrorProvider, LayoutProvider, SdkProvider } from "service";
import ThemeProvider from "service/theme";
import { MenuPageLayout, ProtectedSwitch } from "./components/logic";
import { paths } from "./paths";
import Account from "./routes/Account";
import Cw20Wallet from "./routes/Cw20Wallet";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import OperationResult from "./routes/OperationResult";
import Staking from "./routes/Staking";
import Wallet from "./routes/Wallet";

export default function App(): JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorProvider>
        <ReactQueryClientProvider client={new ReactQueryClient()}>
          <SdkProvider config={config}>
            <ContractsProvider>
              <ThemeProvider>
                <Router basename={process.env.PUBLIC_URL}>
                  <LayoutProvider>
                    <MenuPageLayout>
                      <Switch>
                        <Route exact path="/">
                          <Login />
                        </Route>
                        <Route path={paths.login.prefix}>
                          <Login />
                        </Route>
                        <ProtectedSwitch authPath={paths.login.prefix}>
                          <Route path={paths.logout}>
                            <Logout />
                          </Route>
                          <Route path={paths.operationResult}>
                            <OperationResult />
                          </Route>
                          <Route path={paths.account.prefix}>
                            <Account />
                          </Route>
                          <Route path={paths.wallet.prefix}>
                            <Wallet />
                          </Route>
                          <Route path={paths.cw20Wallet.prefix}>
                            <Cw20Wallet />
                          </Route>
                          <Route path={paths.staking.prefix}>
                            <Staking />
                          </Route>
                        </ProtectedSwitch>
                      </Switch>
                    </MenuPageLayout>
                  </LayoutProvider>
                </Router>
              </ThemeProvider>
            </ContractsProvider>
          </SdkProvider>
        </ReactQueryClientProvider>
      </ErrorProvider>
    </I18nextProvider>
  );
}
