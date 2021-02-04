import { Button, Divider, Typography } from "antd";
import { Stack } from "App/components/layout";
import copyToClipboard from "clipboard-copy";
import { ComponentProps } from "react";
import { useSdk } from "service";
import { printableBalance, useBalance } from "utils/currency";
import { AccountStack } from "./style";

const { Title, Text } = Typography;

type YourAccountProps = ComponentProps<typeof Stack> & {
  readonly hideTitle?: boolean;
  readonly hideBalance?: boolean;
};

export default function YourAccount({ tag, hideTitle, hideBalance }: YourAccountProps): JSX.Element {
  const { getAddress } = useSdk();
  const address = getAddress();
  const balance = useBalance();

  return (
    <AccountStack tag={tag}>
      {!hideTitle && (
        <header>
          <Title level={3}>Your Account</Title>
          {!hideBalance && <Divider />}
        </header>
      )}
      <Text>{address}</Text>
      {!hideBalance && <Text>({printableBalance(balance)})</Text>}
      <Button type="primary" onClick={() => copyToClipboard(address)}>
        Copy Account Address
      </Button>
    </AccountStack>
  );
}
