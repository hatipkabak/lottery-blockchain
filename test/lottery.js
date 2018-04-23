var Lottery = artifacts.require("./Lottery.sol");
var log = console.log;


contract('Lottery', function(accounts) {
	before(function(done){

		Lottery.new()
			.catch(log)
			.then(function(contract){
			lot = contract;
		})
		.then(done);

	});

	describe('LOTTERY CONSTRUCTOR CHECK', function() {
		it("should init lottery" , function(){
			assert.notEqual(lot, null);
		});
		it("check init initial balance 0 or not " , function(){
			return lot.balance.call().then(function(actual){
				assert.equal(actual,0, "ACTUALLY NOT AN ERROR: Lottery balance was not 0")
			});
		});			
		it("check first block number 0 or not" , function(){
			return lot.firstBlockNumber.call().then(function(actual){
				assert.notEqual(actual,0, "ACTUALLY NOT AN ERROR: Lottery first block number not equal 0")
			});
		});	

	});

	describe('BUY TICKET-PLAYER LENGTH', function() {
		it("should increase player length for one address by 3 because three tickets were bought from same address", function() {
			return lot.buyTicket(1,1,2,{from:accounts[2], value: 8000000000000000}).then(function() {
				return lot.buyTicket(1,1,2,{from:accounts[2], value: 4000000000000000}).then(function() {
					return lot.buyTicket(1,1,2,{from:accounts[2], value: 2000000000000000}).then(function() {
			  			return lot.getPlayerLength(accounts[2]);
			})})}).then(function(actual) {
				assert.equal(actual.toNumber(),3, "Player length could not be increased correctly")
			});
		});

		it("should increase player length by 1 because one ticket were bought ", function() {
			return lot.buyTicket(1,1,2,{from:accounts[3], value: 4000000000000000}).then(function() {
			 	return lot.getPlayerLength(accounts[3]);
			}).then(function(actual) {
				assert.equal(actual.toNumber(),1, "Player length could not be increased correctly")
			});
		});

	  	it("should be total all valid tickets that bought by all of the purchasers-->18 FINNEY" , function(){
			return lot.balance.call().then(function(actual){
				assert.equal(actual.toNumber(),18000000000000000, "AN ERROR: Lottery balance should not be 0")
			});
		});	

		it("should not be increase player length by 1 because No Enough Money to buy ticket-->1 FINNEY ", function() {
			return lot.buyTicket(1,1,2,{from:accounts[3], value: 1000000000000000}).then(function() {
			 	return lot.getPlayerLength(accounts[3]);
			}).then(function(actual) {
				assert.equal(actual.toNumber(),1, "Player length could not be same correctly")
			});
		});

		it("should not be increase player length by 2 when sending two ticket price since JUST ONE TICKET AT A TIME -->16 FINNEY ", function() {
			return lot.buyTicket(1,1,2,{from:accounts[3], value: 16000000000000000}).then(function() {
			 	return lot.getPlayerLength(accounts[3]);
			}).then(function(actual) {
				assert.equal(actual.toNumber(),2, "Player length could not be increased correctly");
			});
		});

		//it("should not be increase player length by 2 when sending two ticket price since JUST ONE TICKET AT A TIME -->16 FINNEY ", function() {
		//	return lot.buyTicket(1,1,2,{from:accounts[3], value: 16000000000000000}).then(function() {
		//	 	return lot.getAddressSender.call().then(function(actual) {
		//		assert.equal(actual,"0x26Fdc95950946Bc4A90E0170c21a5EC5c30b7639", "Player length could not be increased correctly");
		//	});
		//});
		//});				
	});

	describe('PRIZE AMOUNT CHECK', function() {

	  	it("should be TOTAL BALANCE that bought by all of the purchasers-->34 FINNEY" , function(){
			return lot.balance.call().then(function(actual){
				assert.equal(actual.toNumber(),34000000000000000, "AN ERROR: Lottery balance should not be 0")
			});
		});	

		it("FIRST PRIZE-FULL TICKET should be balance/2 -->17 FINNEY" , function(){
			return lot.firstPrizeForTicketInfo(1).then(function(actual){
				assert.equal(actual.toNumber(),17000000000000000, "prize amount wrong")
			});
		});
		it("FIRST PRIZE-HALF TICKET should be balance/4 -->8.5 FINNEY" , function(){
			return lot.firstPrizeForTicketInfo(2).then(function(actual){
				assert.equal(actual.toNumber(),8500000000000000, "prize amount wrong")
			});
		});

		it("FIRST PRIZE-QUARTER TICKET should be balance/8 -->4.25 FINNEY" , function(){
			return lot.firstPrizeForTicketInfo(4).then(function(actual){
				assert.equal(actual.toNumber(),4250000000000000, "prize amount wrong")
			});
		});

		it("SECOND PRIZE-FULL TICKET should be balance/4 -->8.5 FINNEY" , function(){
			return lot.secondPrizeForTicketInfo(1).then(function(actual){
				assert.equal(actual.toNumber(),8500000000000000, "prize amount wrong")
			});
		});
		it("SECOND PRIZE-HALF TICKET should be balance/8 -->4.25 FINNEY" , function(){
			return lot.secondPrizeForTicketInfo(2).then(function(actual){
				assert.equal(actual.toNumber(),4250000000000000, "prize amount wrong")
			});
		});

		it("SECOND PRIZE-QUARTER TICKET should be balance/16 -->2.125 FINNEY" , function(){
			return lot.secondPrizeForTicketInfo(4).then(function(actual){
				assert.equal(actual.toNumber(),2125000000000000, "prize amount wrong")
			});
		});

		it("THIRD PRIZE-FULL TICKET should be balance/8 -->4.25 FINNEY" , function(){
			return lot.thirdPrizeForTicketInfo(1).then(function(actual){
				assert.equal(actual.toNumber(),4250000000000000, "prize amount wrong")
			});
		});
		it("THIRD PRIZE-HALF TICKET should be balance/16 -->2.125 FINNEY" , function(){
			return lot.thirdPrizeForTicketInfo(2).then(function(actual){
				assert.equal(actual.toNumber(),2125000000000000, "prize amount wrong")
			});
		});

		it("THIRD PRIZE-QUARTER TICKET should be balance/32 -->1.0625 FINNEY" , function(){
			return lot.thirdPrizeForTicketInfo(4).then(function(actual){
				assert.equal(actual.toNumber(),1062500000000000, "prize amount wrong")
			});
		});
	});

	describe('DRAW(RUN LOTTERY)', function() {

		it("should not be drawn possible" , function(){
			return lot.isDrawPossible().then(function(actual){
				assert.equal(actual,false, "DRAW wrong")
			});
		});

	});

	describe('SUBMISSION', function() {

		it("should be increased player length by 1" , function(){

			return lot.submission(1,2,3,4).then(function(actual){
				return lot.getPlayerLength(accounts[0]);
				}).then(function(actual) {
					assert.equal(actual.toNumber(),1, "Submission could not increase Player struct correctly")
				});
			
		});

	});

	describe('REVEAL', function() {
		it("should not be increased revealedList by 1" , function(){
			return lot.revealStage(1,2,3).then(function(actual){
				return lot.getRevealListLength();
				}).then(function(actual) {
					assert.equal(actual.toNumber(),0, "Revealed List could not change Player struct correctly")
				});
			
		});

	});


	describe('DELETE PLAYER', function() {
		it("should  be decreased player length by 1" , function(){
			return lot.deletePlayerFromPlayers(0).then(function(actual){
				return lot.getPlayerLength(accounts[0]);
				}).then(function(actual) {
					assert.equal(actual.toNumber(),0, "PLAYER could not delete  correctly")
				});
			
		});

	});



})