import Header from './component/Header';

type LayoutProps = {
  children: JSX.Element;
};

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default Layout;
