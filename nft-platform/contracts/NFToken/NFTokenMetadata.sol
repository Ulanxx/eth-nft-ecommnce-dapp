pragma solidity ^0.4.24;


import "./NFToken.sol";
import "../ERC721/ERC721Metadata.sol";


/**
 * @dev Optional metadata implementation for ERC-721 non-fungible token standard.
 */
contract NFTokenMetadata is
    NFToken,
    ERC721Metadata
{
    /**
     * @dev A descriptive name for a collection of NFTs.
     */
    string internal nftName;

    /**
     * @dev An abbreviated name for NFTokens.
     */
    string internal nftSymbol;

    /**
     * @dev Contract constructor.
     * @notice When implementing this contract don't forget to set nftName and nftSymbol.
     */
    constructor()
        public
    {
        supportedInterfaces[0x5b5e139f] = true; // ERC721Metadata
    }

    /**
     * @dev Returns a descriptive name for a collection of NFTokens.
     */
    function name()
        public
        view
        returns (string _name)
    {
        _name = nftName;
    }

    /**
     * @dev Returns an abbreviated name for NFTokens.
     */
    function symbol()
        public
        view
        returns (string _symbol)
    {
        _symbol = nftSymbol;
    }

    /**
     * @dev A distinct URI (RFC 3986) for a given NFT.
     * @param _tokenId Id for which we want uri.
     */
    function tokenURI(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns (string)
    {
        // will override the logic in derived contracts
        return "";
    }
}
