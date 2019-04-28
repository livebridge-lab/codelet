
const React = require('react');

const styles = [
  '/css/home.css',
  '/css/splash.css'
];

const scripts = [
  '/js/splash.js'
];

class HomeSplash extends React.Component {
  render() {
    const siteConfig = this.props.siteConfig;

    const SplashContainer = props => (
      <div className="splash-container home-splash-container">
        <div className="splash-fade">
          <div className="inner">{ props.children }</div>
        </div>
      </div>
    );

    const SplashTitle = props => (
      <h2 className="splash-title">
        { props.title }
        <small>{props.description}</small>
      </h2>
    );

    return (
      <SplashContainer>
        <div className="wrapper splash-wrapper">
          <SplashTitle title={siteConfig.tagline} description={siteConfig.description} />
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig} = this.props;

    const FrameworksContainer = props => (
      <div className="framework-container">
        {props.children}
      </div>
    )

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <HomeSplash siteConfig={siteConfig} />
        <FrameworksContainer></FrameworksContainer>
        {scripts.map(url => (
          <script src={url}></script>
        ))}
      </div>
    );
  }
}

module.exports = Index;