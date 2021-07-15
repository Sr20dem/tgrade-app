import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSdk } from "service";
import AddressTag from "../AddressTag";
import ConnectWalletModal from "../ConnectWalletModal";
import * as Icon from "./icons";
import { Cell, LinkWrapper, Navbar, StyledText } from "./style";
import { DetailedProposalModal } from "../DetailedProposalModal";

export const NavSidebar: React.FC = () => {
  const {
    sdkState: { address },
  } = useSdk();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);

  return (
    <Navbar>
      <LinkWrapper>
        <Icon.TgradeLogo />
        <Link to={paths.dso.prefix}>
          <Cell>
            <Icon.TrustedCircle />
            <StyledText>Trusted Circle</StyledText>
            <Icon.Join />
          </Cell>
        </Link>
        <Link to="/" onClick={() => setModalOpen2(true)}>
          <DetailedProposalModal isModalOpen={isModalOpen2} closeModal={() => setModalOpen2(false)} />
          <Cell>
            <Icon.Token />
            <StyledText>T-Market</StyledText>
            <Icon.Trade />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Wiki />
            <StyledText>Wiki</StyledText>
            <Icon.Visit />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Feedback />
            <StyledText>Feedback</StyledText>
            <Icon.Visit />
          </Cell>
        </Link>
      </LinkWrapper>
      <Link to="/" onClick={() => setModalOpen(true)}>
        <Cell>
          {address ? (
            <AddressTag address={address} short noYou />
          ) : (
            <>
              <Icon.ConnectWallet />
              <StyledText>Connect Wallet</StyledText>
            </>
          )}
        </Cell>
      </Link>
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </Navbar>
  );
};
