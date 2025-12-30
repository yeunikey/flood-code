'use client'

import ChangeMail from "./security/ChangeMail";
import ChangePassword from "./security/ChangePassword";
import { useState } from "react";

function SecuritySettings() {
    const [fetching, setFetching] = useState(false);

    const props = {
        fetching, setFetching
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

            <ChangePassword {...props} />
            <ChangeMail {...props} />

        </div>
    );
}

export default SecuritySettings;