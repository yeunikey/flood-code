import { Grow, Typography, TextField, Button, Divider } from "@mui/material";
import { useAuthStore } from "../model/useAuthStore";
import { handleLogin, handleCreate } from "../model/authService";

function AuthForm() {

    const { type, setType, password, setPassword, email, setEmail } = useAuthStore();

    return (
        <Grow in={true}>
            <div className="w-72">
                <Typography variant="h4" fontWeight={500} textAlign={'center'}>
                    Паводки
                </Typography>
                <Typography variant="body1" color="grey.700" marginTop={1} textAlign={'center'}>
                    Войдите в систему
                </Typography>

                <div className="flex flex-col gap-2 my-8">
                    <TextField value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="Почта" variant="outlined" size="small" />
                    <TextField value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Пароль" variant="outlined" type='password' size="small" />
                </div>

                <Button variant="contained" className="w-full" disableElevation
                    onClick={() => {
                        if (type == "LOGIN") {
                            handleLogin()
                        } else {
                            handleCreate()
                        }
                    }}
                >
                    {type == "LOGIN" ? 'Войти' : 'Зарегистрироваться'}
                </Button>

                <Divider className="py-4">
                    <Typography variant="body1" color="textDisabled">или</Typography>
                </Divider>

                <Button variant="text" className="w-full !text-gray-500"
                    onClick={() => {
                        setType(type == "LOGIN" ? "REGISTER" : "LOGIN")
                    }}
                >
                    {type == "LOGIN" ? 'Нет аккаунта?' : "Есть аккаунт?"}
                </Button>

            </div>
        </Grow>
    );
}

export default AuthForm;