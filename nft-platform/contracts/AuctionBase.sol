/**
 * @file AuctionBase.sol
 * @author secret
 */
pragma solidity ^0.4.24;


import "./NFToken/NFToken.sol";


/**
 * @dev AuctionBase implements the basic functionality of the auction
 * @title AuctionBase
 */
contract AuctionBase {
    struct Auction {
        address seller; // the seller
        uint128 startingPrice; // the initial price
        uint128 endingPrice; // the price floor level
        uint64 duration; // the time the auction will last for
        uint64 startedAt; // timestamp when the auction is created
        bool isSale; // indicate if the auction is actually a simple sale
        bool opened; // indicate if the auction is open
    }

    NFToken public nft; // NFT contract used to check tokens

    mapping (uint256 => Auction) idToAuction; // mapping token id to Auction

    uint256 public feeRate; // the proportion of fee cut by owner on auction completed
    
    /**
     * @dev event triggerred when an auction is created
     * @param _tokenId the id of the token to be traded
     * @param _startingPrice the initial price
     * @param _endingPrice the price floor level
     * @param _duration the time length of the auction
     * @param _isSale indicate if the auction is actually a simple sale
     */
    event AuctionCreated(uint256 _tokenId, uint256 _startingPrice, uint256 _endingPrice, uint64 _duration, bool _isSale);
    
    /**
     * @dev event triggerred when an auction is completed
     * @param _tokenId the token id of the completed auction
     * @param _price the price of the completed auction
     * @param _winner the ultimate buyer of the auction
     */
    event AuctionSucceeded(uint256 _tokenId, uint256 _price, address _winner);

    /**
     * @dev event triggerred when an auction is cancelled
     * @param _tokenId the token id of the auction cancelled
     */
    event AuctionCancelled(uint256 _tokenId);

    /**
     * @dev check if the given address is the owner of the given token
     * @param _target the target address to be checked
     * @param _tokenId the token id to be checked
     * @return true if the target address is the owner of the given token, false otherwise
     */
    function _isOwnerOf(address _target, uint256 _tokenId) internal view returns (bool) {
        return (nft.ownerOf(_tokenId) == _target);
    }
    
    /**
     * @dev authorize NFT the ownership for the given token
     * @param _owner the current owner of the specified token
     * @param _tokenId the id of the token to be hosted
     */
    function _host(address _owner, uint256 _tokenId) internal {
        nft.transferFrom(_owner, this, _tokenId);
    }

    /**
     * @dev transfer the ownership of the given token to the given address
     * @param _to the receiver of the specified token
     * @param _tokenId the id of the token whose ownership is to be transferred
     */
    function _transfer(address _to, uint256 _tokenId) internal {
        nft.transferFrom(this, _to, _tokenId);
    }

    /**
     * @dev add an auction for the specified token
     * @param _tokenId the id of the token for the auction
     * @param _auction the auction to be added
     */
    function _addAuction(uint256 _tokenId, Auction _auction) internal {
        if (!_auction.isSale) {
            // if the auction is a sale, make sure that the duration is greater than 1 minute
            require(_auction.duration > 1 minutes);
        }

        idToAuction[_tokenId] = _auction;

        emit AuctionCreated(
            _tokenId,
            _auction.startingPrice,
            _auction.endingPrice,
            _auction.duration,
            _auction.isSale
        );
    }

    /**
     * @dev cancel an auction
     * @param _tokenId the token id for the auction to be cancelled
     * @param _seller the seller of the auction to be cancelled
     */
    function _cancelAuction(uint256 _tokenId, address _seller) internal {
        _removeAuction(_tokenId);

        // transfer the ownership to the seller
        _transfer(_seller, _tokenId);
        
        // fire the AuctionCancelled event
        emit AuctionCancelled(_tokenId);
    }

    /**
     * @dev bid on the auction for the given token
     * @param _tokenId the target token
     * @param _bidAmount the amount in wei to bid
     * @return the final price to trade
     */
    function _bid(uint256 _tokenId, uint256 _bidAmount)
        internal
        returns (uint256)
    {
        Auction storage auction = idToAuction[_tokenId];

        // get the price
        uint256 price = _getPrice(auction);

        // assert the amount is not less than the price
        require(_bidAmount >= price);

        address seller = auction.seller;
        _removeAuction(_tokenId);
        
        // compute fee and transfer to seller
        if(price > 0) {
            uint256 fee = _computeFee(price);
            uint256 finalPrice = price - fee;

            // transfer to seller
            seller.transfer(finalPrice);
        }

        // refund to sender
        msg.sender.transfer(_bidAmount - price);

        // fire the AuctionSucceeded event
        emit AuctionSucceeded(_tokenId, price, msg.sender);

        return price;
    }

    /**
     * @dev remove an auction
     * @param _tokenId the token id of the auction to be removed
     */
    function _removeAuction(uint256 _tokenId) internal {
        delete idToAuction[_tokenId];
    }

    /**
     * @dev check if an auction is open
     * @param _auction the target auction to be checked
     */
    function _isOpenAuction(Auction storage _auction) internal view returns (bool) {
        return _auction.opened;
    }

    /**
     * @dev get the price of the given auction
     * @param _auction the target auction to be retrieved
     */
    function _getPrice(Auction storage _auction)
        internal
        view
        returns (uint256)
    {
        if (_auction.isSale) {
            return _auction.startingPrice;
        } else {
            return _computeCurrentPrice(
                _auction.startingPrice,
                _auction.endingPrice,
                _auction.duration,
                now-_auction.startedAt
            );
        }
    }

    /**
     * @dev compute the current price for an actual auction
     * @param _startingPrice the starting price
     * @param _endingPrice the ending price
     * @param _duration the time the auction will last for
     * @param _elapsed the elapsed time since creation
     */
    function _computeCurrentPrice(
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        uint256 _elapsed
    )
        internal
        pure
        returns (uint256)
    {
        if (_elapsed >= _duration) {
            return _endingPrice;
        }
        
        int256 totalPriceDiff = int256(_endingPrice) - int256(_startingPrice);
        int256 priceDiff = totalPriceDiff * int256(_elapsed) / int256(_duration);
        return uint256(int256(_startingPrice) + priceDiff);
    }

    /**
     * @dev compute the fee to be cut
     * @param _price the trading price
     * @return fee to be cut
     */
    function _computeFee(uint256 _price) internal view returns (uint256) {
        return _price * feeRate / 10000;
    }
}