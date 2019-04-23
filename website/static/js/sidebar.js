window.addEventListener('load', function () {
  var docDirs = [
    'docs/nodejs-menuet-mongodb',
    'docs/springboot-hibernate-mysql',
    'docs/springboot-mybatis-mysql',
    'docs/vue-element',
    'docs/angular-ng-tangram',
    'docs/react-ant-design',
  ];

  var slidingNav = document.getElementsByClassName('slidingNav');
  var productLink = slidingNav[0].querySelector('ul a[href="/products"]');
  var isActive = docDirs.some(function (dir) {
    return location.href.indexOf(dir) >= 0;
  })
  if (isActive) {
    productLink.parentNode.classList.add('siteNavItemActive');
  }
});