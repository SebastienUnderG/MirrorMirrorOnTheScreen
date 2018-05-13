
var public = {};
var loader = $('#loader');
var countDown = 5;
var w = window.innerWidth;
var h = window.innerHeight;

loader.width(w).height(h);

function loader() {
  loader.slideDown('slow', 'easeOutBounce', function () {
      public.countdown(countDown, $('#counter'));
  });
}


// Countdown Function
public.countdown = function (calls, element) {
    count = 0;
    current = calls;
    var timerFunction = function () {
        element.text(current);
        current--;
        TweenLite.to(element, 0.0, {
            scale: 8,
            opacity: 0.2
        });
        TweenLite.to(element, 0.75, {
            scale: 1,
            opacity: 1
        });

        if (count < calls) {
            window.setTimeout(timerFunction, 1000);
        } else {
            public.cheese();
        }
        count++;
    };
    timerFunction();
}
