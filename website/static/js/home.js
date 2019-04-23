window.addEventListener('load', function () {
  window.scroll = function(event) { 
    console.log(event);
  };
});