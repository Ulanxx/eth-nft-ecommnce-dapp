/**
 * @file StringHandler.sol
 * @author secret
 */

pragma solidity ^0.4.24;


/**
 * @title a library for handling string
 */
library StringHandler {
    /**
     * @dev test if the given strings are equal
     * @param _first the first string
     * @param _second the second string
     */
    function equal(string _first, string _second) public pure returns (bool) {
        return (keccak256(bytes(_first)) == keccak256(bytes(_second)));
    }

     /**
     * @dev check if the specified string is empty
     * @param _str the specified string
     */
    function empty(string _str) public pure returns (bool) {
        return (bytes(_str).length == 0);
    }

    /**
     * @dev used to concat the specifed strings to a single string, taking five args
     */
    function concat(string _a, string _b, string _c, string _d, string _e) internal pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        
        return string(babcde);
    }

    /**
     * @dev used to concat the specifed strings to a single string, taking four args
     */
    function concat(string _a, string _b, string _c, string _d) internal pure returns (string) {
        return concat(_a, _b, _c, _d, "");
    }

    /**
     * @dev used to concat the specifed strings to a single string, taking three args
     */
    function concat(string _a, string _b, string _c) internal pure returns (string) {
        return concat(_a, _b, _c, "", "");
    }

    /**
     * @dev used to concat the specifed strings to a single string, taking two args
     */
    function concat(string _a, string _b) internal pure returns (string) {
        return concat(_a, _b, "", "", "");
    }

    /**
     * @dev convert a number of uint type into a string
     * @param i the number to be converted
     */
    function uint2str(uint i) internal pure returns (string) {
        if (i == 0) {
            return "0";
        }

        uint j = i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }

        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (i != 0) {
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }

        return string(bstr);
    }
}
