function shopifyInit() {
  let storeData;
  let routes;
  let COOKIE_LOGIN;
  let COOKIE_REGISTER;
  let COOKIE_LOGIN_ON_CHECKOUT = 'moe-shopify-login_on_checkout';
  let CART_KEY = 'moe-local-cart-items';
  let TRACK_USER_ATTR = 'moe-track-user-attr';
  let ANONYMOUS_ID_IS_SET = 'moe-anonymoue-id-set';
  let attributesToTrack = [];
  let eventsToTrack = [];
  let trackCheckoutFlag = false;
  let extractCartDataSource = 'extractCartDataSource';
  
  function init() {
    storeData = window.moeApp || {};
    routes = storeData.routes || {};
    COOKIE_LOGIN = 'moe-shopify-login';
    COOKIE_REGISTER = 'moe-shopify-register';
    if(storeData.moe) {
      attributesToTrack = Object.keys(storeData.moe.attributes).filter(attr => !!storeData.moe.attributes[attr]);
      eventsToTrack = Object.keys(storeData.moe.events).filter(event => !!storeData.moe.events[event]);
    }

    if(window.Shopify && window.Shopify.checkout) { // considering it as a thank you page
      handleThankyouPage();
      return;
    }
    handlePageTrackEvents();
    interceptXHR();
    interceptFetch();
    handleSubmitForms();
    setOrderFlags();
  }

  function handleThankyouPage() {
    const data = window.Shopify.checkout;
    const ordersCached = getLocalStorage('orders', []);
    // if the order is already present in localstorage, it has already tracked.. page reload case.
    if(ordersCached.length > 0 && ordersCached.includes(data.order_id)) {
      return;
    }

    const userId = getMoengaegUserID();
    // Logout case - if user clicked on Logout on shipment page, then `data` will not contain that email
    checkUserLogoutOnCheckout(userId, data).then(logOutRes => {
      checkAndSetAnonymousUID(userId, data).then(anonymousUidRes => {
        trackLoginOrRegisterOnCheckout(data);

        if(getLocalStorage('isOrderPlacedEnabled')) {
          trackOrder(data, ordersCached);
        }

        if(data.email && getLocalStorage('isEmailTrackingEnabled')) {
          Moengage.add_email(data.email);
        }
        if(data.phone && getLocalStorage('isMobileTrackingEnabled')) {
          Moengage.add_mobile(data.phone);
        }
        if (data.shipping_address && data.shipping_address.phone && getLocalStorage('isShipmentMobileEnabled')) {
          Moengage.add_user_attribute('Shipping Mobile Number', data.shipping_address.phone.replace(/\s+/g, ''));
        }
      })
    })
  }
  
  function interceptXHR() {
    (function(open, send) {
      let url;
      let cartRequest;
      XMLHttpRequest.prototype.open = function() {
        url = arguments[1];
        if(url.includes(routes.cart.update) ||
        ((storeData.meta && storeData.meta.page_type !== 'product') && url.includes(routes.cart.add))) {
          this.addEventListener('load', getResponse);
        }
        open.apply(this, arguments);
      };

      function getResponse() {
        if(this.readyState === 4) {
          if((storeData.meta && storeData.meta.page_type !== 'product') && this._url.includes(routes.cart.add)) {
            trackCartAdd(JSON.parse(this.responseText));
          } else if(this._url.includes(routes.cart.update)) {
            extractCartData(cartRequest, this.responseText);
          }
          this.removeEventListener('load', getResponse)
        }
      }

      XMLHttpRequest.prototype.send = function() {
        if(url.includes(routes.cart.change)) {
          handleCartUpdate(deserializeQueryParams(arguments[0]));
        } else if(url.includes(routes.cart.add)) {
          if(storeData.meta && storeData.meta.page_type === 'product') {
            trackCartAdd(deserializeQueryParams(arguments[0]), true);
          } else {
            // in product list page as well we are getting xhr calls for add to cart.
            cartRequest = deserializeQueryParams(arguments[0]);
          }
        } else if(url.includes(routes.cart.update) && arguments && arguments[0]) {
          cartRequest = JSON.parse(arguments[0]).updates;
        }
        send.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
  }

  function interceptFetch() {
    const constantMock = window.fetch;
    window.fetch = function(url, req) {
        // Get the parameter in arguments
        // Intercept the parameter here 
        return constantMock.apply(this, arguments).then(function(res) {
          const contentTypeHeader = res.headers.get('Content-Type');
          if(typeof(contentTypeHeader) === 'string' && contentTypeHeader.includes('text/javascript') && typeof(url) === 'string' && url.includes(routes.cart.list)) {
            res
              .clone()
              .json()
              .then(body => {
                if(body.status && body.status !== 200) {
                  return;
                }
                if(url.includes(routes.cart.change)) {
                  handleCartUpdate(JSON.parse(req.body));
                } else if(url.includes(routes.cart.add)) {
                  trackCartAdd(body);
                }
              })
              .catch(err => console.error(err))
          }
          return res
        })
    }
  }

  const trackEvent = (eventName, eventAttr) => {
    Moengage.track_event(eventName, eventAttr);
  }

  function extractCartData(quanityList, response) {
    response = JSON.parse(response);
    if (!quanityList) return;
    if(Array.isArray(quanityList)) {
      const cartData = getLocalStorage(CART_KEY, []);
      for (let i = 0; i < quanityList.length; i++) {
        const qty = quanityList[i];
        const qtyToCheck = parseInt(cartData[cartData.length - i - 1].quantity);
        if(qtyToCheck !== qty) {
          handleCartUpdate({
            line: cartData.length - i,
            quantity: qty
          }, extractCartDataSource);
          break;
        }
      }
      /*quanityList.forEach((qty, i) => {
        if(parseInt(cartsFromLS[cartsFromLS.length - 1 - i].quantity) !== qty) {
          handleCartUpdate({
            line: i + 1,
            quantity: qty
          });
        }
      })*/
    } else { // add to cart flow from right popup
      const variantId = parseInt(Object.keys(quanityList)[0]);
      const foundItem = response.items.find(item => item.variant_id === variantId)
      if(foundItem) {
        trackCartAdd(foundItem);
      }
    }
  }

  function trackLoginOrRegisterOnCheckout(data) {
    if(getCookie(COOKIE_LOGIN_ON_CHECKOUT)) {
      //if user has logged in on checkout page
      trackLogin(data);
      setCookie(COOKIE_LOGIN);
    }
    if(getCookie(COOKIE_REGISTER)) {
      //if user has performed sign up on checkout page
      trackRegister(data);
      removeCookie(COOKIE_REGISTER);
      setCookie(COOKIE_LOGIN)
      setCookie(TRACK_USER_ATTR);
    }
  }

  async function checkAndSetAnonymousUID(userId, data) {
    return new Promise(async (res, rej) => {
      if ((!userId || (userId && userId !== data.email)) && !getCookie(COOKIE_LOGIN_ON_CHECKOUT) && !getCookie(COOKIE_REGISTER)) {
        //there was no unique id before (first time anonymous user) or the user changed the email (switched from loggen in to anonymous user) in the checkout page & user did not login or sign up in the checkout page
        if(eventsToTrack.includes('user_logins') || getLocalStorage('isUserLoginsEnabled')) {
          await Moengage.add_unique_user_id(data.email && data.email.toLowerCase()); //awaiting so that other events/attributes are tracked after this only
        }
        setCookie(ANONYMOUS_ID_IS_SET);
        res();
      } else {
        res();
      }
    });
  }

  async function checkUserLogoutOnCheckout(userId, data) {
    return new Promise(async (res, rej) => {
      if(userId && userId !== data.email) {
        await trackLogout(); // await to make it synchronous
        removeCookie(COOKIE_LOGIN);
        res();
      } else {
        res();
      }
    })
  }

  async function handlePageTrackEvents() {

    if(storeData.product && eventsToTrack.includes('product_viewed')) {
      trackProductView(storeData.product);
    } else if(storeData.search && eventsToTrack.includes('product_searched')) {
      trackProductSearch(storeData.search);
    } else if(storeData.customer) {
      // if the login is set and moengage user id is not set, then its the first login.
      if(getCookie(COOKIE_LOGIN) && !getMoengaegUserID()) {
        trackLogin(storeData.customer);
      } else if(!getCookie(COOKIE_LOGIN)) {
        if (getMoengaegUserID()) {
          removeCookie(ANONYMOUS_ID_IS_SET);
          await trackLogout();
        }
        trackRegister(storeData.customer)
        removeCookie(COOKIE_REGISTER);
        setCookie(COOKIE_LOGIN)
      } else if(getMoengaegUserID() && getCookie(ANONYMOUS_ID_IS_SET)) {
        //user id was set as anonymous user's email (because they had completed a purchase)
        removeCookie(ANONYMOUS_ID_IS_SET);
        await trackLogout();
        trackLogin(storeData.customer);
      }
      if(getCookie(TRACK_USER_ATTR)) {
        trackUserAttributes(storeData.customer);
        removeCookie(TRACK_USER_ATTR);
      }
      // if the page is not captcha page (customer data is not available there)
    } else if(storeData.meta && storeData.meta.page_type === 'captcha') {
      return;
      // if customer data is not available but the login cookie is there and moengage ID exists and user is not anonymous-logged in,
      // it means user has logged out. so track logout and remove the login cookie
    } else if(!storeData.customer && getMoengaegUserID() && getCookie(COOKIE_LOGIN) && !getCookie(ANONYMOUS_ID_IS_SET)) {
      await trackLogout();
      removeCookie(COOKIE_LOGIN);
    }

    // if updating cart in cart page.
    if(storeData.cart) {
      const cartsFromLS = getLocalStorage(CART_KEY, []);
      const { cart } = storeData;
      let updatedCart = cartsFromLS.concat([]);
      let updatedCartForLS = [];

      cart.forEach(cartItem => {
        let itemExistedInLS = false;
        cartsFromLS.forEach((cartItemFromLS, i) => {
          if(cartItemFromLS.variantId === cartItem.variant_id) {
            //item found in LS, item existed from before
            itemExistedInLS = true;

            if(parseInt(cartItemFromLS.quantity) !== cartItem.quantity) {
              trackCartUpdate(cartItem);
            }
            // removing item from CartLS if its already processed
            updatedCart[i] = 0;
          }
        });
        if (!itemExistedInLS) {
          //item did not exist in the LS - perform 'Add to cart'
          trackCartAdd(cartItem, false, true);
        }
        cartItem.variant_price = cartItem.price;
        updatedCartForLS.push(getCartDataForLS(cartItem));
      });

      updatedCart = updatedCart.filter(c => !!c);

      // if there are items still present in LS, then it means those are removed.
      if(updatedCart.length && eventsToTrack.includes('removed_from_cart')) {
        updatedCart.forEach(item => {
          trackCartRemove(formatCartData(item));
        });
      }
      setLocalStorage(CART_KEY, JSON.stringify(updatedCartForLS.reverse()))
    }
  }

  function handleSubmitForms() {
    window.document.addEventListener('submit', e => {
      const action = e.target.getAttribute('action');

      if(action === routes.customer.login && window.location.pathname === routes.customer.login) {
        // TODO: check if cookies can be replace with localStorage
        setCookie(COOKIE_LOGIN)
        // if the user came to login page via redirection from checkout page
        if(window.location.search.includes('checkout_url')) {
          setCookie(COOKIE_LOGIN_ON_CHECKOUT)
        }
      } else if(action === routes.customer.account && window.location.pathname === routes.customer.register) {
        setCookie(COOKIE_REGISTER)
      } else if(action === routes.cart.list && eventsToTrack.includes('checkout_started')) {
        const data = getCheckoutDataFromLS()
        if (!trackCheckoutFlag) {
          trackCheckoutFlag = true;
          trackCheckout(data);
        }
      }
    });

    if(eventsToTrack.includes('checkout_started')) {
      // Buy Now button - it directly opens the checkout flow - only 1 product allowed
      // const buyNowBtn = document.querySelector(".shopify-payment-button .shopify-payment-button__button.shopify-payment-button__button--unbranded")
      // if(buyNowBtn) {
      //   buyNowBtn.addEventListener("click", function() {
      //     const payload = getCheckoutDataFromForm();
      //     trackCheckout(payload);
      //   })
      // }

      window.addEventListener('click', function(e) {
        if (e.target.getAttribute('name') === 'checkout') {
          const payload = getCheckoutDataFromLS();
          if (!trackCheckoutFlag) {
            trackCheckoutFlag = true;
            trackCheckout(payload);
          }
        }

        if (e.target.classList && (e.target.classList.contains("shopify-payment-button") || e.target.classList.contains("shopify-payment-button__button") || e.target.classList.contains("shopify-payment-button__button--unbranded"))) {
          // Buy Now button - it directly opens the checkout flow - only 1 product allowed
          const payload = getCheckoutDataFromForm();
          trackCheckout(payload);
        }
      });
    }
  }

  function setOrderFlags() {
    setLocalStorage('isOrderPlacedEnabled', storeData.moe.events.order_placed)
    setLocalStorage('isUserLoginsEnabled', storeData.moe.events.user_logins)
    setLocalStorage('isEmailTrackingEnabled', storeData.moe.attributes.email)
    setLocalStorage('isMobileTrackingEnabled', storeData.moe.attributes.mobile)
    setLocalStorage('isShipmentMobileEnabled', storeData.moe.attributes.shipment_mobile)
  }

  const trackCartAdd = (formData, isProductPage, dontUpdateLS) => {
    const { meta } = storeData;
    const product = getProductData(formData, isProductPage);
    const variant = product.variants[parseInt(formData.id)];
    const quantity = formData.quantity || 1;
    
    if (!dontUpdateLS) {
      var cartsFromLS = getLocalStorage(CART_KEY, []);
      let itemFound = false;
      // updating the quantity of the cart item in localstorage if found
      let updatedCart = cartsFromLS.map(function(c) {
        if(c.variantId === variant.id) {
          c.quantity = parseInt(quantity);
          itemFound = true;
        }
        return c;
      })

      if(itemFound) {
        setLocalStorage(CART_KEY, JSON.stringify(updatedCart))
      } else {
        const data = product;
        data.variant_id = variant.id
        data.variant_title = variant.title;
        data.variant_price = variant.price;
        data.quantity = parseInt(quantity);
        cartsFromLS.push(getCartDataForLS(data))
        setLocalStorage(CART_KEY, JSON.stringify(cartsFromLS))
      }
    }

    if(eventsToTrack.includes('add_to_cart')) {
      trackEvent('Add To Cart', {
        Currency: meta.currency,
        Quantity: parseInt(quantity),
        'Image URL': prefixHttpsCdnImage(product.image),
        'Product Price': parseFloat((parseInt(variant.price) / 100).toFixed(2)),
        'Product ID': product.id + "",
        'Product Type': product.product_type,
        'Product Title': product.title,
        'Product URL': product.url,
        'Variation ID': variant.id + "",
        'Variation Title': variant.title,
        'Vendor name': product.vendor,
        'Source': 'Shopify'
      })
    }
  };

  function getProductData(formData, isProductPage) {
    const { product } = storeData;
    if(isProductPage && product) {
      return product;
    }
    if(formData.product_title) {
      return {
        variants: {
          [formData.variant_id]: {
            id: formData.variant_id,
            price: formData.price,
            title: formData.variant_title
          }
        },
        id: formData.product_id,
        image: formData.image,
        price: formData.price,
        product_type: formData.product_type,
        title: formData.title,
        url: formData.url,
        vendor: formData.vendor
      }
    }
  }

  function getCartDataForLS(data) {
    return {
      productPrice: data.price,
      productId: data.id,
      variantId: data.variant_id,
      variantPrice: data.variant_price,
      variantTitle: data.variant_title,
      quantity: data.quantity,
      productTitle: data.title,
      productType: data.product_type,
      url: data.url,
      image: data.image,
      vendorName: data.vendor
    }
  }

  function formatCartData(product) {
    return {
      variant_id: product.variantId,
      image: product.image,
      price: product.productPrice,
      product_id: product.productId,
      product_type: product.productType,
      title: product.productTitle,
      url: product.url,
      variant_title: product.variantTitle,
      vendor: product.vendorName
    }
  }

  const handleCartUpdate = (formData, source) => {
    const { cart } = storeData;
    var cartsFromLS = getLocalStorage(CART_KEY, []);

    var cartItem = [];

    if(formData.line) {
      if(cart && source !== extractCartDataSource) {
        cartItem = cart[parseInt(formData.line) - 1];
      } else {
        cartItem = formatCartData(cartsFromLS[parseInt(formData.line) - 1])
      }
    } else if(formData.id) {
      cartItem = formatCartData(cartsFromLS.filter(c => c.variantId.toString() === formData.id.split(':')[0].toString())[0])
    }

    if(parseInt(formData.quantity) === 0) {
      // removing the cart item from localstorage
      let removedItemIndex = 0;
      cartsFromLS.forEach(function(c, i) {
          if(c.variantId === (cartItem && cartItem.variant_id)) {
            removedItemIndex = i
          }
        })
      cartsFromLS.splice(removedItemIndex, 1)
      setLocalStorage(CART_KEY, JSON.stringify(cartsFromLS))
      if(eventsToTrack.includes('removed_from_cart')) {
        trackCartRemove(cartItem, formData);
      }
      return;
    }

    if(cartsFromLS.length > 0) {
      // updating the quantity of the cart item in localstorage
      setLocalStorage(CART_KEY, 
        JSON.stringify(
          cartsFromLS.map(function(c) {
            if(c.variantId === (cartItem && cartItem.variant_id)) {
              c.quantity = parseInt(formData.quantity)
            }
            return c;
          })
        )
      )
    }

    if(!eventsToTrack.includes('add_to_cart')) {
      return;
    }
    cartItem.quantity = formData.quantity;
    trackCartUpdate(cartItem);
  }

  const trackCartUpdate = (data) => {
    const { meta } = storeData;

    trackEvent('Update Cart', {
      currency: meta.currency,
      'Image URL': data.image,
      'Product Price': parseFloat((parseInt(data.price) / 100).toFixed(2)),
      'Product ID': data.product_id + "",
      'ProductType': data.product_type,
      'Quantity': parseInt(data.quantity),
      'Product Title': data.title,
      'Product URL': data.url,
      'Variation ID': data.variant_id + "",
      'Variation Title': data.variant_title,
      'Vendor name': data.vendor,
      'Source': 'Shopify'
    })
  }

  function trackCartRemove(cartItem) {
    const { meta } = storeData;
    trackEvent('Removed from Cart', {
      'Image URL': cartItem.image,
      'Product Price': parseFloat((parseInt(cartItem.price) / 100).toFixed(2)),
      'Product ID': cartItem.product_id + "",
      'ProductType': cartItem.product_type,
      'Product Title': cartItem.title,
      'Product URL': cartItem.url,
      'Variation ID': cartItem.variant_id + "",
      'Variation Title': cartItem.variant_title,
      'Vendor name': cartItem.vendor,
      currency: meta.currency,
      'Source': 'Shopify'
    })
  }

  function prefixHttpsCdnImage (url) {
    if (url.includes('cdn.shopify.com') && !url.startsWith('http')) {
      //prefix https:
      return 'https:' + url;
    }
    return url;
  }
  
  // function getCheckoutDataFromCart() {
  //   const { cart } = storeData;
  //   let totalPrice = 0;
  //   let productIds = [];
  //   let variantIds = [];
  //   let productPrice = [];
  //   let productQuantity = [];
  //   var productTitle = []
  //   var vendorName = [];

  //   cart.forEach(item => {
  //     totalPrice += parseFloat((parseInt(item.price) / 100).toFixed(2)) * item.quantity;
  //     productIds.push(item.product_id)
  //     variantIds.push(item.variant_id)
  //     productPrice.push(parseFloat((parseInt(item.price) / 100).toFixed(2)));
  //     productQuantity.push(item.quantity);
  //     productTitle.push(item.title);
  //     vendorName.push(item.vendor);
  //   })

  //   return {
  //     totalPrice, productIds, variantIds, productPrice, productQuantity, productTitle, vendorName
  //   }
  // }

  function getCheckoutDataFromForm() {
    var forms = document.querySelectorAll('form[action*="/cart/add"]');
    let quantity = 1;
    let id;
    forms.forEach(function(form) {
      const formData = new FormData(form);
      let data = Object.fromEntries(formData.entries());
      if(!id) {
        id = data.id
      }
      if(data.quantity) {
        quantity = data.quantity;
      }
    })
    const { product } = storeData;
    const variant = product.variants[id]
    const vPrice = parseFloat((parseInt(variant.price) / 100).toFixed(2));
    return {
      totalPrice: vPrice * parseInt(quantity),
      productIds: [product.id + ""],
      variantIds: [variant.id + ""],
      productPrice: [vPrice],
      productQuantity: [parseInt(quantity)],
      productTitle: [product.title],
      vendorName: [product.vendor]
    }
  }

  function getCheckoutDataFromLS() {
    const cart = getLocalStorage(CART_KEY);
    let totalPrice = 0;
    let productIds = [];
    let variantIds = [];
    let productPrice = [];
    let productQuantity = [];
    var productTitle = []
    var vendorName = [];

    cart.forEach(item => {
      const vPrice = parseFloat((parseInt(item.variantPrice) / 100).toFixed(2));
      totalPrice += vPrice * parseInt(item.quantity);
      productIds.push(item.productId + "")
      variantIds.push(item.variantId + "")
      productPrice.push(vPrice);
      productQuantity.push(parseInt(item.quantity));
      productTitle.push(item.productTitle);
      vendorName.push(item.vendorName);
    })
    return {
      totalPrice, productIds, variantIds, productPrice, productQuantity, productTitle, vendorName
    }
  }

  function trackCheckout(data) {
    const { meta } = storeData;

    trackEvent('Checkout Started', {
      currency: meta.currency,
      'Total Price': parseFloat(data.totalPrice),
      'Product Prices': data.productPrice,
      'Product IDs': data.productIds,
      'Product Quantities': data.productQuantity,
      'Product Titles': data.productTitle,
      'Variation IDs': data.variantIds,
      'Vendor Names': data.vendorName,
      'Source': 'Shopify'
    });
  }

  function trackProductView(product) {
    const queryParams = deserializeQueryParams(window.location.search);
    let variantId = '';
    try {
      variantId = Object.keys(product.variants)[0];
      if(queryParams.variant) {
        variantId = queryParams.variant;
      }
    } catch (error) {
      console.error('Unable to get variantID: ', error);
    }
    
    
    trackEvent('Product Viewed', {
      'Available': product.available,
      'Currency': storeData.meta.currency,
      'Product Handle': product.handle,
      'Product ID': product.id + "",
      'Price': parseFloat((parseInt(product.price) / 100).toFixed(2)),
      'Product Title': product.title,
      'Total Variants': Object.keys(product.variants).length,
      'Variant ID': variantId,
      'URL': product.url,
      'Source': 'Shopify'
    });
  }

  function trackProductSearch(search) {
    trackEvent('Product Searched', {
      'Currency': storeData.meta.currency, 
      'Search String': search.searchterm,
      'Source': 'Shopify'
    })
  }

  function trackLogin(customer) {
    if(eventsToTrack.includes('user_logins') || getLocalStorage('isUserLoginsEnabled')) {
      trackEvent('Customer Logged In', {
        'Email': customer.email,
        'FirstName': customer.firstName,
        'LastName': customer.lastName,
        'Customer ID': customer.id,
        'Source': 'Shopify'
      });
    }
    if(getCookie(COOKIE_LOGIN_ON_CHECKOUT)) {
      setCookie(TRACK_USER_ATTR);
    }
    // in case if the login is not tracked at thank you page
    removeCookie(COOKIE_LOGIN_ON_CHECKOUT);
    removeCookie(ANONYMOUS_ID_IS_SET);
    trackUserAttributes(customer);
  }

  function trackRegister(customer) {
    if(eventsToTrack.includes('user_logins') || getLocalStorage('isUserLoginsEnabled')) {
      trackEvent('Customer Registered', {
        'Email': customer.email,
        'FirstName': customer.firstName,
        'LastName': customer.lastName,
        'Customer ID': customer.id,
        'Source': 'Shopify'
      });
    }
    removeCookie(ANONYMOUS_ID_IS_SET);
    trackUserAttributes(customer);
  }

  async function trackUserAttributes(customer) {

    // using email as ID
    if(eventsToTrack.includes('user_logins') || getLocalStorage('isUserLoginsEnabled')) {
      await Moengage.add_unique_user_id(customer.email && customer.email.toLowerCase());
    }

    if(attributesToTrack.includes('email')) {
      Moengage.add_email(customer.email);
    }
    if(attributesToTrack.includes('first_name')) {
      Moengage.add_first_name(customer.firstName);
    }
    if(attributesToTrack.includes('last_name')) {
      Moengage.add_last_name(customer.lastName);
    }
    if(attributesToTrack.includes('mobile')) {
      Moengage.add_mobile(customer.phone);
    }
    if(attributesToTrack.includes('shopify_id')) {
      Moengage.add_user_attribute('Shopify Id', customer.id);
    }
    if(attributesToTrack.includes('tags') && customer.tags) {
      Moengage.add_user_attribute('Tags', customer.tags.join(', '));
    }
    if(attributesToTrack.includes('accepts_marketing')) {
      Moengage.add_user_attribute('Accepts Marketing', customer.acceptsMarketing);
    }
    if(attributesToTrack.includes('orders_count')) {
      Moengage.add_user_attribute('Orders Count', customer.ordersCount);
    }
    if(attributesToTrack.includes('shopify_ltv')) {
      Moengage.add_user_attribute('Shopify LTV', parseFloat((parseInt(customer.totalSpent) / 100).toFixed(2)));
    }
  }

  async function trackLogout() {
    if(eventsToTrack.includes('user_logins') || getLocalStorage('isUserLoginsEnabled')) {
      removeCookie(ANONYMOUS_ID_IS_SET);
      return Moengage.destroy_session();
    }
  }

  function trackOrder(data, ordersCached) {
    var payloadForList = {
      image_urls: [],
      prices: [],
      product_ids: [],
      quantities: [],
      titles: [],
      variant_ids: [],
      variant_titles: [],
      vendors: []
    }

    data.line_items.forEach(item => {
      payloadForList.image_urls.push(item.image_url);
      payloadForList.prices.push(parseFloat(item.price));
      payloadForList.product_ids.push(item.product_id + "");
      payloadForList.quantities.push(item.quantity);
      payloadForList.titles.push(item.title);
      payloadForList.variant_ids.push(item.variant_id + "");
      payloadForList.variant_titles.push(item.variant_title);
      payloadForList.vendors.push(item.vendor);

      trackEvent('Item Purchased', {
        'Order Id': data.order_id + "",
        'Image URL': item.image_url,
        'Product Price': parseFloat(item.price),
        'Product ID': item.product_id + "",
        'Quantity': item.quantity,
        'Product Title': item.title,
        'Variation ID': item.variant_id + "",
        'Variation Title': item.variant_title,
        'Vendor name': item.vendor,
        'currency': data.currency,
        'Source': 'Shopify'
      });

      // update the cart of localstorage
      var cartsFromLS = getLocalStorage(CART_KEY, []);
      setLocalStorage(CART_KEY, 
        JSON.stringify(
          cartsFromLS.filter(function(c) {
            if(item.variant_id == c.variantId) {
              if(item.quantity == c.quantity) {
                return false;
              } else {
                c.quantity = item.quantity;
                return true
              }
            }
            
          })
        )
      )
    })
    trackEvent('Order placed', {
      'Order Id': data.order_id + "",
      'Image URL': payloadForList.image_urls,
      'Product Price': payloadForList.prices,
      'Product ID': payloadForList.product_ids,
      'Quantity': payloadForList.quantities,
      'Product Title': payloadForList.titles,
      'Variation ID': payloadForList.variant_ids,
      'Variation Title': payloadForList.variant_titles,
      'Vendor name': payloadForList.vendors,
      'Total Items': data.line_items.length,
      'Total Price': parseFloat(data.total_price),
      'currency': data.currency,
      'Source': 'Shopify'
    });

    setLocalStorage('orders', JSON.stringify(ordersCached.concat(data.order_id)));
  }

  function setCookie(cookieName) {
    document.cookie = cookieName + '=yes;path=/;';
    const expiryTime = new Date(
      Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
    ).toUTCString();
    const expiresString = ';expires=' + expiryTime;
    document.cookie = cookieName + '=yes' + expiresString + ';path=/;';
  }

  function getCookie(cookieName) {
    return document.cookie.includes(cookieName);
  }

  function removeCookie(cookieName) {
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  }

  /**
   * sets item in localstorage
   * @param {*} key
   * @param {*} value
   */
  function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * gets item from localstorage
   *
   * @param {*} item
   * @param {*} defaultValue
   * @return {*} 
   */
  function getLocalStorage(item, defaultValue) {
    var lsData = localStorage.getItem(item);
    if(lsData) {
      return JSON.parse(lsData);
    }
    return defaultValue || null;
  }

  function getMoengaegUserID() {
    try {
      var MOE_DATA = JSON.parse(localStorage.MOE_DATA);
    } catch (error) {
      var MOE_DATA = {};
    }
    const user = MOE_DATA.USER_DATA;
    let userID;
    if(user) {
      user.attributes.forEach(attr => {
        if(attr.key === 'USER_ATTRIBUTE_UNIQUE_ID') {
          userID = attr.value;
        }
      })
    }
    return userID;
  }

  const deserializeQueryParams = (queryParam) => {
    if (queryParam) {
      const pairs = queryParam.replace('?', '').split('&');
      const result = {};
  
      pairs.forEach(p => {
        const pair = p.split('=');
        const key = pair[0];
        const value = decodeURIComponent(pair[1] || '');
  
        if (result[key]) {
          if (Object.prototype.toString.call(result[key]) === '[object Array]') {
            result[key].push(value);
          } else {
            result[key] = [result[key], value];
          }
        } else {
          result[key] = value;
        }
      });
  
      return JSON.parse(JSON.stringify(result));
    }
  
    return {};
  };

  init();
}
function initiateIfMoeScriptIsLoaded() {
  window.addEventListener('MOE_LIFECYCLE', function (event) {
    if(event.detail.name === "SDK_INITIALIZED") {
      shopifyInit();
    }
  });
}

initiateIfMoeScriptIsLoaded();