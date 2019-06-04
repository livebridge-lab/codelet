
const React = require('react');

const CWD = process.cwd();

const frameworks = require(`${CWD}/frameworks.json`);

const styles = [
  '/css/frameworks.css',
  '/css/splash.css'
];

const scripts = [
  '/js/splash.js'
];

const pageDescription = '「codelet基础框架」提供了高质量的开发系统所需的基础功能，功能包括认证、授权、消息、权限、人员、组织、安全等。帮助团队摆脱基础功能的困扰，将更多的精力投入到具体的业务功能中去。';

const pageTitle = '聚焦核心业务，摆脱基础设施困扰';

class FrameworksSplash extends React.Component {
  render() {

    const {siteConfig} = this.props;

    const SplashContainer = props => (
      <div className="splash-container">
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
      <a className={ 'button home-button' } href={props.href} target={props.target}>
        {props.children}
      </a>
    );

    return (
      <SplashContainer>
        <div className="wrapper splash-wrapper">
          <SplashTitle title={pageTitle} description={pageDescription} />
          <PromoSection>
            <Button href={siteConfig.demoUrl} target="_blank">立即体验</Button>
            <Button href={siteConfig.guideUrl} target="_blank">功能介绍</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Descriptions extends React.Component {
  render() {
    const data = this.props.data
    const Description = props => (
      <div className="description-item">
        <div className="order">{props.order}</div>
        <div className="item-title">{props.title}</div>
        <div className="item-content" dangerouslySetInnerHTML={{ __html: props.content }}></div>
      </div>
    );
    return (
      <div className="descriptions">
        <div className="wrapper">
          <div className="description-title">{data.title}</div>
          <div className="description-group">
            {
              (data.descriptions || []).map((description, index) =>
                <Description
                  order={'0' + (index + 1) + '.'}
                  title={description.title}
                  content={description.content}
                ></Description>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

class Frameworks extends React.Component {
  render() {

    const siteConfig = this.props.config;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

    const Framework = props => (
      <div className="framework-item">
        <div className={!!props.default ? 'framework-block show-tag' : 'framework-block'}>
          <div className="framework-background"></div>
          <div className="framework-img"><img src={props.img} /></div>
          <div className="framework-name">{props.name}</div>
          <div className="framework-description" dangerouslySetInnerHTML={{ __html: props.description }}></div>
          <div className="framework-link-wrapper">
            <a className="framework-link-button" href={props.url}>了解更多 -></a>
          </div>
        </div>
      </div>
    );

    const FrameworkGroup = props => (
      <div className="framework-group">
        <div className="framework-group-title">
          <span>{props.title}</span>
        </div>
        <div className="framework-items">{props.children}</div>
      </div>
    );

    const FrameworksWrapper = props => (
      <div className="frameworks-container">
        <div className="frameworks-wrapper wrapper">{props.children}</div>
      </div>
    );

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <FrameworksSplash siteConfig={siteConfig} />
        <Descriptions data={frameworks.why}></Descriptions>
        <Descriptions data={frameworks.core}></Descriptions>
        <div className="wrapper center more"><a className="button" href="/docs/framework/" target="_blank">查看更多</a></div>
        <FrameworksWrapper>
          <FrameworkGroup title="技术栈选型">
            {
              frameworks.choice.map(data => 
                <Framework
                  key={data.name}
                  name={data.name}
                  description={data.description}
                  url={docUrl(data.dir)}
                  img={data.img}
                  default={data.default} />
              )
            }
          </FrameworkGroup>
        </FrameworksWrapper>
        {scripts.map(url => (
          <script src={url}></script>
        ))}
      </div>
    );
  }
}

Frameworks.title = 'Codelet · 聚焦核心业务，摆脱基础设施困扰';

module.exports = Frameworks;