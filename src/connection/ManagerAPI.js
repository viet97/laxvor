import Config from '../Config';
import Connector, { TYPE_METHOD } from './Connector';
import AppInfoManager from '../AppInfoManager';
import { getValueFromObjectByKeys } from '../utils/Util';
import { myLog } from '../Debug';
import { ORDER_TYPE, SAMPLE_REQUEST_TYPE } from '../Define';
import { size } from 'lodash';

export const URL = {
  getBaseUrl: () => Config.serverHost,
  getTypeUrl: url => AppInfoManager.getInstance().getUserInfo() ? ('buyer/' + url) : url,
  // Config
  ping: 'ping',
  product_categories: 'product_categories.json',
  product_variants: 'product_variants.json',
  filter_fields: 'filter_fields.json',
  search: 'search.json',
  login: 'buyer/buyer_auth/sign_in.json',
  saveFirebaseToken: 'device_tokens/subcribe.json',
  removeFirebaseToken: 'device_tokens/unsubcribe.json',
  recommendationProduct: 'recommendation/products.json',
  order: 'orders.json',
  sub_buyer_order: 'sub_buyer/orders.json',
  sample_requests: 'sample_requests.json',
  sub_buyer_sample_requests: 'sub_buyer/sample_requests.json',
  cart: 'cart.json',
  payment: 'payment.json',
  credit_memos: 'credit_memos.json',
  store_statements: 'store_statements.json',
  cartItem: 'cart_item.json',
  addCartItem: 'multiple/cart_item.json',
  addSingleCartItem: 'cart_item.json',
  brand: 'brands.json',
  buyer_companies: 'buyer_companies.json',
  stores: 'stores.json',
  master: 'supports/master_datas.json',
  favorite: 'favorite_products.json',
  catalog_requests: 'catalog_requests.json',
  unFavorite: (id) => `favorite_products/${id}.json`,
  sample_request: 'sample_requests.json',
  buyer_auth: 'buyer_auth.json',
  promotions: 'promotions.json',
  promotionsBrands: 'promotions/brands.json',
  promotionsBrandsVariants: id => `promotions/brands/${id}.json`,
  buyers: 'buyers.json',
  term_of_service: 'term_of_service.json',
  privacy_policy: 'privacy_policy.json',
  term_agreement: 'term_agreement.json',
  recommended_product: 'recommended_product/products.json',
  ordered_variants: 'ordered_variants.json',
  favorite_products: 'favorite_products.json',
  announcements: 'announcements.json',
  markReadAnnouncement: (id) => `announcements/${id}/mark_as_read.json`,
  payment_information: 'payment_information.json',
  reset_password: 'buyer/buyer_auth/password.json',
  sub_buyer_order_guide: 'order_guide/ordered_variants.json',
  total_order_number: 'analytics/buyers/total_order_number.json',
  total_order_value: 'analytics/buyers/total_order_value.json',
  top5_order_number: 'analytics/buyers/top5_purchased_product_by_qty.json',
  top5_order_value: 'analytics/buyers/top5_purchased_product_by_sale.json',
  stores_total_order_number: 'analytics/stores/total_order_number.json',
  stores_total_order_value: 'analytics/stores/total_order_value.json',
  stores_top5_order_number: 'analytics/stores/top5_purchased_product_by_qty.json',
  stores_top5_order_value: 'analytics/stores/top5_purchased_product_by_sale.json',
  referral_brand_forms: 'referral_brand_forms.json',
  purchase_requests: 'purchase_requests.json',
  pre_order: 'pre_order/orders.json',
  sub_invoice_pdf_download: (sub_invoice_id) =>
    `pdf_downloads/sub_invoices/${sub_invoice_id}.json`,
  export_monthly_statement_pdf_download: (id) =>
    `pdf_downloads/store_statements/${id}.json`,
  detailProduct: (productId) => `products/${productId}.json`,
  detailBrand: (brandId) => `brands/${brandId}.json`,
  detailOrder: (orderId) => `orders/${orderId}.json`,
  detailPreOrder: (preOrderId) => `pre_order/orders/${preOrderId}.json`,
  detailSampleRequest: (sample_request_id) =>
    `sample_requests/${sample_request_id}.json`,
};

export const ACCEPT_TYPE = {
  PDF: 'application/pdf',
};

export const RESPONSE_TYPE = {
  BLOB: 'blob',
};
export default class ManagerAPI {
  static getInstance() {
    if (!this._instance) {
      this._instance = new ManagerAPI();
    }
    return this._instance;
  }
  static clear() {
    if (this._instance) {
      delete this._instance;
    }
  }
  constructor() {
    this.name = 'ManagerAPI';
  }
  // 0. GetConnector
  getConnector = (url, checkIsBuyer = true) => {
    const applyUrl = checkIsBuyer ? URL.getTypeUrl(url) : url;
    return new Connector().setUrl(URL.getBaseUrl() + applyUrl);
  };
  // Create custom request
  requestCustom = ({
    url,
    method = TYPE_METHOD.GET,
    query = {},
    params = {},
    timeout = 30000,
    useRefreshToken = true,
    useToken = true,
    useCrypto = false,
    dataTmp = {},
  }) => {
    if (!url) {
      return new Promise((res, rej) => {
        res(true);
      });
    }
    return this.getConnector(url, url)
      .setMethod(method)
      .setQuery(query)
      .setParams(params)
      .setTimeOut(timeout)
      .setUseToken(useToken)
      .setUseCrypto(useCrypto)
      .setDataTmp(dataTmp)
      .setUseRefreshToken(useRefreshToken)
      .getPromise();
  };
  //user
  login = ({ email, password }) => {
    return this.getConnector(URL.login, false)
      .setMethod(TYPE_METHOD.POST)
      .setParams({ email, password })
      .getPromise();
  };

  saveFirebaseToken = ({ token }) => {
    return this.getConnector(URL.saveFirebaseToken)
      .setMethod(TYPE_METHOD.POST)
      .setParams({ token })
      .getPromise();
  };

  removeFirebaseToken = ({ token }) => {
    return this.getConnector(URL.removeFirebaseToken)
      .setMethod(TYPE_METHOD.DELETE)
      .setQuery({ token })
      .getPromise();
  };

  getStores = () => {
    return this.getConnector(URL.stores).getPromise();
  };

  updateStore = ({ store }) => {
    return this.getConnector(URL.stores)
      .setMethod(TYPE_METHOD.PUT)
      .setParams({ store })
      .getPromise();
  };

  getBuyerCompanies = () => {
    return this.getConnector(URL.buyer_companies).getPromise();
  };

  updateBuyerCompanyBusinessLicense = ({ certificates }) => {
    const formData = new FormData();
    certificates && certificates.forEach((item, index) => {
      if (item.id) {
        formData.append(`buyer_company[business_license_certificates_attributes][${index}][id]`, item.id);
        formData.append(`buyer_company[business_license_certificates_attributes][${index}][_destroy]`, !!item._destroy);
      } else {
        const file = {
          uri: item.path,
          type: item.type,
          name: item.name,
        };
        formData.append(`buyer_company[business_license_certificates_attributes][${index}][attachment]`, file);
        formData.append(`buyer_company[business_license_certificates_attributes][${index}][file_name]`, item.name);
      }
    });
    return this.getConnector(URL.buyer_companies)
      .setMethod(TYPE_METHOD.PUT)
      .setParams(formData)
      .getPromise();
  };

  updateBuyerCompanyResaleLicense = ({ certificates }) => {
    const formData = new FormData();
    certificates && certificates.forEach((item, index) => {
      if (item.id) {
        formData.append(`buyer_company[resale_certificates_attributes][${index}][id]`, item.id);
        formData.append(`buyer_company[resale_certificates_attributes][${index}][_destroy]`, !!item._destroy);
      } else {
        const file = {
          uri: item.path,
          type: item.type,
          name: item.name,
        };
        formData.append(`buyer_company[resale_certificates_attributes][${index}][attachment]`, file);
        formData.append(`buyer_company[resale_certificates_attributes][${index}][file_name]`, item.name);
      }
    });
    return this.getConnector(URL.buyer_companies)
      .setMethod(TYPE_METHOD.PUT)
      .setParams(formData)
      .getPromise();
  };

  updateBuyer = (buyer) => {
    return this.getConnector(URL.buyers)
      .setMethod(TYPE_METHOD.PUT)
      .setParams({ buyer })
      .getPromise();
  };

  resetPassword = ({ email }) => {
    const redirect_url = Config.domain + '/buyer_auth/new';
    return this.getConnector(URL.reset_password, false)
      .setMethod(TYPE_METHOD.POST)
      .setParams({ email, redirect_url })
      .getPromise();
  };

  //product
  requestSearch = ({ brand_name, product_variant_name, note, description, urls = [] }) => {
    const formData = new FormData();
    formData.append('catalog_request[brand_name]', brand_name);
    formData.append('catalog_request[product_variant_name]', product_variant_name);
    formData.append('catalog_request[description]', description);
    formData.append('catalog_request[note]', note);
    formData.append('catalog_request[note]', note);

    urls.forEach((url, index) => {
      const file = {
        uri: url,
        type: 'image/jpeg',
        name: `photo${index}${Date.now()}.jpg`,
      };
      formData.append(`catalog_request[images_attributes][${index}][attachment]`, file);
    });

    return this.getConnector(URL.catalog_requests)
      .setMethod(TYPE_METHOD.POST)
      .setContentType('multipart/form-data')
      .setParams(formData)
      .getPromise();
  };

  requestPurchase = ({
    first_name,
    last_name,
    email,
    store_name,
    store_address,
    comment,
    purchase_request_items_attributes,
    city,
    address_state_id,
    zip,
    phone_number }) => {

    return this.getConnector(URL.purchase_requests)
      .setMethod(TYPE_METHOD.POST)
      .setParams({
        purchase_request: {
          comment,
          address_attributes: {
            city,
            address_state_id,
            zip,
            phone_number,
          },
          purchase_request_items_attributes,
          store_address,
          store_name,
        },
        requested_account: {
          first_name,
          last_name,
          email,
        },
      })
      .getPromise();
  };

  addFavorite = ({ product_variant_id }) => {
    return this.getConnector(URL.favorite)
      .setMethod(TYPE_METHOD.POST)
      .setParams({ product_variant_id })
      .getPromise();
  };

  unFavorite = ({ product_variant_id }) => {
    return this.getConnector(URL.unFavorite(product_variant_id))
      .setMethod(TYPE_METHOD.DELETE)
      .getPromise();
  };

  getSKUByCompany = ({
    vendor_company_id,
    region_type,
    page = 1,
  }) => {
    const query = { page };
    if (vendor_company_id) {
      query['q[vendor_company_id]'] = vendor_company_id;
    }
    if (region_type) {
      query['q[region_type]'] = region_type;
    }
    return this.getConnector(URL.product_variants)
      .setQuery(query)
      .getPromise();
  };

  getProductCategories = () => {
    return this.getConnector(URL.product_categories, false).getPromise();
  };

  searchProduct = ({
    term = '',
    page = 1,
    sort,
    direction,
    tag_ids = [],
    product_quality = [],
    package_size = [],
    address_state_id,
    brand_id,
    category_id,
    pfd,
    barcode,
    vendor_company_id,
    region_type,
  }) => {
    const query = {
      term,
      page,
    };

    if (sort) {
      query.sort = sort;
    }
    if (direction) {
      query.direction = direction;
    }
    if (barcode) {
      query['q[barcode]'] = barcode;
    }
    if (vendor_company_id) {
      query['q[vendor_company_id]'] = vendor_company_id;
    }
    if (region_type) {
      query['q[region_type]'] = region_type;
    }

    let url = URL.search;
    let tagArray = [];
    let productArray = [];
    let packageArray = [];
    if (size(tag_ids) > 0) {
      tagArray = tag_ids.map(id => 'q[tag_ids][]=' + id);
    }
    if (size(product_quality) > 0) {
      productArray = product_quality.map(id => 'q[product_quality][]=' + id);
    }
    if (size(package_size) > 0) {
      packageArray = package_size.map(id => 'q[package_size][]=' + id);
    }
    const queryStr = [...tagArray, ...productArray, ...packageArray].join('&');
    if (queryStr) {
      url = url + '?' + queryStr;
    }

    if (address_state_id) {
      query['q[address_state_id]'] = address_state_id;
    }
    query['q[pfd]'] = pfd;
    myLog('queryString', tagArray, productArray, queryStr, url);

    if (brand_id) {
      query.brand_id = brand_id;
    }

    if (category_id >= 0) {
      query.category_id = category_id;
    }

    return this.getConnector(url).setQuery(query).getPromise();
  };

  getDetailProduct = ({ productId = '' }) => {
    return this.getConnector(URL.detailProduct(productId)).getPromise();
  };

  getRecommendationProduct = ({ productId = '' }) => {
    return this.getConnector(URL.recommendationProduct)
      .setQuery({ product_id: productId })
      .getPromise();
  };

  getRecommendationProduct = ({ productId = '' }) => {
    return this.getConnector(URL.recommendationProduct)
      .setQuery({ product_id: productId })
      .getPromise();
  };

  //order
  getOrder = ({
    page = 1,
    per_page = 24,
    fulfillment_state = null,
    orderType = ORDER_TYPE.YOUR_ORDERS,
    brand_id,
    brand_name,
    checkout_date_start,
    checkout_date_end,
    order_item_type,
  }) => {
    const query = {
      page,
      per_page,
      brand_id,
      brand_name,
      checkout_date_start,
      checkout_date_end,
    };

    if (fulfillment_state) {
      query.fulfillment_state = fulfillment_state;
    }
    if (order_item_type) {
      query.order_type = order_item_type;
    }

    let url = URL.order;

    if (orderType === ORDER_TYPE.YOUR_ORDERS) {
      const buyerId = getValueFromObjectByKeys(
        AppInfoManager.getInstance().getUserInfo(),
        ['id']
      );
      query.buyer_id = buyerId;
    }
    if (orderType === ORDER_TYPE.STORE_BUYERS) {
      url = URL.sub_buyer_order;
    }
    return this.getConnector(url).setQuery(query).getPromise();
  };
  getDetailOrder = ({ id }) => {
    return this.getConnector(URL.detailOrder(id)).getPromise();
  };
  getDetailPreOrder = ({ id }) => {
    return this.getConnector(URL.detailPreOrder(id)).getPromise();
  };
  getTotalOrderNumber = ({ time_unit, isBuyer }) => {
    return this.getConnector(isBuyer ? URL.total_order_number : URL.stores_total_order_number).setQuery({ time_unit }).getPromise();
  };
  getTotalOrderValue = ({ time_unit, isBuyer }) => {
    return this.getConnector(isBuyer ? URL.total_order_value : URL.stores_total_order_value).setQuery({ time_unit }).getPromise();
  };
  getTop5OrderNumber = ({ time_unit, isBuyer }) => {
    return this.getConnector(isBuyer ? URL.top5_order_number : URL.stores_top5_order_number).setQuery({ time_unit }).getPromise();
  };
  getTop5OrderValue = ({ time_unit, isBuyer }) => {
    return this.getConnector(isBuyer ? URL.top5_order_value : URL.stores_top5_order_value).setQuery({ time_unit }).getPromise();
  };
  downloadSubInvoicePdf = ({ id }) => {
    return this.getConnector(URL.sub_invoice_pdf_download(id))
      .setAcceptType(ACCEPT_TYPE.PDF)
      .setResponseType(RESPONSE_TYPE.BLOB)
      .getPromise();
  };
  downloadMonthlyStatementPDF = ({ id }) => {
    return this.getConnector(URL.export_monthly_statement_pdf_download(id))
      .setAcceptType(ACCEPT_TYPE.PDF)
      .setResponseType(RESPONSE_TYPE.BLOB)
      .getPromise();
  };
  changePassword = ({ current_password, password, password_confirmation }) => {
    const email = getValueFromObjectByKeys(
      AppInfoManager.getInstance().getUserInfo(),
      ['email']
    );
    return this.getConnector(URL.buyer_auth)
      .setMethod(TYPE_METHOD.PUT)
      .setParams({ email, password, current_password, password_confirmation })
      .getPromise();
  };

  addPreOrder = ({ order }) => {
    return this.getConnector(URL.pre_order)
      .setMethod(TYPE_METHOD.POST)
      .setParams({ order })
      .getPromise();
  };

  //payment
  payment = ({ order_id, payment_type }) => {
    return this.getConnector(URL.payment)
      .setMethod(TYPE_METHOD.POST)
      .setParams({ order_id, payment_type })
      .getPromise();
  };

  getCreditMemos = ({ page = 1 }) => {
    return this.getConnector(URL.credit_memos)
      .setMethod(TYPE_METHOD.GET)
      .setQuery({ per_page: 24, page })
      .getPromise();
  };

  getStoreStatements = ({ page = 1 }) => {
    return this.getConnector(URL.store_statements)
      .setMethod(TYPE_METHOD.GET)
      .setQuery({ per_page: 24, page })
      .getPromise();
  };

  //cart
  getCart = () => {
    const id = AppInfoManager.getInstance().getStateRedux(['Cart', 'cart', 'id']);
    const query = {};
    if (id) {
      query.id = id;
    }
    return this.getConnector(URL.cart).setQuery(query).getPromise();
  };

  updateCart = (order) => {
    return this.getConnector(URL.cart)
      .setMethod(TYPE_METHOD.PUT)
      .setParams({ order })
      .getPromise();
  };

  deleteCart = ({ id }) => {
    return this.getConnector(URL.cartItem)
      .setMethod(TYPE_METHOD.DELETE)
      .setQuery({ id })
      .getPromise();
  };

  putCart = ({ id, quantity }) => {
    return this.getConnector(URL.cartItem)
      .setMethod(TYPE_METHOD.PUT)
      .setParams({
        id,
        quantity,
      })
      .getPromise();
  };

  addCart = ({ cart_items }) => {
    let params = {};
    if (size(cart_items) > 1) {
      params = { cart_items };
    }
    if (size(cart_items) === 1) {
      params = cart_items[0];
    }
    return this.getConnector(size(cart_items) > 1 ? URL.addCartItem : URL.addSingleCartItem)
      .setMethod(TYPE_METHOD.POST)
      .setParams(params)
      .getPromise();
  };
  //Brand
  getBrand = ({ per_page = 24, page = 1, term = '', address_state_id, sort, direction }) => {
    const query = { per_page, term, page };
    if (address_state_id) {
      query['q[address_state_id]'] = address_state_id;
    }
    if (sort) {
      query.sort = sort;
    }
    if (direction) {
      query.direction = direction;
    }
    return this.getConnector(URL.brand).setQuery(query).getPromise();
  };

  getDetailBrand = ({ id }) => {
    return this.getConnector(URL.detailBrand(id)).getPromise();
  };
  //MaterData
  getMasterData = () => {
    return this.getConnector(URL.master).setQuery().getPromise();
  };
  getFilterFields = () => {
    return this.getConnector(URL.filter_fields, false).setQuery().getPromise();
  };

  //payment method
  getPaymentMethod = () => {
    return this.getConnector(URL.payment_information).getPromise();
  };

  //Sample Request
  getSampleRequest = ({
    page = 1,
    per_page = 24,
    fulfillment_state = null,
    sample_requests_type = SAMPLE_REQUEST_TYPE.YOUR_REQUEST,
    brand_name,
    brand_id,
    created_at_end,
    created_at_start,
  }) => {
    const query = {
      page,
      per_page,
    };
    if (fulfillment_state) {
      query['q[fulfillment_state]'] = fulfillment_state;
    }
    if (brand_name) {
      query['q[brand_name]'] = brand_name;
    }
    if (brand_id) {
      query['q[brand_id]'] = brand_id;
    }
    if (created_at_end) {
      query['q[created_at_end]'] = created_at_end;
    }
    if (created_at_start) {
      query['q[created_at_start]'] = created_at_start;
    }

    let url = URL.sample_requests;

    if (sample_requests_type === SAMPLE_REQUEST_TYPE.YOUR_REQUEST) {
      const buyerId = getValueFromObjectByKeys(
        AppInfoManager.getInstance().getUserInfo(),
        ['id']
      );
      query['q[buyer_id]'] = buyerId;
    }
    if (sample_requests_type === SAMPLE_REQUEST_TYPE.STORE_BUYERS) {
      url = URL.sub_buyer_sample_requests;
    }
    return this.getConnector(url).setQuery(query).getPromise();
  };
  getDetailSampleRequest = ({ id }) => {
    return this.getConnector(URL.detailSampleRequest(id)).getPromise();
  };

  requestSample = ({
    items = [],
    shipping_address,
    sample_request,
    product_id,
  }) => {
    const params = {
      items, sample_request, product_id,
    };
    if (shipping_address) {
      params.shipping_address = shipping_address;
    }
    return this.getConnector(URL.sample_request)
      .setMethod(TYPE_METHOD.POST)
      .setParams(params)
      .getPromise();
  };

  //My Pod
  getPromotions = ({ start_date, end_date, sessionKey }) => {
    return this.getConnector(URL.promotions)
      .setQuery({
        start_date,
        end_date,
      })
      .setSessionKey(sessionKey)
      .getPromise();
  };
  getBrandPromotions = ({
    start_date,
    end_date,
    sessionKey,
    brand_id,
    brand_name,
    Bordered }) => {
    const query = {
      start_date,
      end_date,

    };
    if (brand_id) {
      query['q[brand_id]'] = brand_id;
    }
    if (brand_name) {
      query['q[brand_name]'] = brand_name;
    }
    if (Bordered) {
      query['q[ordered]'] = Bordered.id;
    }
    return this.getConnector(URL.promotionsBrands)
      .setQuery(query)
      .setSessionKey(sessionKey)
      .getPromise();
  };
  getBrandPromotionsVariants = ({ id, start_date, end_date, promotion_id }) => {
    return this.getConnector(URL.promotionsBrandsVariants(id))
      .setQuery({
        start_date,
        end_date,
        promotion_id,
      })
      .getPromise();
  };

  getOrderGuide = ({ per_page = 24, page = 1, fromStore, sessionKey }) => {
    const buyerId = getValueFromObjectByKeys(
      AppInfoManager.getInstance().getUserInfo(),
      ['id']
    );
    const query = {};
    if (buyerId && !fromStore) {
      query['q[buyer_id]'] = buyerId;
    }
    query['q[time_interval]'] = 'recent';
    query.per_page = per_page;
    query.page = page;
    return this.getConnector(
      AppInfoManager.getInstance().isSubBuyer()
        ? URL.sub_buyer_order_guide
        : URL.ordered_variants
    )
      .setQuery(query)
      .setSessionKey(sessionKey)
      .getPromise();
  };

  getRecommendedProducts = ({ page = 1 }) => {
    return this.getConnector(URL.recommended_product)
      .setQuery({ page })
      .getPromise();
  };
  getRecommendedProducts = ({ page = 1 }) => {
    return this.getConnector(URL.recommended_product)
      .setQuery({ page })
      .getPromise();
  };

  getFavorite = () => {
    return this.getConnector(URL.favorite).getPromise();
  };

  //About
  getTermOfService = () => {
    return this.getConnector(URL.term_of_service, false).getPromise();
  };

  getPrivacy = () => {
    return this.getConnector(URL.privacy_policy, false).getPromise();
  };

  termAgreement = () => {
    return this.getConnector(URL.term_agreement)
      .setMethod(TYPE_METHOD.POST)
      .getPromise();
  };

  getAnnouncement = () => {
    return this.getConnector(URL.announcements).getPromise();
  };

  markReadAnnouncement = ({ id }) => {
    return this.getConnector(URL.markReadAnnouncement(id)).setMethod(TYPE_METHOD.POST).getPromise();
  };
  brandReferrals = ({ referral_brand_form }) => {
    return this.getConnector(URL.referral_brand_forms)
      .setParams({ referral_brand_form })
      .setMethod(TYPE_METHOD.POST)
      .getPromise();
  };
}

export { ManagerAPI };
