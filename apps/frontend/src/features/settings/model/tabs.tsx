import ImageSettings from "@/features/settings/ui/ImageSettings"
import SecuritySettings from "@/features/settings/ui/SecuritySettings"

const tabs = [
    {
        name: "Безопасность",
        node: <SecuritySettings />
    },
    {
        name: "Изображение",
        node: <ImageSettings />
    },
]

export {
    tabs
}