import Header from "./components/Header";

function Layout(props) {
    return (
        <div>
            <Header />
            {props.children}
        </div>
    );
}

export default Layout;
