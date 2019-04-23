
const React = require('react');

const styles = [
  '/css/products.css',
  '/css/splash.css'
];

const backend = [
  {
    name: 'Node.js + Menuet + MongoDB',
    description: '互联网应用首选<br>轻量，高效',
    dir: 'nodejs-menuet-mongodb',
    img: '/img/WechatIMG42.jpeg',
    default: true
  },
  {
    name: 'SpringBoot + MyBatis + MySQL',
    description: '企业级应用<br>易学，上手快',
    dir: 'springboot-mybatis-mysql',
    img: '/img/WechatIMG42.jpeg'
  },
  {
    name: 'SpringBoot + Hibernate + MySQL',
    description: '企业级应用<br>功能强大，有一定学习曲线',
    dir: 'springboot-hibernate-mysql',
    img: '/img/WechatIMG42.jpeg'
  },
];

const frontend = [
  {
    name: 'Vue + ElementUI',
    description: '轻量级应用<br>上手快',
    dir: 'vue-elementui',
    img: '/img/WechatIMG42.jpeg',
  },
  {
    name: 'Angular + ng-tangram',
    description: '企业级应用<br>谷歌站台',
    dir: 'angular-ng-tangram',
    img: '/img/WechatIMG42.jpeg',
    default: true
  },
  {
    name: 'React + AntDesign',
    description: '企业级应用<br>Facebook站台',
    dir: 'react-ant-desin',
    img: '/img/WechatIMG42.jpeg'
  }
]

class ProductsSplash extends React.Component {
  render() {
    const siteConfig = this.props.siteConfig;

    const SplashContainer = props => (
      <div className="splash-container">
        <div className="splash-fade">
          <div className="inner">{ props.children }</div>
        </div>
      </div>
    );

    const SplashTitle = props => (
      <h2 className="splash-title center">
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

class Products extends React.Component {
  render() {

    const siteConfig = this.props.config;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

    const Product = props => (
      <div className="product-item">
        <div className={!!props.default ? 'product-block show-tag' : 'product-block'}>
          <div className="product-img"><img src={props.img} /></div>
          <div className="product-name">{props.name}</div>
          <div className="product-description" dangerouslySetInnerHTML={{ __html: props.description }}></div>
          <div className="product-link-wrapper">
            <a className="button button-circle product-link-button" href={props.url}>查看详情</a>
          </div>
        </div>
      </div>
    );

    const ProductGroup = props => (
      <div className="product-group">
        <div className="product-group-title">
          <span>{props.title}</span>
        </div>
        <div className="product-items">
          {props.children}
        </div>
      </div>
    );

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <ProductsSplash siteConfig={siteConfig} />
        <div className="products-container">
          <div className="products-wrapper wrapper">
            <ProductGroup title="后&nbsp;端">
              {
                backend.map(data => 
                  <Product
                    name={data.name}
                    description={data.description}
                    url={docUrl(data.dir)}
                    img={data.img}
                    default={data.default} />
                )
              }
            </ProductGroup>
            <ProductGroup title="前&nbsp;端">
              {
                frontend.map(data => 
                  <Product
                    name={data.name}
                    description={data.description}
                    url={docUrl(data.dir)}
                    img={data.img}
                    default={data.default} />
                )
              }
            </ProductGroup>
          </div>
        </div>
      </div>
    );
  }
}

Products.title = '聚焦核心业务，摆脱基础设施困扰';

Products.description = '「Codelet 基础框架」提供了高质量的开发系统所需的基础功能，包括认证、授权、消息、权限、人员、组织、安全等，帮助团队摆脱基础功能的困扰，将更多的精力投入到具体的业务功能中去。';

module.exports = Products;