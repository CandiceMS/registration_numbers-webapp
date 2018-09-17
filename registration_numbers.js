module.exports = function(pool) {

        function regUpper(regInput) {
          var reg = '';
        let regInput = regInput.replace(/\s+/g, '');
          // the above is a regular expression to remove all whitespace.
          // regInput = regInput.trim();
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
        
        async function storeInDB(regInput, locationInput) {

          let reg = regInput.toLowerCase();
          let location = locationInput.toLowerCase();

          if (reg == "" || location == "") {
            return ;
          }

          let rowResult = await pool.query('select * from towns where town_name = $1', [location])
          let rowResult2 = await pool.query('select * from reg_numbers where reg_number = $1', [reg])
             if(rowResult.rowCount === 0){
              await pool.query('insert into towns(town_name) values($1)', [location])
             }

             let townColumn = await pool.query('select id from towns where town_name = $1', [location])
             let townId = townColumn.rows[0].id;

             if(rowResult2.rowCount === 0){
              await pool.query('insert into reg_numbers(reg_number, town_id) values($1, $2)', [reg, townId])
             }
            // no need to join tables because line above assigns values as needed. Line below is for a join.
            //  await pool.query('select * from towns join reg_numbers on towns.id = reg_numbers.town_id')
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
          console.log(location);
          let townColumn = await pool.query('select id from towns where town_name = $1', [location])
             let townId = townColumn.rows[0].id;
          let filterReg = await pool.query('select reg_number from reg_numbers where reg_numbers.town_id = $1', [townId])
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
      
  
    
  
  
