module.exports = function(factory){

    async function registrations(req, res) {
        let locations = req.body.townInput;
        let regNumber = req.body.regNumberInput;
         await factory.storeInDB(regNumber, location);
       res.render('home', {
        //  alert: greet.alert(name, language),
         registration: await factory.returnRegNumbers,
         town: await factory.returnTowns
       });
     }

    async function filtered(req, res) {
        res.render('filter', {
           town_name: req.params.town_name,
           townReg: await factory.returnFilter(req.params.town_name)
        });
     }

    async function clear(req, res) {
        await factory.resetTowns();
        await factory.resetReg();
       res.redirect('/');
     } 
     
    return {
        registrations,
        filtered,
        clear
    }
};
