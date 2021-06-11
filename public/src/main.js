
var Vue = require('vue');

var LandingPage = require('./pages/Landing.vue');
var ListingPage = require('./pages/Listing.vue');


Vue.component('login-status', require('./modules/LoginStatus.vue'));
Vue.component('logo-confirm', require('./modules/LogoConfirm.vue'));


Vue.component('icon-acoustic-guitar', require('./icons/AcousticGuitar.vue'));
Vue.component('icon-piano', require('./icons/Piano.vue'));
Vue.component('icon-triangle', require('./icons/Triangle.vue'));
Vue.component('icon-violin', require('./icons/Violin.vue'));

Vue.component('icon-star', require('./icons/Star.vue'));


new Vue({
  el: '#app',
  render: function (createElement) {
    if (document.location.pathname === '/landing') {
      return createElement(LandingPage);
    } else if (document.location.pathname === '/') {
      return createElement(ListingPage);
    }
    return createElement(App);
  }
});