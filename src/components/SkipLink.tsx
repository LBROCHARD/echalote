const SkipLink = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:static focus:bg-black focus:text-white focus:p-2 focus:z-50 focus:absolute focus:top-4 focus:left-4"
    >
      Skip
    </a>
  );
};

export default SkipLink;
