import { Button, TextField } from "@mui/material";

import { useState } from "react";
import { changePassword } from "../../model/settingsService";

interface SettingsProps {
    fetching: boolean,
    setFetching: (fetching: boolean) => void
}

function ChangePassword({ setFetching }: SettingsProps) {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    return (
        <div
            className="flex flex-col gap-6"
        >
            <div className="text-2xl font-semibold">
                Смена пароля
            </div>

            <div className="flex flex-col gap-3">
                <TextField
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    label="Старый пароль"
                    type="password"
                    className="w-full"
                    variant="outlined"
                    size="small"
                ></TextField>

                <TextField
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    label="Новый пароль"
                    type="password"
                    className="w-full"
                    variant="outlined"
                    size="small"
                ></TextField>

                <TextField
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    label="Повтор пароля"
                    type="password"
                    className="w-full"
                    variant="outlined"
                    size="small"
                ></TextField>
            </div>

            <Button
                variant="contained"
                className="mt-3 w-fit"
                onClick={() => changePassword(oldPassword, newPassword, repeatPassword, setFetching)}
                disableElevation
            >
                Сохранить
            </Button>
        </div>
    );
}

export default ChangePassword;