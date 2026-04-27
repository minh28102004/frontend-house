import FooterMobile from "./footer/FooterMobile";
import FooterPc from "./footer/FooterPc";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to determine if current viewport is mobile (using 768px breakpoint)
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile ? <FooterMobile /> : <FooterPc />;
}
