import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <main className="flex h-screen justify-center items-center">
            <section className="text-center">
                <h1>404 Not found !</h1>
                <p>The page you are looking for doesn't exist 😢</p>
                <Link to="/">
                    <Button>Go Back Home</Button>
                </Link>
            </section>
        </main>
    )
}

export default NotFoundPage;
