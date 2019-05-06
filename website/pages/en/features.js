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

const pageDescription = '「codelet业务系统」一键完成数据接入，原始数据自动更新，基础框架也随之更新，帮助团队摆脱基础功能的困扰，将更多的精力投入到具体的业务功能中去,效率提高N倍';

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
            <Button href={siteConfig.repoUrl} target="_blank">立即体验</Button>
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