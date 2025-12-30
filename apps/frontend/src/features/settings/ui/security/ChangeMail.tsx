import { IconButton, TextField } from "@mui/material";
import { cn } from "@/shared/model/utils";

import CheckIcon from '@mui/icons-material/Send';
import SendIcon from '@mui/icons-material/Check';
import { useState } from "react";
import { changeMail, confirmMail } from "../../model/settingsService";

interface SettingsProps {
    fetching: boolean,
    setFetching: (fetching: boolean) => void
}

function ChangeMail({ }: SettingsProps) {

    const [mail, setMail] = useState('');

    const [waitingCode, setWaitingCode] = useState(false);
    const [code, setCode] = useState('');

    return (
        <div
            className="flex flex-col gap-6"
        >
            <div className="text-2xl font-semibold">
                Почта
            </div>

            <div className="space-y-3">
                <div className={cn(!true ? 'opacity-100' : 'opacity-75', 'transition-all')}>
                    <div
                        className="flex gap-2 items-center"
                    >
                        <TextField
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            type="email"
                            className="w-full"
                            label="Почта"
                            variant="outlined"
                            size="small"
                        ></TextField>

                        <IconButton
                            className="h-8 w-8"
                            onClick={() => changeMail(mail, waitingCode, setWaitingCode)}
                        >
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>

                <div className={cn(waitingCode ? 'opacity-100' : 'opacity-25 pointer-events-none', 'transition-all')}>
                    <div
                        className="flex gap-2 items-center"
                    >
                        <TextField
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder={'Код'}
                            type="text"
                            className="w-full"
                            variant="outlined"
                            size="small"
                        ></TextField>

                        <IconButton
                            className="h-8 w-8"
                            onClick={() => confirmMail(mail, code, waitingCode, setWaitingCode)}
                        >
                            <CheckIcon />
                        </IconButton>
                    </div>
                </div>
            </div>

        </div >
    );
}

export default ChangeMail;