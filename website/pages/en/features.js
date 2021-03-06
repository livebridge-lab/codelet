const React = require('react');

const CWD = process.cwd();

const styles = [
  '/css/splash.css',
  '/css/features.css'
];

const scripts = [
  '/js/splash.js'
];

const features = require(`${CWD}/features.json`);

const pageDescription = '「codelet功能模块」提供了大量的基础性业务功能实现，帮助团队快速搭建所需的应用系统。这些功能模块遵循统一的技术栈、设计理念和规范，可实现无缝整合。';

const pageTitle = '用心每一个功能模块';


class FeaturesSplash extends React.Component {
  render() {

    const { siteConfig } = this.props;

    const SplashContainer = props => (
      <div className="splash-container">
        <div className="splash-fade">
          <div className="inner">{props.children}</div>
        </div>
      </div>
    );

    const SplashTitle = props => (
      <h2 className="splash-title">
        {props.title} <br />
        <small>{props.description}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promo-section">
        <div className="promo-row">{props.children}</div>
      </div>
    );

    const Button = props => (
      <a className={'button button-circle home-button'} href={props.href} target={props.target}>
        {props.children}
      </a>
    );

    return (
      <SplashContainer>
        <div className="wrapper splash-wrapper">
          <SplashTitle title={pageTitle} description={pageDescription} />
          <PromoSection>
            <Button href={siteConfig.demoUrl} target="_blank">立即体验</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Features extends React.Component {
  render() {

    const siteConfig = this.props.config;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

    const Features = props => (
      <div className="features-item">
        <div className="features-block">
          <div className="features-background"></div>
          <div className="features-img"><img src={props.img} /></div>
          <div className="features-name">{props.title}</div>
          <div className="features-description" dangerouslySetInnerHTML={{ __html: props.description }}></div>
          <div className="features-link-wrapper">
            <a className="features-link-button" href={props.url}>了解更多&nbsp;→</a>
          </div>
        </div>
      </div>
    );

    const FeaturesGroup = props => (
      <div className="features-group">
        <div className="features-group-title">
          <span>{props.title}</span>
        </div>
        <div className="features-items">{props.children}</div>
      </div>
    );

    const FeaturesWrapper = props => (
      <div className="features-container">
        <div className="features-wrapper wrapper">{props.children}</div>
      </div>
    );

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <FeaturesSplash siteConfig={siteConfig} />
        <FeaturesWrapper>
          <FeaturesGroup title="专业化、精细化的管理服务">
            {
              features.map(data =>
                <Features
                  title={data.title}
                  description={data.description}
                  url={docUrl(data.url)}
                  img={data.img}
                  default={data.default} />
              )
            }
          </FeaturesGroup>
        </FeaturesWrapper>
        {scripts.map(url => (
          <script src={url}></script>
        ))}
      </div>
    );
  }
}

Features.title = 'Codelet · 用心每一个功能模块';

module.exports = Features;