import { Typography } from "antd";
import Styled from "styled-components";
import MenuBG from "./assets/background.svg";

export const Navbar = Styled.div`
display:flex;
justify-content:space-between;
flex-direction:column;
min-height: 100vh;
width:15.25rem;
background-image: url(${MenuBG});
svg{
    margin:1.5rem;
}
`;

export const LinkWrapper = Styled.div`
display:flex;
flex-direction:column;
`;
export const Cell = Styled.div`
display:flex;
align-items:center;
padding:0.75rem;
width:15.25rem;
height:4.875rem;
color:#fff;
border-left: 4px solid transparent;
svg{
    margin:1rem;
}
&:hover{
    background-color:rgba(220,220,220,0.25);
    border-left: 4px solid white;
}
`;

export const StyledText = Styled(Typography.Text)`
&.ant-typography {
    color: #fff;
  }
`;