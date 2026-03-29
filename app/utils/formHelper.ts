import type { FormInstance } from "element-plus"

const submitForm = async (formEl: FormInstance | undefined, callBack: () => void) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            callBack()
        } else {
            console.log('error submit!', fields)
        }
    })
}

export const getSubmitForm = (callBack: () => void) => {
    return (formEl: FormInstance | undefined) => submitForm(formEl, callBack)
}