 'use strict';

 window.addEventListener('load', function () {
 window.cursor = $('#cursor');
    window.output = $('#output');

    Leap.loop({hand: function(hand){

      var screenPosition = hand.screenPosition(hand.palmPosition);

      var outputContent = "x: " + (screenPosition[0].toPrecision(4)) + 'px' +
             "        <br/>y: " + (screenPosition[1].toPrecision(4)) + 'px' +
             "        <br/>z: " + (screenPosition[2].toPrecision(4)) + 'px';


      // hide and show the cursor in order to get second-topmost element.
      cursor.hide();
      var el = document.elementFromPoint(
          hand.screenPosition()[0],
          hand.screenPosition()[1]
      );
      cursor.show();

      if (el){
        outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className;
      }

      output.html(outputContent);

      cursor.css({
        left: screenPosition[0] + 'px',
        top:  screenPosition[1] + 'px'
      });

    }})
    .use('screenPosition', {
      scale: 1
    });
}
