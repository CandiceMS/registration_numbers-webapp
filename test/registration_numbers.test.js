const assert = require("assert");
let RegNumbers = require("../registration_numbers");

let postgres = require('pg');
const Pool = postgres.Pool


let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbersDB'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

describe('Add and filter registration numbers for a location', function(){ 

    beforeEach(async function() {
        await pool.query("delete from reg_numbers");
        await pool.query("delete from towns");
      });   

    const factoryRegNumbers = RegNumbers(pool);

    it('should add the registration number for Cape Town', async function(){
      let regAdd = await factoryRegNumbers.storeInDB('CA6879','cape town');
        assert.equal(regAdd, "You added a registration number for this town!");
    });
    it('should add the registration number for Paarl', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CJ6879','paarl');
          assert.equal(regAdd, "You added a registration number for this town!");
    });
    it('should add the registration number for Cape Town', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CY6879','bellville');
          assert.equal(regAdd, "You added a registration number for this town!");
    });
    it('should add the registration number for Cape Town', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CL6879','stellenbosch');
          assert.equal(regAdd, "You added a registration number for this town!");
    });

    it('should NOT add the registration number as it does not start with the required value for Cape Town', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CZ6879','cape town');
          assert.equal(regAdd, "Sorry. This is not a valid registration number for this town");
    });
    it('should NOT add the registration number as it does not start with the required value for Stellenbosch', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CZ6879','stellenbosch');
          assert.equal(regAdd, "Sorry. This is not a valid registration number for this town");
    });
   
    it('should NOT add a regsitration number as the requirements are incomplete', async function(){
        await factoryRegNumbers.storeInDB('', 'cape town');
        await factoryRegNumbers.storeInDB('', false);
        await factoryRegNumbers.storeInDB('CA78906', false);
       assert.deepEqual([], await factoryRegNumbers.returnRegNumbers());
    });
    
    it('should return only registration numbers for the selected town', async function(){
         await factoryRegNumbers.storeInDB('CA6709','cape town');
         await factoryRegNumbers.storeInDB('CA6879','cape town');
         await factoryRegNumbers.storeInDB('CA680','cape town');
         await factoryRegNumbers.storeInDB('CY679','bellville');

        assert.deepEqual([{'reg_number': 'ca6709'}, {'reg_number': 'ca6879'}, {'reg_number': 'ca680'}], await factoryRegNumbers.returnFilter('cape town'));
    });
     it('should clear all values in the reg_numbers table in the database', async function(){
         await factoryRegNumbers.storeInDB('CL6879','stellenbosch');
         await factoryRegNumbers.storeInDB('CA6879','cape town');
         await factoryRegNumbers.storeInDB('CA680','cape town');
         await factoryRegNumbers.storeInDB('CY679','bellville');
        assert.deepEqual([], await factoryRegNumbers.resetReg());
     });
     it('should clear all values in the towns table in the database', async function(){
        await factoryRegNumbers.storeInDB('CL6879','stellenbosch');
        await factoryRegNumbers.storeInDB('CA6879','cape town');
        await factoryRegNumbers.storeInDB('CA680','cape town');
        await factoryRegNumbers.storeInDB('CY679','bellville');
       assert.deepEqual([], await factoryRegNumbers.resetReg(), await factoryRegNumbers.resetTowns());
    });

    after(async function() {
        await pool.end();
      });

   });
