const MerkleTree = require("merkletree");
const _ = require("underscore");


var makeMerkleTree = data => {
    data = data || {};

    if (!_.isObject(data)) {
        return null;
    }

    values = data.map((k, v) => {
        return web3.sha3(v);
    })

    console.log(values);

    mtree = MerkleTree.default(values)
    return mtree;
}

var getMerkleRoot = data => {
    mtree = makeMerkleTree(data);

    if (mtree == null) {
        return null;
    }

    return mtree.root;
}

var getMerkleProof = (data, key) => {
    if (!data.hasOwnProperty(key)) {
        return null;
    }
    mtree = makeMerkleTree(data);

    if (mtree == null) {
        return null;
    }

    return mtree.proof(data[key]);
}

var verifyMerkleProof = (data, leaf, proof) => {
}

var assertRevert = async (promise) => {
    try {
        await promise;
        assert.fail('Expected revert not received');
    } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
    }
};

module.exports = {
    assertRevert: assertRevert
}
