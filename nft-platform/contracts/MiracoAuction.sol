/**
 * @file MiracoAuction.sol
 * @author secret
 */
pragma solidity ^0.4.24;


import "./MiracoAccessControl.sol";
import "./Auction.sol";


/**
 * @dev integrate Auction into Miraco for management intention
 * @title MiracoAuction
 */
contract MiracoAuction is MiracoAccessControl {
    // auction address
    Auction public auction;
    
    /**
     * @dev set the Auction address
     * @param _address the candidate address to be set
     */
    function setAuctionAddress(address _address) external onlyCEO {
        Auction candidateContract = Auction(_address);

        require(candidateContract.isAuction());

        auction = candidateContract;
    }

    /**
     * @dev withdraw balances of the Auction contract, requiring admin permission
     */
    function withdrawAuctionBalances() external onlyCLevel {
        if(auction != address(0)) {
            auction.withdrawBalance();
        }
    }
}