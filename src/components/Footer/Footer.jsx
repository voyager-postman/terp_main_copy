import { useTranslation } from "react-i18next";
const Footer = () => {
  const [t, i18n] = useTranslation("global");
  return (
    <footer className="card footer py-4 bg-gray-100  shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-lg-between">
          <div className="col-lg-12 mb-lg-0 mb-4">
            <div className="copyright text-center text-sm text-muted text-lg-center footerTrpA">
              {t("footer.footerOne")} {new Date().getFullYear()}{" "}
              <i className="fa fa-heart"></i>
              <a
                href="#!"
                className="font-weight-bold"
                target="_blank"
                rel="noreferrer"
              >
                {t("header.logoName")}
              </a>{" "}
              {t("footer.footerTwo")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
