
const axios = require('axios');

const easeBuzz = async (req, res) => {
    try {
        const { key, txnid, amount, productinfo, firstname, phone, email, surl, furl, hash,
            udf1, udf2, udf3, udf4, udf5, udf6, udf7, address1, address2, city, state, country,
            zipcode, show_payment_mode, request_flow, sub_merchant_id, payment_category,
            account_no, ifsc } = req.body;

        const data = new URLSearchParams();
        if (key) { data.append('key', key); }
        if (txnid) { data.append('txnid', txnid); }
        if (amount) { data.append('amount', amount); }
        if (productinfo) { data.append('productinfo', productinfo); }
        if (firstname) { data.append('firstname', firstname); }
        if (phone) { data.append('phone', phone); }
        if (email) { data.append('email', email); }
        if (surl) { data.append('surl', surl); }
        if (furl) { data.append('furl', furl); }
        if (hash) { data.append('hash', hash); }
        if (udf1) { data.append('udf1', udf1); }
        if (udf2) { data.append('udf2', udf2); }
        if (udf3) { data.append('udf3', udf3); }
        if (udf4) { data.append('udf4', udf4); }
        if (udf5) { data.append('udf5', udf5); }
        if (udf6) { data.append('udf6', udf6); }
        if (udf7) { data.append('udf7', udf7); }
        if (address1) { data.append('address1', address1); }
        if (address2) { data.append('address2', address2); }
        if (city) { data.append('city', city); }
        if (state) { data.append('state', state); }
        if (country) { data.append('country', country); }
        if (zipcode) { data.append('zipcode', zipcode); }
        if (show_payment_mode) { data.append('show_payment_mode', show_payment_mode); }
        if (request_flow) { data.append('request_flow', request_flow); }
        if (sub_merchant_id) { data.append('sub_merchant_id', sub_merchant_id); }
        if (payment_category) { data.append('payment_category', payment_category); }
        if (account_no) { data.append('account_no', account_no); }
        if (ifsc) { data.append('ifsc', ifsc); }

        const response = await axios.post('https://testpay.easebuzz.in/payment/initiateLink', data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'Path=/'
            }
        });
        return {
            response: "Fetch Data Successfully",
            data: response.data,
        };

    } catch (error) {
        throw error;
    }
}

module.exports = {
    easeBuzz
}
