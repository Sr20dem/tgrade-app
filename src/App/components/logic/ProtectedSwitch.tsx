import * as React from "react";
import { Redirect, Switch, SwitchProps } from "react-router-dom";
import { useSdk } from "service";

export interface RedirectLocation {
  readonly redirectPathname: string;
  readonly redirectState: any;
}

interface ProtectedSwitchProps extends SwitchProps {
  readonly authPath: string;
}

export default function ProtectedSwitch({ authPath, children, location }: ProtectedSwitchProps): JSX.Element {
  const { initialized } = useSdk();

  return initialized ? (
    <Switch location={location}>{children}</Switch>
  ) : (
    <Redirect
      to={{
        pathname: authPath,
        state: location ? { redirectPathname: location.pathname, redirectState: location.state } : undefined,
      }}
    />
  );
}
