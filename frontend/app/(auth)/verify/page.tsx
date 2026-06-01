import { Suspense } from "react";
import VerifyPageContent from "./verifyContent";

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyPageContent />
        </Suspense>
    );
}