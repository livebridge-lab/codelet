
const React = require('react');

const CWD = process.cwd();

const products = require(`${CWD}/products.json`);

const styles = [
  '/css/products.css',
  '/css/splash.css'
];

const pageDescription = '「Codelet 基础框架」提供了高质量的开发系统所需的基础功能，包括认证、授权、消息、权限、人员、组织、安全等，帮助团队摆脱基础功能的困扰，将更多的精力投入到具体的业务功能中去。';

const pageTitle = '聚焦核心业务，摆脱基础设施困扰';

class ProductsSplash extends React.Component {
  render() {
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
          <SplashTitle title={pageTitle} description={pageDescription} />
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
        <div className="product-items">{props.children}</div>
      </div>
    );

    const ProductsWrapper = props => (
      <div className="products-container">
        <div className="products-wrapper wrapper">{props.children}</div>
      </div>
    );

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <ProductsSplash />
        <ProductsWrapper>
          <ProductGroup title="后&nbsp;端" key="后端">
            {
              products.backend.map(data => 
                <Product
                  key={data.name}
                  name={data.name}
                  description={data.description}
                  url={docUrl(data.dir)}
                  img={data.img}
                  default={data.default} />
              )
            }
          </ProductGroup>
          <ProductGroup title="前&nbsp;端" key="前端">
            {
              products.frontend.map(data => 
                <Product
                  key={data.name}
                  name={data.name}
                  description={data.description}
                  url={docUrl(data.dir)}
                  img={data.img}
                  default={data.default} />
              )
            }
          </ProductGroup>
        </ProductsWrapper>
      </div>
    );
  }
}

Products.title = 'Codelet · 聚焦核心业务，摆脱基础设施困扰';

module.exports = Products;