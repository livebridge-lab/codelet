
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
          <div className="footerSection">
            <h4>产品功能</h4>
            <a href="">基础框架</a>
            <a href="">功能模块</a>
            <a href="">业务系统</a>
            <a href="">更新日志</a>
          </div>
          <div className="footerSection">
            <h4>服务与支持</h4>
            <a href="">文档中心</a>
            <a href="">社区</a>
            <a href="">客户案例</a>
          </div>
          <div className="footerSection">
            <h4>其他</h4>
            <a>support@codedance.top</a>
            <a>400-123-4567</a>
            <a>周一至周五 9:00 ～ 18:00</a>
            <div className="social">
              <img src={this.props.config.baseUrl + 'img/wechat.png'} />
              <img src={this.props.config.baseUrl + 'img/qq.png'} />
              <img src={this.props.config.baseUrl + 'img/zhihu.png'} />
            </div>
          </div>
          <div className="footerSection">
            <img className="code-dance-logo" src={this.props.config.baseUrl + 'img/code-dance.png'} />
          </div>
        </section>
        <section className="copyright">Copyright © 2019 代码跳动 版权所有 辽ICP备19008868号-2</section>
      </footer>
    );
  }
}

module.exports = Footer;
