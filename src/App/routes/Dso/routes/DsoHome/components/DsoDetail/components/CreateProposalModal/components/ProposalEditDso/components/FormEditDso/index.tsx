import { Button, Checkbox, Field } from "App/components/form";
import { BackButtonOrLink } from "App/components/logic";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, FieldGroup, FormStack, Separator, WarningText } from "./style";

function getFormValuesWithType(values: { [x: string]: string | boolean }): FormEditDsoValues {
  return {
    dsoName: values[getFormItemName(dsoNameLabel)].toString(),
    quorum: values[getFormItemName(quorumLabel)].toString(),
    threshold: values[getFormItemName(thresholdLabel)].toString(),
    votingDuration: values[getFormItemName(votingDurationLabel)].toString(),
    escrowAmount: values[getFormItemName(escrowAmountLabel)].toString(),
    earlyPass: !!values[getFormItemName(earlyPassLabel)],
    comment: values[getFormItemName(commentLabel)].toString(),
  };
}

function checkEditParamsAreNew(
  formValues: FormEditDsoValues,
  currentValues: Omit<FormEditDsoValues, "comment">,
): boolean {
  return (
    formValues.dsoName !== currentValues.dsoName ||
    formValues.quorum !== currentValues.quorum ||
    formValues.threshold !== currentValues.threshold ||
    formValues.votingDuration !== currentValues.votingDuration ||
    formValues.escrowAmount !== currentValues.escrowAmount ||
    formValues.earlyPass !== currentValues.earlyPass
  );
}

const dsoNameLabel = "Add new name for the Trusted Circle";
const quorumLabel = "Quorum";
const thresholdLabel = "Threshold";
const votingDurationLabel = "Voting duration";
const escrowAmountLabel = "Escrow amount";
const earlyPassLabel = "Allow end early?";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(dsoNameLabel)]: Yup.string().typeError("Trusted Circle name must be alphanumeric"),
  [getFormItemName(quorumLabel)]: Yup.number()
    .typeError("Quorum must be a number")
    .positive("Quorum must be positive")
    .integer("Quorum must be an integer")
    .max(100, "Quorum must be 100 maximum"),
  [getFormItemName(thresholdLabel)]: Yup.number()
    .typeError("Threshold must be a number")
    .positive("Threshold must be positive")
    .integer("Threshold must be an integer")
    .min(50, "Threshold must be 50 minimum")
    .max(100, "Threshold must be 100 maximum"),
  [getFormItemName(votingDurationLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .positive("Voting duration must be positive")
    .integer("Voting duration must be an integer")
    .min(1, "Voting duration must be 1 minimum"),
  [getFormItemName(escrowAmountLabel)]: Yup.number()
    .typeError("Escrow amount must be a number")
    .positive("Escrow amount must be positive")
    .min(1, "Escrow amount must be 1 minimum"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormEditDsoValues {
  readonly dsoName: string;
  readonly quorum: string;
  readonly threshold: string;
  readonly votingDuration: string;
  readonly escrowAmount: string;
  readonly earlyPass: boolean;
  readonly comment: string;
}

interface FormEditDsoProps extends FormEditDsoValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormEditDsoValues) => void;
  readonly currentDsoValues: Omit<FormEditDsoValues, "comment">;
}

export default function FormEditDso({
  goBack,
  handleSubmit,
  currentDsoValues,
  dsoName,
  quorum,
  threshold,
  votingDuration,
  escrowAmount,
  earlyPass,
  comment,
}: FormEditDsoProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(dsoNameLabel)]: dsoName,
        [getFormItemName(quorumLabel)]: quorum,
        [getFormItemName(thresholdLabel)]: threshold,
        [getFormItemName(votingDurationLabel)]: votingDuration,
        [getFormItemName(escrowAmountLabel)]: escrowAmount,
        [getFormItemName(earlyPassLabel)]: earlyPass,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(getFormValuesWithType(values))}
    >
      {({ values, isValid, submitForm }) => {
        const votingDurationInt = parseInt(values[getFormItemName(votingDurationLabel)].toString(), 10);
        const showDurationWarning = votingDurationInt >= 60;

        return (
          <>
            <Form>
              <FormStack gap="s1">
                <Field label={dsoNameLabel} placeholder="Enter Trusted Circle name" />
                <FieldGroup>
                  <Field label={quorumLabel} placeholder="Enter quorum" units="%" />
                  <Field label={thresholdLabel} placeholder="Enter threshold" units="%" />
                </FieldGroup>
                <FieldGroup>
                  <Field label={votingDurationLabel} placeholder="Enter duration" units="Days" />
                  <Field label={escrowAmountLabel} placeholder="Enter amount" units="TGD" />
                </FieldGroup>
                <Checkbox name={getFormItemName(earlyPassLabel)}>{earlyPassLabel}</Checkbox>
                <Field label={commentLabel} placeholder="Enter comment" />
                {showDurationWarning ? <WarningText>Warning: voting duration very long</WarningText> : null}
                <Separator />
                <ButtonGroup>
                  <BackButtonOrLink onClick={() => goBack()} text="Back" />
                  <Button
                    disabled={
                      !isValid || !checkEditParamsAreNew(getFormValuesWithType(values), currentDsoValues)
                    }
                    onClick={() => submitForm()}
                  >
                    <div>Next</div>
                  </Button>
                </ButtonGroup>
              </FormStack>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
