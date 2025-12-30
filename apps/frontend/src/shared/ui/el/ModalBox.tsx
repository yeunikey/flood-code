import { Box } from "@mui/material";
import { ReactNode } from "react";

interface ModalProps {
    children?: ReactNode
}

function ModalBox({ children }: ModalProps) {
    return (
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 96 * 5,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            {children}
        </Box>
    );
}

export default ModalBox;