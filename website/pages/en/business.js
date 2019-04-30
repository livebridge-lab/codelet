const React = require('react');

const CWD = process.cwd();

const styles = [
  '/css/business.css',
  '/css/splash.css'
];

const scripts = [
  '/js/splash.js'
];

const business = require(`${CWD}/business.json`);

const pageDescription = '「codelet业务系统」提供了高质量的满足特定业务需求的完整系统，可以拿来即用，也可作为二开的基础。由于是基于codelet基础开发框架，使得这些系统具有良好的可维护行和技术持续性。';

const pageTitle = '泛化业务系统、二开最佳选择';


class BusinessSplash extends React.Component {
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
        {props.title} <br/>
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

class Business extends React.Component {
  render() {

    const siteConfig = this.props.config;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

    const Business = props => (
      <div className="business-item">
        <div className="business-block">
          <div className="business-background"></div>
          <div className="business-img"><img src={props.img} /></div>
          <div className="business-name">{props.title}</div>
          <div className="business-description" dangerouslySetInnerHTML={{ __html: props.description }}></div>
          <div className="business-link-wrapper">
            <a className="business-link-button" href={props.url}>了解更多&nbsp;→</a>
          </div>
        </div>
      </div>
    );

    const BusinessGroup = props => (
      <div className="business-group">
        <div className="business-group-title">
          <span>{props.title}</span>
        </div>
        <div className="business-items">{props.children}</div>
      </div>
    );

    const BusinessWrapper = props => (
      <div className="business-container">
        <div className="business-wrapper wrapper">{props.children}</div>
      </div>
    );

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <BusinessSplash siteConfig={siteConfig} />
        <BusinessWrapper>
          <BusinessGroup title="专业化、精细化的管理服务">
            {
              business.map(data =>
                <Business
                  title={data.title}
                  description={data.description}
                  url={docUrl(data.dir)}
                  img={data.img}
                  default={data.default} />
              )
            }
          </BusinessGroup>
        </BusinessWrapper>
        {scripts.map(url => (
          <script src={url}></script>
        ))}
      </div>
    );
  }
}

Business.title = 'Codelet · 泛化业务系统、二开最佳选择';

module.exports = Business;