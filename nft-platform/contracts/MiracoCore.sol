/**
 * @file MiracoCore.sol
 * @author secret
 */
pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


import "./MiracoAuction.sol";


/**
 * @dev MiracoCore represents the core of the Miraco, being the entry of Miraco
 * @title MiracoCore
 */
contract MiracoCore is MiracoAuction {
    /**
     * @dev only used to test
     */
    event Track(string info);

    /**
     * @dev constructor
     * @param _name nft name
     * @param _symbol nft symbol
     */
    constructor(string _name, string _symbol) public {
        // set Miraco metadata
        _setMetadata(_name, _symbol);
        
        // set roles
        _setRoles();
    }

    /**
     * @dev fallback function, preventing payment from the addresses except for the auction address
     */
    function() external payable {
        require(msg.sender == address(auction));
    }

    /**
     * @dev create an asset.
     * @param _recipient The address that will own the minted asset.
     * @param _issuerId the symbol id of asset.
     * @param _proof the asset proof.
     */
    function mintAsset(
        address _recipient,
        uint _issuerId,
        bytes32 _proof
    )
        external
        issuerExists(_issuerId)
        isAuthorized()
    {
        // mint
        mint(_recipient, _issuerId, _proof, 0);
    }

    /**
     * @dev create multiple assets.
     * @param _issuerId the issuer id of the assets
     * @param _recipients The array of addresses that will own the minted assets.
     * @param _proofs An array of proof.
     */
    function mintAssets(
        uint _issuerId,
        address[] _recipients,
        bytes32[] _proofs
    )
        external
        issuerExists(_issuerId)
        isAuthorized()
    {
        require(
            _recipients.length > 0 &&
            _recipients.length == _proofs.length
        );

        // loop to mint
        for(uint i = 0; i < _recipients.length; i++) {
            // mint
            mint(_recipients[i], _issuerId, _proofs[i], 0);
        }
    }

    /**
     * @dev transfer an asset, including user id
     * @param _from The current owner of the token.
     * @param _to The new owner.
     * @param _tokenId the id of the token to be transfered
     */
    function transferAsset(address _from, address _to, uint256 _tokenId, uint _userId)
        external
        validNFToken(_tokenId)
    {
        // modify user id
        Asset storage asset = assets[_tokenId];
        asset.userId = _userId;
        
        // transfer
        transferFrom(_from, _to, _tokenId);
    }

    /**
     * @dev revokes the given asset
     * @param _tokenId the id of the token to be revoked
     */
    function revokeAsset(uint256 _tokenId)
        external
        onlyCEOOrCOO
    {
        _revoke(_tokenId);
    }

    /**
     * @dev get the proof of the given token id
     * @param _tokenId the token id to be retrieved
     */
    function getAssetProof(uint256 _tokenId)
        external
        view
        returns (bytes32 _proof)
    {
        return tokenProof(_tokenId);
    }

    /**
     * @dev get the asset data of the specified token id
     * @param _tokenId the token id to be retrieved
     */
    function getAssetData(uint256 _tokenId)
        external
        view
        validNFToken(_tokenId)
        returns (address _owner, uint _issuerId, bytes32 _proof, uint _userId)
    {
        return (
            idToOwner[_tokenId],
            tokenIssuerId(_tokenId),
            tokenProof(_tokenId),
            tokenUserId(_tokenId)
        );
    }

    /**
     * @dev set the uri prefix
     * @param _newURIPrefix the new uri prefix to set
     */
    function setURIPrefix (string _newURIPrefix)
        external
        onlyCOO
    {
        require(bytes(_newURIPrefix).length > 0);
        _setURIPrefix(_newURIPrefix);
    }

    /**
     * @dev add an issuer
     * @param _name the name of the issuer to be added
     * @param _symbol the symbol of the issuer to be added
     */
    function addIssuer(string _name, string _symbol)
        external
        onlyCEOOrCOO
    {
        require(
            bytes(_name).length > 0 && 
            bytes(_symbol).length > 0
        );

        _addIssuer(_name, _symbol);
    }

    /**
     * @dev remove an issuer
     * @param _issuerId the id of the issuer to be deleted
     */
    function removeIssuer(uint _issuerId) external onlyCEOOrCOO {
        _removeIssuer(_issuerId);
    }

    /**
     * @dev withdraw the balance of the contract, only cfo allowed
     */
    function withdrawBalance() external onlyCFO {
        cfo.send(address(this).balance); // intentional to call send instead of transfer
    }

    /**
     * @dev set Miraco metadata
     * @param _name the name of NFT
     * @param _symbol the symbol of NFT
     */
    function _setMetadata(string _name, string _symbol) internal {
        // assert metadata is valid
        require(bytes(_name).length > 0 && bytes(_symbol).length > 0);

        nftName = _name;
        nftSymbol = _symbol;
    }

     /**
     * @dev set roles
     */
    function _setRoles() internal {
        ceo = msg.sender;
        cfo = msg.sender;
        coo =  msg.sender;

        // authorize minting for ceo
        authorizeMint(ceo);
    }
}