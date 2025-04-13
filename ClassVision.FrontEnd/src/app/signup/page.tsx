import CardWithImage from "../../components/cards/CardWithImage";
import { SignUpForm } from "../../components/login/SignupForm";

export default function SignUpPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <CardWithImage imagesource={"/logo.png"}>
                    <SignUpForm />
                </CardWithImage>
            </div>
        </div>
    )
}
