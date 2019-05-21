---
id: security
title: 安全
---

很多 Web应用都缺少安全方面的考量，被安全工具扫描时漏洞百出。「Codelet基础框架」提供了完全涵盖 [OWASP 十大风险](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project) 的实现，解决了通用层面上的安全问题。WASP 是一个开源的、非盈利的全球性安全组织，致力于应用软件的安全研究。OWASP 被视为 Web 应用安全领域的权威参考。
>  OWASP = Open Web Application Security Project 

## OWASP 十大风险
下面列举了「Codelet基础框架」中针对十大风险实施的防范措施。
| 风险名称 | 防范措施 | 
| :------| :------ | 
| Injection | `防止 SQL/NoSQL 注入` <br> `防止 HTML/JavaScript/CSS 注入` | 
| Broken Authentication  |`限制登录失败次数` `实现多因素认证（如图形验证码）`<br> `实施密码强度策略` `规范化密码恢复流程`<br>  `使用 TLS 协议` `避免使用 Session 认证机制`| 
| Sensitive Data Exposure  | `使用 TLS 协议` `密码存储加密` | 
| XML External Entities (XXE)  | 中等文本 | 
| Broken Access Control  | `实现服务端访问控制机制` `实现资源精准定义(RESTful)`<br>`避免使用CORS` `JWT令牌生命周期管理`  | 
| Security Misconfiguration  | 中等文本 | 
| Cross-Site Scripting (XSS)  | 防止XSS攻击 | 
| Insecure Deserialization  | 中等文本 | 
| Using Components with Known Vulnerabilities  | 中等文本 | 
| Insufficient Logging & Monitoring  | 中等文本 | 
如果对风险和防范措施的具体内容感兴趣，请参照 [CodingEX 中的安全章节](https://codingex.proding.net/docs/backend/was-01-overview/)。

## 其它风险




OWASP Top 10 Most Critical Web Application Security Risks

The OWASP Top 10 is a powerful awareness document for web application security. It represents a broad consensus about the most critical security risks to web applications. Project members include a variety of security experts from around the world who have shared their expertise to produce this list.

We urge all companies to adopt this awareness document within their organization and start the process of ensuring that their web applications minimize these risks. Adopting the OWASP Top 10 is perhaps the most effective first step towards changing the software development culture within your organization into one that produces secure code.