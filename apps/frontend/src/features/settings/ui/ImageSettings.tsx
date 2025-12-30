"use client"

import { Button, styled } from "@mui/material";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from "@/shared/model/auth";
import { useState } from "react";
import { changeImage } from "../model/settingsService";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function ImageSettings() {
    const { user } = useAuth();

    const [, setFetching] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="mt-6 flex flex-wrap gap-12">

            <div
                className="flex flex-col gap-6"
            >
                <div className="text-2xl font-semibold">
                    Изменить изображение
                </div>

                <div className="flex gap-3">
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                if (event.currentTarget.files == null) {
                                    return;
                                }
                                setFile(event.currentTarget.files[0])
                            }}
                        />
                    </Button>
                    <Button
                        variant="contained"
                        className="mt-3 w-fit"
                        onClick={() => changeImage(file, setFetching)}
                        disableElevation
                    >Сохранить</Button>
                </div>

                <img
                    src={"http://localhost:3001/v1/images/" + user?.image}
                    alt="logo"
                    className="w-48 h-48 bg-muted rounded-full object-cover"
                    width={1024}
                    height={1024}
                >
                </img>

            </div>
        </div>
    );
}

export default ImageSettings;