import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s4);
  }

  h1 {
    margin: 0;
  }
`;

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
