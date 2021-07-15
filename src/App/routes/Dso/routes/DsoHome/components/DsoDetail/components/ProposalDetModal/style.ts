import { Modal, Divider, Typography, Button } from "antd";
import { Stack } from "App/components/layoutPrimitives";
import styled from "styled-components";

export default styled(Modal)`
  ${({ bgTransparent }: { bgTransparent?: boolean }) =>
    bgTransparent &&
    `
  & .ant-modal-content {
    background: none;
    box-shadow: none;
  }
  `};
`;

export const Title = styled(Typography.Title)`
  &.ant-typography {
    color: #000;
    font-weight: 500;
    font-size: 30px;
  }
`;

export const Paragraph = styled.p`
  margin-left: 50px;
`;

export const Text = styled(Typography.Text)`
  &.ant-typography {
    color: #000;
    font-weight: 500;
  }
`;

export const FormStack = styled(Stack)`
  & .ant-btn {
    align-self: flex-end;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;

  & h1 {
    font-size: var(--s3);
    font-weight: 500;
    line-height: 2.35rem;
  }

  & span.ant-typography {
    line-height: 28px;
    color: #8692a6;
  }

  & img {
    position: absolute;
    top: 0;
    right: -40px;
    cursor: pointer;
    height: 1.25rem;
  }
`;

export const Separator = styled(Divider)`
  margin: 2px;
`;

export const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & .ant-form-item {
    flex-basis: 18rem;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FeeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  align-items: flex-end;
  min-width: 100px;
`;

export const ParticipantsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & p {
    margin: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  height: 82px;
  align-items: center;
  & button {
    height: 42px;
    flex-basis: calc(50% - calc(var(--s1) / 2));
  }

  & button + button {
    margin-left: var(--s1);
  }

  & .ant-btn {
  }
`;

export const AbstainedButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  min-width: 125px;
  background-color: #8692a6;
  color: #fff;
`;

export const AcceptButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  width: 94px;
  background-color: #0bb0b1;
  color: #fff;
`;

export const RejectButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  width: 94px;
  background-color: #ff6465;
  color: #fff;
`;
