import { createContext, useState, useEffect } from "react";

const ScreenSizeContext = createContext({});

export const ScreenSizeProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState({
    isSmartphone: false,
    isTablet: false,
    isDesktop: true,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isSmartphone: width <= 580,
        isTablet: width > 580 && width <= 1024,
        isDesktop: width > 1024,
        width,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ screenSize }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

export default ScreenSizeContext;
