import { Typography } from "antd";
import { Stack } from "App/components/layout";
import styled from "styled-components";

const { Text } = Typography;

export const TokenStack = styled(Stack)`
  & > * {
    --gap: var(--s0);
  }
`;

export const TokenItem = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  & span.ant-typography + span.ant-typography {
    font-family: var(--ff-montserrat);
    font-size: var(--s-1);
    font-weight: bolder;
  }
`;

export const ErrorText = styled(Text)`
  && {
    font-size: var(--s-1);
    color: var(--color-red);
  }
`;
