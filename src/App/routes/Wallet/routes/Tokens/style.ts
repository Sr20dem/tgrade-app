import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s4);
  }

  h1 {
    margin: 0;
  }

  .ant-form {
    margin-top: var(--gap);
  }
`;
