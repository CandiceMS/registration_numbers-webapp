module.exports = function(factory){

    async function registrations(req, res) {
        let location = req.body.townInput;
        let regNumber = req.body.regNumberInput;
        let conditionSet = req.body.restrictInput;
         await factory.storeInDB(regNumber, location, conditionSet);
       res.render('home', {
        //  alert: .alert(param1, param2),
         registration: await factory.returnRegNumbers(),
         town: await factory.returnTowns()
       });
     }

    async function filtered(req, res) {
        res.render('home', {
           registration: await factory.returnFilter(req.params.town_name),
           town: await factory.returnTowns()
        });
     }

    async function clear(req, res) {
        await factory.resetReg();
        await factory.resetTowns();
       res.redirect('/');
     } 
     
    return {
        registrations,
        filtered,
        clear
    }
};
