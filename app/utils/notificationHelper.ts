import { ElNotification } from 'element-plus'

interface INotification {
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

const notification = ({ title, message = 'success', type = 'success' }: INotification) => {
    ElNotification({
        position: 'top-right',
        title,
        message,
        type,
    });
}

const success = (message: string) => {
    notification({
        title: 'Success',
        message,
        type: 'success',
    });
}

const error = (message: string) => {
    notification({
        title: 'Error',
        message,
        type: 'error',
    });
}

export default {
    success,
    error,
}   