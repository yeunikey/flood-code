'use client'

import AuthForm from "@/features/auth/ui/AuthForm";
import CodeModal from "@/features/auth/ui/modal/CodeModal";

export default function AuthPage() {

    return (
        <div className="h-dvh w-full px-6 py-20 flex gap-16">

            <CodeModal />

            <div className="w-full h-full flex justify-center items-center">
                <AuthForm />
            </div>
        </div >
    );
}