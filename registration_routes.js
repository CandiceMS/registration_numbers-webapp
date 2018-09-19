module.exports = function(factory){

    async function registrations(req, res) {
        let location = req.body.townInput;
        if(location === ''){
            req.flash('location', 'Please enter a location')
        }
        let regNumber = req.body.regNumberInput;
        if(regNumber === ''){
            req.flash('regNum', 'Please enter a registration to be added')
        }
        let conditionSet = req.body.restrictInput;
        if(conditionSet === ''){
            req.flash('validReg', 'Please enter a validation code for registration numbers')
        }
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
