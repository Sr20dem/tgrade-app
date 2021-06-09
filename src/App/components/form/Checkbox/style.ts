import { Checkbox } from "formik-antd";
import styled from "styled-components";

export const StyledCheckbox = styled(Checkbox)`
  & .ant-checkbox-inner {
    border-color: var(--color-primary);
  }

  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--color-primary);
  }
`;
