/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
const registrationRoute = require('../routes/registrationRoute');
const statusRoute = require('../routes/statusRoute');
const privilageRoute = require('../routes/privilageRoute');
const creditRoute = require('../routes/creditRoute');
const productPlanRoute = require('../routes/productPlanRoute');
const emailConfigRoute = require('../routes/emailConfigRoute');
const emailConfigDecriptionRoute = require("../routes/emailConfigDiscriptionRoute");
const smtpRoute = require('../routes/smtpRoute');
const CountryRoute = require('../routes/countryRoute');
const CabinClassMasterRoute = require('../routes/cabinClassMasterRoute');
const websiteManagerRoute = require('../routes/websiteManagerRoute');
const stateRoute = require('../routes/stateRoute');
const cityRoute = require('../routes/cityRoute');
const permissionRoute = require('../routes/permissionRoute');
const roleRoute = require('../routes/roleRoute');
const salesRoute = require('../routes/salesRoute');
const commercialAirPlanRoute = require('../routes/commercialAirPlanRoute');
const fareFamilyRoute = require('../routes/fareFamilyMasterRoute');
const verifyOtpRoute = require('../routes/verifyOtpRoute');
const flightRoute = require('../routes/flight/flightRoute');
const carrierRoute = require('../routes/carrierRoute');
const airCommercialRoute = require('../routes/airCommercialRoute');
const roleHasPermissionRoute = require('../routes/roleHasPermissioRoute');
const bankDetailsRoute = require('../routes/bankDetailsRoute');
const plbMaster = require('../routes/plbMasterRoute');
const layoutRoute = require('../routes/layoutRoute')
const plbGroupMaster = require('../routes/plbGroupMasterRoute');
const incentiveMasterRoute = require('../routes/incentiveMasterRoute');
const incentiveGroupMasterRoute = require('../routes/incentiveGroupMasterRoute');
const configManageRoute = require('../routes/configManage/configManageRoute');
const pgChargesRoute = require('../routes/pgChargesRoute');
const supplierCode = require('../routes/supplierCodeRoute');
const supplier = require('../routes/supplierRoute');
const airlinePromo = require('../routes/airlinePromoCodeRoute');
const configCredential = require('../routes/configCredentialRoute');
const diSetup = require('../routes/diSetupRoute');
const autoTicketingRoute = require('../routes/autoTicketingRoute');
const manageUploadRoute = require('../routes/manageUploadsRoute');
const fareRuleRoute = require('../routes/fareRulesRoute');
const fareRuleGroupRoute = require('../routes/fareRuleGroupRoute');
const airLineCodeRoute = require('../routes/airLineCodeRoute');
const agencyConfigRoute = require('../routes/agencyConfigurationRoute')
const emulateRoute = require('../routes/emulateRoute');
const agencyConfigRoute = require('../routes/agencyConfigurationRoute');
const paymentGatewayChargeRoute = require('../routes/paymentGatewayChargeRoute')
class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

        // Product route by AlamShah
        app.use('/api' , productRoute);
        
        // Registration route by Shashi
        app.use('/api', registrationRoute);

        // Ststus route by Shashi
         app.use('/api',statusRoute);


        // Privilage Route created by AlamShah
        app.use('/api' , privilageRoute);

        // Credit route created by AlamShah
        app.use('/api' ,creditRoute);

        // Product Plan Route
        app.use('/api' ,productPlanRoute);

        // emailConfig Route by shahsi
        app.use('/api',emailConfigRoute);

        // emailConfigDescription Route by shashi
        app.use('/api', emailConfigDecriptionRoute);

        // smtp Route by shashi
        app.use('/api',smtpRoute);

        // Country route by alamShah
        app.use('/api', CountryRoute);

        // CabinClassMaster route by alam
        app.use('/api', CabinClassMasterRoute);

        // website Manager Route by alam Shah
        app.use('/api', websiteManagerRoute);

        // State route by alam shah
        app.use('/api' , stateRoute);

        // City route by alam shah
        app.use('/api' , cityRoute);

        // Permission Route by ALam Shah
        app.use('/api' , permissionRoute);

        // role routes by shashi

        app.use('/api', roleRoute );

        // saleInchage route by shashi

        app.use('/api', salesRoute)

        // varify otp by shashi

        app.use('/api', verifyOtpRoute)

        // Flight Route Start Here
        app.use("/api", flightRoute);

        app.use('/api', verifyOtpRoute);

        // Carrier route by alam shah
        app.use('/api' , carrierRoute);

        // Air Commercial route by alam shah
        app.use('/api' , airCommercialRoute);

        // Fare family route
        app.use('/api' , fareFamilyRoute);

        // RoleHasPermission route created by alam
        app.use('/api' , roleHasPermissionRoute);

        // bankDetails Route by shashi
        app.use('/api' , bankDetailsRoute)

        // PLB Master route
        app.use('/api' , plbMaster);

        // layot Route by  shashi

        app.use('/api', layoutRoute);
        // PLB Group Master
        app.use('/api' , plbGroupMaster);

        // Incentive Master route
        app.use('/api' , incentiveMasterRoute);

        // Commercial Route
        app.use('/api' , commercialAirPlanRoute);

        // incentive Master Group route
        app.use('/api' , incentiveGroupMasterRoute);

        // Air Wise GST route Config Manage
        app.use('/api', configManageRoute);

        // pgcharges route 
        app.use('/api', pgChargesRoute);

        // supplierCode route
        app.use('/api', supplierCode);

        // supplier route
        app.use('/api', supplier);

        // airline Peomocode route
        app.use('/api', airlinePromo )

        // configCredential apis route
        app.use('/api', configCredential)

        // diSetup api route
        app.use('/api' , diSetup);

        // autoTicketing routes
        app.use('/api',autoTicketingRoute);

        // manageUploadRoute route
        app.use('/api', manageUploadRoute);

        // fareRule route
        app.use('/api',fareRuleRoute);
         
        app.use('/api', fareRuleGroupRoute);

        // airLine code
        app.use('/api',airLineCodeRoute);

        //agent Configuration Route
        app.use('/api', agencyConfigRoute);

        // emulate
        app.use('/api', emulateRoute);
        //paymentgateWay ChargeRoute
        app.use('/api', paymentGatewayChargeRoute);
    }
}

module.exports = {RoutesLoader};