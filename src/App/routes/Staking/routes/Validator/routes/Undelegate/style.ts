import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s6);
  }
`;

export const HeaderTitleStack = styled(Stack)`
  & > * {
    --gap: var(--s0);
  }

  h1.ant-typography,
  h2.ant-typography {
    margin: 0;
    margin-top: var(--gap);
  }

  h1 {
    font-size: var(--s2);
    line-height: var(--s2);
  }

  h2 {
    font-size: var(--s5);
    line-height: var(--s5);
  }
`;
