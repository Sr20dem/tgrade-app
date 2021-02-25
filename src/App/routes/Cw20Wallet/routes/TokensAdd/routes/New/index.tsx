import { Decimal, Uint64 } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input, Select } from "formik-antd";
import * as React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useContracts, useError, useSdk } from "service";
import { CW20, MinterResponse } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { createTokenValidationSchema } from "utils/formSchemas";
import { FormField, FormStack, MainStack } from "./style";

const { Title, Text } = Typography;
const { Option } = Select;

export interface FormCreateTokenFields {
  readonly symbol: string;
  readonly tokenName: string;
  readonly decimals: string;
  readonly initialSupply: string;
  readonly mint: string;
  readonly mintCap?: string;
}

export default function New(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { handleError } = useError();
  const { getConfig, getSigningClient, getAddress } = useSdk();
  const codeId = getConfig().codeId;
  const address = getAddress();
  const { addContract } = useContracts();

  async function submitCreateToken(values: FormCreateTokenFields) {
    setLoading(true);

    try {
      if (!codeId) {
        throw new Error("Missing codeId in configuration file.");
      }

      const decimals = parseInt(values.decimals, 10);
      const amount = Decimal.fromUserInput(values.initialSupply, decimals)
        .multiply(Uint64.fromNumber(10 ** decimals))
        .toString();
      const cap = values.mintCap
        ? Decimal.fromUserInput(values.mintCap, decimals)
            .multiply(Uint64.fromNumber(10 ** decimals))
            .toString()
        : undefined;
      const canMint = values.mint === "fixed" || values.mint === "unlimited";
      const mint: MinterResponse | undefined = canMint ? { minter: address, cap } : undefined;

      const msg: any = {
        name: values.tokenName,
        symbol: values.symbol,
        decimals,
        initial_balances: [{ address, amount }],
        mint,
      };

      const { contractAddress } = await getSigningClient().instantiate(
        getAddress(),
        codeId,
        msg,
        values.symbol,
        { admin: address },
      );

      const newCw20Contract = CW20(getSigningClient()).use(contractAddress);
      addContract(newCw20Contract);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `${amount} ${values.tokenName} successfully created`,
          customButtonText: "Token Detail",
          customButtonActionPath: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Token creation failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddNew}`,
        } as OperationResultState,
      });
    }
  }

  return loading ? (
    <Loading loadingText={"Creating token..."} />
  ) : (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}` }}>
      <MainStack>
        <Title>Add New Token</Title>
        <Formik
          initialValues={{
            symbol: "",
            tokenName: "",
            decimals: "",
            initialSupply: "",
            mint: "",
            maxMint: "",
          }}
          onSubmit={submitCreateToken}
          validationSchema={createTokenValidationSchema}
        >
          {(formikProps) => (
            <Form>
              <FormStack>
                <FormField>
                  <Text>Symbol</Text>
                  <FormItem name="symbol">
                    <Input name="symbol" placeholder="Enter symbol" />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text>Name</Text>
                  <FormItem name="tokenName">
                    <Input name="tokenName" placeholder="Enter Token Name" />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text>Display decimals</Text>
                  <FormItem name="decimals">
                    <Input name="decimals" placeholder="Select Number" />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text>Initial supply</Text>
                  <FormItem name="initialSupply">
                    <Input name="initialSupply" placeholder="Enter Number" />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text>Mint</Text>
                  <FormItem name="mint">
                    <Select name="mint" defaultValue="none">
                      <Option value="none">None</Option>
                      <Option value="fixed">Fixed cap</Option>
                      <Option value="unlimited">Unlimited</Option>
                    </Select>
                  </FormItem>
                </FormField>
                <FormField>
                  <Text>Mint cap</Text>
                  <FormItem name="mintCap" data-disabled={formikProps.values.mint !== "fixed"}>
                    <Input
                      name="mintCap"
                      disabled={formikProps.values.mint !== "fixed"}
                      placeholder="Enter Amount"
                    />
                  </FormItem>
                </FormField>
                <Button
                  type="primary"
                  onClick={formikProps.submitForm}
                  disabled={!(formikProps.isValid && formikProps.dirty)}
                >
                  Create
                </Button>
              </FormStack>
            </Form>
          )}
        </Formik>
      </MainStack>
    </PageLayout>
  );
}
