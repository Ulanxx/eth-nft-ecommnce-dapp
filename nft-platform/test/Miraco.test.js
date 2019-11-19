const Miraco = artifacts.require('MiracoCore');
const Auction = artifacts.require('Auction');
const assertRevert = require('./utils').assertRevert;
const mtBuilder = require('merkletree').default;
const Web3 = require('web3');

contract('Miraco', (accounts) => {
    let miraco;
    let auction;

    let recipient = accounts[0];
    let recipients = [
        accounts[0],
        accounts[1],
        accounts[2],
        accounts[3],
        accounts[4],
        accounts[5],
        accounts[6],
        accounts[7],
        accounts[8],
        accounts[9]
    ];

    let proof = web3.sha3('proof');
    let proofs = [proof, proof, proof, proof, proof, proof, proof, proof, proof, proof];

    let uids = [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000];

    let amount = recipients.length;
    let feeRate = 1;

    // beforeEach(async () => {
    //     miraco = await Miraco.new('Miraco', 'MRC');
    // });

    it('initialization', async () => {
        miraco = await Miraco.new('Miraco', 'MRC');
        auction = await Auction.new(miraco.address, feeRate);
        await miraco.setAuctionAddress(auction.address);
        await miraco.addIssuer('champion', 'CMP');

        assert.notEqual(miraco.address, 0, 'failed to deploy Miraco');
        assert.notEqual(auction.address, 0, 'failed to deploy Auction');
    });

    it('should mint multiple tokens of the specified amount once', async () => {
        console.log(web3.sha3('mintAssets(uint,address[],bytes32[])'));
        let result = await miraco.mintAssets(1, recipients, proofs);
        //console.log(result.receipt);

        let count = await miraco.totalSupply.call();
        assert.equal(count.toNumber(), amount, 'wrong token supply');
    });

    it('should mint some tokens of the specified amount', async () => {
        for (var i = 0; i < amount; i++) {
            let result = await miraco.mintAsset(recipient, 1, proof, 10000);
            console.log(result.receipt);
        }

        let count = await miraco.totalSupply.call();
        assert.equal(count.toNumber(), amount, 'wrong token supply');
    });
});
