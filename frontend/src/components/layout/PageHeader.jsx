const PageHeader = ({ title, subtitle }) => {
  return (
    <header className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[#8b5e34]">{title}</h1>
      {subtitle && <p className="mt-3 text-xl text-[#b78846]">{subtitle}</p>}
    </header>
  );
};

export default PageHeader;
