import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { Button, Field } from "App/components/form";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay } from "utils/currency";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import BackButtonOrLink from "../../../../../BackButtonOrLink";
import { ButtonGroup, FeeField, FeeGroup, FormStack, Separator } from "./style";

const { Text } = Typography;

const escrowLabel = "Escrow amount";

const validationSchema = Yup.object().shape({
  [getFormItemName(escrowLabel)]: Yup.number()
    .typeError("Escrow must be a number")
    .required("Escrow is required")
    .positive("Escrow amount must be positive")
    .min(1, "Escrow amount must be 1 minimum"),
});

export interface FormDsoPaymentValues {
  readonly escrowAmount: string;
}

interface FormDsoPaymentProps {
  readonly handleSubmit: (values: FormDsoPaymentValues) => void;
  readonly goBack: () => void;
}

export default function FormDsoPayment({ handleSubmit, goBack }: FormDsoPaymentProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient },
  } = useSdk();

  const [escrowAmount, setEscrowAmount] = useState("1");
  const [txFee, setTxFee] = useState("0");
  const [totalCharged, setTotalCharged] = useState("0");
  const mappedFeeToken = config.coinMap[config.feeToken];

  useEffect(() => {
    if (isNaN(parseFloat(escrowAmount))) {
      setTxFee("0");
      setTotalCharged("0");
      return;
    }

    const initFeeCoin = signingClient.fees.init.amount.find(({ denom }) => denom === config.feeToken);

    try {
      if (!initFeeCoin) {
        throw new Error(`Fee coin is not configured for ${config.feeToken}`);
      }

      const nativeEscrowAmount = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);

      const decimalEscrow = Decimal.fromUserInput(nativeEscrowAmount, mappedFeeToken.fractionalDigits);
      const decimalTxFee = Decimal.fromUserInput(initFeeCoin.amount, mappedFeeToken.fractionalDigits);
      const decimalTotalCharged = decimalEscrow.plus(decimalTxFee);

      const txFeeToDisplay = nativeCoinToDisplay(initFeeCoin, config.coinMap);
      const totalChargedToDisplay = nativeCoinToDisplay(
        { denom: config.feeToken, amount: decimalTotalCharged.toString() },
        config.coinMap,
      );

      setTxFee(txFeeToDisplay.amount);
      setTotalCharged(totalChargedToDisplay.amount);
    } catch (error) {
      handleError(error);
    }
  }, [
    config.coinMap,
    config.feeToken,
    escrowAmount,
    handleError,
    mappedFeeToken.fractionalDigits,
    signingClient.fees.init.amount,
  ]);

  return (
    <Formik
      initialValues={{ [getFormItemName(escrowLabel)]: escrowAmount }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit({ escrowAmount: values[getFormItemName(escrowLabel)] })}
    >
      {({ isValid, isSubmitting, submitForm }) => (
        <Form>
          <FormStack>
            <Field
              value={escrowAmount}
              onInputChange={({ target: { value } }) => setEscrowAmount(value)}
              disabled={isSubmitting}
              label={escrowLabel}
              placeholder="Enter escrow amount"
              units={config.coinMap[config.feeToken]?.denom || "—"}
            />
            <FeeGroup>
              <FeeField>
                <Text>Escrow amount</Text>
                <Text>{`${escrowAmount || 0} ${mappedFeeToken.denom}`}</Text>
              </FeeField>
              <FeeField>
                <Text>Tx fee</Text>
                <Text>{`~${txFee} ${mappedFeeToken.denom}`}</Text>
              </FeeField>
              <FeeField>
                <Text>Total charged</Text>
                <Text>{`~${totalCharged} ${mappedFeeToken.denom}`}</Text>
              </FeeField>
            </FeeGroup>
            <Separator />
            <ButtonGroup>
              <BackButtonOrLink disabled={isSubmitting} onClick={() => goBack()} text="Back" />
              <Button loading={isSubmitting} disabled={!isValid} onClick={() => submitForm()}>
                <div>Sign transaction and pay escrow</div>
              </Button>
            </ButtonGroup>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
