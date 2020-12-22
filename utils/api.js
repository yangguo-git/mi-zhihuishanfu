const minipId = 'unicom'; //winvoice_minip
const baseUrl = "https://tcheckminip.weein.cn";


const LOGIN = '/check/minip/login';
const GET_PHONE = '/check/minip/phone';

const ADD_INVOICE_TITLE = '/v1/invoice/addInvoiceTitle.do';
const UPDATE_INVOICE_TITLE = '/v1/invoice/updateInvoiceTitle.do';
const DELETE_INVOICE_TITLE = '/v1/invoice/deleteInvoiceTitle.do';

module.exports = {
  login() {
    return baseUrl + LOGIN;
  },
  postAddInvoiceTitle() {
    return baseUrl + ADD_INVOICE_TITLE;
  },
  updateInvoiceTitle() {
    return baseUrl + UPDATE_INVOICE_TITLE;
  },
  deleteInvoiceTitle() {
    return baseUrl + DELETE_INVOICE_TITLE;
  },
  getPhone() {
    return baseUrl + GET_PHONE;
  },
  baseUrl, minipId
}