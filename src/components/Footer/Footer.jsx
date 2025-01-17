import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="sub_footer">
              <a className="sub_footer_logo" href="https://www.harbingergroup.com/" rel="home">
                <img
                  src="https://www.harbingergroup.com/wp-content/webp-express/webp-images/uploads/2022/12/Harbinger-Footer-logo.png.webp"
                  className="logo"
                  alt="footer-logo"
                  
                />
              </a>
              <div className="menu-sub-footer-menu-container">
                <ul id="menu-sub-footer-menu" className="sub-footer-menu">
                  <li id="menu-item-1889" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-1889">
                    <a rel="privacy-policy" href="https://www.harbingergroup.com/privacy-policy/" itemProp="url">
                      Privacy&nbsp;Policy
                    </a>
                  </li>
                  <li id="menu-item-1890" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1890">
                    <a href="https://www.harbingergroup.com/gdpr-compliance/" itemProp="url">
                      GDPR Compliance
                    </a>
                  </li>
                  <li id="menu-item-1891" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1891">
                    <a href="https://www.harbingergroup.com/cookie-policy/" itemProp="url">
                      Cookie&nbsp;Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="copyright-text-wrapper">
              <p className="copyright-text">© 1990 - 2025 Harbinger Group. All Rights Reserved.</p>
            </div>
          </div>
        </div>
     
    </footer>
  );
};

export default Footer;