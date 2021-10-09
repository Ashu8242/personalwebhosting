// Javascript for blink
var blink = document.getElementById('blink');
var blink2 = document.getElementById('blink2');
var blink3 = document.getElementById('blink3');
        // setInterval(function() {
        //     blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
        // }, 1350);
        setInterval(function() {
            blink2.style.opacity = (blink2.style.opacity == 0 ? 1 : 0);
            blink3.style.opacity = (blink3.style.opacity == 0 ? 1 : 0);
        }, 900);



//For Time Script

function showTime(){
    var date = new Date();
    var h = date.getHours(); 
    var m = date.getMinutes(); 
    var s = date.getSeconds(); 
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("DigitalCLOCK").innerText = time;
    document.getElementById("DigitalCLOCK").textContent = time;
    
    setTimeout(showTime, 1000);
    
}
 
showTime();



//Jquery
$(document).ready(function(){
    $(window).scroll(function () {
       if (this.scrollY > 20){
            $('.navbar').addClass("sticky");
       } else{
        $('.navbar').removeClass("sticky");
       }
       if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
       } else{
            $('.scroll-up-btn').removeClass("show");
       }
    });

    // slide-up script
    $('.scroll-up-btn').click(function() {
        $('html').animate({scrollTop: 0});
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing animation script
    var typed = new Typed(".typing", {
        strings: ["Developer","Designer","Student"],
        typeSpeed: 120,
        backSpeed: 60,
        loop: true
    })

    var typed = new Typed(".typing-2", {
        strings: ["Developer","Designer","Student"],
        typeSpeed: 120,
        backSpeed: 60,
        loop: true
    })

    // owl carousel script
    $('.carousel').owlCarousel({
        margin:20,
        loop:true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
           1000:{
                items: 3,
                nav: false
            }
        }
    })
});
