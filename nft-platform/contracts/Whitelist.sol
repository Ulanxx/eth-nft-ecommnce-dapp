/**
 * @file Whitelist.sol
 * @author secret
 */
pragma solidity ^0.4.24;


/**
 * @dev Whitelist represents a list which contains the whitelisted addresses
 * @title Whitelist
 */
contract Whitelist {
    /**
     * @dev mapping address to bool, indicating if an address is whitelisted
     */
    mapping (address => bool) internal whitelists;

    /**
     * @dev event triggered when an address is added to the whitelists
     * @param _target the added address
     */
    event Whitelisted(address indexed _target);

    /**
     * @dev event triggered when an address is removed from the whitelists
     * @param _target the removed address
     */
    event Unwhitelisted(address indexed _target);
    
    /**
     * @dev assert the given address is whitelisted
     * @param _target the target address
     */
    modifier onlyWhitelisted(address _target) {
        require(whitelists[_target]);
        _;
    }

    /**
     * @dev assert the given address is not whitelisted
     * @param _target the target address
     */
    modifier onlyNotWhitelisted(address _target) {
        require(!whitelists[_target]);
        _;
    }

    /**
     * @dev add an address to the whitelists
     * @param _target the address to be added
     */
    function _whitelist(address _target) internal onlyNotWhitelisted(_target) {
        require(_target != 0); // 0 address is not allowed
        whitelists[_target] = true;

        // fire the Whitelisted event
        emit Whitelisted(_target);
    }

    /**
     * @dev remove an address from the whitelists
     * @param _target the address to be removed
     */
    function _unwhitelist(address _target) internal onlyWhitelisted(_target) {
        whitelists[_target] = false;

        // fire the Unwhitelisted event
        emit Unwhitelisted(_target);
    }

    /**
     * @dev check if the given address is whitelisted
     * @param _target the target address to be checked
     * @return true if whitelisted, false otherwise
     */
    function isWhitelisted(address _target) public view returns (bool) {
        return whitelists[_target];
    }
}