const { expect } = require("chai");

const NAME = "TicketMaster";
const SYMBOL = "TM";

const OCCASION_NAME = "ETH Texas";
const OCCASION_COST = ethers.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "June 26";
const OCCASION_TIME = "11:00AM CST";
const OCCASION_LOCATION = "Dallas, Texas";

describe("TicketMaster", () => {
  let ticketMaster;
  let deployer, buyer;

  beforeEach(async () => {
    // Setup the accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy the contract
    const ticketMaster = await ethers.deployContract("TicketMaster", [
      "NAME",
      "SYMBOL",
    ]);
    contractAddr = await ticketMaster.waitForDeployment();

    const transaction = await contractAddr
      .connect(deployer)
      .list(
        OCCASION_NAME,
        OCCASION_COST,
        OCCASION_MAX_TICKETS,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION
      );

    await transaction.wait();
  });

  describe("Deployment", () => {
    // it("Sets the name", async () => {
    //   expect(await contractAddr.name()).to.equal("NAME");
    // });
    // it("Sets the symbol", async () => {
    //   expect(await contractAddr.symbol()).to.equal("SYMBOL");
    // });
    // it("Sets the owner", async () => {
    //   expect(await contractAddr.owner()).to.equal(deployer.address);
    // });
  });

  describe("Occasions", () => {
    it("Returns occasions attributes", async () => {
      const occasion = await contractAddr.getOccasion(1);
      expect(occasion.id).to.be.equal(1);
      expect(occasion.name).to.be.equal(OCCASION_NAME);
      expect(occasion.cost).to.be.equal(OCCASION_COST);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.date).to.be.equal(OCCASION_DATE);
      expect(occasion.time).to.be.equal(OCCASION_TIME);
      expect(occasion.location).to.be.equal(OCCASION_LOCATION);
    });

    it("Updates occasions count", async () => {
      const totalOccasions = await contractAddr.totalOccasions();
      expect(totalOccasions).to.be.equal(1);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.parseUnits("1", "ether");

    beforeEach(async () => {
      const transaction = await contractAddr
        .connect(buyer)
        .mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
    });

    it("Updates ticket count", async () => {
      const occasion = await contractAddr.getOccasion(1);
      expect(occasion.tickets).to.equal(99);
    });

    it("Updates buying status", async () => {
      const owner = await contractAddr.seatTaken(ID, SEAT);
      expect(owner).to.be.equal(buyer.address);
    });

    it("Updates overall seating status", async () => {
      const seats = await contractAddr.getSeatsTaken(ID);
      expect(seats.length).to.equal(1);
      expect(seats[0]).to.equal(SEAT);
    });
  });
  describe("Withdrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.parseUnits("1", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await contractAddr
        .connect(buyer)
        .mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();

      transaction = await contractAddr.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance(
        contractAddr.getAddress()
      );
      expect(balance).to.equal(0);
    });
  });
});
