
const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <h4>更多产品</h4>
            <a href="https://codingex.proding.net/" target="_blank">
              CodingEX - 开发规范与最佳实践
            </a>
            <a>
              Softeaming - 软件团队协作工具
            </a>
            <a href="https://menuet.proding.net/" target="_blank">
              Menuet - Node.js 后台轻量级框架
            </a>
            <a href="https://tangram.proding.net/" target="_blank">
              NG-TANGRAM - Angular 桌面端 UI 组件库
            </a>
          </div>
          <div className="company-logo">
            <a className="code-dance">
              <img src={this.props.config.baseUrl + 'img/code-dance.png'} />
            </a>
          </div>
          
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
