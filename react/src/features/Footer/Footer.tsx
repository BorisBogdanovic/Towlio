import { Link, NavLink } from "react-router-dom";
import Container from "../../Ui/Container";
import Logo from "../../Ui/Logo";

function Footer() {
    return (
        <footer className="bg-secondary pt-16 pb-12 mt-auto">
            <Container>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <NavLink
                            className="text-base leading-6 text-textGray hover:underline"
                            to={"/"}
                        >
                            Business analytics
                        </NavLink>
                        <NavLink
                            className="text-base leading-6 text-textGray hover:underline"
                            to={"create-client"}
                        >
                            Create Client
                        </NavLink>
                        <NavLink
                            className="text-base leading-6 text-textGray hover:underline"
                            to={"clients"}
                        >
                            All Clients
                        </NavLink>
                        <NavLink
                            className="text-base leading-6 text-textGray hover:underline"
                            to={"create-user"}
                        >
                            Add Salesperson
                        </NavLink>
                        <NavLink
                            className="text-base leading-6 text-textGray hover:underline"
                            to={"users"}
                        >
                            Salesperson List
                        </NavLink>
                    </div>
                    <Link to="/">
                        <div className="w-35 mx-auto px-0">
                            <Logo />
                        </div>
                    </Link>
                </div>
                <div className="h-[1px] w-full bg-disabledBorderGray my-8"></div>
                <div className="flex items-center justify-between">
                    <p className="text-textLightGray text-base leading-6">
                        © 2025 Towlio — All rights reserved. Simplifying towing
                        services.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
