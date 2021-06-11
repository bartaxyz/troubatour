
<style lang="stylus">

.page--listing
    display block

    .page__content
        display flex
        flex-wrap nowrap
        align-items stretch
    
    .page__content > * > *
        transition 0.2s

    .page__content__results
        position absolute
        overflow-y auto
        z-index 10
        background white
        width 400px
        box-sizing border-box
        padding 16px
        box-shadow 0 0 16px rgba(0, 0, 0, 0.15)
        transition 0.2s
        left 0
        top 0
        height 100%
    
    .page__content__results--show > *
        opacity 0.25

    .page__content__map
        position absolute
        background whitesmoke
        width calc(100% - 400px)
        transition 0.2s
        right 0
        top 0
        height 100%
    
    .page__content__map--show
        width calc(100% - 800px)

    .page__content__details
        position absolute
        z-index 9
        background white
        left -20px
        width 400px
        height 100%
        box-shadow 0 0 16px rgba(0, 0, 0, 0.15)
        padding 16px
        box-sizing border-box
        transition 0.2s

    .page__content__details--show
        left 400px

    .page__content__details--rent > *
        opacity 0.25

    .page__content__login
        position absolute
        z-index 11
        background white
        left -100%
        width 100%
        height 100%
        box-shadow 0 0 16px rgba(0, 0, 0, 0.15)
        padding 16px
        box-sizing border-box
        transition 0.2s
        display flex
        flex-direction column
        justify-content center

    .page__content__login--rent
        left 0

</style>



<template lang="jade">

.page.page--listing

    .page__content

        .page__content__results(v-bind:class="{ 'page__content__results--show': detailShow, 'page__content__results--rent': loginShow }")

            img(src="/images/logo.svg")

            form(v-on:submit.prevent="search")

                .field__label Where are you going?
                .field.field--search
                    input.field__input(placeholder="Destination, city, address")
                
                .field__label What instrument do you need?
                .field.field--button-group
                    button.field__button(v-bind:class="{ 'field__button--selected': form.tag === 'guitar' }", v-on:click.prevent.stop="form.tag = 'guitar'") #[icon-acoustic-guitar] Guitar
                    button.field__button(v-bind:class="{ 'field__button--selected': form.tag === 'piano' }", v-on:click.prevent.stop="form.tag = 'piano'") #[icon-piano] Piano
                    button.field__button(v-bind:class="{ 'field__button--selected': form.tag === 'flute' }", v-on:click.prevent.stop="form.tag = 'flute'") #[icon-violin] Violin
                    button.field__button(v-bind:class="{ 'field__button--selected': form.tag === 'other' }", v-on:click.prevent.stop="form.tag = 'other'") #[icon-triangle] Other

                .field__label From/To
                .field.field--input-group
                    input.field__input(type="date")
                    input.field__input(type="date")
                
                .field
                    button.field__button(v-on:click="search") Search

            hr(v-if="form.submited || form.pending")

            .search-results(v-if="!searchResults.length && form.submited && !form.pending")
                .search-results__no-results No instruments found
            
            .search-results(v-if="form.pending")
                .loader
                    .loader__bar
                    .loader__bar
                    .loader__bar

            .search-results(v-if="searchResults.length")

                .search-results__item(v-for="item in searchResults", v-on:click="showDetail(item)")
                    .search-results__item__picture(v-bind:style="{ 'background-image': 'url(' + item.image + ')' }")
                    .search-results__item__description
                        h3.search-results__item__description__title {{ item.title }}
                        .search-results__item__description__price {{ item.price }}
                        .search-results__item__description__review {{ item.review }} #[icon-star]

            
        
        .page__content__map(v-bind:class="{ 'page__content__map--show': detailShow, 'page__content__map--rent': loginShow }")
    
        .page__content__details.detail(v-bind:class="{ 'page__content__details--show': detailShow, 'page__content__details--rent': loginShow }")
            .detail__close.field__label(v-on:click="hideDetail") Close

            img.detail__picture(v-bind:style="{ 'background-image': 'url(' + detail.image + ')' }")

            h3.detail__title {{ detail.title }}

            .profile
                .profile__picture(style="background-image:url(http://i.telegraph.co.uk/multimedia/archive/01854/Hugh_Laurie_music2_1854963c.jpg)")
                .profile__name Daniel Byczko

            .detail__price {{ detail.price }}
            .detail__review {{ detail.review }} #[icon-star]

            .field
                button.field__button(v-on:click="showLogin") Rent
            
            .detail__reviews
                h4 Reviews
                .detail__reviews__item
                    .profile
                        .profile__picture(style="background-image:url(http://artsinstarkblog.com/wp-content/uploads/2016/03/Pat-3.jpg)")
                        .profile__name Patrick Neumann
                    p.detail__reviews__item__text I rent this instrument for few days while traveling to New York City. It is great and the lender is so nice!
        
        .page__content__login(v-bind:class="{ 'page__content__login--rent': loginShow }")
            .detail__close.field__label(v-on:click="hideLogin") Close

            logo-confirm

            h3(style="text-align:center") Your band is going to the&nbsp;New&nbsp;York&nbsp;City!

            p(style="text-align:center") We contacted the lender and your booking&nbsp;is&nbsp;ready&nbsp;to&nbsp;go!


</template>



<script>

export default {
    data() {
        let data = {
            form: {
                destination: '',
                submited: false,
                pending: false,
                tag: '',
            },
            detailShow: false,
            loginShow: false,
            detail: {},
            searchResults: [],
            markers: [],
        };
        return data;
    },
    methods: {
        showDetail(item) {
            this.detailShow = true;
            this.detail = item;
            this.updateMapPoints([item]);
        },
        hideDetail() {
            this.detailShow = false;
            this.updateMapPoints();
        },
        showLogin() {
            this.loginShow = true;
            this.updateMapPoints(this.detail);
        },
        hideLogin() {
            this.loginShow = false;
            this.updateMapPoints(this.detail);
        },
        updateMapPoints(results) {
            if (!results) {
                this.map = new google.maps.Map(document.querySelector('.page__content__map'), {
                    zoom: 12,
                    center: { lat: 40.727284, lng: -73.9446147 },
                });
                this.searchResults.forEach((item) => {
                    this.markers.push(new google.maps.Marker({
                        position: item.geo,
                        map: this.map,
                    }))
                });
            } else {
                this.map = new google.maps.Map(document.querySelector('.page__content__map'), {
                    zoom: 12,
                    center: results[0].geo,
                });
                setTimeout(() => {
                    this.map.setCenter(results[0].geo);
                }, 400);
                results.forEach((item) => {
                    this.markers.push(new google.maps.Marker({
                        position: item.geo,
                        map: this.map,
                    }))
                });
            }
        },
        search() {
            this.form.pending = true;
            this.markers.forEach(marker => marker.setMap(null));
            this.searchResults = [];
            this.hideDetail();

            setTimeout(() => {
                this.form.submited = true;
                this.form.pending = false;

                if (this.form.tag === 'guitar') {
                    this.searchResults = [{
                        title: 'Guitar in North City',
                        price: '$40 / day',
                        image: 'http://www.versusbattle.com/wp-content/uploads/2013/03/steel-string-guitar.jpg',
                        review: '4.7',
                        geo: { lat: 40.733668, lng: -73.9925587 }
                    }, {
                        title: 'Guitar in South City',
                        price: '$62 / day',
                        image: 'https://images-na.ssl-images-amazon.com/images/G/01/img16/musical-instruments/vertical-store/guitars/Cordoba_AcousticGuitars_Tall_Tile._CB530541139_.jpg',
                        review: '4.9',
                        geo: { lat: 40.739781, lng: -73.9968077 }
                    }, {
                        title: 'Acoustic Guitar for Rent',
                        price: '$35 / day',
                        image: 'https://www.taylorguitars.com/sites/default/files/limited-guitar-acoustic-405x285.jpg',
                        review: '4.4',
                        geo: { lat: 40.755558, lng: -73.9756307 }
                    }, {
                        title: 'Guitar in North New York',
                        price: '$40 / day',
                        image: 'https://www.taylorguitars.com/sites/default/files/styles/hero_rotator/public/TaylorGuitars-GSMini-Bass-HomepageTout.jpg?itok=ZNPYJLvk',
                        review: '4.7',
                        geo: { lat: 40.727284, lng: -73.9446147 }
                    }, {
                        title: 'Guitar in South New York',
                        price: '$62 / day',
                        image: 'https://s-media-cache-ak0.pinimg.com/originals/fc/ca/d2/fccad2fbed5e79711fbd497df6962d9a.jpg',
                        review: '4.9',
                        geo: { lat: 40.648261, lng: -73.9679917 }
                    }, {
                        title: 'Acoustic Guitar for Rent',
                        price: '$35 / day',
                        image: 'http://i0.wp.com/acousticguitar.com/wp-content/uploads/2017/04/gypsy-jazz_guitar.jpg?resize=750%2C500',
                        review: '4.4',
                        geo: { lat: 40.67274, lng: -73.8797197 }
                    }];
                } else if (this.form.tag === 'piano') {
                    this.searchResults = [{
                        title: 'Street piano in New York',
                        price: '$0 / day',
                        image: 'http://static.boredpanda.com/blog/wp-content/uploads/2014/12/street-pianos-play-me-im-yours-project__880.jpg',
                        review: '5.0',
                        geo: { lat: 40.686973, lng: -73.8693037 }
                    }, {
                        title: 'Play me, I\'m yours - Piano',
                        price: '$0 / day',
                        image: 'http://streetpianos.com/stockholm2015/wp-content/uploads/comments/2015/08/07/500x500/image_13.jpg',
                        review: '5.0',
                        geo: { lat: 40.69671, lng: -73.8745927 }
                    }];
                }

                this.markers = [];
                this.updateMapPoints();
            }, 1000);
        },
    },
    mounted() {
        this.map = new google.maps.Map(document.querySelector('.page__content__map'), {
            zoom: 12,
            center: { lat: 59.333663, lng: 18.0582223 },
        });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.map.setCenter(pos);
            }, function() { });
        }
    }
}

</script>