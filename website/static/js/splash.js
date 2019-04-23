window.addEventListener('scroll', function () {
  var scrollY = window.scrollY;
  var bodyWidth = document.body.clientWidth;
  var splashHeight = bodyWidth > 1024 ? 500 : 408;

  if (scrollY > splashHeight) {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
});