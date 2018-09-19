module.exports = function(pool) {

  // add a reg trim function to remove all white space
        
        async function storeInDB(regInput, locationInput, conditionInput) {

          if (regInput == "" || locationInput == "" || conditionInput == "") {
            return ;
          }

          // let regTrim = regInput.trim();
          let reg = regInput.toLowerCase();
          let location = locationInput.toLowerCase();
          let condition = conditionInput.toLowerCase();
          let conditionSplit = condition.split(" ");

          if(conditionSplit.length !== 3){
            return;
          }

          let rowResult = await pool.query('select * from towns where town_name = $1', [location])
          let rowResult2 = await pool.query('select * from reg_numbers where reg_number = $1', [reg])

            if(rowResult.rowCount === 0){
              await pool.query('insert into towns(town_name) values($1)', [location])
             }

            if(conditionSplit.length > 2){
              await pool.query('update towns set condition = $1, condition_value = $2 where town_name = $3', [conditionSplit[0], conditionSplit[2], location])
            }
            else {
              return;
            }
             
          let townColumn = await pool.query('select id from towns where town_name = $1', [location])
          let townId = townColumn.rows[0].id;

          let conCon_val = await pool.query('select condition, condition_value from towns where town_name = $1', [location])

            if(rowResult2.rowCount === 0){
               if(conCon_val.rows[0].condition == "start" && startRestrict(reg, location)){
                 await pool.query('insert into reg_numbers(reg_number, town_id) values($1, $2)', [reg, townId])
              }
               if(conCon_val.rows[0].condition == "end" && endRestrict(reg, location)){
                 await pool.query('insert into reg_numbers(reg_number, town_id) values($1, $2)', [reg, townId])
               }
            // console.log(rowResult.rows);
            console.log(conCon_val.rows);
            }
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

        async function startRestrict(reg, location){
          let selectRow = await pool.query('select * from towns where town_name = $1', [location])
          if(reg.startsWith(selectRow.condition_value)){
            return true;
          }
          else {
            return false;
          }
        }

        async function endRestrict(reg, location){
          let selectRow = await pool.query('select * from towns where town_name = $1', [location])
          if(reg.endsWith(selectRow.condition_value)){
            return true;
          }
          else {
            return false;
          }
        }
      
      return {
          storeInDB,
          returnRegNumbers,
          returnTowns,
          returnFilter,
          resetReg,
          resetTowns,
          startRestrict,
          endRestrict
        }
      }
      
      // add flash to inform of reg, location and validation added.
      // add flash for prompt for 3 parameters
      // if rowResult.rowCount === 1 ...
  
    
  
  
