/**
 * @file MiracoBase.sol
 * @author secret
 */
pragma solidity ^0.4.24;


import "./NFToken/NFTokenEnumerable.sol";
import "./NFToken/NFTokenMetadata.sol";
import "./lib/utils/StringHandler.sol";


/**
 * @dev MiracoBase is the extension of NFT
 * @title MiracoBase
 */
contract MiracoBase is NFTokenEnumerable, NFTokenMetadata {
    using StringHandler for string;
    using StringHandler for uint256;

    // asset structure
    struct Asset {
        uint issuerId;
        bytes32 proof;
        uint userId;
    }
    
    // issuer structure
    struct Issuer {
        string name;
        string symbol;
    }

    /**
     * @dev issuer mapping table
     */
    mapping (uint => Issuer) internal issuers;

    /**
     * @dev issuer count
     */
    uint internal issuerNum;

    /**
     * @dev issuer token count mapping
     */
    mapping (uint => uint) issuerTokenCount;

    /**
     * @dev token array.
     */
    Asset[] internal assets;

    /**
     * @dev base uri prefix
     */
    string public uriPrefix = 'http://miraco.io/';

    /**
     * @dev Maps address to authorization of contract.
     */
    mapping (address => bool) internal addressToAuthorized;

    /**
     * @dev Emits when an address is authorized to some contract control or the authorization is revoked.
     * The _target has some contract controle like minting new NFTs.
     * @param _target Address to set authorized state.
     * @param _authorized True if the _target is authorised, false to revoke authorization.
     */
    event AuthorizedAddress(
        address indexed _target,
        bool _authorized
    );

    /**
     * @dev event triggered when an issuer is added
     */
    event IssuerAdded(uint _issuerId, string _name, string _symbol);

    /**
     * @dev event triggered when an issuer is removed
     */
    event IssuerRemoved(uint _issueId);

    /**
     * @dev Guarantees that msg.sender is allowed to mint a new NFT.
     */
    modifier isAuthorized() {
        require(addressToAuthorized[msg.sender]);
        _;
    }

    /**
     * @dev assert the specified issuer exists in the issuer mapping
     */
    modifier issuerExists(uint _issuerId) {
        require(bytes(issuers[_issuerId].name).length > 0);
        _;
    }

    /**
     * @dev Mints a new NFT.
     * @param _recipient The address that will own the minted NFT.
     * @param _issuerId the issuer id.
     * @param _proof Cryptographic asset imprint.
     * @param _userId the user id of the owner
     */
    function mint(
        address _recipient,
        uint _issuerId,
        bytes32 _proof,
        uint _userId
    )
        internal
    {
        Asset memory asset = Asset({
            issuerId:_issuerId,
            proof:_proof,
            userId:_userId
        });
        
        uint id = assets.push(asset) - 1;
        super._mint(_recipient, id);

        issuerTokenCount[_issuerId] += 1;

        // approve
        idToApprovals[id] = msg.sender;
    }

    /**
     * @dev revokes the given token
     * @param _tokenId the id of the token to be revoked
     */
    function _revoke(uint256 _tokenId)
        internal
        validNFToken(_tokenId)
    {
        address tokenOwner = idToOwner[_tokenId];
        super._burn(tokenOwner, _tokenId);
        delete assets[_tokenId];
        issuerTokenCount[tokenIssuerId(_tokenId)] -= 1;
    }

    /**
     * @dev Returns proof for NFT.
     * @param _tokenId Id of the NFT.
     */
    function tokenProof(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns(bytes32)
    {
        return assets[_tokenId].proof;
    }

    /**
     * @dev Returns user id for NFT.
     * @param _tokenId Id of the NFT.
     */
    function tokenUserId(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns(uint)
    {
        return assets[_tokenId].userId;
    }

    /**
     * @dev Returns symbol.
     * @param _tokenId Id of the NFT.
     */
    function tokenSymbol(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns(string)
    {
        return issuers[assets[_tokenId].issuerId].symbol;
    }

    /**
     * @dev Returns issuer info.
     * @param _tokenId Id of the NFT.
     */
    function tokenIssuer(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns(string, string)
    {
        Issuer storage issuer = issuers[assets[_tokenId].issuerId];
        return (issuer.name, issuer.symbol);
    }

    /**
     * @dev Returns issuer id.
     * @param _tokenId Id of the NFT.
     */
    function tokenIssuerId(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns(uint)
    {
        return assets[_tokenId].issuerId;
    }

    /**
     * @dev Returns URI.
     * @param _tokenId Id of the NFT.
     */
    function tokenURI(
        uint256 _tokenId
    )
        validNFToken(_tokenId)
        public
        view
        returns(string)
    {
        // append the given token id to the uri prefix
        return uriPrefix.concat(_tokenId.uint2str());
    }

    /**
     * @dev get the token count of the specified issuer
     * @param _issuerId the id of the issuer to be retrieved
     */
    function getIssuerTokenCount(uint _issuerId)
        public
        view
        issuerExists(_issuerId)
        returns (uint)
    {
        return issuerTokenCount[_issuerId];
    }

    /**
     * @dev Sets authorised address for minting.
     * @param _target Address to set authorized state.
     * @param _authorized True if the _target is authorised, false to revoke authorization.
     */
    function _setAuthorizedAddress(
        address _target,
        bool _authorized
    )
        internal
    {
        require(_target != address(0));
        addressToAuthorized[_target] = _authorized;
        emit AuthorizedAddress(_target, _authorized);
    }

    /**
     * @dev Sets mint authorised address.
     * @param _target Address for which we want to check if it is authorized.
     * @return Is authorized or not.
     */
    function isAuthorizedAddress(
        address _target
    )
        external
        view
        returns (bool)
    {
        require(_target != address(0));
        return addressToAuthorized[_target];
    }

    /**
     * @dev set the uri prefix
     * @param _newURIPrefix the new uri prefix to set
     */
    function _setURIPrefix(string _newURIPrefix) internal {
        uriPrefix = _newURIPrefix;
    }

    /**
     * @dev add an issuer
     * @param _name the name of the issuer to be added
     * @param _symbol the symbol of the issuer to be added
     */
    function _addIssuer(string _name, string _symbol) internal {
        Issuer memory issuer = Issuer({
            name: _name,
            symbol: _symbol
        });
        
        issuerNum += 1;
        issuers[issuerNum] = issuer;

        emit IssuerAdded(issuerNum, _name, _symbol);
    }

    /**
     * @dev remove an issuer
     * @param _issuerId the id of the issuer to be deleted
     */
    function _removeIssuer(uint _issuerId) internal issuerExists(_issuerId) {
        delete issuers[_issuerId];
        issuerNum -= 1;

        emit IssuerRemoved(_issuerId);
    }
}