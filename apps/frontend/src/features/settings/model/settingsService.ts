import { api, vapi } from "@/shared/model/api/instance";
import { useAuth } from "@/shared/model/auth";
import { authHeader } from "@/shared/model/utils";
import { ApiResponse, SavedImage, User } from "@/types";
import { toast } from "react-toastify";


const changePassword = async (
    oldPassword: string,
    newPassword: string,
    repeatPassword: string,
    setFetching: (fetching: boolean) => void
) => {

    const { token } = useAuth.getState();

    if (oldPassword == ""
        || newPassword == ""
        || repeatPassword == "") {
        toast.error("Заполните все поля")
        return;
    }

    if (newPassword != repeatPassword) {
        toast.error("Пароли не совпадают")
        return;
    }

    setFetching(true);

    const body = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        repeatPassword: repeatPassword
    }

    await api.post('/auth/change-password', body, authHeader(token))
        .then((response) => {

            setFetching(false);

            if (response.data.statusCode == 400) {
                toast.error(response.data.message)
                return;
            }

            toast.success("Успешно сохранено!")
        })
}

const changeImage = async (
    file: File | null,
    setFetching: (fetching: boolean) => void
) => {

    const { token, setUser } = useAuth.getState();

    if (file == null) {
        toast.warning("Пожалуйста, выберите изображение");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        setFetching(true);

        const imageRes = await vapi.post<ApiResponse<SavedImage>>(
            "/images/upload",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            }
        );

        if (imageRes.data.statusCode === 400) {
            toast.success(imageRes.data.message);
            return;
        }

        const updateRes = await api.post<ApiResponse<User>>(
            "/users/update",
            {
                "image": imageRes.data.data.id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        setUser(updateRes.data.data);
        toast.success("Аватар успешно обновлён!");

    } catch {
        toast.success("Ошибка при загрузке изображения");
    } finally {
        setFetching(false);
    }
};

const changeMail = async (
    mail: string,

    waitingCode: boolean,
    setWaitingCode: (waitingCode: boolean) => void
) => {

    const { token } = useAuth.getState();

    if (waitingCode) {
        return;
    }

    if (mail == "") {
        toast.error("Заполните все поля")
        return;
    }

    const body = {
        newMail: mail
    };

    await api.post('/auth/change-mail', body, authHeader(token))
        .then(({ data: req }) => {

            if (req.statusCode == 400) {
                toast.error(req.message)
                return;
            }

            setWaitingCode(true);

            toast.warning("Вам на новую почту отправлено письмо!")

        })
}

const confirmMail = async (
    mail: string,
    code: string,

    waitingCode: boolean,
    setWaitingCode: (waitingCode: boolean) => void
) => {

    const { token, setUser } = useAuth.getState();

    if (!waitingCode) {
        return;
    }

    if (code == "") {
        toast.error("Заполните все поля", {
            type: 'error',
        })
        return;
    }

    const body = {
        email: mail,
        code: code
    };

    await api.post<ApiResponse<User>>('/auth/confirm-mail', body, authHeader(token))
        .then(({ data: req }) => {

            if (req.statusCode == 400) {
                return;
            }

            setWaitingCode(false);
            setUser(req.data)

            toast.success("Успешно сохранено!")

        })

}

export {
    changePassword,
    changeImage,
    changeMail,
    confirmMail
}