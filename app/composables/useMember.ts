import type { FormInstance, FormRules } from "element-plus";
import { MemberResponse, type ICreateUser } from "~~/types/member";

export default function useMember() {
    const { t } = useI18n();
    const members = ref<MemberResponse[]>([]);
    const dialogVisible = ref(false);
    const ruleFormRef = ref<FormInstance>()
    const isEditting = ref(false);
    const isLoading = ref(false);

    const formModel = ref<ICreateUser>({} as ICreateUser);

    const rules = computed<FormRules<ICreateUser>>(() => ({
        username: [
            { required: true, message: t("Please input username"), trigger: "blur" },
            { min: 3, max: 20, message: t("Username must be between 3 and 20 characters"), trigger: "blur" },
        ],
        phone: [
            { required: true, message: t("Please input phone number"), trigger: "blur" },
            { type: "string", message: t("Please input a valid phone number"), trigger: "blur" },
        ],
        password: [
            { required: true, message: t("Please input password"), trigger: "blur" },
            { min: 6, message: t("Password must be at least 6 characters"), trigger: "blur" },
        ],
        role: [
            { required: true, message: t("Please select a role"), trigger: "change" },
        ]
    }));

    const getMember = async () => {
        isLoading.value = true;
        try {
            const result = await getAllMembers();
            if (result.isSuccess) {
                members.value = result.data.map(member => new MemberResponse(member));
            } else {
                console.error("Failed to fetch members:", result.message);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            isLoading.value = false;
        }
    }

    const createMember = async () => {
        try {
            const result = await callCreateMember(formModel.value);
            if (result.isSuccess) {
                await getMember();
                formModel.value = {} as ICreateUser;
            } else {
                console.error("Failed to create member:", result.message);
            }
        } catch (error) {
            console.error("Error creating member:", error);
        } finally {
            dialogVisible.value = false;
        }
    }

    const id = ref<number | null>(null);
    const onEditMember = (member: MemberResponse) => {
        id.value = member.id;
        formModel.value = {
            shopId: member.shopId,
            username: member.username,
            phone: member.phone,
            password: "",
            role: member.role,
            isActive: member.isActive,
        };
        dialogVisible.value = true;
        isEditting.value = true;
    }

    const handleEditMember = async () => {
        if (!id.value) return;
        try {
            const result = await callUpdateMember(id.value, formModel.value);
            if (result.isSuccess) {
                await getMember();
                formModel.value = {} as ICreateUser;
            } else {
                notificationHelper.error(result.message || "Failed to update member");
            }
        } catch (error) {
            notificationHelper.error("Error updating member");
        } finally {
            dialogVisible.value = false;
            isEditting.value = false;
            id.value = null;
        }
    }

    const onSubmit = getSubmitForm(() => {
        return isEditting.value ? handleEditMember() : createMember();
    });

    const handleClose = () => {
        formModel.value = {} as ICreateUser;
        isEditting.value = false;
        id.value = null;
    }

    return {
        members,
        getMember,
        dialogVisible,
        formModel,
        createMember,
        rules,
        id,
        onEditMember,
        handleEditMember,
        ruleFormRef,
        onSubmit,
        isEditting,
        handleClose,
        isLoading,
    };
}
