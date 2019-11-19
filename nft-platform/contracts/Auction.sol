/**
 * @file Auction.sol
 * @author secret
 */
pragma solidity ^0.4.24;


import "./AuctionBase.sol";
import "./lib/ownership/Pausable.sol";


/**
 * @dev Auction performs the auction operation
 * @title Auction
 */
contract Auction is AuctionBase, Pausable {
    bool public isAuction = true;
    bytes4 constant InterfaceId_ERC721 = bytes4(0x9a20483d);
    
    /**
     * @dev assert the target address is the owner of the specified token
     * @param _target the address to be checked
     * @param _tokenId the token id to be checked
     */
    modifier onlyOwnership(address _target, uint256 _tokenId) {
        require(_isOwnerOf(_target, _tokenId));
        _;
    }

    /**
     * @dev assert the sender has the withdraw permission
     */
    modifier hasWithdrawPermission() {
        require(msg.sender == owner || msg.sender == address(nft));
        _;
    }

    /**
     * @dev assert the sender is the seller of the auction for the specified token id
     * @param _tokenId the token id to be checked
     */
    modifier onlySeller(uint256 _tokenId) {
        require(idToAuction[_tokenId].seller == msg.sender);
        _;
    }

    /**
     * @dev assert the target auction is open
     * @param _tokenId the token id of the auction to be checked
     */
    modifier whenAuctionOpen(uint256 _tokenId) {
        require(_isOpenAuction(idToAuction[_tokenId]));
        _;
    }

    /**
     * @dev constructor
     * @param _nft the NFT contract address
     * @param _feeRate the fee proportion (0-10000 means 0%-100%)
     */
    constructor(address _nft, uint256 _feeRate) public {
        require(_feeRate <= 10000);
        feeRate = _feeRate;

        NFToken candidateContract = NFToken(_nft);
        require(candidateContract.supportsInterface(InterfaceId_ERC721));
        nft = candidateContract;
    }

    /**
     * @dev withdraw the balance of the contract to NFT, requiring permission 
     */
    function withdrawBalance() external hasWithdrawPermission {
        address(nft).send(address(this).balance);
    }

    /**
     * @dev create an auction
     * @param _tokenId the id of the token to be traded
     * @param _seller the seller of the auction
     * @param _startingPrice the initial price
     * @param _endingPrice the ultimate price
     * @param _duration the time the auction will last for
     * @param _isSale a flag indicating the auction is a sale
     */
    function create(
        uint256 _tokenId,
        address _seller,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        bool _isSale
    )
        external
        whenNotPaused
        onlyOwnership(msg.sender, _tokenId)
    {
        require(_startingPrice == uint256(uint128(_startingPrice)));
        
        uint256 endingPrice = _endingPrice;
        uint256 duration = _duration;
        
        if (_isSale) {
            endingPrice = _startingPrice;
            duration = 0;
        } else {
            require(endingPrice == uint256(uint128(endingPrice)));
            require(duration == uint256(uint64(duration)));
        }
        
        // host the token to the contract
        _host(msg.sender, _tokenId);

        Auction memory auction = Auction(
            _seller,
            uint128(_startingPrice),
            uint128(endingPrice),
            uint64(duration),
            uint64(now),
            _isSale,
            true
        );
        _addAuction(_tokenId, auction);
    }

    /**
     * @dev bid on an auction of the given token id
     * @param _tokenId the token id of the target auction
     */
    function bid(uint256 _tokenId)
        external
        payable
        whenNotPaused
        whenAuctionOpen(_tokenId)
    {
        _bid(_tokenId, msg.value);
        _transfer(msg.sender, _tokenId);
    }

    /**
     * @dev cancel an auction for the specified token
     * @param _tokenId the token id of the auction to be cancelled
     */
    function cancelAuction(uint256 _tokenId)
        external
        onlySeller(_tokenId)
        whenAuctionOpen(_tokenId)
    {
        Auction storage auction = idToAuction[_tokenId];
        _cancelAuction(_tokenId, auction.seller);
    }

    /**
     * @dev cancel an auction when the contract is paused, only owner allowed
     * @param _tokenId the token id of the auction to be cancelled
     */
    function cancelAuctionWhenPaused(uint256 _tokenId)
        external
        whenPaused
        onlyOwner
        whenAuctionOpen(_tokenId)
    {
        Auction storage auction = idToAuction[_tokenId];
        _cancelAuction(_tokenId, auction.seller);
    }

    /**
     * @dev get the auction of the given token id
     * @param _tokenId the token id of the auction to be retrieved
     * @return the auction data
     */
    function getAuction(uint256 _tokenId)
        external
        view
        whenAuctionOpen(_tokenId)
        returns
    (
        address _seller,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        uint256 _startedAt,
        bool _isSale
    ) {
        Auction storage auction = idToAuction[_tokenId];
        return (
            auction.seller,
            auction.startingPrice,
            auction.endingPrice,
            auction.duration,
            auction.startedAt,
            auction.isSale
        );
    }

    /**
     * @dev check if an auction is open
     * @param _tokenId the token id of the auction to be checked
     */
    function isAuctionOpen(uint256 _tokenId)
        external
        view
        returns (bool)
    {
        return _isOpenAuction(idToAuction[_tokenId]);
    }

    /**
     * @dev get the current price of the auction for the specified token
     * @param _tokenId the target token id
     */
    function getPrice(uint256 _tokenId)
        external
        view
        whenAuctionOpen(_tokenId)
        returns (uint256)
    {
        Auction storage auction = idToAuction[_tokenId];
        return _getPrice(auction);
    }
}