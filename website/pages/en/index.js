
const React = require('react');

const styles = [
  '/css/home.css',
  '/css/splash.css'
];

const scripts = [
  '/js/home.js'
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

    const PromoSection = props => (
      <div className="section promo-section">
        <div className="promo-row">{props.children}</div>
      </div>
    );

    const Button = props => (
      <a className={ 'button button-circle home-button'} href={props.href} target={props.target}>
        {props.children}
      </a>
    );

    return (
      <SplashContainer>
        <div className="wrapper splash-wrapper">
          <SplashTitle title={siteConfig.tagline} description={siteConfig.description} />
          <PromoSection>
            <Button href={ siteConfig.repoUrl } target="_blank">立即体验</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig} = this.props;

    const ProductsContainer = props => (
      <div className="product-container">
        {props.children}
      </div>
    )

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <HomeSplash siteConfig={siteConfig} />
        <ProductsContainer></ProductsContainer>
        {scripts.map(url => (
          <script src={url}></script>
        ))}
      </div>
    );
  }
}

module.exports = Index;