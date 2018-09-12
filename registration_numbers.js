module.exports = function RegistrationNumbers(pool) {
        
        

        function regUpper(regInput) {
          regInput = regInput.replace(/\s+/g, '');
          // the above is a regular expression to remove all whitespace.
          var reg = '';
          let regUp = regInput.toUpperCase();
            reg = regUp;
            return reg;
          }
        function capitalise(location_Input) {
          var location = '';
          var lower = location_Input.toLowerCase();
          if (lower.includes(" ")) {
            var lowerSplit = lower.split(' ');
            var caps = [];
            for (var i = 0; i < lowerSplit.length; i++) {
              caps.push((lowerSplit[i].charAt(0).toUpperCase() + lowerSplit[i].slice(1)));
            }
            location = caps.join(" ");
          }
          else {
            location = lower.charAt(0).toUpperCase() + lower.slice(1);
          }
            return location;
        }
        
        async function storeInDB(reg, location) {

          if (reg == "" || location == "") {
            return ;
          }

          regUpper();
          capitalise();

          let rowResult = await pool.query('select * from towns where town_name = $1', [location])
          let rowResult2 = await pool.query('select * from reg_numbers where reg_number = $1', [reg])
             if(rowResult.rowCount === 0){
              await pool.query('insert into towns town_name value($1)', [location])
             }
             if(rowResult2.rowCount === 0){
              await pool.query('insert into reg_numbers reg_number($1)', [reg])
             }

             await pool.query('select town.town_name, reg_numbers.reg_number from towns inner join reg_numbers on town.id = reg_numbers.town_id')
        }

        async function returnRegNumbers() {
          let returnRows = await pool.query('select * from reg_numbers')
            return returnRows.rows;
        }

        async function returnTowns() {
            let returnRows = await pool.query('select * from towns')
              return returnRows.rows;
          }

        async function returnFilter(location) {
          let townID = await pool.query('select id from towns where town_name = $1', [location])
          let filterReg = await pool.query('select reg_number from reg_numbers where reg_number.town_id = $1', [townID.rows])
            return filterReg.rows;
        }

      async function resetReg() {
          let resetRegNumbers = await pool.query('delete from reg_numbers');
          return resetRegNumbers.rows;
        }
        async function resetTowns(){
            let reset = await pool.query('delete from towns');
            return reset.rows;
        }
      
      return {
          regUpper,
          capitalise,
          storeInDB,
          returnRegNumbers,
          returnTowns,
          returnFilter,
          resetReg,
          resetTowns
        }
      }
      
  
    
  
  
