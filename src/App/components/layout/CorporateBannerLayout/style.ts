import { Stack } from "App/components/layout";
import styled from "styled-components";

export const BannerContainer = styled.div`
  min-height: 100vh;

  display: flex;
  align-self: stretch;
  justify-content: center;
  flex-wrap: wrap-reverse;
`;

export const CorporateBannerStack = styled(Stack)<{ "background-image-url": string }>`
  flex-basis: 29rem;
  padding-top: clamp(var(--s0), calc(2vw + var(--s0)), var(--s1));
  padding-bottom: calc(clamp(var(--s0), calc(2vw + var(--s0)), var(--s4)) * 2);
  padding-left: clamp(var(--s0), calc(2vw + var(--s0)), var(--s3));
  padding-right: clamp(var(--s0), calc(2vw + var(--s0)), var(--s3));

  background: linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)),
    url(${(p) => p["background-image-url"]});
  background-size: cover;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  & h2.ant-typography,
  & div.ant-typography {
    margin: 0 var(--s1);
    font-weight: 500;
    color: white;
  }

  & h2.ant-typography {
    font-size: var(--s3);
    line-height: 3.235rem;
  }

  & div.ant-typography {
    line-height: 2.375rem;
  }
`;

export const TgradeLogo = styled.img`
  height: 1.875rem;
`;

export const CornerStack = styled(Stack)`
  align-items: flex-start;
`;

export const CornerTopLeft = styled.img`
  height: 2.0625rem;
`;

export const CornerBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CornerBottomRight = styled.img`
  align-self: flex-end;
  height: 2.0625rem;
`;

export const DotMatrix = styled.img`
  margin-left: clamp(var(--s0), calc(2vw + var(--s0)), var(--s4));
  width: 3.75rem;
  height: 3.5rem;
`;