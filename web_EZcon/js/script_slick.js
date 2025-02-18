
$.js = function (el) {
    return $('[data-js=' + el + ']')
};

function carousel() {
  $.js('timeline-carousel').slick({
    infinite: false,
    arrows: true,
    dots: false,
    autoplay: true,
    // autoplaySpeed: 3000,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    // nextArrow: '.next_caro',
    // prevArrow: '.previous_caro',
    // prevArrow: $('.prev'),
    // nextArrow: $('.next'),
    arrows: true,
    prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
    nextArrow: '<div class="slick-next"><i class="fa fa-angle-right" aria-hidden="true"></i></div>',
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
  });
}

carousel();

function carouselpad() {
  $.js('timeline-carousel-pad').slick({
    infinite: false,
    arrows: true,
    dots: false,
    autoplay: true,
    // autoplaySpeed: 3000,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    // nextArrow: '.next_caro',
    // prevArrow: '.previous_caro',
    // prevArrow: $('.prev'),
    // nextArrow: $('.next'),
    arrows: true,
    prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
    nextArrow: '<div class="slick-next"><i class="fa fa-angle-right" aria-hidden="true"></i></div>',
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
  });
}

carouselpad();