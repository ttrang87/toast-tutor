const PageContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FFFDE7] py-12 px-4 md:px-5">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
};

export default PageContainer;
