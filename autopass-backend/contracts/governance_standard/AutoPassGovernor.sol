// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../AutopassGovernorToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AutoPassGovernor is Ownable {
    struct Proposal {
        uint proposalId;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool canExecute;
    }

    uint private s_proposalIdCounter;

    //錢包地址, 提案ID, 是否投過
    mapping(address => mapping(uint256 => bool)) private voted;

    AutopassGovernorToken public governanceToken;

    Proposal[] public proposals;

    uint256 public quorumNumerator;

    //輸入治理代幣合約地址,以及投票通過率,e.g. 5%
    constructor(address _governanceTokenAddress, uint256 _quorumNumerator) {
        governanceToken = AutopassGovernorToken(_governanceTokenAddress);
        quorumNumerator = _quorumNumerator;
        s_proposalIdCounter = 0;
    }

    //檢查現有註冊會員人數
    function mintedTokens() public view returns (uint256) {
        return governanceToken.totalMinted();
    }

    //依照現有鑄造代幣人數計算投票率
    function quorumThreshold() public view returns (uint256) {
        return (mintedTokens() * quorumNumerator) / 100;
    }

    function createProposal(string memory _description) public {
        require(
            governanceToken.balanceOf(msg.sender) >= 1,
            "DAO: Only token holders can create proposals"
        );

        Proposal memory newProposal;
        newProposal.proposalId = s_proposalIdCounter;
        newProposal.proposer = msg.sender;
        newProposal.description = _description;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.canExecute = false;

        proposals.push(newProposal);

        s_proposalIdCounter = s_proposalIdCounter + 1;
    }

    function vote(uint256 _proposalId, bool _support) public {
        require(
            governanceToken.balanceOf(msg.sender) >= 1,
            "DAO: Only token holders can vote"
        );
        require(_proposalId < proposals.length, "DAO: Invalid proposal ID");
        require(
            !voted[msg.sender][_proposalId],
            "DAO: You have already voted on this proposal"
        );
        voted[msg.sender][_proposalId] = true;

        if (_support) {
            proposals[_proposalId].forVotes += 1;
        } else {
            proposals[_proposalId].againstVotes += 1;
        }
    }

    // 新增
    function getActiveProposals() public view returns (Proposal[] memory) {
        Proposal[] memory activeProposals = new Proposal[](proposals.length);
        uint256 count = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (!proposals[i].canExecute) {
                activeProposals[count] = proposals[i];
                count++;
            }
        }
        return activeProposals;
    }

    function checkAndExecuteProposals() public onlyOwner {
        uint256 activeProposalsCount = 0;
        uint256 quorum = quorumThreshold();

        for (uint256 i = 0; i < proposals.length; i++) {
            if (!proposals[i].canExecute) {
                if (proposals[i].forVotes >= quorum) {
                    proposals[i].canExecute = true;
                }
                activeProposalsCount++;
            }
        }
    }
}
