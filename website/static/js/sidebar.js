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
  var frameworksLink = slidingNav[0].querySelector('ul a[href="/frameworks"]');
  var isActive = docDirs.some(function (dir) {
    return location.href.indexOf(dir) >= 0;
  })
  if (isActive) {
    frameworksLink.parentNode.classList.add('siteNavItemActive');
  }
  var mainLogo = document.getElementsByClassName('headerWrapper wrapper');
  var websiteLink = mainLogo[0].querySelector('header a');
  if (websiteLink) {
    websiteLink.href = 'http://codelet.net/';
  }

});