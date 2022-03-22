import { Radio } from "antd";
import styled from "styled-components";

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  button:first-child {
    margin-right: var(--s0);
  }
`;

export const StyledRadioGroup = styled(Radio.Group)`
  & .ant-radio:hover {
    border-color: var(--color-primary);
  }

  & .ant-radio-checked .ant-radio-inner {
    border-color: var(--color-primary);

    &:after {
      background-color: var(--color-primary);
    }
  }
`;