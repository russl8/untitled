import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    /**
     * 
     * An optional catch all route (ex: /sign-up/[[...sign-up]])
     * will make it so that routes such as /sign-up/verify-user are also caught
     */
    return (
        <div className="flex justify-center">
            <SignIn />
        </div>);
}

export default SignInPage;