import AddressList from "App/components/AddressList";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { addressStringToArray, getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, Separator } from "./style";

const membersLabel = "Non voting participants to be added";
const commentLabel = "Comment";

export interface FormAddParticipantsValues {
  readonly members: readonly string[];
  readonly comment: string;
}

interface FormAddParticipantsProps extends FormAddParticipantsValues {
  readonly setMembers: React.Dispatch<React.SetStateAction<readonly string[]>>;
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormAddParticipantsValues) => void;
}

export default function FormAddParticipants({
  members,
  setMembers,
  comment,
  goBack,
  handleSubmit,
}: FormAddParticipantsProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(membersLabel)]: Yup.string()
      .typeError("Participants must be alphanumeric")
      .required("Participants are required")
      .test("are-addresses-valid", "Participants must have valid addresses", (membersString) => {
        const membersArray = addressStringToArray(membersString || "");
        return membersArray.every((memberAddress) => isValidAddress(memberAddress, addressPrefix));
      }),
    [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(membersLabel)]: members.join(","),
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const members = addressStringToArray(values[getFormItemName(membersLabel)]);
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ members, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field
                label={membersLabel}
                placeholder="Type or paste addresses here"
                value={members.join(",")}
                onInputChange={({ target: { value: membersString } }) => {
                  const membersArray = addressStringToArray(membersString);
                  setMembers(membersArray);
                }}
              />
              <AddressList
                addresses={members}
                addressPrefix={addressPrefix}
                handleClose={(memberAddress) =>
                  setMembers(members.filter((member) => member !== memberAddress))
                }
              />
              <Field label={commentLabel} placeholder="Enter comment" />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Create proposal</div>
                </Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}