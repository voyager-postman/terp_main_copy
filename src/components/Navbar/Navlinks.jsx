import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { links } from "./Mylinks";

const lngs = [
  { code: "en", native: "English" },
  { code: "th", native: "Thai" },
];

const NavLinks = ({ setOpen }) => {
  console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const { t, i18n } = useTranslation();

  const handleTrans = (code) => {
    i18n.changeLanguage(code);
  };
  return (
    <>
      {links.map((link, i) => (
        <Fragment key={`link-${i}`}>
          <div className=" px-1 text-left md:cursor-pointer group terpNav">
            {link.submenu ? (
              <button
                type="button"
                className="navMenuInvt py-4 flex w-full justify-between items-center md:pr-0 pr-5 group relative font-light hover-underline-animationnn	"
                onClick={() => {
                  heading !== link.name
                    ? setHeading(link.name)
                    : setHeading("");
                  setSubHeading("");
                }}
              >
                <span style={{ paddingRight: "3px", fontSize: "medium" }}>
                  {link.icon}
                </span>
                {link.name}
                <span className="text-xl md:hidden inline">
                  <ion-icon
                    name={`${
                      heading == link.name ? "chevron-up" : "chevron-down"
                    }`}
                  />
                </span>
                <span className="text-xl md:mt-1 md:ml-2  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                  <ion-icon name="chevron-down" />
                </span>
              </button>
            ) : (
              <>
                <Link
                  to={link.link}
                  onClick={() => setOpen(false)}
                  className="navMenuInvt py-4 flex w-full justify-between items-center md:pr-0 pr-5 group relative font-light hover-underline-animationnn	"
                >
                  <span style={{ paddingRight: "3px", fontSize: "medium" }}>
                    {link.icon}
                  </span>
                  {link.name}
                  <span />
                </Link>
              </>
            )}
            {link.submenu && (
              <div className="absolute  hidden group-hover:md:block hover:md:block">
                <div
                  className="p-2 grid grid-cols-1 gap-3"
                  style={{ backgroundColor: "#203764" }}
                >
                  {link.sublinks.map((mysublinks, j) => (
                    <div key={`link-${i}-${j}`}>
                      <h1 className="text-lg font-semibold">
                        {mysublinks.Head}
                      </h1>
                      {mysublinks.sublink.map((slink, k) => (
                        <li
                          key={`link-${i}-${j}-s${k}`}
                          className="text-sm text-white my-3 mx-1.5 font-light hover-underline-animation-submenu"
                        >
                          <Link to={slink.link} className="hover:text-white">
                            {slink.name}
                          </Link>
                        </li>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className={`
            ${heading == link.name ? "md:hidden" : "hidden"}
          `}
          >
            {link.sublinks.map((slinks, j) =>
              slinks.sublink.map((slink, k) => (
                <li className="py-3 pl-14 text-white" key={`s-${i}-${j}-${k}`}>
                  <Link to={slink.link} onClick={() => setOpen(false)}>
                    {slink.name}
                  </Link>
                </li>
              ))
            )}
          </div>
        </Fragment>
      ))}
    </>
  );
};

export default NavLinks;
