import { USElection } from "../typechain-types/USElection";
import { expect } from "chai";
import { ethers } from "hardhat";
describe("USElection", function() {
    let usElection: USElection;
    before(async () => {
        usElection = await ethers.deployContract("USElection");
        await usElection.waitForDeployment();
        console.log("deployed");
    });
    it("Should return the current leader before submit any election results",
    async function() {
        expect(await usElection.currentLeader()).to.equal(0);
    });
    it("Should return the election status", async function() {
        expect(await usElection.electionEnded()).to.equal(false);
    });
    it("Should submit state results and get current leader", async function() {
        const stateResults = {
            name: "California",
            votesBiden: 1000,
            votesTrump: 900,
            stateSeats: 32
        }
        const submitStateResultsTx = await usElection.submitStateResult(stateResults);
        await submitStateResultsTx.wait();
        expect(await usElection.currentLeader()).to.equal(1);

    });
    it("Should throw when try to submit already submitted state results", async function() {
        const stateResults = {
            name: "California",
            votesBiden: 1000,
            votesTrump: 900,
            stateSeats: 32
        }
        expect(usElection.submitStateResult(stateResults)).to.be.revertedWith("This state result was already submitted!");
    });
    it("Should submit state results and get current leader", async function() {
        const stateResults = {
            name: "Ohaio",
            votesBiden: 800,
            votesTrump: 1200,
            stateSeats: 33
        };
        const submitStateResultsTx = await usElection.submitStateResult(stateResults);
        await submitStateResultsTx.wait();
        expect(await usElection.currentLeader()).to.equal(2);
    });
    it("Should throw on trying to end election with not the owner", async function() {
        const [owner, addr1] = await ethers.getSigners();
        console.log("addr1 = ", addr1);
        expect(usElection.connect(addr1).endElection()).to.be.revertedWith("Ownable: caller is not the owner");
        expect(await usElection.electionEnded()).to.equal(false);
    });
    it("Should throw on trying to submit state results with not the owner", async function() {
        const stateResults = {
            name: "California",
            votesBiden: 1000,
            votesTrump: 900,
            stateSeats: 32
        }
        const [owner, addr1] = await ethers.getSigners();
        expect(usElection.connect(addr1).submitStateResult(stateResults)).to.be.revertedWith("Ownable: caller is not the owner");
        expect(await usElection.electionEnded()).to.equal(false);
    });
    it("Should throw on trying to submit state results with 0 stateSeats", async function() {
        const stateResults = {
            name: "California",
            votesBiden: 1000,
            votesTrump: 900,
            stateSeats: 0
        }
        expect(usElection.submitStateResult(stateResults)).to.be.revertedWith("States must have at least 1 seat");
    });
    it("Should throw on trying to submit state results with equal votes for biden and trump", async function() {
        const stateResults = {
            name: "California",
            votesBiden: 950,
            votesTrump: 950,
            stateSeats: 32
        }
        expect(usElection.submitStateResult(stateResults)).to.be.revertedWith("There cannot be a tie");
    });
    it("Should end the elections, get the leader and election status", async function() {
        const endElectionTx = await usElection.endElection();
        await endElectionTx.wait();
        expect(await usElection.currentLeader()).to.equal(2);
        expect(await usElection.electionEnded()).to.equal(true);
    });
    it("Should throw on trying to end an already finished election", async function() {
        expect(await usElection.electionEnded()).to.equal(true);
        expect(usElection.endElection()).to.be.revertedWith("The election has ended already");
    });
    it("Should throw when try to submit state results for a finished election", async function() {
        const stateResults = {
            name: "California",
            votesBiden: 1000,
            votesTrump: 900,
            stateSeats: 32
        }
        expect(usElection.submitStateResult(stateResults)).to.be.revertedWith("The election has ended already");
    });
});