
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
            <a href={this.pageUrl('users.html')}>
              Codelet - 快速开发框架
            </a>
            <a
              href="https://www.proding.net/"
              target="_blank"
              rel="noreferrer noopener">
              CodingEX - 开发规范与最佳实践
            </a>
            <a href="https://discordapp.com/">
              Softeaming - 软件团队协作工具
            </a>
            <a href="https://tangram.proding.net/" target="_blank">
              ng-tangram - Angular UI 组件库
            </a>
          </div>
          <div className="flex-2">
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
