// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract EscrowUPI {
    enum EscrowStatus { Pending, Paid, Released, Refunded, Cancelled }

    struct Escrow {
        address payable buyer;
        address payable seller;
        uint256 amount;
        EscrowStatus status;
        uint256 createdAt;
    }

    uint256 public escrowCount;
    address public admin;
    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createEscrow(address payable _seller) external payable returns (uint256) {
        require(msg.value > 0, "Amount > 0");
        require(_seller != address(0), "Invalid seller");

        escrowCount++;
        escrows[escrowCount] = Escrow({
            buyer: payable(msg.sender),
            seller: _seller,
            amount: msg.value,
            status: EscrowStatus.Pending,
            createdAt: block.timestamp
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, msg.value);
        return escrowCount;
    }

    function releasePayment(uint256 _escrowId) external onlyAdmin {
        Escrow storage e = escrows[_escrowId];
        require(e.status == EscrowStatus.Pending, "Not pending");
        e.status = EscrowStatus.Released;
        uint256 amt = e.amount;
        e.amount = 0;
        (bool ok, ) = e.seller.call{value: amt}("");
        require(ok, "Transfer failed");
        emit EscrowReleased(_escrowId);
    }

    function refundBuyer(uint256 _escrowId) external onlyAdmin {
        Escrow storage e = escrows[_escrowId];
        require(e.status == EscrowStatus.Pending, "Invalid state");
        e.status = EscrowStatus.Refunded;
        uint256 amt = e.amount;
        e.amount = 0;
        (bool ok, ) = e.buyer.call{value: amt}("");
        require(ok, "Refund failed");
        emit EscrowRefunded(_escrowId);
    }

    function cancelEscrow(uint256 _escrowId) external onlyAdmin {
        Escrow storage e = escrows[_escrowId];
        require(e.status == EscrowStatus.Pending, "Already processed");
        e.status = EscrowStatus.Cancelled;
        emit EscrowCancelled(_escrowId);
    }

    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid");
        admin = _newAdmin;
    }
}

