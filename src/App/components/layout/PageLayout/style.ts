import { FormItem } from "formik-antd";
import styled from "styled-components";
import { Center } from "..";

export const StyledCenter = styled(Center)`
  --max-width: min(100vw, 22rem);
  max-width: var(--max-width);
  overflow: hidden;

  padding: var(--s4);
  /* Reduces padding when width < var(--max-width), but uses em for better media query support */
  @media (max-width: 22em) {
    padding: var(--s-1) 0 var(--s-2) 0;
  }

  && > * {
    width: 100%;
  }
`;

export const MenuWrapper = styled.div`
  /* Position and sizing of burger button */
  & .bm-burger-button {
    display: none;
  }

  /* Color/shape of close button cross */
  & .bm-cross {
    background: white;
  }

  /* General sidebar styles */
  & .bm-menu {
    background: var(--grad-primary);
    padding: 2rem;
  }

  &[data-background-big="true"] .bm-menu {
    background: var(--color-form-focus);
  }

  /* Wrapper for item list */
  & .bm-item-list {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  /* Individual item */
  & .bm-item {
    display: inline-block;

    h3.ant-typography {
      color: white;
      margin: 0;
    }
  }
`;

export const LanguageFormItem = styled(FormItem)`
  & .ant-form-item-control-input-content {
    background-color: var(--color-form);
    border-color: var(--color-form);

    & .ant-select {
      color: var(--color-form-focus);

      &:focus-within {
        color: white;
      }
    }
  }
`;

export const NavHeader = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & [alt="Back arrow"] {
    margin-right: auto;
  }

  & [aria-label="Toggle menu"] {
    margin-left: auto;
  }
`;
