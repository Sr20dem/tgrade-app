import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { DsoContractQuerier, ProposalResponse } from "utils/dso";

import Stack from "../Stack/style";
import { EscrowMembersContainer, ProposalsContainer, StatusBlock, StatusParagraph } from "./style";

const DsoCreateProposalModal = lazy(() => import("App/components/DsoCreateProposalModal"));
const DsoProposalDetailModal = lazy(() => import("App/components/DsoProposalDetailModal"));
const DsoIdActions = lazy(() => import("App/components/DsoIdActions"));
const DsoEscrow = lazy(() => import("App/components/DsoEscrow"));
const DsoMembers = lazy(() => import("App/components/DsoMembers"));
const Table = lazy(() => import("App/components/Table"));

const { Title, Paragraph } = Typography;

function getImgSrcFromStatus(status: string) {
  switch (status) {
    case "executed":
    case "passed":
      return { src: passedIcon };
    case "rejected":
      return { src: rejectedIcon };
    default:
      return { src: pendingIcon };
  }
}

const columns = [
  {
    title: "Nº",
    dataIndex: "id",
    key: "id",
    sorter: (a: any, b: any) => a.id - b.id,
  },
  {
    title: "Type",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Due date",
    key: "expires",
    render: (record: any) => {
      const formatedDate = new Date(record.expires.at_time / 1000000).toLocaleDateString();
      const formatedTime = new Date(record.expires.at_time / 1000000).toLocaleTimeString();
      return (
        <>
          <div>{formatedDate}</div>
          <div>{formatedTime}</div>
        </>
      );
    },
    sorter: (a: any, b: any) => {
      const aDate = new Date(a.expires.at_time / 1000000);
      const bDate = new Date(b.expires.at_time / 1000000);
      return bDate.getTime() - aDate.getTime();
    },
  },
  {
    title: "Status",
    key: "status",
    render: (record: any) => (
      <StatusBlock>
        <StatusParagraph status={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {(record.status as string).charAt(0).toUpperCase() + (record.status as string).slice(1)}
        </StatusParagraph>
        <Paragraph>Yes: {record.votes.yes}</Paragraph>
        <Paragraph>No: {record.votes.no}</Paragraph>
        <Paragraph>Abstained: {record.votes.abstain}</Paragraph>
      </StatusBlock>
    ),
    sorter: (a: any, b: any) => {
      function getSortNumFromStatus(status: string): number {
        switch (status) {
          case "executed":
            return 1;
          case "passed":
            return 2;
          case "rejected":
            return 3;
          default:
            return 4;
        }
      }

      return getSortNumFromStatus(b.status) - getSortNumFromStatus(a.status);
    },
  },
  {
    title: "Description",
    key: "description",
    render: (record: any) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
  },
];

interface DsoDetailParams {
  readonly dsoAddress: string;
}

export default function DsoDetail({ dsoAddress }: DsoDetailParams): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();

  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);
  const [proposals, setProposals] = useState<readonly ProposalResponse[]>([]);
  const [clickedProposal, setClickedProposal] = useState<number>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const dsoContract = new DsoContractQuerier(dsoAddress, client);
      const proposals = await dsoContract.getProposals();
      const isVotingMember = (await dsoContract.getVotingMembers()).some((member) => member.addr === address);
      setVotingMember(isVotingMember);
      setProposals(proposals);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [client, dsoAddress, address, handleError]);

  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);

  return (
    <>
      <Stack>
        <DsoIdActions />
        <EscrowMembersContainer>
          <DsoEscrow />
          <DsoMembers />
        </EscrowMembersContainer>
        <ProposalsContainer>
          <header>
            <Title level={2} style={{ fontSize: "var(--s1)" }}>
              Proposals
            </Title>
            {isVotingMember && (
              <ButtonAddNew text="Add proposal" onClick={() => setCreateProposalModalOpen(true)} />
            )}
          </header>
          {proposals.length ? (
            <Table
              columns={columns}
              pagination={false}
              dataSource={proposals}
              onRow={(proposal: ProposalResponse) => ({
                onClick: () => setClickedProposal(proposal.id),
              })}
            />
          ) : null}
        </ProposalsContainer>
      </Stack>
      <DsoCreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      <DsoProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal ?? 0}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
