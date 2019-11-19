/**
 * @file MiracoAccessControl.sol
 * @author secret
 */
pragma solidity ^0.4.24;


import "./Whitelist.sol";
import "./MiracoBase.sol";
import "./lib/ownership/Pausable.sol";


/**
 * @dev MiracoAccessControl provides access control
 * @title MiracoAccessControl
 */
contract MiracoAccessControl is Whitelist, MiracoBase, Pausable {
    bool public paused = false;

    address public ceo;
    address public cfo;
    address public coo;

    /**
     * @dev assert the sender is ceo
     */
    modifier onlyCEO() {
        require(msg.sender == ceo);
        _;
    }

    /**
     * @dev assert the sender is cfo
     */
    modifier onlyCFO() {
        require(msg.sender == cfo);
        _;
    }

    /**
     * @dev assert the sender is coo
     */
    modifier onlyCOO() {
        require(msg.sender == coo);
        _;
    }

    /**
     * @dev assert the sender is ceo or cfo
     */
    modifier onlyCEOOrCFO() {
        require(
            msg.sender == ceo ||
            msg.sender == cfo
        );

        _;
    }

    /**
     * @dev assert the sender is ceo or coo
     */
    modifier onlyCEOOrCOO() {
        require(
            msg.sender == ceo ||
            msg.sender == coo
        );

        _;
    }

    /**
     * @dev assert the sender has the admin permission
     */
    modifier onlyCLevel {
        require(
            msg.sender == ceo ||
            msg.sender == coo ||
            msg.sender == cfo
        );
        
        _;
    }

    /**
     * @dev set the admin address
     * @param _newCEO the new admin to be set
     */
    function setCEO(address _newCEO) external onlyCEO {
        // transfer ownership
        //transferOwnership(_newCEO);

        // unauthorize minting for prior ceo
        unauthorizeMint(ceo);

        // set to the new ceo and authorize minting
        ceo = _newCEO;
        authorizeMint(ceo);
    }

    /**
     * @dev set the CFO address
     * @param _newCFO the new address to be set
     */
    function setCFO(address _newCFO) external onlyCEO {
        require(_newCFO != address(0));
        cfo = _newCFO;
    }

    /**
     * @dev set the COO address
     * @param _newCOO the new address to be set
     */
    function setCOO(address _newCOO) external onlyCEO {
        require(_newCOO != address(0));
        coo = _newCOO;
    }
    
    /**
     * @dev add an address to whitelist
     * @param _target the target to be added
     */
    function whitelist(address _target) external onlyCEOOrCOO {
        _whitelist(_target);
    }

    /**
     * @dev remove an address from whitelist
     * @param _target the target to be removed
     */
    function unwhitelist(address _target) external onlyCEOOrCOO {
        _unwhitelist(_target);
    }

    /**
     * @dev authorize the specified address to mint
     * @param _target the target to be authorized
     */
    function authorizeMint(address _target) public onlyCEO {
        _setAuthorizedAddress(_target, true);
    }

    /**
     * @dev unauthorize the specified address to mint
     * @param _target the target to be unauthorized
     */
    function unauthorizeMint(address _target) public onlyCEO {
        _setAuthorizedAddress(_target, false);
    }
}