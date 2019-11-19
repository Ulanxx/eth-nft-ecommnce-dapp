/**
 * @file MiracoProxy.sol
 * @author secret
 */
pragma solidity ^0.4.24;


import "./lib/ownership/Ownable.sol";
import "./lib/utils/StringHandler.sol";


/**
 * @dev MiracoProxy forwards call to the underlying contract
 * @title MiracoProxy
 */
contract MiracoProxy is Ownable {
    using StringHandler for string;

    string public ver; // the current version of the underlying contract
    address public implContract; // the underlying contract

    /**
     * @dev event triggerred when upgrading to a new contract
     * @param _ver the target version to upgrade to
     * @param _implContract the underlying contract
     */
    event Upgraded(string _ver, address indexed _implContract);
  
    /**
     * @dev constructor
     * @param _implContract the underlying contract
     */
    constructor(address _implContract) public {
        upgrade("1.0", _implContract);
    }

    /**
     * @dev fallback to farward call to the underlying contract using delegate call
     */
    function () payable public {
        assembly {
            let pos := mload(0x40) // get the free memory pointer
            calldatacopy(pos, 0, calldatasize) // copy call data to the position above
            let success := delegatecall(gas, sload(implContract_slot), pos, calldatasize, 0, 0) // delegate call
            let size := returndatasize // get the length of the result data
            returndatacopy(pos, 0, size) // copy result data

            switch success
            case 1 { // on successful
                return(pos, size)
            }
            default { // on failed
                revert(pos, size)
            }
        }
    }

    /**
     * @dev upgrade to a new contract version, only owner allowed
     * @param _newVer the new version to upgrade to
     * @param _newImplContract The new contract address
     */
    function upgrade(string _newVer, address _newImplContract) public onlyOwner {
        require(!_newVer.equal(ver), "The version cannot be the same");
        require(_newImplContract != implContract, "The new contract cannot be the same");
        require(_newImplContract != address(0), "The new contract address cannot be the 0");

        ver = _newVer;
        implContract = _newImplContract;

        // fire the Upgraded event
        emit Upgraded(_newVer, _newImplContract);
    }
}