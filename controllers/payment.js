const {Controller} = require('bak')
const {User} = require('../models')
const Boom = require('boom')
const Config = require('config');

const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create(Config.get('zarinpal.merchant_id'), false);
// const baseUrl = Config.get('zarinpal.base_url')
const baseUrl = 'https://ceit93.ir/'


class PaymentController extends Controller {

  init() {
    this.post('/payment/pay', this.pay)
    this.post('/payment/add', this.add)
    this.get('/payment/check/add', this.checkAdd)
    this.get('/payment/check', this.check)
    this.get('/payment/status', this.status)
  }

  async checkAdd(request, h) {
    let params = request.query;
    let user = await User.findById(request.user._id);
    let transaction = {};
    let transactionID = 0;
    user.addFamily.forEach((e,i) => {
      if (params.Authority === e.Authority) {
        transaction = e;
        transactionID = i;
      }
    });
    if (transaction === {})
      return Boom.badRequest('درخواست بدی فرستادی :دی');
    else {
      try {
        if (!params.Authority)
          return Boom.badRequest('درخواست بدی فرستادی :دی');
        // check user send him/her self authority as query string
        if (params.Status === 'OK') {

            // if user payed the cost => no need to verify
            if (transaction.status) {
              return this.getUserRegister(user);
            }
            let verify = await zarinpal.PaymentVerification({
              Amount: (transaction.newFamily - user.registration.family) * 30 * 1000, // In Tomans
              Authority: params.Authority,
            });
            if (verify.status === 100) {
              user.addFamily[transactionID].status = true;
              console.log(user.addFamily[transactionID]);
              user.registration.cost += (transaction.newFamily - user.registration.family) * 30;
              user.registration.family = transaction.newFamily;
              await user.save();
              return this.getUserRegister(user)
            }
        }
        else if (params.Status === 'NOK') {
          let verify = await zarinpal.PaymentVerification({
            Amount: (transaction.newFamily - user.registration.family) * 30 * 1000, // In Tomans
            Authority: params.Authority,
          });
          if (verify.status === -21)
            throw Boom.paymentRequired('هیچ نوع عملیاتی برای این تراکنش یافت نشد.:(')
          else if (verify.status === 100)
            return this.getUserRegister(user)
          else
            throw Boom.paymentRequired('با پشتیبانی تماس بگیرید. عارف حسینی کیا : 09024855528')

        } else { // Bad Request

        }

        throw Boom.paymentRequired('لطفا از قسمت ثبت نام جشن هزینه خود را پرداخت کنید.')
      } catch (e) {
        return e;
      }
    }


  }

  /**
   * Checks that user payed the cost or not
   * @param request
   * @param h
   * @returns {Promise<*>}
   */
  async check(request, h) {
    let params = request.query;
    let user = await User.findById(request.user._id);
    try {
      if (!params.Authority)
        return Boom.badRequest('درخواست بدی فرستادی :دی');
      // check user send him/her self authority as query string
      if (params.Status === 'OK') {

        // checks loggedIn user payed him/her self cost
        if (user.registration.Authority === params.Authority) {
          // if user payed the cost => no need to verify
          if (user.registration.status && this.isPayedCorrect(user.registration)) {
            return this.getUserRegister(user);
          }
          let verify = await zarinpal.PaymentVerification({
            Amount: user.registration.cost * 1000, // In Tomans
            Authority: params.Authority,
          });
          if (verify.status === 100 && this.isPayedCorrect(user.registration)) {
            user.registration.status = true;
            await user.save();
            return this.getUserRegister(user)
          }
        }
      }
      else if (params.Status === 'NOK') {
        let verify = await zarinpal.PaymentVerification({
          Amount: user.registration.cost * 1000, // In Tomans
          Authority: params.Authority,
        });
        if (verify.status === -21)
          throw Boom.paymentRequired('هیچ نوع عملیاتی برای این تراکنش یافت نشد.:(')
        else if (verify.status === 100)
          return this.getUserRegister(user)
        else
          throw Boom.paymentRequired('با پشتیبانی تماس بگیرید. عارف حسینی کیا : 09024855528')

      } else { // Bad Request

      }

      throw Boom.paymentRequired('لطفا از قسمت ثبت نام جشن هزینه خود را پرداخت کنید.')
    } catch (e) {
      return e;
    }


  }

  /**
   * User requests to pay the cost and we return gateway url to him
   * @param request
   * @param h
   * @returns {Promise<{gateway: {url: *}}>}
   */
  async pay(request, h) {
    let payload = request.payload;
    // get user
    let user = await User.findById(request.user._id)
    try {
      // first try to get gateway from zarinpal
      let gateway = await zarinpal.PaymentRequest({
        Amount: this.isPayedCorrect({
          selfPayed: user.registration.selfPayed,
          cost: payload.cost,
          family: payload.family
        }) ? payload.cost * 1000 : 0,
        CallbackURL: `${baseUrl}/register/added`,
        Description: 'پرداخت هزینه جشن فارغ التحصیلی 1393',
        Email: payload.email,
        Mobile: payload.phone
      });
      payload.Authority = gateway.authority;

      let keys = Object.keys(payload);

      keys.forEach((e) => {
        user.registration[e] = payload[e]
      });

      await user.save();

      return {
        gateway: {
          url: gateway.url
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * User requests to edit his family and we return gateway url to him
   * @param request
   * @param h
   * @returns {Promise<{gateway: {url: *}}>}
   */
  async add(request, h) {
    let newFamily = request.payload.newFamily;
    // get user
    let user = await User.findById(request.user._id)
    if (user.registration.status) {
      if (user.registration.family === newFamily)
        return Boom.paymentRequired('نفراتی اضافه نشده اند.')
      else {
        try {
          // first try to get gateway from zarinpal
          let gateway = await zarinpal.PaymentRequest({
            Amount: (newFamily - user.registration.family) * 30 * 1000,
            CallbackURL: `${baseUrl}/register/added`,
            Description: 'اضافه کردن مهمان جشن فارغ التحصیلی 1393',
            Email: user.registration.email,
            Mobile: user.registration.phone
          });

          user.addFamily.push({
            Authority: gateway.authority,
            newFamily: newFamily,
            date: new Date(),
            status: false
          });

          await user.save();

          return {
            gateway: {
              url: gateway.url
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

    } else {
      throw Boom.paymentRequired('ابتدا ثبت نام کنید.')
    }

  }


  /**
   * Return payment status of user.
   * @param request
   * @param h
   * @returns {Promise<*>}
   */
  async status(request, h) {
    try {
      let user = await User.findById(request.user._id);
      if (user.registration.status)
        return {
          status: user.registration.status,
          ticket: this.getUserRegister(user)
        }
      return {
        status: user.registration.status,
        selfPayed: user.registration.selfPayed,
      }
    } catch (e) {

    }
  }

  /**
   * Checks that registration cost is correct depend on selfPayed(user),family,cost(request)
   * @param registration
   * @returns {boolean}
   */
  isPayedCorrect(registration) {
    if (registration.selfPayed)
      return registration.cost === (registration.family * 30) + 15;
    else
      return registration.cost === (registration.family) * 30 + 45;
  }

  /**
   * Return object that should be in response when the user is registered successfully
   * @param user
   * @returns {{name, email: *|email|{type, required}|{type, index, sparse, unique}, phone: *|phone|{type, required}|string, family: *|family|{type, required}, cost: *|cost|{type, required}}}
   */
  getUserRegister(user) {
    return {
      name: user.name,
      email: user.registration.email,
      phone: user.registration.phone,
      family: user.registration.family,
      cost: user.registration.cost
    }
  }

}

module.exports = PaymentController
